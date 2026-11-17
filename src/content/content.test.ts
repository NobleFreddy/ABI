import { describe, expect, it } from 'vitest'
import { ALL_QUIZ, BUILTIN_CARDS, CONTENT, TOPIC_BY_ID } from './index'

describe('Lerninhalte', () => {
  it('jede Karte und jede Quizfrage gehört zu einem existierenden Thema', () => {
    for (const c of BUILTIN_CARDS) expect(TOPIC_BY_ID[c.topic], `Karte ${c.id}: ${c.topic}`).toBeDefined()
    for (const q of ALL_QUIZ) expect(TOPIC_BY_ID[q.topic], `Frage ${q.id}: ${q.topic}`).toBeDefined()
  })

  it('Thema passt zum Fach', () => {
    for (const c of BUILTIN_CARDS) expect(TOPIC_BY_ID[c.topic].subjectId).toBe(c.subjectId)
    for (const q of ALL_QUIZ) expect(TOPIC_BY_ID[q.topic].subjectId).toBe(q.subjectId)
  })

  it('IDs sind eindeutig', () => {
    const ids = [...BUILTIN_CARDS.map((c) => c.id), ...ALL_QUIZ.map((q) => q.id), ...Object.keys(TOPIC_BY_ID)]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('Quizfragen haben eine gültige richtige Antwort und keine doppelten Optionen', () => {
    for (const q of ALL_QUIZ) {
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(q.options.length)
      expect(new Set(q.options).size, q.q).toBe(q.options.length)
    }
  })

  it('keine Formel-Platzhalter oder leeren Texte', () => {
    for (const c of BUILTIN_CARDS) {
      expect(c.q.trim().length).toBeGreaterThan(5)
      expect(c.a.trim().length).toBeGreaterThan(5)
      // ungerade Anzahl $ deutet auf eine kaputte Formel hin
      const dollars = (s: string) => (s.match(/\$/g) ?? []).length
      expect(dollars(c.q) % 2, c.q).toBe(0)
      expect(dollars(c.a) % 2, c.a).toBe(0)
    }
  })

  it('jedes Fach hat genug Material', () => {
    for (const c of Object.values(CONTENT)) {
      expect(c.cards.length, c.subjectId).toBeGreaterThanOrEqual(50)
      expect(c.quiz.length, c.subjectId).toBeGreaterThanOrEqual(25)
    }
  })

  it('jedes Thema hat mindestens eine Karteikarte', () => {
    const withCards = new Set(BUILTIN_CARDS.map((c) => c.topic))
    const missing = Object.keys(TOPIC_BY_ID).filter((t) => !withCards.has(t))
    expect(missing).toEqual([])
  })
})
