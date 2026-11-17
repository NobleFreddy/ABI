import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ALL_QUIZ, TOPIC_BY_ID, topicsOf, type QuizRef } from '../content'
import { SUBJECTS, SUBJECT_BY_ID } from '../content/subjects'
import type { SubjectId } from '../content/types'
import { useStore } from '../store/store'
import { formatShort } from '../lib/dates'
import { Badge, Button, Card, Checkbox, EmptyState, Field, PageHeader, ProgressBar, Select, SubjectDot, cx } from '../components/ui'
import { RichText } from '../components/RichText'
import { Icon } from '../components/Icon'

type Filter = SubjectId | 'mix'

interface Question extends QuizRef {
  order: number[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function Quiz() {
  const [params] = useSearchParams()
  const initialTopic = params.get('thema') || ''
  const initialSubject = (params.get('fach') as Filter) || (initialTopic ? TOPIC_BY_ID[initialTopic]?.subjectId : null) || 'mix'

  const [subject, setSubject] = useState<Filter>(initialSubject)
  const [topic, setTopic] = useState(initialTopic)
  const [count, setCount] = useState(10)
  const [focusWeak, setFocusWeak] = useState(true)
  const [run, setRun] = useState<Question[] | null>(null)

  const stats = useStore((s) => s.quizStats)
  const runs = useStore((s) => s.quizRuns)

  useEffect(() => {
    setSubject(initialSubject)
    setTopic(initialTopic)
  }, [initialSubject, initialTopic])

  const pool = useMemo(
    () => ALL_QUIZ.filter((q) => (subject === 'mix' || q.subjectId === subject) && (!topic || q.topic === topic)),
    [subject, topic],
  )

  const start = (questions?: QuizRef[]) => {
    let list = questions ?? pool
    if (!questions) {
      list = shuffle(list)
      if (focusWeak) {
        // Zuerst nie beantwortete oder zuletzt falsch beantwortete Fragen
        const rank = (q: QuizRef) => (!stats[q.id] ? 0 : stats[q.id].last ? 2 : 1)
        list = [...list].sort((a, b) => rank(a) - rank(b))
      }
      list = list.slice(0, count)
    }
    setRun(list.map((q) => ({ ...q, order: shuffle(q.options.map((_, i) => i)) })))
  }

  if (run) return <Runner questions={run} subject={subject} topic={topic || null} onExit={() => setRun(null)} onRestart={start} />

  const answered = pool.filter((q) => stats[q.id]).length
  const right = pool.filter((q) => stats[q.id]?.last).length

  return (
    <div>
      <PageHeader title="Quiz" subtitle="Multiple-Choice-Fragen zu allen Abi-Themen – mit Erklärung nach jeder Antwort." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Quiz zusammenstellen" icon="quiz" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Fach">
              <Select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value as Filter)
                  setTopic('')
                }}
              >
                <option value="mix">Alle Fächer gemischt (Prüfungs-Check)</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Thema">
              <Select value={topic} onChange={(e) => setTopic(e.target.value)} disabled={subject === 'mix'}>
                <option value="">Alle Themen</option>
                {subject !== 'mix' &&
                  topicsOf(subject).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title.length > 60 ? t.title.slice(0, 58) + '…' : t.title}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Anzahl Fragen">
              <Select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {[5, 10, 15, 20, 30, 1000].map((n) => (
                  <option key={n} value={n}>
                    {n === 1000 ? 'Alle' : n}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex items-end pb-2">
              <Checkbox checked={focusWeak} onChange={setFocusWeak} label="Neue und falsche Fragen zuerst" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg" icon="play" disabled={pool.length === 0} onClick={() => start()}>
              Quiz starten ({Math.min(count, pool.length)} Fragen)
            </Button>
            <span className="text-sm text-slate-500">
              {pool.length} Fragen verfügbar · {answered} schon beantwortet · {right} zuletzt richtig
            </span>
          </div>
          {pool.length > 0 && <ProgressBar className="mt-3" value={pool.length ? right / pool.length : 0} color="#10b981" />}
        </Card>
        <Card title="Letzte Durchgänge" icon="list">
          {runs.length === 0 ? (
            <p className="text-sm text-slate-500">Noch keine Quiz-Runden.</p>
          ) : (
            <ul className="space-y-2">
              {[...runs]
                .reverse()
                .slice(0, 8)
                .map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm">
                    {r.subjectId === 'mix' ? (
                      <Icon name="shuffle" className="size-3.5 text-slate-400" />
                    ) : (
                      <SubjectDot color={SUBJECT_BY_ID[r.subjectId].color} />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      {r.topic ? TOPIC_BY_ID[r.topic]?.title : r.subjectId === 'mix' ? 'Gemischt' : SUBJECT_BY_ID[r.subjectId].name}
                    </span>
                    <span className="text-xs text-slate-500">{formatShort(r.date)}</span>
                    <Badge tone={r.correct / r.total >= 0.8 ? 'green' : r.correct / r.total >= 0.5 ? 'amber' : 'red'}>
                      {r.correct}/{r.total}
                    </Badge>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function Runner({
  questions,
  subject,
  topic,
  onExit,
  onRestart,
}: {
  questions: Question[]
  subject: Filter
  topic: string | null
  onExit: () => void
  onRestart: (qs: QuizRef[]) => void
}) {
  const record = useStore((s) => s.recordQuizAnswer)
  const recordRun = useStore((s) => s.recordQuizRun)
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [saved, setSaved] = useState(false)

  const q = questions[idx]
  const finished = idx >= questions.length

  useEffect(() => {
    if (finished && !saved) {
      recordRun({ subjectId: subject, topic, correct: results.filter(Boolean).length, total: results.length })
      setSaved(true)
    }
  }, [finished, saved, recordRun, subject, topic, results])

  useEffect(() => {
    if (finished) return
    const onKey = (e: KeyboardEvent) => {
      if (picked == null && ['1', '2', '3', '4'].includes(e.key)) {
        const i = Number(e.key) - 1
        if (i < q.order.length) choose(q.order[i])
      } else if (picked != null && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const choose = (opt: number) => {
    if (picked != null) return
    setPicked(opt)
    const ok = opt === q.correct
    record(q.id, ok)
    setResults((r) => [...r, ok])
  }
  const next = () => {
    setPicked(null)
    setIdx((i) => i + 1)
  }

  if (finished) {
    const correct = results.filter(Boolean).length
    const wrong = questions.filter((_, i) => !results[i])
    const pct = results.length ? Math.round((correct / results.length) * 100) : 0
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <div className="py-4 text-center">
            <div className="text-sm text-slate-500">Ergebnis</div>
            <div className="tabular text-5xl font-bold">{pct} %</div>
            <div className="mt-1 text-slate-500">
              {correct} von {results.length} richtig
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button onClick={onExit}>Zur Übersicht</Button>
              {wrong.length > 0 && (
                <Button variant="primary" icon="reset" onClick={() => onRestart(wrong)}>
                  Nur die {wrong.length} falschen wiederholen
                </Button>
              )}
            </div>
          </div>
        </Card>
        {wrong.length > 0 && (
          <Card title="Das solltest du dir nochmal anschauen" icon="alert">
            <ul className="space-y-4">
              {wrong.map((w) => (
                <li key={w.id} className="text-sm">
                  <RichText text={w.q} className="font-medium" />
                  <div className="mt-1 text-emerald-700 dark:text-emerald-400">
                    ✓ <RichText text={w.options[w.correct]} className="inline" />
                  </div>
                  {w.explain && <RichText text={w.explain} className="mt-1 text-slate-500" />}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    )
  }

  const meta = SUBJECT_BY_ID[q.subjectId]
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
        <span className="tabular">
          Frage {idx + 1} / {questions.length}
        </span>
        <ProgressBar value={idx / questions.length} className="flex-1" />
        <button onClick={onExit} className="hover:underline">
          Abbrechen
        </button>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" style={{ borderTop: `5px solid ${meta.color}` }}>
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
          <SubjectDot color={meta.color} /> {meta.name}
          {TOPIC_BY_ID[q.topic] && <span className="truncate">· {TOPIC_BY_ID[q.topic].title}</span>}
        </div>
        <RichText text={q.q} className="text-lg font-semibold" />
        <div className="mt-5 space-y-2">
          {q.order.map((opt, i) => {
            const isCorrect = opt === q.correct
            const isPicked = opt === picked
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={picked != null}
                className={cx(
                  'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                  picked == null && 'border-slate-200 hover:border-brand-400 hover:bg-brand-50 dark:border-slate-700 dark:hover:bg-brand-900/30',
                  picked != null && isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
                  picked != null && isPicked && !isCorrect && 'border-rose-500 bg-rose-50 dark:bg-rose-900/30',
                  picked != null && !isCorrect && !isPicked && 'border-slate-200 opacity-60 dark:border-slate-700',
                )}
              >
                <span className="tabular mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold dark:bg-slate-800">
                  {picked != null && isCorrect ? '✓' : picked != null && isPicked ? '✗' : i + 1}
                </span>
                <RichText text={q.options[opt]} />
              </button>
            )
          })}
        </div>
        {picked != null && (
          <div className="flip-in mt-5">
            <div className={cx('mb-2 font-semibold', picked === q.correct ? 'text-emerald-600' : 'text-rose-600')}>
              {picked === q.correct ? 'Richtig!' : 'Leider falsch.'}
            </div>
            {q.explain && <RichText text={q.explain} className="text-sm text-slate-600 dark:text-slate-300" />}
            <Button variant="primary" className="mt-4 w-full" onClick={next}>
              {idx + 1 < questions.length ? 'Nächste Frage' : 'Auswertung'} <span className="text-xs opacity-70">(Enter)</span>
            </Button>
          </div>
        )}
      </div>
      {picked == null && <p className="mt-2 text-center text-xs text-slate-400">Tipp: Antworten mit den Tasten 1–4 wählen</p>}
      {questions.length === 0 && <EmptyState title="Keine Fragen" />}
    </div>
  )
}
