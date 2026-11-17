import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { formatClock, todayISO } from '../lib/dates'

const BASE_TITLE = 'Abi-Cockpit 2027'

export function elapsedMs(t: { accumulatedMs: number; running: boolean; startedAt: number | null }, now = Date.now()) {
  return t.accumulatedMs + (t.running && t.startedAt ? now - t.startedAt : 0)
}

export function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const play = (start: number, freq: number) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = freq
      o.type = 'sine'
      g.gain.setValueAtTime(0.0001, ctx.currentTime + start)
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + 0.35)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + start)
      o.stop(ctx.currentTime + start + 0.4)
    }
    play(0, 880)
    play(0.45, 1175)
    setTimeout(() => ctx.close(), 1500)
  } catch {
    /* kein Audio verfügbar */
  }
}

/** Läuft im Hintergrund jeder Seite: beendet Pomodoro-Phasen und protokolliert Lernzeit. */
export function TimerController() {
  const running = useStore((s) => s.timer.running)
  const phase = useStore((s) => s.timer.phase)
  const mode = useStore((s) => s.timer.mode)

  useEffect(() => {
    if (!running) {
      document.title = BASE_TITLE
      return
    }
    const tick = () => {
      const { timer: t, settings: st, addSession, setTimer } = useStore.getState()
      if (!t.running) return
      const el = elapsedMs(t)
      if (t.mode === 'pomodoro') {
        const dur = (t.phase === 'focus' ? st.pomodoroFocus : st.pomodoroBreak) * 60000
        const remaining = dur - el
        if (remaining <= 0) {
          const longAgo = remaining < -60000 // App war zwischendurch geschlossen
          if (t.phase === 'focus') {
            addSession({
              subjectId: t.subjectId,
              topic: t.topic,
              date: todayISO(),
              start: (t.startedAt ?? Date.now()) - t.accumulatedMs,
              minutes: st.pomodoroFocus,
              kind: 'pomodoro',
            })
            setTimer(
              longAgo
                ? { phase: 'focus', running: false, startedAt: null, accumulatedMs: 0, cycles: t.cycles + 1 }
                : { phase: 'break', running: true, startedAt: Date.now(), accumulatedMs: 0, cycles: t.cycles + 1 },
            )
          } else {
            setTimer({ phase: 'focus', running: false, startedAt: null, accumulatedMs: 0 })
          }
          if (st.sound && !longAgo) beep()
          return
        }
        document.title = `${formatClock(remaining / 1000)} · ${t.phase === 'focus' ? 'Fokus' : 'Pause'}`
      } else {
        document.title = `${formatClock(el / 1000)} · Lernzeit`
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [running, phase, mode])

  return null
}

/** Für Anzeigen: aktualisiert sich jede Sekunde. */
export function useTimerDisplay() {
  const timer = useStore((s) => s.timer)
  const settings = useStore((s) => s.settings)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!timer.running) return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [timer.running])
  const el = elapsedMs(timer, now)
  const dur = timer.mode === 'pomodoro' ? (timer.phase === 'focus' ? settings.pomodoroFocus : settings.pomodoroBreak) * 60000 : 0
  const remainingSec = timer.mode === 'pomodoro' ? Math.max(0, (dur - el) / 1000) : el / 1000
  const label = timer.mode === 'pomodoro' ? (timer.phase === 'focus' ? 'Fokus' : 'Pause') : 'Stoppuhr'
  return { running: timer.running, label, remainingSec, elapsedSec: el / 1000, durationSec: dur / 1000, timer }
}
