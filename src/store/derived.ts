import { useMemo } from 'react'
import { Q_SEMESTERS, computeBlockI, computeBlockII, gradeFromPoints, type CalcCourse } from '../lib/abi-calc'
import type { SimInput } from '../lib/abi-simulation'
import { isDue, mastery } from '../lib/srs'
import { todayISO } from '../lib/dates'
import { ALL_QUIZ, BUILTIN_CARDS, topicsOf, type CardRef } from '../content'
import type { SubjectId } from '../content/types'
import { useStore } from './store'
import type { AppData, Course } from './types'

/** Halbjahreskurse mit eingetragener Note (echt oder Prognose) für den Rechner. */
export function toCalcCourses(courses: Course[]): CalcCourse[] {
  const out: CalcCourse[] = []
  for (const c of courses) {
    for (const s of Q_SEMESTERS) {
      if (c.notTaken[s]) continue
      const p = c.semesters[s].points
      if (p == null) continue
      out.push({
        id: `${c.id}|${s}`,
        courseId: c.id,
        name: c.name,
        semester: s,
        points: p,
        isLK: c.type === 'LK',
        mandatory: c.abiNr != null || c.mandatory[s],
        projectGroup: c.isProjektkurs ? c.id : undefined,
      })
    }
  }
  return out
}

export function isComplete(courses: Course[]) {
  return courses.every((c) => Q_SEMESTERS.every((s) => c.notTaken[s] || c.semesters[s].points != null))
}

export function simInputFrom(d: Pick<AppData, 'courses' | 'exams' | 'simulation' | 'blockI' | 'bll'>): SimInput {
  return {
    courses: d.courses.map((c) => ({
      id: c.id,
      name: c.name,
      isLK: c.type === 'LK',
      abiNr: c.abiNr,
      mandatory: c.mandatory,
      projectGroup: c.isProjektkurs ? c.id : undefined,
      notTaken: c.notTaken,
      semesters: Object.fromEntries(
        Q_SEMESTERS.map((s) => [s, { points: c.semesters[s].points, isForecast: c.semesters[s].isForecast }]),
      ),
    })),
    exams: ([1, 2, 3, 4] as const).map((nr) => ({ abiNr: nr, main: d.exams[nr].main, extraOral: d.exams[nr].extraOral })),
    semesterOverrides: d.simulation.semesterOverrides,
    examOverrides: d.simulation.examOverrides,
    include: new Set(d.blockI.include),
    exclude: new Set(d.blockI.exclude),
    bll: d.bll.enabled ? { points: d.bll.points } : null,
  }
}

/** Offizielle Berechnung mit den eingetragenen Werten. */
export function useOfficialCalc() {
  const courses = useStore((s) => s.courses)
  const exams = useStore((s) => s.exams)
  const blockISel = useStore((s) => s.blockI)
  const bll = useStore((s) => s.bll)
  return useMemo(() => {
    const blockI = computeBlockI(toCalcCourses(courses), {
      rounding: 'round',
      include: new Set(blockISel.include),
      exclude: new Set(blockISel.exclude),
      complete: isComplete(courses),
    })
    const blockII = computeBlockII(
      ([1, 2, 3, 4] as const).map((nr) => {
        const c = courses.find((x) => x.abiNr === nr)
        return {
          abiNr: nr,
          name: c?.name ?? `${nr}. Fach`,
          isLK: c ? c.type === 'LK' : nr <= 2,
          main: exams[nr].main,
          extraOral: exams[nr].extraOral,
        }
      }),
      bll.enabled ? { points: bll.points } : null,
    )
    const total = blockI.points + blockII.points
    return { blockI, blockII, total, grade: blockII.complete ? gradeFromPoints(total) : null }
  }, [courses, exams, blockISel, bll])
}

/** Alle Karteikarten (vorbereitet + eigene), mit Bearbeitungen. */
export function useAllCards(includeHidden = false): CardRef[] {
  const custom = useStore((s) => s.customCards)
  const edits = useStore((s) => s.cardEdits)
  const hidden = useStore((s) => s.hiddenCards)
  return useMemo(() => {
    const hiddenSet = new Set(hidden)
    const builtin = BUILTIN_CARDS.filter((c) => includeHidden || !hiddenSet.has(c.id)).map((c) =>
      edits[c.id] ? { ...c, q: edits[c.id].q, a: edits[c.id].a, edited: true } : c,
    )
    const own: CardRef[] = custom.map((c) => ({
      id: c.id,
      topic: c.topic ?? '',
      q: c.q,
      a: c.a,
      subjectId: c.subjectId,
      custom: true,
    }))
    return [...builtin, ...own]
  }, [custom, edits, hidden, includeHidden])
}

export function useDueCards(subject?: SubjectId | 'all') {
  const cards = useAllCards()
  const states = useStore((s) => s.cardStates)
  return useMemo(() => {
    const today = todayISO()
    const pool = subject && subject !== 'all' ? cards.filter((c) => c.subjectId === subject) : cards
    const review = pool.filter((c) => states[c.id] && isDue(states[c.id], today))
    const fresh = pool.filter((c) => !states[c.id])
    return { review, fresh, total: pool.length }
  }, [cards, states, subject])
}

export interface TopicStats {
  cards: number
  cardMastery: number
  quizAnswered: number
  quizAccuracy: number | null
}

export function topicStats(
  topicId: string,
  cards: CardRef[],
  cardStates: AppData['cardStates'],
  quizStats: AppData['quizStats'],
): TopicStats {
  const tc = cards.filter((c) => c.topic === topicId)
  const m = tc.length ? tc.reduce((s, c) => s + mastery(cardStates[c.id]), 0) / tc.length : 0
  const qs = ALL_QUIZ.filter((q) => q.topic === topicId && quizStats[q.id])
  const right = qs.filter((q) => quizStats[q.id].last).length
  return { cards: tc.length, cardMastery: m, quizAnswered: qs.length, quizAccuracy: qs.length ? right / qs.length : null }
}

/** Fortschritt eines Fachs: Anteil der Themen mit Status "sicher" und Durchschnitt der Selbsteinschätzung. */
export function subjectProgress(subjectId: SubjectId, topics: AppData['topics']) {
  const list = topicsOf(subjectId)
  const done = list.filter((t) => topics[t.id]?.status === 'sicher').length
  const inWork = list.filter((t) => topics[t.id]?.status === 'arbeit').length
  const rated = list.map((t) => topics[t.id]?.confidence ?? 0).filter((c) => c > 0)
  return {
    total: list.length,
    done,
    inWork,
    share: list.length ? done / list.length : 0,
    weighted: list.length ? (done + inWork * 0.5) / list.length : 0,
    avgConfidence: rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null,
  }
}
