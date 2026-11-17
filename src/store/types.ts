import type { QSemester, RoundingMode } from '../lib/abi-calc'
import type { SrsState } from '../lib/srs'
import type { SubjectId } from '../content/types'

export type AbiNr = 1 | 2 | 3 | 4

export interface GradeEntry {
  id: string
  label: string
  kind: 'klausur' | 'sonstige' | 'andere'
  points: number
  date?: string
}

export interface SemesterData {
  /** Halbjahresnote 0–15 (null = noch nicht eingetragen) */
  points: number | null
  /** Wert ist nur eine Prognose */
  isForecast: boolean
  entries: GradeEntry[]
}

export interface Course {
  id: string
  name: string
  short: string
  type: 'LK' | 'GK'
  abiNr: AbiNr | null
  subjectId: SubjectId | null
  color: string
  mandatory: Record<QSemester, boolean>
  notTaken: Record<QSemester, boolean>
  semesters: Record<QSemester, SemesterData>
  isProjektkurs?: boolean
}

export interface ExamEntry {
  main: number | null
  extraOral: number | null
}

export type TopicStatus = 'offen' | 'arbeit' | 'sicher'

export interface TopicProgress {
  status: TopicStatus
  /** Selbsteinschätzung 1–5, 0 = noch nicht bewertet */
  confidence: number
  note: string
  lastReviewed?: string
}

export interface CustomCard {
  id: string
  subjectId: SubjectId
  topic: string | null
  q: string
  a: string
  createdAt: string
}

export interface QuizStat {
  right: number
  wrong: number
  last: boolean
  lastDate: string
}

export interface QuizRun {
  id: string
  date: string
  subjectId: SubjectId | 'mix'
  topic: string | null
  correct: number
  total: number
}

export interface StudySession {
  id: string
  subjectId: SubjectId | 'other' | null
  topic: string | null
  date: string
  start: number
  minutes: number
  kind: 'pomodoro' | 'stopwatch' | 'manual'
  note?: string
}

export interface TimerState {
  mode: 'pomodoro' | 'stopwatch'
  phase: 'focus' | 'break'
  running: boolean
  startedAt: number | null
  accumulatedMs: number
  subjectId: SubjectId | 'other' | null
  topic: string | null
  cycles: number
}

export type EventType = 'klausur' | 'abgabe' | 'vorabi' | 'termin' | 'sonstiges'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  type: EventType
  subjectId?: SubjectId | null
  notes?: string
}

export interface Todo {
  id: string
  title: string
  done: boolean
  due?: string
  subjectId?: SubjectId | null
  priority: 1 | 2 | 3
  createdAt: string
  doneAt?: string
}

export interface PastExam {
  id: string
  subjectId: SubjectId
  year: string
  label: string
  achieved: number | null
  max: number | null
  done: boolean
  date?: string
  notes?: string
}

export interface Settings {
  name: string
  theme: 'system' | 'light' | 'dark'
  weeklyGoalHours: number
  pomodoroFocus: number
  pomodoroBreak: number
  roundingMode: RoundingMode
  examDates: Record<SubjectId, string>
  newCardsPerDay: number
  sound: boolean
}

export interface AppData {
  meta: { createdAt: string; lastBackupAt: string | null; schema: number }
  settings: Settings
  courses: Course[]
  exams: Record<AbiNr, ExamEntry>
  /** Besondere Lernleistung: wird sie eingebracht, zählen alle Prüfungen vierfach */
  bll: { enabled: boolean; points: number | null; title: string }
  blockI: { include: string[]; exclude: string[] }
  simulation: { semesterOverrides: Record<string, number>; examOverrides: Record<string, number> }
  topics: Record<string, TopicProgress>
  cardStates: Record<string, SrsState>
  customCards: CustomCard[]
  hiddenCards: string[]
  cardEdits: Record<string, { q: string; a: string }>
  quizStats: Record<string, QuizStat>
  quizRuns: QuizRun[]
  sessions: StudySession[]
  timer: TimerState
  events: CalendarEvent[]
  hiddenBuiltins: string[]
  todos: Todo[]
  pastExams: PastExam[]
}
