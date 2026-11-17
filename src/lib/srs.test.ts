import { describe, expect, it } from 'vitest'
import { MAX_INTERVAL, isDue, newCardState, review } from './srs'

const T = '2026-11-17'

describe('Karteikarten-Wiederholung (SM-2)', () => {
  it('neue Karte: Gut → morgen, dann 3 Tage, dann Intervall × Leichtigkeit', () => {
    let s = review(undefined, 2, T)
    expect(s.interval).toBe(1)
    expect(s.due).toBe('2026-11-18')
    s = review(s, 2, T)
    expect(s.interval).toBe(3)
    s = review(s, 2, T)
    expect(s.interval).toBe(8) // 3 · 2,5 = 7,5 → 8
  })

  it('Nochmal setzt die Karte zurück und senkt die Leichtigkeit', () => {
    let s = review(undefined, 2, T)
    s = review(s, 2, T)
    s = review(s, 0, T)
    expect(s.interval).toBe(0)
    expect(s.due).toBe(T)
    expect(s.reps).toBe(0)
    expect(s.lapses).toBe(1)
    expect(s.ease).toBeCloseTo(2.3, 5)
  })

  it('Einfach springt weiter, Schwer weniger weit', () => {
    expect(review(undefined, 3, T).interval).toBe(4)
    const base = review(review(review(undefined, 2, T), 2, T), 2, T) // 8 Tage
    expect(review(base, 1, T).interval).toBeLessThan(review(base, 2, T).interval)
    expect(review(base, 3, T).interval).toBeGreaterThan(review(base, 2, T).interval)
  })

  it('Intervall ist gedeckelt, damit vor dem Abi alles wiederkommt', () => {
    let s = newCardState(T)
    for (let i = 0; i < 20; i++) s = review(s, 3, T)
    expect(s.interval).toBe(MAX_INTERVAL)
  })

  it('fällig-Prüfung', () => {
    expect(isDue(undefined, T)).toBe(true)
    expect(isDue(review(undefined, 2, T), T)).toBe(false)
    expect(isDue(review(undefined, 2, T), '2026-11-18')).toBe(true)
  })
})
