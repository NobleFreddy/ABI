import type { ContentCard, ContentQuiz, ContentTopic, SubjectContent, SubjectId } from './types'
import { geographie } from './geographie'
import { latein } from './latein'
import { mathematik } from './mathematik'
import { biologie } from './biologie'

export const CONTENT: Record<SubjectId, SubjectContent> = {
  geo: geographie,
  latein,
  mathe: mathematik,
  bio: biologie,
}

export interface TopicRef extends ContentTopic {
  subjectId: SubjectId
  areaId: string
  areaTitle: string
}

export const ALL_TOPICS: TopicRef[] = Object.values(CONTENT).flatMap((c) =>
  c.areas.flatMap((a) => a.topics.map((t) => ({ ...t, subjectId: c.subjectId, areaId: a.id, areaTitle: a.title }))),
)

export const TOPIC_BY_ID: Record<string, TopicRef> = Object.fromEntries(ALL_TOPICS.map((t) => [t.id, t]))

export const topicsOf = (id: SubjectId) => ALL_TOPICS.filter((t) => t.subjectId === id)

export interface CardRef extends ContentCard {
  subjectId: SubjectId
  custom?: boolean
  edited?: boolean
}

export const BUILTIN_CARDS: CardRef[] = Object.values(CONTENT).flatMap((c) =>
  c.cards.map((card) => ({ ...card, subjectId: c.subjectId })),
)

export interface QuizRef extends ContentQuiz {
  subjectId: SubjectId
}

export const ALL_QUIZ: QuizRef[] = Object.values(CONTENT).flatMap((c) =>
  c.quiz.map((q) => ({ ...q, subjectId: c.subjectId })),
)

export type { SubjectId } from './types'
