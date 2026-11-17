import { useMemo } from 'react'
import { Link } from 'react-router'
import { SUBJECTS, SUBJECT_BY_ID } from '../content/subjects'
import { useStore } from '../store/store'
import { simInputFrom, subjectProgress, useDueCards } from '../store/derived'
import { simulate } from '../lib/abi-simulation'
import { ROUNDING_LABELS, fmt, fmtGrade } from '../lib/abi-calc'
import { activityStreak, minutesThisWeek } from '../lib/study'
import { daysBetween, formatDate, formatMinutes, todayISO } from '../lib/dates'
import { ALL_TOPICS } from '../content'
import { useAgenda, AgendaRow } from './Kalender'
import { Badge, ButtonLink, Card, Checkbox, ProgressBar, SubjectDot } from '../components/ui'
import { Icon } from '../components/Icon'

export function Dashboard() {
  const name = useStore((s) => s.settings.name)
  const today = todayISO()
  const hour = new Date().getHours()
  const greet = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greet}
          {name ? `, ${name}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">{formatDate(today)} · Dein Abi-Cockpit für 2027</p>
      </div>
      <Countdowns />
      <div className="grid gap-6 lg:grid-cols-3">
        <PrognoseCard />
        <ProgressCard />
        <TodayCard />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <UpcomingCard />
        <TodoCard />
        <FocusCard />
      </div>
    </div>
  )
}

function Countdowns() {
  const dates = useStore((s) => s.settings.examDates)
  const today = todayISO()
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {SUBJECTS.map((s) => {
        const d = daysBetween(today, dates[s.id])
        return (
          <Link
            key={s.id}
            to={`/lernplan?fach=${s.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            style={{ borderTop: `4px solid ${s.color}` }}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {s.abiNr}. Fach · {s.type}
              </span>
              <span>{s.examKind}</span>
            </div>
            <div className="mt-1 font-semibold">{s.name}</div>
            <div className="mt-2 text-3xl font-bold">{d > 0 ? d : d === 0 ? 'Heute' : '✓'}</div>
            <div className="text-xs text-slate-500">
              {d > 0 ? 'Tage bis ' : ''}
              {formatDate(dates[s.id])}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function PrognoseCard() {
  const courses = useStore((s) => s.courses)
  const exams = useStore((s) => s.exams)
  const simulation = useStore((s) => s.simulation)
  const blockI = useStore((s) => s.blockI)
  const bll = useStore((s) => s.bll)
  const mode = useStore((s) => s.settings.roundingMode)
  const r = useMemo(() => simulate(simInputFrom({ courses, exams, simulation, blockI, bll }), mode), [courses, exams, simulation, blockI, bll, mode])
  const known = courses.reduce((n, c) => n + Object.values(c.semesters).filter((s) => s.points != null).length, 0)

  return (
    <Card title="Abi-Prognose" icon="sparkles" action={<ButtonLink to="/simulation">Simulation</ButtonLink>}>
      {known === 0 ? (
        <div className="py-4 text-sm text-slate-500">
          Trag deine ersten Halbjahresnoten ein, dann rechnet das Cockpit deinen Abi-Schnitt hoch.
          <div className="mt-3">
            <ButtonLink to="/noten" variant="primary" icon="grades">
              Noten eintragen
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-4">
            <div className="text-6xl font-bold tracking-tight text-brand-600 dark:text-brand-300">{fmtGrade(r.grade)}</div>
            <div className="pb-2 text-sm text-slate-500">
              <div className="tabular">exakt {fmt(r.exact.gradeValue, 3)}</div>
              <div className="tabular">{r.total} / 900 Punkte</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <div className="text-xs text-slate-500">Block I</div>
              <div className="tabular font-semibold">{r.blockI.points} / 600</div>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <div className="text-xs text-slate-500">Block II (geschätzt)</div>
              <div className="tabular font-semibold">{r.blockII.points} / 300</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Badge tone={r.passed ? 'green' : 'red'}>{r.passed ? 'Regeln erfüllt' : 'Regeln prüfen'}</Badge>
            Rundung: {ROUNDING_LABELS[mode]}
          </div>
        </>
      )}
    </Card>
  )
}

function ProgressCard() {
  const topics = useStore((s) => s.topics)
  return (
    <Card title="Lernfortschritt" icon="map" action={<ButtonLink to="/lernplan">Lernplan</ButtonLink>}>
      <ul className="space-y-4">
        {SUBJECTS.map((s) => {
          const p = subjectProgress(s.id, topics)
          return (
            <li key={s.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <SubjectDot color={s.color} />
                  {s.name}
                </span>
                <span className="tabular text-xs text-slate-500">
                  {p.done}/{p.total} sicher{p.inWork ? ` · ${p.inWork} in Arbeit` : ''}
                </span>
              </div>
              <ProgressBar value={p.weighted} color={s.color} label={`Fortschritt ${s.name}`} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function TodayCard() {
  const { review, fresh } = useDueCards('all')
  const sessions = useStore((s) => s.sessions)
  const cardStates = useStore((s) => s.cardStates)
  const quizRuns = useStore((s) => s.quizRuns)
  const goal = useStore((s) => s.settings.weeklyGoalHours)
  const today = todayISO()
  const week = minutesThisWeek(sessions, today)
  const todayMin = sessions.filter((s) => s.date === today).reduce((a, s) => a + s.minutes, 0)
  const streak = activityStreak({ sessions, cardStates, quizRuns }, today)

  return (
    <Card title="Heute" icon="flame">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-2xl font-bold">{review.length}</div>
          <div className="text-xs text-slate-500">Karten fällig</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{formatMinutes(todayMin)}</div>
          <div className="text-xs text-slate-500">gelernt</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-2xl font-bold">
            {streak}
            <Icon name="flame" className="size-5 text-orange-500" />
          </div>
          <div className="text-xs text-slate-500">Tage Serie</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Wochenziel</span>
          <span className="tabular">
            {formatMinutes(week)} / {goal} h
          </span>
        </div>
        <ProgressBar value={week / (goal * 60)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ButtonLink to="/karteikarten" variant="primary" icon="cards">
          {review.length > 0 ? `${review.length} Karten wiederholen` : `${Math.min(fresh.length, 20)} neue Karten`}
        </ButtonLink>
        <ButtonLink to="/timer" icon="timer">
          Timer
        </ButtonLink>
        <ButtonLink to="/quiz" icon="quiz">
          Quiz
        </ButtonLink>
      </div>
    </Card>
  )
}

function UpcomingCard() {
  const agenda = useAgenda()
  const today = todayISO()
  const upcoming = agenda.filter((a) => a.date >= today).slice(0, 6)
  return (
    <Card title="Nächste Termine" icon="calendar" action={<ButtonLink to="/kalender">Kalender</ButtonLink>}>
      {upcoming.length === 0 ? (
        <p className="text-sm text-slate-500">Keine Termine.</p>
      ) : (
        <ul className="space-y-2.5">
          {upcoming.map((a) => (
            <AgendaRow key={a.id} item={a} compact />
          ))}
        </ul>
      )}
    </Card>
  )
}

function TodoCard() {
  const todos = useStore((s) => s.todos)
  const toggle = useStore((s) => s.toggleTodo)
  const open = todos
    .filter((t) => !t.done)
    .sort((a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999') || a.priority - b.priority)
    .slice(0, 6)
  return (
    <Card title="Offene To-dos" icon="check" action={<ButtonLink to="/kalender">Alle</ButtonLink>}>
      {open.length === 0 ? (
        <p className="text-sm text-slate-500">Keine offenen Aufgaben. Leg im Kalender neue an.</p>
      ) : (
        <ul className="space-y-2">
          {open.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <Checkbox checked={false} onChange={() => toggle(t.id)} />
              {t.subjectId && <SubjectDot color={SUBJECT_BY_ID[t.subjectId].color} />}
              <span className="min-w-0 flex-1 truncate">{t.title}</span>
              {t.due && <span className={`text-xs ${t.due < todayISO() ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>{t.due.slice(8, 10)}.{t.due.slice(5, 7)}.</span>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function FocusCard() {
  const topics = useStore((s) => s.topics)
  const list = ALL_TOPICS.filter((t) => topics[t.id]?.status !== 'sicher')
    .map((t) => ({ t, p: topics[t.id] }))
    .sort((a, b) => {
      const w = (x: typeof a) => (x.p?.status === 'arbeit' ? 10 : 0) + (x.p?.confidence || 2.5) - (x.t.focus ? 0.5 : 0)
      return w(a) - w(b)
    })
    .slice(0, 5)
  return (
    <Card title="Als Nächstes lernen" icon="target" action={<ButtonLink to="/lernplan?ansicht=wochenplan">Wochenplan</ButtonLink>}>
      {list.length === 0 ? (
        <p className="text-sm text-slate-500">Alle Themen sitzen – stark! Wiederhole mit Karteikarten und Altklausuren.</p>
      ) : (
        <ul className="space-y-2">
          {list.map(({ t, p }) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <SubjectDot color={SUBJECT_BY_ID[t.subjectId].color} />
              <Link to={`/lernplan?fach=${t.subjectId}`} className="min-w-0 flex-1 truncate hover:underline">
                {t.title}
              </Link>
              {t.focus && <Badge tone="red">Fokus</Badge>}
              {p?.status === 'arbeit' && <Badge tone="amber">läuft</Badge>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
