export type SubjectId = 'geo' | 'latein' | 'mathe' | 'bio'

export interface ContentTopic {
  id: string
  title: string
  /** Fokussierungen laut Vorgaben 2027 (im Original rot markiert) */
  focus?: string[]
  /** Stichpunkte, was dazugehört */
  details?: string[]
}

export interface ContentArea {
  id: string
  title: string
  topics: ContentTopic[]
}

/** Karteikarte. Text darf $…$ (Formel) und **fett** enthalten. */
export interface ContentCard {
  id: string
  topic: string
  q: string
  a: string
}

export interface ContentQuiz {
  id: string
  topic: string
  q: string
  options: string[]
  /** Index der richtigen Antwort */
  correct: number
  explain?: string
}

export interface SubjectContent {
  subjectId: SubjectId
  areas: ContentArea[]
  cards: ContentCard[]
  quiz: ContentQuiz[]
}
