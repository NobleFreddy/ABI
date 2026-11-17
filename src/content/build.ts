import type { ContentCard, ContentQuiz } from './types'

/** Stabile ID aus dem Fragetext – Lernstände bleiben erhalten, auch wenn neue Karten dazukommen. */
function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

function uniqueIds<T extends { id: string }>(items: T[]): T[] {
  const seen = new Map<string, number>()
  return items.map((it) => {
    const n = seen.get(it.id) ?? 0
    seen.set(it.id, n + 1)
    return n === 0 ? it : { ...it, id: `${it.id}-${n}` }
  })
}

/** [Thema, Frage, Antwort] */
export type CardTuple = [topic: string, q: string, a: string]
/** [Thema, Frage, Antwortmöglichkeiten, Index der richtigen, Erklärung] */
export type QuizTuple = [topic: string, q: string, options: string[], correct: number, explain?: string]

export function buildCards(prefix: string, list: CardTuple[]): ContentCard[] {
  return uniqueIds(list.map(([topic, q, a]) => ({ id: `${prefix}-${hash(q)}`, topic, q, a })))
}

export function buildQuiz(prefix: string, list: QuizTuple[]): ContentQuiz[] {
  return uniqueIds(
    list.map(([topic, q, options, correct, explain]) => ({ id: `${prefix}q-${hash(q)}`, topic, q, options, correct, explain })),
  )
}
