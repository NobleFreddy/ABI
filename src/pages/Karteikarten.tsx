import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { TOPIC_BY_ID, topicsOf, type CardRef } from '../content'
import { SUBJECTS, SUBJECT_BY_ID } from '../content/subjects'
import type { SubjectId } from '../content/types'
import { useStore } from '../store/store'
import { useAllCards } from '../store/derived'
import { RATING_LABELS, isDue, review, type Rating } from '../lib/srs'
import { formatShort, todayISO } from '../lib/dates'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  IconButton,
  Modal,
  PageHeader,
  ProgressBar,
  Select,
  SubjectDot,
  Tabs,
  TextArea,
  TextInput,
  cx,
} from '../components/ui'
import { RichText } from '../components/RichText'

type Filter = SubjectId | 'all'

export function Karteikarten() {
  const [params, setParams] = useSearchParams()
  const subject = (params.get('fach') as Filter) || (params.get('thema') ? TOPIC_BY_ID[params.get('thema')!]?.subjectId : null) || 'all'
  const topic = params.get('thema') || ''
  const [view, setView] = useState<'lernen' | 'verwalten'>('lernen')
  const setFilter = (s: Filter, t = '') => {
    const p = new URLSearchParams()
    if (s !== 'all') p.set('fach', s)
    if (t) p.set('thema', t)
    setParams(p, { replace: true })
  }

  return (
    <div>
      <PageHeader
        title="Karteikarten"
        subtitle="Wiederholung mit System: Karten, die du gut kannst, kommen seltener, schwierige öfter (Spaced Repetition)."
        actions={
          <Tabs
            value={view}
            onChange={setView}
            tabs={[
              { value: 'lernen', label: 'Lernen' },
              { value: 'verwalten', label: 'Karten verwalten' },
            ]}
          />
        }
      />
      <FilterBar subject={subject} topic={topic} onChange={setFilter} />
      {view === 'lernen' ? <Session subject={subject} topic={topic} /> : <Manage subject={subject} topic={topic} />}
    </div>
  )
}

function FilterBar({ subject, topic, onChange }: { subject: Filter; topic: string; onChange: (s: Filter, t?: string) => void }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {(['all', ...SUBJECTS.map((s) => s.id)] as Filter[]).map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cx(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition',
            subject === s
              ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
          )}
        >
          {s !== 'all' && <SubjectDot color={SUBJECT_BY_ID[s].color} />}
          {s === 'all' ? 'Alle Fächer' : SUBJECT_BY_ID[s].name}
        </button>
      ))}
      {subject !== 'all' && (
        <Select className="w-auto max-w-full min-w-48 flex-1 sm:flex-none" value={topic} onChange={(e) => onChange(subject, e.target.value)}>
          <option value="">Alle Themen</option>
          {topicsOf(subject).map((t) => (
            <option key={t.id} value={t.id}>
              {t.title.length > 70 ? t.title.slice(0, 68) + '…' : t.title}
            </option>
          ))}
        </Select>
      )}
    </div>
  )
}

function useFiltered(subject: Filter, topic: string) {
  const cards = useAllCards()
  return useMemo(
    () => cards.filter((c) => (subject === 'all' || c.subjectId === subject) && (!topic || c.topic === topic)),
    [cards, subject, topic],
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Session({ subject, topic }: { subject: Filter; topic: string }) {
  const pool = useFiltered(subject, topic)
  const states = useStore((s) => s.cardStates)
  const newPerDay = useStore((s) => s.settings.newCardsPerDay)
  const rateCard = useStore((s) => s.rateCard)

  const today = todayISO()
  const due = pool.filter((c) => states[c.id] && isDue(states[c.id], today))
  const fresh = pool.filter((c) => !states[c.id])
  const learned = pool.filter((c) => states[c.id] && states[c.id].reps > 0).length

  const [queue, setQueue] = useState<CardRef[] | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState({ total: 0, again: 0 })

  // Filter geändert → laufende Runde beenden
  useEffect(() => {
    setQueue(null)
  }, [subject, topic])

  const start = (extraNew = 0) => {
    const q = [...shuffle(due), ...shuffle(fresh).slice(0, newPerDay + extraNew)]
    setQueue(q)
    setRevealed(false)
    setDone({ total: 0, again: 0 })
  }

  const current = queue?.[0]

  const rate = useCallback(
    (r: Rating) => {
      if (!current || !queue) return
      rateCard(current.id, r)
      const rest = queue.slice(1)
      setQueue(r === 0 ? [...rest, current] : rest)
      setRevealed(false)
      setDone((d) => ({ total: d.total + 1, again: d.again + (r === 0 ? 1 : 0) }))
    },
    [current, queue, rateCard],
  )

  useEffect(() => {
    if (!current) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        setRevealed(true)
      } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
        rate((Number(e.key) - 1) as Rating)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, revealed, rate])

  if (pool.length === 0)
    return (
      <Card>
        <EmptyState icon="cards" title="Keine Karten in dieser Auswahl">
          Leg unter „Karten verwalten“ eigene Karten an oder wähle ein anderes Fach.
        </EmptyState>
      </Card>
    )

  if (!queue)
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-6">
            <Count label="Fällig zum Wiederholen" value={due.length} tone="text-brand-600 dark:text-brand-300" />
            <Count label="Neue Karten" value={fresh.length} />
            <Count label="Schon gelernt" value={learned} />
            <Count label="Karten gesamt" value={pool.length} />
          </div>
          <div className="mt-4">
            <ProgressBar value={pool.length ? learned / pool.length : 0} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="primary" size="lg" icon="play" disabled={due.length + fresh.length === 0} onClick={() => start()}>
              Lernen starten ({due.length + Math.min(fresh.length, newPerDay)} Karten)
            </Button>
          </div>
          {due.length + fresh.length === 0 && (
            <p className="mt-3 text-sm text-emerald-600">Für heute ist alles wiederholt. Super! Morgen geht’s weiter.</p>
          )}
        </Card>
        <Card title="So funktioniert’s" icon="info">
          <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600 dark:text-slate-300">
            <li>Frage lesen, Antwort im Kopf formulieren</li>
            <li>Aufdecken (Leertaste) und ehrlich bewerten (Tasten 1–4)</li>
            <li>„Nochmal“ kommt in derselben Runde wieder</li>
            <li>Pro Runde max. {newPerDay} neue Karten (in den Einstellungen änderbar)</li>
          </ul>
        </Card>
      </div>
    )

  if (!current)
    return (
      <Card>
        <EmptyState icon="check" title="Runde geschafft!">
          {done.total} Bewertungen, davon {done.again}× „Nochmal“.
        </EmptyState>
        <div className="flex justify-center gap-2">
          <Button onClick={() => setQueue(null)}>Zur Übersicht</Button>
          {fresh.length > 0 && (
            <Button variant="primary" onClick={() => start(10)}>
              10 weitere neue Karten
            </Button>
          )}
        </div>
      </Card>
    )

  const meta = SUBJECT_BY_ID[current.subjectId]
  const topicTitle = TOPIC_BY_ID[current.topic]?.title
  const st = states[current.id]
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>Noch {queue.length} Karte{queue.length === 1 ? '' : 'n'}</span>
        <button className="hover:underline" onClick={() => setQueue(null)}>
          Runde beenden
        </button>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900" style={{ borderTop: `5px solid ${meta.color}` }}>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <SubjectDot color={meta.color} />
          <span className="font-medium">{meta.name}</span>
          {topicTitle && <span className="truncate">· {topicTitle}</span>}
          {!st && <Badge tone="blue">neu</Badge>}
          {current.custom && <Badge>eigene Karte</Badge>}
        </div>
        <RichText text={current.q} className="text-lg leading-relaxed font-semibold" />
        {revealed ? (
          <div className="flip-in mt-6 border-t border-slate-100 pt-5 leading-relaxed dark:border-slate-800">
            <RichText text={current.a} />
          </div>
        ) : (
          <Button variant="primary" size="lg" className="mt-8 w-full" onClick={() => setRevealed(true)}>
            Antwort zeigen <span className="text-xs opacity-70">(Leertaste)</span>
          </Button>
        )}
      </div>
      {revealed && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {([0, 1, 2, 3] as Rating[]).map((r) => {
            const next = review(st, r, todayISO())
            return (
              <button
                key={r}
                onClick={() => rate(r)}
                className={cx(
                  'rounded-xl px-2 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110',
                  r === 0 && 'bg-rose-500',
                  r === 1 && 'bg-amber-500',
                  r === 2 && 'bg-emerald-500',
                  r === 3 && 'bg-sky-500',
                )}
              >
                {RATING_LABELS[r]}
                <div className="text-[11px] font-normal opacity-90">
                  {r === 0 ? 'gleich nochmal' : next.interval === 1 ? 'morgen' : `in ${next.interval} Tagen`}
                </div>
                <div className="hidden text-[10px] font-normal opacity-70 sm:block">Taste {r + 1}</div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Count({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className={cx('tabular text-3xl font-bold', tone)}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}

// ---------------------------------------------------------------- Verwalten

function Manage({ subject, topic }: { subject: Filter; topic: string }) {
  const allIncludingHidden = useAllCards(true)
  const hidden = useStore((s) => s.hiddenCards)
  const states = useStore((s) => s.cardStates)
  const toggleHidden = useStore((s) => s.toggleHiddenCard)
  const resetCard = useStore((s) => s.resetCard)
  const removeCustom = useStore((s) => s.removeCustomCard)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<CardRef | 'new' | null>(null)
  const hiddenSet = new Set(hidden)

  const list = allIncludingHidden.filter(
    (c) =>
      (subject === 'all' || c.subjectId === subject) &&
      (!topic || c.topic === topic) &&
      (!q || (c.q + ' ' + c.a).toLowerCase().includes(q.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <TextInput className="max-w-sm" placeholder="Karten durchsuchen …" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="primary" icon="plus" onClick={() => setEditing('new')}>
          Eigene Karte
        </Button>
      </div>
      <p className="text-sm text-slate-500">{list.length} Karten</p>
      <ul className="space-y-2">
        {list.map((c) => {
          const st = states[c.id]
          const isHidden = hiddenSet.has(c.id)
          return (
            <li key={c.id} className={cx('rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900', isHidden && 'opacity-50')}>
              <div className="flex items-start gap-2">
                <SubjectDot color={SUBJECT_BY_ID[c.subjectId].color} className="mt-1.5 size-2.5" />
                <details className="min-w-0 flex-1">
                  <summary className="cursor-pointer list-none">
                    <RichText text={c.q} className="text-sm font-medium" />
                  </summary>
                  <RichText text={c.a} className="mt-2 border-t border-slate-100 pt-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300" />
                </details>
                <div className="flex shrink-0 items-center gap-1">
                  {c.custom && <Badge>eigene</Badge>}
                  {c.edited && <Badge tone="amber">bearbeitet</Badge>}
                  <span className="hidden text-xs text-slate-500 sm:inline">
                    {!st ? 'neu' : st.due <= todayISO() ? 'fällig' : `ab ${formatShort(st.due)}`}
                  </span>
                  <IconButton icon="edit" label="Bearbeiten" onClick={() => setEditing(c)} />
                  {c.custom ? (
                    <IconButton icon="trash" label="Löschen" onClick={() => removeCustom(c.id)} />
                  ) : (
                    <IconButton icon={isHidden ? 'eye' : 'eyeOff'} label={isHidden ? 'Wieder einblenden' : 'Ausblenden'} onClick={() => toggleHidden(c.id)} />
                  )}
                  {st && <IconButton icon="reset" label="Lernstand zurücksetzen" onClick={() => resetCard(c.id)} />}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {editing && (
        <CardEditor
          card={editing === 'new' ? null : editing}
          defaultSubject={subject === 'all' ? 'geo' : subject}
          defaultTopic={topic}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function CardEditor({
  card,
  defaultSubject,
  defaultTopic,
  onClose,
}: {
  card: CardRef | null
  defaultSubject: SubjectId
  defaultTopic: string
  onClose: () => void
}) {
  const addCustom = useStore((s) => s.addCustomCard)
  const updateCustom = useStore((s) => s.updateCustomCard)
  const editCard = useStore((s) => s.editCard)
  const revertCard = useStore((s) => s.revertCard)
  const [subjectId, setSubjectId] = useState<SubjectId>(card?.subjectId ?? defaultSubject)
  const [topic, setTopic] = useState(card?.topic ?? defaultTopic)
  const [q, setQ] = useState(card?.q ?? '')
  const [a, setA] = useState(card?.a ?? '')
  const isBuiltin = card && !card.custom

  const save = () => {
    if (!q.trim() || !a.trim()) return
    if (!card) addCustom({ subjectId, topic: topic || null, q, a })
    else if (card.custom) updateCustom(card.id, { subjectId, topic: topic || null, q, a })
    else editCard(card.id, q, a)
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={card ? 'Karte bearbeiten' : 'Neue Karteikarte'}
      footer={
        <>
          {isBuiltin && card.edited && (
            <Button
              variant="ghost"
              onClick={() => {
                revertCard(card.id)
                onClose()
              }}
            >
              Original wiederherstellen
            </Button>
          )}
          <Button onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" onClick={save} disabled={!q.trim() || !a.trim()}>
            Speichern
          </Button>
        </>
      }
    >
      {!isBuiltin && (
        <div className="mb-3 grid grid-cols-2 gap-3">
          <Field label="Fach">
            <Select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value as SubjectId)
                setTopic('')
              }}
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Thema">
            <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">ohne Thema</option>
              {topicsOf(subjectId).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title.length > 60 ? t.title.slice(0, 58) + '…' : t.title}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}
      <Field label="Vorderseite (Frage)">
        <TextArea value={q} onChange={(e) => setQ(e.target.value)} />
      </Field>
      <div className="mt-3">
        <Field label="Rückseite (Antwort)" hint="Tipp: Formeln zwischen $…$ schreiben (z. B. $f'(x) = 2x$), **fett** mit zwei Sternchen, Aufzählungen mit „- “.">
          <TextArea value={a} onChange={(e) => setA(e.target.value)} className="min-h-32" />
        </Field>
      </div>
      {(q || a) && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <div className="mb-1 text-xs font-semibold text-slate-500">Vorschau</div>
          <RichText text={q} className="font-medium" />
          <RichText text={a} className="mt-2 text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </Modal>
  )
}
