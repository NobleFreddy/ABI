import { SUBJECTS } from '../content/subjects'
import type { DayValues, Series } from '../components/charts'
import type { AppData, StudySession } from '../store/types'
import { addDays, streak, weekStart } from './dates'

export const STUDY_SERIES: Series[] = [
  ...SUBJECTS.map((s) => ({ key: s.id, label: s.name, color: s.color })),
  { key: 'other', label: 'Sonstiges', color: 'var(--subj-other)' },
]

const keyOf = (s: StudySession) => (s.subjectId && s.subjectId !== 'other' ? s.subjectId : 'other')

export function dailyData(sessions: StudySession[], days: number, today: string): DayValues[] {
  const start = addDays(today, -(days - 1))
  const map = new Map<string, Record<string, number>>()
  for (let i = 0; i < days; i++) map.set(addDays(start, i), {})
  for (const s of sessions) {
    const rec = map.get(s.date)
    if (!rec) continue
    const k = keyOf(s)
    rec[k] = (rec[k] ?? 0) + s.minutes
  }
  return [...map.entries()].map(([date, values]) => ({ date, values }))
}

export function minutesBetween(sessions: StudySession[], from: string, to: string) {
  return sessions.filter((s) => s.date >= from && s.date <= to).reduce((a, s) => a + s.minutes, 0)
}

export function minutesThisWeek(sessions: StudySession[], today: string) {
  return minutesBetween(sessions, weekStart(today), addDays(weekStart(today), 6))
}

export function minutesBySubject(sessions: StudySession[], from?: string) {
  const out: Record<string, number> = {}
  for (const s of sessions) {
    if (from && s.date < from) continue
    const k = keyOf(s)
    out[k] = (out[k] ?? 0) + s.minutes
  }
  return out
}

export function minutesByDay(sessions: StudySession[]) {
  const m = new Map<string, number>()
  for (const s of sessions) m.set(s.date, (m.get(s.date) ?? 0) + s.minutes)
  return m
}

/** Lernserie: Tage mit Lernzeit, Karteikarten-Wiederholung oder Quiz. */
export function activityStreak(d: Pick<AppData, 'sessions' | 'cardStates' | 'quizRuns'>, today: string) {
  const days = new Set<string>()
  d.sessions.forEach((s) => days.add(s.date))
  d.quizRuns.forEach((r) => days.add(r.date))
  Object.values(d.cardStates).forEach((c) => c.last && days.add(c.last))
  return streak(days, today)
}
