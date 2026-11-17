/**
 * Vereinfachtes SM-2-Verfahren (wie Anki) für Karteikarten.
 * Bewertungen: 0 = Nochmal, 1 = Schwer, 2 = Gut, 3 = Einfach.
 */
import { addDays, todayISO } from './dates'

export type Rating = 0 | 1 | 2 | 3

export interface SrsState {
  ease: number
  /** Intervall in Tagen */
  interval: number
  reps: number
  lapses: number
  /** fällig ab (YYYY-MM-DD) */
  due: string
  last?: string
}

export const RATING_LABELS: Record<Rating, string> = {
  0: 'Nochmal',
  1: 'Schwer',
  2: 'Gut',
  3: 'Einfach',
}

export const MAX_INTERVAL = 60

export function newCardState(today = todayISO()): SrsState {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: today }
}

export function review(state: SrsState | undefined, rating: Rating, today = todayISO()): SrsState {
  const s = state ?? newCardState(today)
  let { ease, interval, reps, lapses } = s

  if (rating === 0) {
    reps = 0
    lapses += 1
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
  } else if (rating === 1) {
    interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2))
    ease = Math.max(1.3, ease - 0.15)
    reps += 1
  } else if (rating === 2) {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease)
    reps += 1
  } else {
    interval = reps === 0 ? 4 : Math.round(Math.max(interval, 1) * ease * 1.3)
    ease = ease + 0.15
    reps += 1
  }
  interval = Math.min(MAX_INTERVAL, interval)
  return { ease: Math.round(ease * 100) / 100, interval, reps, lapses, due: addDays(today, interval), last: today }
}

export function isDue(state: SrsState | undefined, today = todayISO()): boolean {
  return !state || state.due <= today
}

/** Grobe Einschätzung, wie gut eine Karte sitzt (0–1). */
export function mastery(state: SrsState | undefined): number {
  if (!state || state.reps === 0) return 0
  return Math.min(1, state.interval / 21)
}
