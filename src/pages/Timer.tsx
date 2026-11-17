import { useMemo, useState } from 'react'
import { topicsOf } from '../content'
import { SUBJECTS, SUBJECT_BY_ID } from '../content/subjects'
import type { SubjectId } from '../content/types'
import { useStore } from '../store/store'
import type { StudySession, TimerState } from '../store/types'
import { elapsedMs, useTimerDisplay } from '../components/TimerController'
import { BarList, DaysTable, Heatmap, Legend, StackedDays } from '../components/charts'
import { STUDY_SERIES, activityStreak, dailyData, minutesByDay, minutesBySubject, minutesThisWeek } from '../lib/study'
import { addDays, formatClock, formatDay, formatMinutes, todayISO } from '../lib/dates'
import { Button, Card, Field, IconButton, PageHeader, ProgressBar, Select, Stat, SubjectDot, Tabs, TextInput } from '../components/ui'
import { Icon } from '../components/Icon'

export function Timer() {
  return (
    <div>
      <PageHeader title="Lern-Timer & Statistik" subtitle="Fokussiert lernen mit Pomodoro oder Stoppuhr – jede Einheit landet automatisch in deiner Statistik." />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TimerCard />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <WeekCard />
          <ManualEntry />
        </div>
      </div>
      <div className="mt-6">
        <StatsCard />
      </div>
      <div className="mt-6">
        <SessionList />
      </div>
    </div>
  )
}

function TimerCard() {
  const { timer, remainingSec, elapsedSec, durationSec, running } = useTimerDisplay()
  const settings = useStore((s) => s.settings)
  const setTimer = useStore((s) => s.setTimer)
  const setSettings = useStore((s) => s.setSettings)
  const addSession = useStore((s) => s.addSession)

  const logElapsed = (t: TimerState) => {
    const minutes = Math.round(elapsedMs(t) / 60000)
    if (minutes >= 1)
      addSession({
        subjectId: t.subjectId,
        topic: t.topic,
        date: todayISO(),
        start: Date.now() - elapsedMs(t),
        minutes,
        kind: t.mode === 'pomodoro' ? 'pomodoro' : 'stopwatch',
      })
  }

  const start = () => setTimer({ running: true, startedAt: Date.now() })
  const pause = () => setTimer({ running: false, startedAt: null, accumulatedMs: elapsedMs(timer) })
  const reset = () => setTimer({ running: false, startedAt: null, accumulatedMs: 0, phase: 'focus' })
  const finish = () => {
    logElapsed(timer)
    reset()
  }
  const skip = () => {
    if (timer.phase === 'focus') {
      logElapsed(timer)
      setTimer({ phase: 'break', running: true, startedAt: Date.now(), accumulatedMs: 0, cycles: timer.cycles + 1 })
    } else reset()
  }

  const isPomo = timer.mode === 'pomodoro'
  const progress = isPomo && durationSec ? 1 - remainingSec / durationSec : 0
  const R = 88
  const C = 2 * Math.PI * R
  const accent = timer.phase === 'break' ? '#10b981' : 'var(--color-brand-500)'
  const started = running || timer.accumulatedMs > 0

  return (
    <Card title="Timer" icon="timer">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={timer.mode}
          onChange={(m) => !started && setTimer({ mode: m, phase: 'focus' })}
          tabs={[
            { value: 'pomodoro', label: 'Pomodoro' },
            { value: 'stopwatch', label: 'Stoppuhr' },
          ]}
        />
        {started && <span className="text-xs text-slate-500">Modus wechseln: erst zurücksetzen</span>}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Fach">
          <Select
            value={timer.subjectId ?? ''}
            onChange={(e) => setTimer({ subjectId: (e.target.value || null) as SubjectId | 'other' | null, topic: null })}
          >
            <option value="">– bitte wählen –</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value="other">Sonstiges</option>
          </Select>
        </Field>
        <Field label="Thema (optional)">
          <Select
            value={timer.topic ?? ''}
            disabled={!timer.subjectId || timer.subjectId === 'other'}
            onChange={(e) => setTimer({ topic: e.target.value || null })}
          >
            <option value="">–</option>
            {timer.subjectId &&
              timer.subjectId !== 'other' &&
              topicsOf(timer.subjectId).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title.length > 55 ? t.title.slice(0, 53) + '…' : t.title}
                </option>
              ))}
          </Select>
        </Field>
      </div>

      <div className="my-6 flex flex-col items-center">
        <div className="relative">
          <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
            <circle cx="110" cy="110" r={R} fill="none" stroke="var(--chart-grid)" strokeWidth="10" />
            {isPomo && (
              <circle
                cx="110"
                cy="110"
                r={R}
                fill="none"
                stroke={accent}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {isPomo ? (timer.phase === 'focus' ? 'Fokus' : 'Pause') : 'Stoppuhr'}
            </div>
            <div className="tabular text-5xl font-bold">{formatClock(isPomo ? remainingSec : elapsedSec)}</div>
            {isPomo && <div className="text-xs text-slate-500">Runde {timer.cycles + 1}</div>}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {running ? (
            <Button size="lg" icon="pause" onClick={pause}>
              Pause
            </Button>
          ) : (
            <Button size="lg" variant="primary" icon="play" onClick={start}>
              {timer.accumulatedMs > 0 ? 'Weiter' : 'Start'}
            </Button>
          )}
          {isPomo && started && (
            <Button size="lg" icon="chevronRight" onClick={skip}>
              {timer.phase === 'focus' ? 'Zur Pause' : 'Pause beenden'}
            </Button>
          )}
          {!isPomo && started && (
            <Button size="lg" variant="success" icon="check" onClick={finish}>
              Beenden & speichern
            </Button>
          )}
          {started && (
            <Button size="lg" variant="ghost" icon="reset" onClick={reset}>
              Zurücksetzen
            </Button>
          )}
        </div>
        {!timer.subjectId && <p className="mt-3 text-xs text-amber-600">Tipp: Wähle ein Fach, damit die Zeit richtig zugeordnet wird.</p>}
      </div>

      {isPomo && (
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <label className="flex items-center gap-2">
            Fokus
            <Select className="w-20" value={settings.pomodoroFocus} onChange={(e) => setSettings({ pomodoroFocus: Number(e.target.value) })}>
              {[15, 20, 25, 30, 40, 45, 50, 60, 90].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            min
          </label>
          <label className="flex items-center gap-2">
            Pause
            <Select className="w-20" value={settings.pomodoroBreak} onChange={(e) => setSettings({ pomodoroBreak: Number(e.target.value) })}>
              {[3, 5, 10, 15, 20].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            min
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-brand-600" checked={settings.sound} onChange={(e) => setSettings({ sound: e.target.checked })} />
            Ton
          </label>
        </div>
      )}
    </Card>
  )
}

function WeekCard() {
  const sessions = useStore((s) => s.sessions)
  const cardStates = useStore((s) => s.cardStates)
  const quizRuns = useStore((s) => s.quizRuns)
  const goal = useStore((s) => s.settings.weeklyGoalHours)
  const setSettings = useStore((s) => s.setSettings)
  const today = todayISO()
  const week = minutesThisWeek(sessions, today)
  const todayMin = sessions.filter((s) => s.date === today).reduce((a, s) => a + s.minutes, 0)
  const str = activityStreak({ sessions, cardStates, quizRuns }, today)
  return (
    <Card title="Diese Woche" icon="target">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Heute" value={formatMinutes(todayMin)} />
        <Stat label="Woche" value={formatMinutes(week)} />
        <Stat
          label="Lernserie"
          value={
            <span className="flex items-center gap-1">
              {str} <Icon name="flame" className="size-5 text-orange-500" />
            </span>
          }
          sub={str === 1 ? 'Tag' : 'Tage'}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Wochenziel</span>
          <span className="tabular">
            {formatMinutes(week)} / {goal} h
          </span>
        </div>
        <ProgressBar value={week / (goal * 60)} color={week >= goal * 60 ? '#10b981' : undefined} />
        <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          Ziel pro Woche
          <Select className="h-8 w-20" value={goal} onChange={(e) => setSettings({ weeklyGoalHours: Number(e.target.value) })}>
            {[3, 5, 7, 10, 12, 15, 20, 25, 30].map((h) => (
              <option key={h} value={h}>
                {h} h
              </option>
            ))}
          </Select>
        </label>
      </div>
    </Card>
  )
}

function ManualEntry() {
  const addSession = useStore((s) => s.addSession)
  const [date, setDate] = useState(todayISO())
  const [subjectId, setSubjectId] = useState<StudySession['subjectId']>('geo')
  const [minutes, setMinutes] = useState('45')
  return (
    <Card title="Lernzeit nachtragen" icon="plus">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Datum">
          <TextInput type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Minuten">
          <TextInput inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value.replace(/\D/g, ''))} />
        </Field>
        <Field label="Fach">
          <Select value={subjectId ?? ''} onChange={(e) => setSubjectId(e.target.value as SubjectId)}>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value="other">Sonstiges</option>
          </Select>
        </Field>
        <div className="flex items-end">
          <Button
            variant="primary"
            className="w-full"
            disabled={!Number(minutes) || !date}
            onClick={() => {
              addSession({ subjectId, topic: null, date, start: new Date(date).getTime(), minutes: Number(minutes), kind: 'manual' })
              setMinutes('45')
            }}
          >
            Eintragen
          </Button>
        </div>
      </div>
    </Card>
  )
}

function StatsCard() {
  const sessions = useStore((s) => s.sessions)
  const [range, setRange] = useState<'14' | '30'>('14')
  const [showTable, setShowTable] = useState(false)
  const today = todayISO()
  const days = Number(range)
  const data = useMemo(() => dailyData(sessions, days, today), [sessions, days, today])
  const bySubject = useMemo(() => minutesBySubject(sessions, addDays(today, -(days - 1))), [sessions, days, today])
  const heat = useMemo(() => minutesByDay(sessions), [sessions])
  const total = Object.values(bySubject).reduce((a, b) => a + b, 0)

  return (
    <Card
      title="Statistik"
      icon="grades"
      action={
        <Tabs
          value={range}
          onChange={setRange}
          tabs={[
            { value: '14', label: '14 Tage' },
            { value: '30', label: '30 Tage' },
          ]}
        />
      }
    >
      {sessions.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">Noch keine Lernzeit erfasst – starte den Timer oder trag Zeit nach.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">Lernzeit pro Tag · gesamt {formatMinutes(total)}</div>
              <Legend series={STUDY_SERIES} />
            </div>
            <StackedDays data={data} series={STUDY_SERIES} />
            <button className="mt-1 text-xs text-brand-600 hover:underline" onClick={() => setShowTable(!showTable)}>
              {showTable ? 'Tabelle ausblenden' : 'Als Tabelle anzeigen'}
            </button>
            {showTable && (
              <div className="mt-2">
                <DaysTable data={data} series={STUDY_SERIES} />
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div>
              <div className="mb-3 text-sm font-medium">Nach Fach ({range} Tage)</div>
              <BarList
                items={STUDY_SERIES.map((s) => ({
                  key: s.key,
                  label: s.label,
                  color: s.color,
                  value: bySubject[s.key] ?? 0,
                  display: formatMinutes(bySubject[s.key] ?? 0),
                }))}
              />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">Aktivität (18 Wochen)</div>
              <Heatmap values={heat} endDate={today} />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function SessionList() {
  const sessions = useStore((s) => s.sessions)
  const remove = useStore((s) => s.removeSession)
  const recent = [...sessions].sort((a, b) => b.start - a.start).slice(0, 12)
  if (recent.length === 0) return null
  return (
    <Card title="Letzte Lerneinheiten" icon="list">
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {recent.map((s) => {
          const meta = s.subjectId && s.subjectId !== 'other' ? SUBJECT_BY_ID[s.subjectId] : null
          return (
            <li key={s.id} className="flex items-center gap-3 py-2 text-sm">
              <SubjectDot color={meta?.color ?? 'var(--subj-other)'} />
              <span className="w-28 shrink-0 text-slate-500">{formatDay(s.date)}</span>
              <span className="min-w-0 flex-1 truncate">{meta?.name ?? 'Sonstiges'}</span>
              <span className="text-xs text-slate-500">{s.kind === 'pomodoro' ? 'Pomodoro' : s.kind === 'stopwatch' ? 'Stoppuhr' : 'nachgetragen'}</span>
              <span className="tabular w-16 text-right font-medium">{formatMinutes(s.minutes)}</span>
              <IconButton icon="trash" label="Einheit löschen" onClick={() => remove(s.id)} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
