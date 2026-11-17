import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Q_SEMESTERS, type QSemester } from '../lib/abi-calc'
import { review, type Rating } from '../lib/srs'
import { todayISO } from '../lib/dates'
import { SUBJECTS, COURSE_COLORS, type CourseTemplate } from '../content/subjects'
import type { SubjectId } from '../content/types'
import type {
  AbiNr,
  AppData,
  CalendarEvent,
  Course,
  CustomCard,
  ExamEntry,
  GradeEntry,
  PastExam,
  SemesterData,
  Settings,
  StudySession,
  TimerState,
  Todo,
  TopicProgress,
} from './types'

export const STORAGE_KEY = 'abi-cockpit-data'
export const SCHEMA_VERSION = 1

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)

const perSem = <T,>(fn: (s: QSemester, i: number) => T) =>
  Object.fromEntries(Q_SEMESTERS.map((s, i) => [s, fn(s, i)])) as Record<QSemester, T>

const emptySemester = (): SemesterData => ({ points: null, isForecast: false, entries: [] })

export function makeCourse(partial: Partial<Course> & Pick<Course, 'name' | 'short'>): Course {
  return {
    id: uid(),
    type: 'GK',
    abiNr: null,
    subjectId: null,
    color: COURSE_COLORS[0],
    mandatory: perSem(() => false),
    notTaken: perSem(() => false),
    semesters: perSem(emptySemester),
    ...partial,
  }
}

function defaultCourses(): Course[] {
  const abi = SUBJECTS.map((s) =>
    makeCourse({
      id: s.id,
      name: s.name,
      short: s.short,
      type: s.type,
      abiNr: s.abiNr,
      subjectId: s.id,
      color: s.color,
      mandatory: perSem(() => true),
    }),
  )
  const deutsch = makeCourse({ name: 'Deutsch', short: 'D', color: COURSE_COLORS[0], mandatory: perSem(() => true) })
  return [...abi, deutsch]
}

export const defaultSettings = (): Settings => ({
  name: '',
  theme: 'system',
  weeklyGoalHours: 10,
  pomodoroFocus: 25,
  pomodoroBreak: 5,
  roundingMode: 'floor',
  examDates: Object.fromEntries(SUBJECTS.map((s) => [s.id, s.defaultExamDate])) as Record<SubjectId, string>,
  newCardsPerDay: 20,
  sound: true,
})

const defaultTimer = (): TimerState => ({
  mode: 'pomodoro',
  phase: 'focus',
  running: false,
  startedAt: null,
  accumulatedMs: 0,
  subjectId: null,
  topic: null,
  cycles: 0,
})

export function defaultData(): AppData {
  return {
    meta: { createdAt: new Date().toISOString(), lastBackupAt: null, schema: SCHEMA_VERSION },
    settings: defaultSettings(),
    courses: defaultCourses(),
    exams: { 1: { main: null, extraOral: null }, 2: { main: null, extraOral: null }, 3: { main: null, extraOral: null }, 4: { main: null, extraOral: null } },
    bll: { enabled: false, points: null, title: '' },
    blockI: { include: [], exclude: [] },
    simulation: { semesterOverrides: {}, examOverrides: {} },
    topics: {},
    cardStates: {},
    customCards: [],
    hiddenCards: [],
    cardEdits: {},
    quizStats: {},
    quizRuns: [],
    sessions: [],
    timer: defaultTimer(),
    events: [],
    hiddenBuiltins: [],
    todos: [],
    pastExams: [],
  }
}

export const DATA_KEYS = Object.keys(defaultData()) as (keyof AppData)[]

export function pickData(s: AppData): AppData {
  const out = {} as Record<string, unknown>
  for (const k of DATA_KEYS) out[k] = s[k]
  return out as unknown as AppData
}

/** Ergänzt fehlende Felder (z. B. nach Updates der App oder bei älteren Backups). */
export function normalizeData(raw: Partial<AppData>): AppData {
  const d = defaultData()
  const merged = { ...d, ...raw } as AppData
  merged.settings = { ...d.settings, ...(raw.settings ?? {}) }
  merged.settings.examDates = { ...d.settings.examDates, ...(raw.settings?.examDates ?? {}) }
  merged.meta = { ...d.meta, ...(raw.meta ?? {}), schema: SCHEMA_VERSION }
  merged.timer = { ...d.timer, ...(raw.timer ?? {}) }
  merged.exams = { ...d.exams, ...(raw.exams ?? {}) }
  merged.bll = { ...d.bll, ...(raw.bll ?? {}) }
  merged.simulation = { ...d.simulation, ...(raw.simulation ?? {}) }
  merged.blockI = { ...d.blockI, ...(raw.blockI ?? {}) }
  merged.courses = (raw.courses ?? d.courses).map((c) => ({
    ...c,
    mandatory: { ...perSem(() => false), ...c.mandatory },
    notTaken: { ...perSem(() => false), ...c.notTaken },
    semesters: perSem((s) => ({ ...emptySemester(), ...(c.semesters?.[s] ?? {}) })),
  }))
  return merged
}

export interface Actions {
  // Kurse & Noten
  addCourse: (tpl?: CourseTemplate) => string
  updateCourse: (id: string, patch: Partial<Course>) => void
  removeCourse: (id: string) => void
  moveCourse: (id: string, dir: -1 | 1) => void
  setSemester: (id: string, sem: QSemester, patch: Partial<SemesterData>) => void
  addGradeEntry: (id: string, sem: QSemester, entry: Omit<GradeEntry, 'id'>) => void
  removeGradeEntry: (id: string, sem: QSemester, entryId: string) => void
  setExam: (nr: AbiNr, patch: Partial<ExamEntry>) => void
  setBll: (patch: Partial<AppData['bll']>) => void
  toggleBlockI: (key: string, mode: 'include' | 'exclude' | 'auto') => void
  setSemesterOverride: (key: string, value: number | null) => void
  setExamOverride: (nr: string, value: number | null) => void
  clearOverrides: () => void
  // Themen
  setTopic: (topicId: string, patch: Partial<TopicProgress>) => void
  // Karteikarten
  rateCard: (cardId: string, rating: Rating) => void
  resetCard: (cardId: string) => void
  addCustomCard: (c: Omit<CustomCard, 'id' | 'createdAt'>) => void
  updateCustomCard: (id: string, patch: Partial<CustomCard>) => void
  removeCustomCard: (id: string) => void
  toggleHiddenCard: (id: string) => void
  editCard: (id: string, q: string, a: string) => void
  revertCard: (id: string) => void
  // Quiz
  recordQuizAnswer: (questionId: string, correct: boolean) => void
  recordQuizRun: (run: { subjectId: SubjectId | 'mix'; topic: string | null; correct: number; total: number }) => void
  // Lernzeit
  addSession: (s: Omit<StudySession, 'id'>) => void
  removeSession: (id: string) => void
  setTimer: (patch: Partial<TimerState>) => void
  // Kalender & To-dos
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void
  removeEvent: (id: string) => void
  toggleBuiltin: (id: string) => void
  addTodo: (t: Omit<Todo, 'id' | 'createdAt' | 'done'>) => void
  updateTodo: (id: string, patch: Partial<Todo>) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  // Altklausuren
  addPastExam: (p: Omit<PastExam, 'id'>) => void
  updatePastExam: (id: string, patch: Partial<PastExam>) => void
  removePastExam: (id: string) => void
  // Einstellungen & Daten
  setSettings: (patch: Partial<Settings>) => void
  setExamDate: (id: SubjectId, date: string) => void
  markBackup: () => void
  replaceAll: (data: AppData) => void
  resetAll: () => void
}

export type Store = AppData & Actions

export const useStore = create<Store>()(
  persist(
    (set, get) => {
      const mapCourse = (id: string, fn: (c: Course) => Course) =>
        set((s) => ({ courses: s.courses.map((c) => (c.id === id ? fn(c) : c)) }))

      return {
        ...defaultData(),

        addCourse: (tpl) => {
          const used = new Set(get().courses.map((c) => c.color))
          const color = COURSE_COLORS.find((c) => !used.has(c)) ?? COURSE_COLORS[get().courses.length % COURSE_COLORS.length]
          const course = makeCourse({
            name: tpl?.name ?? 'Neuer Kurs',
            short: tpl?.short ?? '',
            color,
            mandatory: tpl ? perSem((_, i) => tpl.mandatory[i]) : perSem(() => false),
            notTaken: tpl?.notTaken ? perSem((_, i) => tpl.notTaken![i]) : perSem(() => false),
            isProjektkurs: tpl?.name === 'Projektkurs' ? true : undefined,
          })
          // Projektkurs läuft über zwei Halbjahre – Vorschlag Q1 (wie im Merkblatt), änderbar
          if (course.isProjektkurs) course.notTaken = perSem((_, i) => i >= 2)
          set((s) => ({ courses: [...s.courses, course] }))
          return course.id
        },
        updateCourse: (id, patch) => mapCourse(id, (c) => ({ ...c, ...patch })),
        removeCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),
        moveCourse: (id, dir) =>
          set((s) => {
            const i = s.courses.findIndex((c) => c.id === id)
            const j = i + dir
            if (i < 0 || j < 0 || j >= s.courses.length) return {}
            const arr = [...s.courses]
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
            return { courses: arr }
          }),
        setSemester: (id, sem, patch) =>
          mapCourse(id, (c) => ({ ...c, semesters: { ...c.semesters, [sem]: { ...c.semesters[sem], ...patch } } })),
        addGradeEntry: (id, sem, entry) =>
          mapCourse(id, (c) => ({
            ...c,
            semesters: {
              ...c.semesters,
              [sem]: { ...c.semesters[sem], entries: [...c.semesters[sem].entries, { ...entry, id: uid() }] },
            },
          })),
        removeGradeEntry: (id, sem, entryId) =>
          mapCourse(id, (c) => ({
            ...c,
            semesters: {
              ...c.semesters,
              [sem]: { ...c.semesters[sem], entries: c.semesters[sem].entries.filter((e) => e.id !== entryId) },
            },
          })),
        setExam: (nr, patch) => set((s) => ({ exams: { ...s.exams, [nr]: { ...s.exams[nr], ...patch } } })),
        setBll: (patch) => set((s) => ({ bll: { ...s.bll, ...patch } })),
        toggleBlockI: (key, mode) =>
          set((s) => {
            const include = s.blockI.include.filter((k) => k !== key)
            const exclude = s.blockI.exclude.filter((k) => k !== key)
            if (mode === 'include') include.push(key)
            if (mode === 'exclude') exclude.push(key)
            return { blockI: { include, exclude } }
          }),
        setSemesterOverride: (key, value) =>
          set((s) => {
            const next = { ...s.simulation.semesterOverrides }
            if (value == null) delete next[key]
            else next[key] = value
            return { simulation: { ...s.simulation, semesterOverrides: next } }
          }),
        setExamOverride: (nr, value) =>
          set((s) => {
            const next = { ...s.simulation.examOverrides }
            if (value == null) delete next[nr]
            else next[nr] = value
            return { simulation: { ...s.simulation, examOverrides: next } }
          }),
        clearOverrides: () => set({ simulation: { semesterOverrides: {}, examOverrides: {} } }),

        setTopic: (topicId, patch) =>
          set((s) => ({
            topics: {
              ...s.topics,
              [topicId]: {
                ...({ status: 'offen', confidence: 0, note: '' } satisfies TopicProgress),
                ...(s.topics[topicId] as TopicProgress | undefined),
                ...patch,
              },
            },
          })),

        rateCard: (cardId, rating) =>
          set((s) => ({ cardStates: { ...s.cardStates, [cardId]: review(s.cardStates[cardId], rating) } })),
        resetCard: (cardId) =>
          set((s) => {
            const next = { ...s.cardStates }
            delete next[cardId]
            return { cardStates: next }
          }),
        addCustomCard: (c) =>
          set((s) => ({ customCards: [...s.customCards, { ...c, id: `own-${uid()}`, createdAt: todayISO() }] })),
        updateCustomCard: (id, patch) =>
          set((s) => ({ customCards: s.customCards.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
        removeCustomCard: (id) => set((s) => ({ customCards: s.customCards.filter((c) => c.id !== id) })),
        toggleHiddenCard: (id) =>
          set((s) => ({
            hiddenCards: s.hiddenCards.includes(id) ? s.hiddenCards.filter((x) => x !== id) : [...s.hiddenCards, id],
          })),
        editCard: (id, q, a) => set((s) => ({ cardEdits: { ...s.cardEdits, [id]: { q, a } } })),
        revertCard: (id) =>
          set((s) => {
            const next = { ...s.cardEdits }
            delete next[id]
            return { cardEdits: next }
          }),

        recordQuizAnswer: (questionId, correct) =>
          set((s) => {
            const prev = s.quizStats[questionId] ?? { right: 0, wrong: 0, last: false, lastDate: '' }
            return {
              quizStats: {
                ...s.quizStats,
                [questionId]: {
                  right: prev.right + (correct ? 1 : 0),
                  wrong: prev.wrong + (correct ? 0 : 1),
                  last: correct,
                  lastDate: todayISO(),
                },
              },
            }
          }),
        recordQuizRun: (run) =>
          set((s) => ({ quizRuns: [...s.quizRuns, { ...run, id: uid(), date: todayISO() }].slice(-300) })),

        addSession: (sess) => set((s) => ({ sessions: [...s.sessions, { ...sess, id: uid() }] })),
        removeSession: (id) => set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),
        setTimer: (patch) => set((s) => ({ timer: { ...s.timer, ...patch } })),

        addEvent: (e) => set((s) => ({ events: [...s.events, { ...e, id: uid() }] })),
        updateEvent: (id, patch) => set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
        removeEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
        toggleBuiltin: (id) =>
          set((s) => ({
            hiddenBuiltins: s.hiddenBuiltins.includes(id)
              ? s.hiddenBuiltins.filter((x) => x !== id)
              : [...s.hiddenBuiltins, id],
          })),
        addTodo: (t) => set((s) => ({ todos: [...s.todos, { ...t, id: uid(), done: false, createdAt: todayISO() }] })),
        updateTodo: (id, patch) => set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
        toggleTodo: (id) =>
          set((s) => ({
            todos: s.todos.map((t) =>
              t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? todayISO() : undefined } : t,
            ),
          })),
        removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

        addPastExam: (p) => set((s) => ({ pastExams: [...s.pastExams, { ...p, id: uid() }] })),
        updatePastExam: (id, patch) =>
          set((s) => ({ pastExams: s.pastExams.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
        removePastExam: (id) => set((s) => ({ pastExams: s.pastExams.filter((p) => p.id !== id) })),

        setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
        setExamDate: (id, date) =>
          set((s) => ({ settings: { ...s.settings, examDates: { ...s.settings.examDates, [id]: date } } })),
        markBackup: () => set((s) => ({ meta: { ...s.meta, lastBackupAt: new Date().toISOString() } })),
        replaceAll: (data) => set(normalizeData(data)),
        resetAll: () => set(defaultData()),
      }
    },
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => pickData(s),
      migrate: (persisted) => normalizeData(persisted as Partial<AppData>),
      merge: (persisted, current) => ({ ...current, ...normalizeData((persisted ?? {}) as Partial<AppData>) }),
    },
  ),
)

/** Alle Abiturfach-Kurse in Reihenfolge 1–4. */
export const abiCourses = (courses: Course[]) =>
  ([1, 2, 3, 4] as AbiNr[]).map((nr) => courses.find((c) => c.abiNr === nr) ?? null)
