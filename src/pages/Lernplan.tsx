import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ALL_TOPICS, CONTENT, TOPIC_BY_ID, topicsOf, type TopicRef } from '../content'
import { SUBJECTS, SUBJECT_BY_ID } from '../content/subjects'
import type { SubjectId } from '../content/types'
import { useStore } from '../store/store'
import { subjectProgress, topicStats, useAllCards } from '../store/derived'
import type { TopicProgress, TopicStatus } from '../store/types'
import { addDays, daysBetween, formatDate, formatShort, isoWeek, todayISO, weekStart } from '../lib/dates'
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  EmptyState,
  Field,
  IconButton,
  PageHeader,
  ProgressBar,
  Select,
  SubjectDot,
  Tabs,
  TextArea,
  TextInput,
  cx,
} from '../components/ui'
import { Icon } from '../components/Icon'

type View = 'themen' | 'wochenplan' | 'schwach' | 'altklausuren'

const STATUS: { value: TopicStatus; label: string; cls: string }[] = [
  { value: 'offen', label: 'Offen', cls: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' },
  { value: 'arbeit', label: 'In Arbeit', cls: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100' },
  { value: 'sicher', label: 'Sicher', cls: 'bg-emerald-500 text-white' },
]

export function Lernplan() {
  const [params, setParams] = useSearchParams()
  const subject = (params.get('fach') as SubjectId) || 'geo'
  const view = (params.get('ansicht') as View) || 'themen'
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    p.set(k, v)
    setParams(p, { replace: true })
  }

  return (
    <div>
      <PageHeader
        title="Lernplan & Themen"
        subtitle="Alle Schwerpunkte nach den offiziellen Abiturvorgaben 2027. Markiere, was du sicher kannst – daraus entstehen Fortschritt und Wochenplan."
      />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs<View>
          value={view}
          onChange={(v) => set('ansicht', v)}
          tabs={[
            { value: 'themen', label: 'Themen' },
            { value: 'wochenplan', label: 'Wochenplan' },
            { value: 'schwach', label: 'Schwächste Themen' },
            { value: 'altklausuren', label: 'Altklausuren' },
          ]}
        />
      </div>
      {view === 'themen' && <SubjectTopics subject={subject} onSubject={(s) => set('fach', s)} />}
      {view === 'wochenplan' && <WeekPlan />}
      {view === 'schwach' && <WeakTopics />}
      {view === 'altklausuren' && <PastExams />}
    </div>
  )
}

function SubjectPicker({ value, onChange }: { value: SubjectId; onChange: (s: SubjectId) => void }) {
  const topics = useStore((s) => s.topics)
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {SUBJECTS.map((s) => {
        const p = subjectProgress(s.id, topics)
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={cx(
              'rounded-2xl border p-3 text-left transition',
              value === s.id
                ? 'border-transparent ring-2'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900',
            )}
            style={
              value === s.id
                ? { boxShadow: `0 0 0 2px ${s.color}`, background: `color-mix(in srgb, ${s.color} 8%, transparent)` }
                : undefined
            }
          >
            <div className="flex items-center gap-2 font-semibold">
              <SubjectDot color={s.color} />
              {s.name}
              <span className="ml-auto text-xs font-normal text-slate-500">{s.type}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar value={p.weighted} color={s.color} />
              <span className="tabular text-xs text-slate-500">
                {p.done}/{p.total}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function SubjectTopics({ subject, onSubject }: { subject: SubjectId; onSubject: (s: SubjectId) => void }) {
  const meta = SUBJECT_BY_ID[subject]
  const content = CONTENT[subject]
  const examDate = useStore((s) => s.settings.examDates[subject])
  const days = daysBetween(todayISO(), examDate)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div>
      <SubjectPicker value={subject} onChange={onSubject} />
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-semibold">
              {meta.abiNr}. Abiturfach · {meta.name} {meta.type} · {meta.examKind}
            </div>
            <div className="text-sm text-slate-500">
              {meta.examKind === 'mündlich' ? 'Mündliche Prüfungen ab' : 'Prüfung am'} {formatDate(examDate)} ·{' '}
              <strong>{days > 0 ? `noch ${days} Tage` : days === 0 ? 'heute' : 'vorbei'}</strong>
            </div>
          </div>
          <Button size="sm" variant="ghost" icon={showInfo ? 'chevronUp' : 'chevronDown'} onClick={() => setShowInfo(!showInfo)}>
            Prüfungsformat
          </Button>
          <ButtonLink to={`/karteikarten?fach=${subject}`} icon="cards">
            Karteikarten
          </ButtonLink>
          <ButtonLink to={`/quiz?fach=${subject}`} icon="quiz">
            Quiz
          </ButtonLink>
        </div>
        {showInfo && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {meta.examInfo.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-6">
        {content.areas.map((a) => (
          <div key={a.id}>
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">{a.title}</h2>
            <div className="space-y-2">
              {a.topics.map((t) => (
                <TopicRow key={t.id} topic={TOPIC_BY_ID[t.id]} color={meta.color} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Quelle: Zentralabitur 2027 – Vorgaben {meta.name} (MSB NRW). Die Fokussierungen ergänzen den Kernlehrplan – alle
        Schwerpunkte bleiben prüfungsrelevant.
      </p>
    </div>
  )
}

function TopicRow({ topic, color }: { topic: TopicRef; color: string }) {
  const p = useStore((s) => s.topics[topic.id]) as TopicProgress | undefined
  const setTopic = useStore((s) => s.setTopic)
  const cards = useAllCards()
  const cardStates = useStore((s) => s.cardStates)
  const quizStats = useStore((s) => s.quizStats)
  const [open, setOpen] = useState(false)
  const status = p?.status ?? 'offen'
  const conf = p?.confidence ?? 0
  const st = useMemo(() => topicStats(topic.id, cards, cardStates, quizStats), [topic.id, cards, cardStates, quizStats])

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      style={{
        borderLeft: `4px solid ${
          status === 'sicher' ? '#10b981' : status === 'arbeit' ? '#f59e0b' : `color-mix(in srgb, ${color} 35%, transparent)`
        }`,
      }}
    >
      <div className="flex flex-wrap items-center gap-3 px-3 py-2.5">
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-start gap-2 text-left">
          <Icon name={open ? 'chevronDown' : 'chevronRight'} className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span className="min-w-0">
            <span className="font-medium">{topic.title}</span>
            {topic.focus && topic.focus.length > 0 && (
              <Badge tone="red" className="ml-2 align-middle">
                Fokus 2027
              </Badge>
            )}
          </span>
        </button>
        <div className="flex items-center gap-3">
          {st.cards > 0 && (
            <span className="tabular text-xs text-slate-500" title="Wie gut die Karteikarten sitzen">
              <Icon name="cards" className="mr-1 inline size-3.5" />
              {Math.round(st.cardMastery * 100)} %
            </span>
          )}
          {st.quizAccuracy != null && (
            <span className="tabular text-xs text-slate-500" title="Quiz: Anteil zuletzt richtig beantworteter Fragen">
              <Icon name="quiz" className="mr-1 inline size-3.5" />
              {Math.round(st.quizAccuracy * 100)} %
            </span>
          )}
          <Stars value={conf} onChange={(v) => setTopic(topic.id, { confidence: v })} />
          <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs dark:border-slate-700">
            {STATUS.map((s) => (
              <button
                key={s.value}
                onClick={() => setTopic(topic.id, { status: s.value, lastReviewed: todayISO() })}
                className={cx('px-2 py-1 font-medium', status === s.value ? s.cls : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800')}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
          {topic.focus && topic.focus.length > 0 && (
            <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-rose-900 dark:bg-rose-900/20 dark:text-rose-200">
              <div className="text-xs font-semibold uppercase">Fokussierung 2027</div>
              <ul className="mt-1 list-disc pl-5">
                {topic.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {topic.details && (
            <ul className="mb-3 list-disc space-y-0.5 pl-5 text-slate-600 dark:text-slate-300">
              {topic.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          <Field label="Eigene Notizen">
            <TextArea
              value={p?.note ?? ''}
              placeholder="Beispiele aus dem Unterricht, Fallbeispiele, Merksätze …"
              onChange={(e) => setTopic(topic.id, { note: e.target.value })}
            />
          </Field>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {p?.lastReviewed ? `Zuletzt bearbeitet: ${formatDate(p.lastReviewed)}` : 'Noch nicht bearbeitet'}
            <Button size="sm" variant="ghost" icon="check" onClick={() => setTopic(topic.id, { lastReviewed: todayISO() })}>
              Heute wiederholt
            </Button>
            {st.cards > 0 && (
              <Link to={`/karteikarten?thema=${topic.id}`} className="font-medium text-brand-600 hover:underline">
                {st.cards} Karteikarten lernen
              </Link>
            )}
            <Link to={`/quiz?thema=${topic.id}`} className="font-medium text-brand-600 hover:underline">
              Quiz zum Thema
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex" title="Selbsteinschätzung: Wie sicher fühlst du dich?">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n === value ? 0 : n)}
          className={cx('px-0.5 text-base leading-none', n <= value ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600')}
          aria-label={`${n} von 5`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- Wochenplan

function weakness(t: TopicRef, p?: TopicProgress) {
  const statusW = p?.status === 'sicher' ? 3 : p?.status === 'arbeit' ? 1 : 0
  const conf = p?.confidence ?? 0
  return statusW * 10 + (conf === 0 ? 2.5 : conf) + (t.focus?.length ? -0.5 : 0)
}

function WeekPlan() {
  const topics = useStore((s) => s.topics)
  const examDates = useStore((s) => s.settings.examDates)
  const setTopic = useStore((s) => s.setTopic)
  const today = todayISO()
  const thisWeek = weekStart(today)

  const plan = useMemo(() => {
    const weeks = new Map<string, { subjectId: SubjectId; topic: TopicRef }[]>()
    for (const s of SUBJECTS) {
      const lastWeek = weekStart(addDays(examDates[s.id], -7))
      const ws: string[] = []
      for (let w = thisWeek; w <= lastWeek; w = addDays(w, 7)) ws.push(w)
      if (ws.length === 0) ws.push(thisWeek)
      const open = topicsOf(s.id)
        .filter((t) => topics[t.id]?.status !== 'sicher')
        .sort((a, b) => weakness(a, topics[a.id]) - weakness(b, topics[b.id]))
      open.forEach((t, i) => {
        const w = ws[Math.floor((i * ws.length) / open.length)]
        const arr = weeks.get(w) ?? []
        arr.push({ subjectId: s.id, topic: t })
        weeks.set(w, arr)
      })
    }
    return [...weeks.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [topics, examDates, thisWeek])

  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? plan : plan.slice(0, 4)

  if (plan.length === 0)
    return (
      <Card>
        <EmptyState icon="check" title="Alles sicher!">
          Alle Themen sind als „sicher“ markiert. Nutze jetzt Karteikarten und Altklausuren zum Wiederholen.
        </EmptyState>
      </Card>
    )

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Alle noch nicht sicheren Themen werden bis eine Woche vor der jeweiligen Prüfung verteilt – die schwächsten zuerst.
        Die letzte Woche vor jeder Prüfung bleibt für die Gesamtwiederholung frei. Der Plan passt sich automatisch an.
      </p>
      {visible.map(([w, items]) => (
        <Card
          key={w}
          title={`KW ${isoWeek(w)} · ${formatShort(w)}–${formatShort(addDays(w, 6))}${w === thisWeek ? ' · diese Woche' : ''}`}
          icon="calendar"
        >
          <ul className="space-y-1.5">
            {items.map(({ subjectId, topic }) => {
              const st = topics[topic.id]?.status ?? 'offen'
              return (
                <li key={topic.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={st === 'sicher'}
                    onChange={(v) => setTopic(topic.id, { status: v ? 'sicher' : 'arbeit', lastReviewed: todayISO() })}
                  />
                  <SubjectDot color={SUBJECT_BY_ID[subjectId].color} />
                  <span className="text-xs font-medium text-slate-500">{SUBJECT_BY_ID[subjectId].short}</span>
                  <Link to={`/lernplan?fach=${subjectId}`} className="min-w-0 flex-1 truncate hover:underline">
                    {topic.title}
                  </Link>
                  {st === 'arbeit' && <Badge tone="amber">in Arbeit</Badge>}
                </li>
              )
            })}
          </ul>
        </Card>
      ))}
      {plan.length > 4 && (
        <Button variant="ghost" icon={showAll ? 'chevronUp' : 'chevronDown'} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Weniger anzeigen' : `Alle ${plan.length} Wochen anzeigen`}
        </Button>
      )}
    </div>
  )
}

function WeakTopics() {
  const topics = useStore((s) => s.topics)
  const cards = useAllCards()
  const cardStates = useStore((s) => s.cardStates)
  const quizStats = useStore((s) => s.quizStats)
  const list = useMemo(() => {
    return ALL_TOPICS.map((t) => {
      const st = topicStats(t.id, cards, cardStates, quizStats)
      const p = topics[t.id]
      let score = weakness(t, p)
      if (st.quizAccuracy != null) score += st.quizAccuracy * 3
      score += st.cardMastery * 2
      return { t, p, st, score }
    })
      .filter((x) => x.p?.status !== 'sicher')
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
  }, [topics, cards, cardStates, quizStats])

  return (
    <Card title="Hier lohnt sich Lernen am meisten" icon="target">
      {list.length === 0 ? (
        <EmptyState icon="check" title="Keine offenen Themen" />
      ) : (
        <ol className="space-y-2">
          {list.map(({ t, p, st }, i) => (
            <li key={t.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <span className="tabular w-5 text-right text-xs text-slate-400">{i + 1}.</span>
              <SubjectDot color={SUBJECT_BY_ID[t.subjectId].color} />
              <Link to={`/lernplan?fach=${t.subjectId}`} className="min-w-0 flex-1 truncate text-sm hover:underline">
                {t.title}
              </Link>
              <span className="hidden text-xs text-slate-500 sm:inline">
                {p?.confidence ? '★'.repeat(p.confidence) : 'unbewertet'}
                {st.quizAccuracy != null && ` · Quiz ${Math.round(st.quizAccuracy * 100)} %`}
              </span>
              <Link
                to={`/quiz?thema=${t.id}`}
                title="Quiz starten"
                aria-label="Quiz starten"
                className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon name="quiz" className="size-4" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------- Altklausuren

function PastExams() {
  const list = useStore((s) => s.pastExams)
  const add = useStore((s) => s.addPastExam)
  const update = useStore((s) => s.updatePastExam)
  const remove = useStore((s) => s.removePastExam)
  const [subjectId, setSubjectId] = useState<SubjectId>('geo')
  const [year, setYear] = useState('2025')
  const [label, setLabel] = useState('')

  return (
    <div className="space-y-4">
      <Card title="Altklausur hinzufügen" icon="plus">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[10rem_7rem_1fr_auto] sm:items-end">
          <Field label="Fach">
            <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value as SubjectId)}>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Jahrgang">
            <TextInput value={year} onChange={(e) => setYear(e.target.value)} />
          </Field>
          <Field label="Aufgabe">
            <TextInput value={label} placeholder="z. B. Aufgabe 2 – Tourismus Kenia" onChange={(e) => setLabel(e.target.value)} />
          </Field>
          <Button
            variant="primary"
            icon="plus"
            onClick={() => {
              add({ subjectId, year, label: label || 'Abiturklausur', achieved: null, max: null, done: false })
              setLabel('')
            }}
          >
            Hinzufügen
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Alte NRW-Abiturklausuren bekommst du meist über deine Lehrkräfte oder in Abi-Trainingsbänden. Hier hältst du fest,
          was du schon geübt hast.
        </p>
      </Card>

      {SUBJECTS.map((s) => {
        const items = list.filter((x) => x.subjectId === s.id).sort((a, b) => b.year.localeCompare(a.year))
        if (items.length === 0) return null
        const done = items.filter((x) => x.done).length
        return (
          <Card key={s.id} title={`${s.name} · ${done}/${items.length} erledigt`} icon="book">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((x) => (
                <li key={x.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                  <Checkbox checked={x.done} onChange={(v) => update(x.id, { done: v, date: v ? todayISO() : undefined })} />
                  <span className="tabular font-medium">{x.year}</span>
                  <span className={cx('min-w-0 flex-1 truncate', x.done && 'text-slate-500 line-through')}>{x.label}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <input
                      className="tabular h-8 w-14 rounded-md border border-slate-300 bg-transparent px-1 text-center dark:border-slate-700"
                      placeholder="Pkt."
                      value={x.achieved ?? ''}
                      onChange={(e) => update(x.id, { achieved: e.target.value === '' ? null : Number(e.target.value) || 0 })}
                      aria-label="Erreichte Punkte"
                    />
                    /
                    <input
                      className="tabular h-8 w-14 rounded-md border border-slate-300 bg-transparent px-1 text-center dark:border-slate-700"
                      placeholder="max."
                      value={x.max ?? ''}
                      onChange={(e) => update(x.id, { max: e.target.value === '' ? null : Number(e.target.value) || 0 })}
                      aria-label="Maximale Punkte"
                    />
                    {x.achieved != null && x.max ? <strong className="ml-1">{Math.round((x.achieved / x.max) * 100)} %</strong> : null}
                  </span>
                  <IconButton icon="trash" label="Entfernen" onClick={() => remove(x.id)} />
                </li>
              ))}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}
