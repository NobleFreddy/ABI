import { useMemo, useState } from 'react'
import { SUBJECTS, SUBJECT_BY_ID, builtinEvents } from '../content/subjects'
import type { SubjectId } from '../content/types'
import { useStore } from '../store/store'
import type { EventType, Todo } from '../store/types'
import { addDays, daysBetween, formatDate, formatDay, formatMonth, formatShort, parseISO, toISO, todayISO, weekStart } from '../lib/dates'
import { Badge, Button, Card, Checkbox, EmptyState, Field, IconButton, PageHeader, Select, SubjectDot, Tabs, TextInput, cx, type Tone } from '../components/ui'

export const EVENT_TYPES: Record<EventType | 'abi' | 'info' | 'todo', { label: string; tone: Tone; dot: string }> = {
  abi: { label: 'Abiprüfung', tone: 'red', dot: '#e11d48' },
  klausur: { label: 'Klausur', tone: 'brand', dot: '#6366f1' },
  vorabi: { label: 'Vorabi', tone: 'amber', dot: '#d97706' },
  abgabe: { label: 'Abgabe', tone: 'blue', dot: '#0284c7' },
  termin: { label: 'Termin', tone: 'green', dot: '#059669' },
  sonstiges: { label: 'Sonstiges', tone: 'slate', dot: '#64748b' },
  info: { label: 'Info', tone: 'slate', dot: '#94a3b8' },
  todo: { label: 'To-do', tone: 'slate', dot: '#a8a29e' },
}

export interface AgendaItem {
  id: string
  date: string
  title: string
  kind: keyof typeof EVENT_TYPES
  subjectId?: SubjectId | null
  time?: string
  builtin?: boolean
  custom?: boolean
}

export function useAgenda() {
  const events = useStore((s) => s.events)
  const hidden = useStore((s) => s.hiddenBuiltins)
  const examDates = useStore((s) => s.settings.examDates)
  const todos = useStore((s) => s.todos)
  return useMemo(() => {
    const hiddenSet = new Set(hidden)
    const items: AgendaItem[] = [
      ...builtinEvents(examDates)
        .filter((b) => !hiddenSet.has(b.id))
        .map((b) => ({ id: b.id, date: b.date, title: b.title, kind: b.kind, subjectId: b.subjectId, builtin: true })),
      ...events.map((e) => ({ id: e.id, date: e.date, title: e.title, kind: e.type, subjectId: e.subjectId, time: e.time, custom: true })),
      ...todos
        .filter((t) => t.due && !t.done)
        .map((t) => ({ id: t.id, date: t.due!, title: t.title, kind: 'todo' as const, subjectId: t.subjectId })),
    ]
    return items.sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''))
  }, [events, hidden, examDates, todos])
}

export function Kalender() {
  const [tab, setTab] = useState<'kalender' | 'todos'>('kalender')
  return (
    <div>
      <PageHeader
        title="Kalender & To-dos"
        subtitle="Die offiziellen Abi-Termine 2027 sind schon eingetragen. Ergänze Klausuren, Vorabi und Abgaben."
        actions={
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'kalender', label: 'Kalender' },
              { value: 'todos', label: 'To-dos' },
            ]}
          />
        }
      />
      {tab === 'kalender' ? <CalendarView /> : <TodoView />}
    </div>
  )
}

function CalendarView() {
  const today = todayISO()
  const [month, setMonth] = useState(today.slice(0, 7) + '-01')
  const [selected, setSelected] = useState(today)
  const agenda = useAgenda()
  const byDate = useMemo(() => {
    const m = new Map<string, AgendaItem[]>()
    for (const a of agenda) m.set(a.date, [...(m.get(a.date) ?? []), a])
    return m
  }, [agenda])

  const first = parseISO(month)
  const gridStart = weekStart(month)
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const shift = (n: number) => {
    const d = parseISO(month)
    d.setMonth(d.getMonth() + n)
    setMonth(toISO(d).slice(0, 7) + '-01')
  }
  const upcoming = agenda.filter((a) => a.date >= today).slice(0, 12)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card
          title={formatMonth(month)}
          icon="calendar"
          action={
            <div className="flex items-center gap-1">
              <IconButton icon="chevronLeft" label="Vorheriger Monat" onClick={() => shift(-1)} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setMonth(today.slice(0, 7) + '-01')
                  setSelected(today)
                }}
              >
                Heute
              </Button>
              <IconButton icon="chevronRight" label="Nächster Monat" onClick={() => shift(1)} />
            </div>
          }
          bodyClass="p-2 sm:p-3"
        >
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const inMonth = parseISO(d).getMonth() === first.getMonth()
              const items = byDate.get(d) ?? []
              return (
                <button
                  key={d}
                  onClick={() => setSelected(d)}
                  className={cx(
                    'flex min-h-16 flex-col items-stretch rounded-lg border p-1 text-left transition sm:min-h-20',
                    d === selected ? 'border-brand-500 ring-1 ring-brand-500' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60',
                    !inMonth && 'opacity-40',
                  )}
                >
                  <span
                    className={cx(
                      'tabular mb-0.5 inline-flex size-6 items-center justify-center self-start rounded-full text-xs font-medium',
                      d === today && 'bg-brand-600 text-white',
                    )}
                  >
                    {parseISO(d).getDate()}
                  </span>
                  <span className="hidden flex-col gap-0.5 sm:flex">
                    {items.slice(0, 2).map((it) => (
                      <span
                        key={it.id}
                        className="truncate rounded px-1 text-[10px] leading-4 font-medium text-white"
                        style={{ background: it.subjectId && it.kind === 'abi' ? SUBJECT_BY_ID[it.subjectId].color : EVENT_TYPES[it.kind].dot }}
                      >
                        {it.title}
                      </span>
                    ))}
                    {items.length > 2 && <span className="text-[10px] text-slate-500">+{items.length - 2} weitere</span>}
                  </span>
                  <span className="flex gap-0.5 sm:hidden">
                    {items.slice(0, 4).map((it) => (
                      <span key={it.id} className="size-1.5 rounded-full" style={{ background: EVENT_TYPES[it.kind].dot }} />
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
        <DayPanel date={selected} items={byDate.get(selected) ?? []} />
      </div>
      <Card title="Demnächst" icon="list">
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">Keine anstehenden Termine.</p>
        ) : (
          <ul className="space-y-2.5">
            {upcoming.map((a) => (
              <AgendaRow key={a.id} item={a} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export function AgendaRow({ item: a, compact }: { item: AgendaItem; compact?: boolean }) {
  const days = daysBetween(todayISO(), a.date)
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: a.subjectId && a.kind === 'abi' ? SUBJECT_BY_ID[a.subjectId].color : EVENT_TYPES[a.kind].dot }} />
      <div className="min-w-0 flex-1">
        <div className={cx('truncate', a.kind === 'abi' && 'font-semibold')}>{a.title}</div>
        <div className="text-xs text-slate-500">
          {formatDay(a.date)}
          {a.time && ` · ${a.time}`}
          {!compact && ` · ${EVENT_TYPES[a.kind].label}`}
        </div>
      </div>
      <span className="tabular shrink-0 text-xs text-slate-500">{days === 0 ? 'heute' : days === 1 ? 'morgen' : `in ${days} T.`}</span>
    </li>
  )
}

function DayPanel({ date, items }: { date: string; items: AgendaItem[] }) {
  const addEvent = useStore((s) => s.addEvent)
  const removeEvent = useStore((s) => s.removeEvent)
  const toggleBuiltin = useStore((s) => s.toggleBuiltin)
  const toggleTodo = useStore((s) => s.toggleTodo)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EventType>('klausur')
  const [subjectId, setSubjectId] = useState<SubjectId | ''>('')
  const [time, setTime] = useState('')

  return (
    <Card title={formatDate(date)} icon="calendar">
      {items.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">Keine Einträge an diesem Tag.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/50">
              <Badge tone={EVENT_TYPES[it.kind].tone}>{EVENT_TYPES[it.kind].label}</Badge>
              {it.subjectId && <SubjectDot color={SUBJECT_BY_ID[it.subjectId].color} />}
              <span className="min-w-0 flex-1 truncate">{it.title}</span>
              {it.time && <span className="text-xs text-slate-500">{it.time}</span>}
              {it.custom && <IconButton icon="trash" label="Löschen" onClick={() => removeEvent(it.id)} />}
              {it.builtin && <IconButton icon="eyeOff" label="Ausblenden" onClick={() => toggleBuiltin(it.id)} />}
              {it.kind === 'todo' && <IconButton icon="check" label="Erledigt" onClick={() => toggleTodo(it.id)} />}
            </li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_8rem_8rem_6rem_auto] sm:items-end">
        <div className="col-span-2 sm:col-span-1">
          <Field label="Neuer Eintrag">
            <TextInput value={title} placeholder="z. B. Klausur Latein" onChange={(e) => setTitle(e.target.value)} />
          </Field>
        </div>
        <Field label="Art">
          <Select value={type} onChange={(e) => setType(e.target.value as EventType)}>
            {(['klausur', 'vorabi', 'abgabe', 'termin', 'sonstiges'] as EventType[]).map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPES[t].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Fach">
          <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value as SubjectId | '')}>
            <option value="">–</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Uhrzeit">
          <TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Button
          variant="primary"
          icon="plus"
          disabled={!title.trim()}
          onClick={() => {
            addEvent({ title: title.trim(), date, type, subjectId: subjectId || null, time: time || undefined })
            setTitle('')
            setTime('')
          }}
        >
          Eintragen
        </Button>
      </div>
    </Card>
  )
}

function TodoView() {
  const todos = useStore((s) => s.todos)
  const add = useStore((s) => s.addTodo)
  const toggle = useStore((s) => s.toggleTodo)
  const remove = useStore((s) => s.removeTodo)
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [subjectId, setSubjectId] = useState<SubjectId | ''>('')
  const [priority, setPriority] = useState<Todo['priority']>(2)
  const [filter, setFilter] = useState<'offen' | 'erledigt' | 'alle'>('offen')
  const today = todayISO()

  const list = todos
    .filter((t) => (filter === 'alle' ? true : filter === 'offen' ? !t.done : t.done))
    .sort((a, b) => Number(a.done) - Number(b.done) || (a.due ?? '9999').localeCompare(b.due ?? '9999') || a.priority - b.priority)

  const submit = () => {
    if (!title.trim()) return
    add({ title: title.trim(), due: due || undefined, subjectId: subjectId || null, priority })
    setTitle('')
    setDue('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_9rem_8rem_7rem_auto] sm:items-end">
          <div className="col-span-2 sm:col-span-1">
            <Field label="Aufgabe">
              <TextInput
                value={title}
                placeholder="z. B. Abi-Klausur 2024 Mathe rechnen"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </Field>
          </div>
          <Field label="Fällig">
            <TextInput type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </Field>
          <Field label="Fach">
            <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value as SubjectId | '')}>
              <option value="">–</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priorität">
            <Select value={priority} onChange={(e) => setPriority(Number(e.target.value) as Todo['priority'])}>
              <option value={1}>hoch</option>
              <option value={2}>normal</option>
              <option value={3}>niedrig</option>
            </Select>
          </Field>
          <Button variant="primary" icon="plus" onClick={submit} disabled={!title.trim()}>
            Hinzufügen
          </Button>
        </div>
      </Card>

      <Tabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { value: 'offen', label: `Offen (${todos.filter((t) => !t.done).length})` },
          { value: 'erledigt', label: `Erledigt (${todos.filter((t) => t.done).length})` },
          { value: 'alle', label: 'Alle' },
        ]}
      />

      <Card bodyClass="p-0">
        {list.length === 0 ? (
          <EmptyState icon="check" title={filter === 'offen' ? 'Nichts offen' : 'Keine Einträge'}>
            {filter === 'offen' && 'Trag oben deine nächsten Lernaufgaben ein.'}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((t) => {
              const overdue = !t.done && t.due && t.due < today
              return (
                <li key={t.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <Checkbox checked={t.done} onChange={() => toggle(t.id)} />
                  {t.subjectId && <SubjectDot color={SUBJECT_BY_ID[t.subjectId].color} />}
                  <span className={cx('min-w-0 flex-1', t.done && 'text-slate-400 line-through')}>{t.title}</span>
                  {t.priority === 1 && !t.done && <Badge tone="red">wichtig</Badge>}
                  {t.due && (
                    <span className={cx('tabular text-xs', overdue ? 'font-semibold text-rose-600' : 'text-slate-500')}>
                      {overdue ? 'überfällig · ' : ''}
                      {formatShort(t.due)}
                    </span>
                  )}
                  <IconButton icon="trash" label="Löschen" onClick={() => remove(t.id)} />
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
