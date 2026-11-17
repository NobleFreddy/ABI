import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Q_SEMESTERS, fmt, roundBy, type QSemester } from '../lib/abi-calc'
import { useStore } from '../store/store'
import type { Course, GradeEntry } from '../store/types'
import { COURSE_COLORS, COURSE_TEMPLATES } from '../content/subjects'
import {
  Badge,
  Button,
  Callout,
  Card,
  Checkbox,
  Field,
  IconButton,
  Modal,
  PageHeader,
  PointsInput,
  Select,
  SubjectDot,
  TextInput,
  cx,
  pointsTone,
} from '../components/ui'
import { Icon } from '../components/Icon'

export function Noten() {
  const courses = useStore((s) => s.courses)
  const [editId, setEditId] = useState<string | null>(null)
  const [entriesFor, setEntriesFor] = useState<{ id: string; sem: QSemester } | null>(null)
  const [adding, setAdding] = useState(false)

  const stats = useMemo(() => {
    const vals: number[] = []
    let deficits = 0
    let open = 0
    for (const c of courses)
      for (const s of Q_SEMESTERS) {
        if (c.notTaken[s]) continue
        const p = c.semesters[s].points
        if (p == null) {
          open++
          continue
        }
        vals.push(p)
        if (p < 5) deficits++
      }
    return { count: vals.length, avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null, deficits, open }
  }, [courses])

  return (
    <div>
      <PageHeader
        title="Noten & Kurse"
        subtitle="Trag deine Halbjahresnoten (0–15 Punkte) für die Qualifikationsphase ein. Für kommende Halbjahre kannst du Prognosen markieren."
        actions={
          <Button variant="primary" icon="plus" onClick={() => setAdding(true)}>
            Kurs hinzufügen
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Eingetragene Kurse" value={String(stats.count)} />
        <MiniStat label="Ø Punkte (alle Kurse)" value={stats.avg == null ? '–' : fmt(stats.avg, 2)} />
        <MiniStat label="Defizite (< 5 P.)" value={String(stats.deficits)} tone={stats.deficits > 6 ? 'bad' : undefined} />
        <MiniStat label="Noch offen" value={String(stats.open)} />
      </div>

      {courses.length < 9 && (
        <div className="mb-4">
          <Callout tone="brand" icon="info">
            Füge alle Fächer hinzu, die du in der Q-Phase belegst (z. B. Englisch, Geschichte, Sport, Religion). Für den
            Abi-Rechner zählen 35–40 Kurse; belegt sein müssen mindestens 30 Grund- und 8 Leistungskurse.
            Pflichtkurse sind schon passend vormarkiert (Vorschlag nach § 28 APO-GOSt, bitte mit deiner
            Oberstufenkoordination abgleichen). Vertiefungskurse nicht eintragen – sie sind nicht anrechenbar.
          </Callout>
        </div>
      )}

      <Card bodyClass="p-0">
        <div className="hidden grid-cols-[minmax(0,1fr)_repeat(4,4.5rem)_4rem_5.5rem] items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 md:grid dark:border-slate-800">
          <div>Fach</div>
          {Q_SEMESTERS.map((s) => (
            <div key={s} className="text-center">
              {s}
            </div>
          ))}
          <div className="text-center">Ø</div>
          <div />
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {courses.map((c, i) => (
            <CourseRow
              key={c.id}
              course={c}
              first={i === 0}
              last={i === courses.length - 1}
              onEdit={() => setEditId(c.id)}
              onEntries={(sem) => setEntriesFor({ id: c.id, sem })}
            />
          ))}
        </ul>
      </Card>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded border-2 border-dashed border-slate-400" /> Prognose
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-brand-500" /> Pflicht zum Einbringen
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="list" className="size-3.5" /> Einzelnoten (Klausuren, sonstige Mitarbeit)
        </span>
        <Link to="/rechner" className="ml-auto font-medium text-brand-600 hover:underline">
          Zum Abi-Rechner →
        </Link>
      </div>

      <AddCourseModal open={adding} onClose={() => setAdding(false)} onCreated={(id) => setEditId(id)} />
      {editId && <EditCourseModal id={editId} onClose={() => setEditId(null)} />}
      {entriesFor && <EntriesModal {...entriesFor} onClose={() => setEntriesFor(null)} />}
    </div>
  )
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: 'bad' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={cx('tabular text-xl font-bold', tone === 'bad' && 'text-rose-600')}>{value}</div>
    </div>
  )
}

function CourseRow({
  course: c,
  first,
  last,
  onEdit,
  onEntries,
}: {
  course: Course
  first: boolean
  last: boolean
  onEdit: () => void
  onEntries: (s: QSemester) => void
}) {
  const setSemester = useStore((s) => s.setSemester)
  const moveCourse = useStore((s) => s.moveCourse)
  const vals = Q_SEMESTERS.filter((s) => !c.notTaken[s])
    .map((s) => c.semesters[s].points)
    .filter((p): p is number => p != null)
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null

  return (
    <li className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_repeat(4,4.5rem)_4rem_5.5rem] md:items-center md:gap-2">
      <button onClick={onEdit} className="flex min-w-0 items-start gap-2 text-left">
        <SubjectDot color={c.color} className="mt-1.5 size-2.5" />
        <span className="min-w-0">
          <span className="block truncate font-medium">{c.name}</span>
          <span className="mt-0.5 flex flex-wrap gap-1">
            <Badge tone={c.type === 'LK' ? 'brand' : 'slate'}>{c.type}</Badge>
            {c.abiNr && <Badge tone="green">{c.abiNr}. Abifach</Badge>}
            {c.isProjektkurs && <Badge tone="blue">Projektkurs</Badge>}
          </span>
        </span>
      </button>

      <div className="grid grid-cols-4 gap-2 md:contents">
        {Q_SEMESTERS.map((s) => {
          const d = c.semesters[s]
          if (c.notTaken[s])
            return (
              <div key={s} className="flex flex-col items-center text-xs text-slate-400">
                <span className="md:hidden">{s}</span>
                <span className="flex h-9 items-center">nicht belegt</span>
              </div>
            )
          return (
            <div key={s} className="flex flex-col items-center gap-1">
              <span className="text-[11px] text-slate-500 md:hidden">{s}</span>
              <PointsInput
                value={d.points}
                onChange={(v) => setSemester(c.id, s, { points: v })}
                className={cx(pointsTone(d.points), d.isForecast && 'border-dashed')}
                muted={d.isForecast}
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSemester(c.id, s, { isForecast: !d.isForecast })}
                  className={cx(
                    'rounded px-1 text-[10px] font-semibold',
                    d.isForecast ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'text-slate-400 hover:text-slate-600',
                  )}
                  title={d.isForecast ? 'Prognose – klicken, um als echte Note zu markieren' : 'Als Prognose markieren'}
                >
                  P
                </button>
                <button
                  onClick={() => onEntries(s)}
                  className={cx('rounded p-0.5', d.entries.length ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600')}
                  title="Einzelnoten"
                  aria-label={`Einzelnoten ${c.name} ${s}`}
                >
                  <Icon name="list" className="size-3.5" />
                </button>
                {(c.mandatory[s] || c.abiNr != null) && (
                  <span className="size-1.5 rounded-full bg-brand-500" title="Pflicht zum Einbringen" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className={cx('tabular hidden text-center text-sm font-semibold md:block', pointsTone(avg))}>
        {avg == null ? '–' : fmt(avg, 1)}
      </div>
      <div className="flex items-center justify-end gap-0.5">
        <IconButton icon="arrowUp" label="Nach oben" disabled={first} onClick={() => moveCourse(c.id, -1)} />
        <IconButton icon="arrowDown" label="Nach unten" disabled={last} onClick={() => moveCourse(c.id, 1)} />
        <IconButton icon="edit" label="Kurs bearbeiten" onClick={onEdit} />
      </div>
    </li>
  )
}

function AddCourseModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const addCourse = useStore((s) => s.addCourse)
  const courses = useStore((s) => s.courses)
  const existing = new Set(courses.map((c) => c.name))
  return (
    <Modal open={open} onClose={onClose} title="Kurs hinzufügen" wide>
      <p className="mb-3 text-sm text-slate-500">
        Wähle eine Vorlage – die Pflicht-Markierungen sind ein Vorschlag und lassen sich danach anpassen.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {COURSE_TEMPLATES.map((t) => (
          <button
            key={t.name}
            disabled={existing.has(t.name)}
            onClick={() => {
              addCourse(t)
              onClose()
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-brand-900/30"
          >
            <div className="font-medium">{t.name}</div>
            {t.hint && <div className="text-xs text-slate-500">{t.hint}</div>}
          </button>
        ))}
        <button
          onClick={() => {
            const id = addCourse()
            onClose()
            onCreated(id)
          }}
          className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-left text-sm hover:border-brand-400 dark:border-slate-700"
        >
          <div className="font-medium">+ Eigener Kurs</div>
          <div className="text-xs text-slate-500">Name und Einstellungen selbst festlegen</div>
        </button>
      </div>
    </Modal>
  )
}

function EditCourseModal({ id, onClose }: { id: string; onClose: () => void }) {
  const c = useStore((s) => s.courses.find((x) => x.id === id))
  const update = useStore((s) => s.updateCourse)
  const remove = useStore((s) => s.removeCourse)
  const [confirmDelete, setConfirmDelete] = useState(false)
  if (!c) return null
  return (
    <Modal
      open
      onClose={onClose}
      title={`${c.name} bearbeiten`}
      footer={
        <>
          {confirmDelete ? (
            <Button
              variant="danger"
              icon="trash"
              onClick={() => {
                remove(c.id)
                onClose()
              }}
            >
              Wirklich löschen
            </Button>
          ) : (
            <Button variant="ghost" icon="trash" onClick={() => setConfirmDelete(true)}>
              Löschen
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Fertig
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name">
          <TextInput value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} />
        </Field>
        <Field label="Kürzel">
          <TextInput value={c.short} onChange={(e) => update(c.id, { short: e.target.value })} />
        </Field>
        <Field label="Kursart">
          <Select value={c.type} onChange={(e) => update(c.id, { type: e.target.value as 'LK' | 'GK' })}>
            <option value="GK">Grundkurs</option>
            <option value="LK">Leistungskurs</option>
          </Select>
        </Field>
        <Field label="Abiturfach">
          <Select
            value={c.abiNr ?? ''}
            onChange={(e) => update(c.id, { abiNr: e.target.value ? (Number(e.target.value) as 1 | 2 | 3 | 4) : null })}
          >
            <option value="">kein Abiturfach</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}. Abiturfach
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-4">
        <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">Farbe</div>
        <div className="flex flex-wrap gap-2">
          {[c.color, ...COURSE_COLORS.filter((x) => x !== c.color)].map((col) => (
            <button
              key={col}
              onClick={() => update(c.id, { color: col })}
              className={cx('size-7 rounded-full ring-offset-2 dark:ring-offset-slate-900', col === c.color && 'ring-2 ring-slate-400')}
              style={{ background: col }}
              aria-label={`Farbe ${col}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="py-1 text-left font-medium">Halbjahr</th>
              {Q_SEMESTERS.map((s) => (
                <th key={s} className="py-1 font-medium">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1.5">Pflicht zum Einbringen</td>
              {Q_SEMESTERS.map((s) => (
                <td key={s} className="text-center">
                  <input
                    type="checkbox"
                    className="size-4 accent-brand-600"
                    checked={c.mandatory[s] || c.abiNr != null}
                    disabled={c.abiNr != null}
                    onChange={(e) => update(c.id, { mandatory: { ...c.mandatory, [s]: e.target.checked } })}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-1.5">Nicht belegt</td>
              {Q_SEMESTERS.map((s) => (
                <td key={s} className="text-center">
                  <input
                    type="checkbox"
                    className="size-4 accent-brand-600"
                    checked={c.notTaken[s]}
                    onChange={(e) => update(c.id, { notTaken: { ...c.notTaken, [s]: e.target.checked } })}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {c.abiNr != null && <p className="mt-1 text-xs text-slate-500">Abiturfächer müssen immer mit allen 4 Kursen eingebracht werden.</p>}
      </div>

      <div className="mt-4">
        <Checkbox
          checked={!!c.isProjektkurs}
          onChange={(v) => update(c.id, { isProjektkurs: v || undefined })}
          label="Projektkurs (beide Halbjahre nur zusammen anrechenbar)"
        />
      </div>
    </Modal>
  )
}

function EntriesModal({ id, sem, onClose }: { id: string; sem: QSemester; onClose: () => void }) {
  const c = useStore((s) => s.courses.find((x) => x.id === id))
  const add = useStore((s) => s.addGradeEntry)
  const remove = useStore((s) => s.removeGradeEntry)
  const setSemester = useStore((s) => s.setSemester)
  const [label, setLabel] = useState('')
  const [kind, setKind] = useState<GradeEntry['kind']>('klausur')
  const [points, setPoints] = useState<number | null>(null)
  if (!c) return null
  const entries = c.semesters[sem].entries

  const avgOf = (k: GradeEntry['kind']) => {
    const xs = entries.filter((e) => e.kind === k).map((e) => e.points)
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null
  }
  const aK = avgOf('klausur')
  const aS = avgOf('sonstige')
  const all = entries.map((e) => e.points)
  const suggestion =
    aK != null && aS != null ? (aK + aS) / 2 : all.length ? all.reduce((a, b) => a + b, 0) / all.length : null

  return (
    <Modal open onClose={onClose} title={`${c.name} · ${sem} – Einzelnoten`}>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">Noch keine Einzelnoten. Trag Klausuren und deine Note für die sonstige Mitarbeit ein.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center gap-2 py-2 text-sm">
              <Badge tone={e.kind === 'klausur' ? 'brand' : e.kind === 'sonstige' ? 'green' : 'slate'}>
                {e.kind === 'klausur' ? 'Klausur' : e.kind === 'sonstige' ? 'Sonst. Mitarbeit' : 'Andere'}
              </Badge>
              <span className="min-w-0 flex-1 truncate">{e.label || '—'}</span>
              <span className={cx('tabular font-semibold', pointsTone(e.points))}>{fmt(e.points, Number.isInteger(e.points) ? 0 : 2)} P.</span>
              <IconButton icon="trash" label="Entfernen" onClick={() => remove(c.id, sem, e.id)} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 grid grid-cols-[1fr_auto_auto_auto] items-end gap-2">
        <Field label="Bezeichnung">
          <TextInput value={label} placeholder="z. B. 1. Klausur" onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="Art">
          <Select value={kind} onChange={(e) => setKind(e.target.value as GradeEntry['kind'])}>
            <option value="klausur">Klausur</option>
            <option value="sonstige">Sonst. Mitarbeit</option>
            <option value="andere">Andere</option>
          </Select>
        </Field>
        <Field label="Punkte">
          <PointsInput value={points} onChange={setPoints} allowDecimals />
        </Field>
        <Button
          variant="primary"
          icon="plus"
          disabled={points == null}
          onClick={() => {
            if (points == null) return
            add(c.id, sem, { label, kind, points })
            setLabel('')
            setPoints(null)
          }}
        >
          <span className="sr-only">Hinzufügen</span>
        </Button>
      </div>

      {suggestion != null && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <div>
            Vorschlag für die Halbjahresnote: <strong className="tabular">{fmt(suggestion, 3)}</strong> Punkte
            {aK != null && aS != null && <span className="text-slate-500"> (Klausuren und sonstige Mitarbeit je 50 %)</span>}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setSemester(c.id, sem, { points: roundBy(suggestion, 'round') })}
            >
              {roundBy(suggestion, 'round')} Punkte übernehmen
            </Button>
            <span className="text-xs text-slate-500">Die echte Note legt deine Lehrkraft fest – das ist nur eine Orientierung.</span>
          </div>
        </div>
      )}
    </Modal>
  )
}
