import { useMemo } from 'react'
import { Link } from 'react-router'
import { Q_SEMESTERS, ROUNDING_LABELS, fmt, fmtGrade, fmtNum, type ReasonKind, type RoundingMode } from '../lib/abi-calc'
import { simulateAll, type SimResult, type ValueSource } from '../lib/abi-simulation'
import { useStore } from '../store/store'
import { simInputFrom } from '../store/derived'
import { Badge, Button, Callout, Card, IssueList, PageHeader, PointsInput, SubjectDot, Tabs, cx, pointsTone } from '../components/ui'

const MODE_SHORT: Record<RoundingMode, string> = { floor: 'Schlechtester Fall', round: 'Realistisch', ceil: 'Bester Fall' }

const SOURCE_STYLE: Record<ValueSource, { label: string; cls: string }> = {
  real: { label: 'eingetragen', cls: 'bg-white dark:bg-slate-900' },
  prognose: { label: 'Prognose', cls: 'bg-amber-50 dark:bg-amber-900/20' },
  override: { label: 'von dir gesetzt', cls: 'bg-brand-50 dark:bg-brand-900/30' },
  estimate: { label: 'geschätzt', cls: 'bg-slate-50 dark:bg-slate-800/50' },
  none: { label: '', cls: '' },
}

export function Simulation() {
  const courses = useStore((s) => s.courses)
  const exams = useStore((s) => s.exams)
  const simulation = useStore((s) => s.simulation)
  const blockI = useStore((s) => s.blockI)
  const bll = useStore((s) => s.bll)
  const mode = useStore((s) => s.settings.roundingMode)
  const setSettings = useStore((s) => s.setSettings)
  const clearOverrides = useStore((s) => s.clearOverrides)

  const all = useMemo(
    () => simulateAll(simInputFrom({ courses, exams, simulation, blockI, bll })),
    [courses, exams, simulation, blockI, bll],
  )
  const r = all[mode]
  const overrides = Object.keys(simulation.semesterOverrides).length + Object.keys(simulation.examOverrides).length

  return (
    <div>
      <PageHeader
        title="Abi-Simulation"
        subtitle="Rechnet aus deinen bisherigen Noten ein komplettes Abitur hoch. Fehlende Halbjahre und Prüfungen werden geschätzt – du kannst jeden Wert mit Kommazahlen überschreiben."
        actions={
          overrides > 0 && (
            <Button size="sm" icon="reset" onClick={clearOverrides}>
              {overrides} eigene Werte zurücksetzen
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Rundung:</span>
        <Tabs<RoundingMode>
          value={mode}
          onChange={(v) => setSettings({ roundingMode: v })}
          tabs={(['floor', 'round', 'ceil'] as RoundingMode[]).map((m) => ({ value: m, label: ROUNDING_LABELS[m] }))}
        />
      </div>

      <ResultHero r={r} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {(['floor', 'round', 'ceil'] as RoundingMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setSettings({ roundingMode: m })}
            className={cx(
              'rounded-2xl border p-4 text-left transition',
              m === mode
                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 dark:bg-brand-900/30'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900',
            )}
          >
            <div className="text-xs font-medium text-slate-500">{MODE_SHORT[m]}</div>
            <div className="text-xs text-slate-400">{ROUNDING_LABELS[m]}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="tabular text-3xl font-bold">{fmtGrade(all[m].grade)}</span>
              <span className="tabular text-sm text-slate-500">{all[m].total} Punkte</span>
            </div>
            <div className="tabular mt-1 text-xs text-slate-500">
              Block I {all[m].blockI.points} · Block II {all[m].blockII.points} · rechnerisch {fmtGrade(all[m].computed)}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SemesterTable r={r} />
          <SelectionExplainer r={r} />
        </div>
        <div className="space-y-6">
          <ExamTable r={r} />
          <Card title="Regeln" icon="shield">
            <IssueList issues={r.issues} okText="Zulassung und Bestehen wären erfüllt." />
          </Card>
          <Callout>
            <strong>So wird geschätzt:</strong> Fehlende Halbjahre bekommen den Schnitt des Fachs, fehlende Prüfungen den
            Q-Phasen-Schnitt des Abifachs. Kommazahlen werden je nach Rundung auf ganze Punkte gebracht – „Sicher (abrunden)“
            rechnet bewusst pessimistisch.
          </Callout>
        </div>
      </div>
    </div>
  )
}

function ResultHero({ r }: { r: SimResult }) {
  return (
    <div className="grid gap-4 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white shadow-sm sm:grid-cols-[auto_1fr] sm:gap-8">
      <div>
        <div className="text-sm opacity-80">Simulierte Abiturnote</div>
        <div className="tabular text-6xl font-bold tracking-tight">{fmtGrade(r.grade)}</div>
        <div className="mt-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-sm">
          Rechnerischer Schnitt: <strong className="tabular text-base">{fmtGrade(r.computed)}</strong>
          <span className="tabular opacity-80"> · exakt {fmt(r.exact.gradeValue, 3)}</span>
        </div>
        {r.computed != null && r.computed < 1 && (
          <div className="mt-1 max-w-64 text-xs opacity-85">Besser als 1,0 – offiziell ist 1,0 die beste Note, rechnerisch liegst du darunter.</div>
        )}
        {!r.passed && <Badge tone="red" className="mt-2">Regeln nicht erfüllt</Badge>}
      </div>
      <dl className="grid grid-cols-3 gap-3 self-center">
        <HeroNum label="Block I" rounded={r.blockI.points} exact={r.exact.blockI} max={600} />
        <HeroNum label="Block II" rounded={r.blockII.points} exact={r.exact.blockII} max={300} />
        <HeroNum label="Gesamt" rounded={r.total} exact={r.exact.total} max={900} />
      </dl>
    </div>
  )
}

function HeroNum({ label, rounded, exact, max }: { label: string; rounded: number; exact: number; max: number }) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <dt className="text-xs opacity-80">{label}</dt>
      <dd className="tabular text-2xl font-bold">{rounded}</dd>
      <dd className="tabular text-xs opacity-80">
        exakt {fmt(exact, 3)} / {max}
      </dd>
    </div>
  )
}

function SemesterTable({ r }: { r: SimResult }) {
  const courses = useStore((s) => s.courses)
  const overrides = useStore((s) => s.simulation.semesterOverrides)
  const setOverride = useStore((s) => s.setSemesterOverride)
  const cellByKey = new Map(r.cells.map((c) => [c.key, c]))

  return (
    <Card
      title="Halbjahre"
      icon="grades"
      action={
        <Link to="/noten" className="text-xs text-brand-600 hover:underline">
          echte Noten eintragen →
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="py-1.5 text-left font-medium">Fach</th>
              {Q_SEMESTERS.map((s) => (
                <th key={s} className="px-1 py-1.5 font-medium">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-2">
                    <SubjectDot color={c.color} />
                    <span className="max-w-36 truncate">{c.name}</span>
                    {c.type === 'LK' && <Badge tone="brand">LK</Badge>}
                  </div>
                </td>
                {Q_SEMESTERS.map((s) => {
                  const key = `${c.id}|${s}`
                  const cell = cellByKey.get(key)
                  if (!cell)
                    return (
                      <td key={s} className="text-center text-xs text-slate-300">
                        –
                      </td>
                    )
                  const editable = cell.source === 'estimate' || cell.source === 'override'
                  const st = SOURCE_STYLE[cell.source]
                  const reason = r.blockI.reasons[key]
                  const inc = reason?.included
                  const problem = reason?.kind === 'zero' && inc
                  return (
                    <td key={s} className="px-1 py-1.5 text-center">
                      <div
                        className={cx(
                          'inline-flex flex-col items-center rounded-lg px-1 py-1 ring-2 transition',
                          st.cls,
                          problem ? 'ring-rose-500' : inc ? 'ring-brand-500' : 'opacity-55 ring-transparent',
                        )}
                        title={`${reason ? reason.text : ''}\n(${st.label}${cell.value !== cell.rounded ? `, gerundet ${cell.rounded} P.` : ''})`}
                      >
                        {editable ? (
                          <PointsInput
                            allowDecimals
                            value={overrides[key] ?? null}
                            placeholder={fmtNum(cell.value)}
                            onChange={(v) => setOverride(key, v)}
                            className={cx('w-16', overrides[key] == null && 'border-dashed')}
                          />
                        ) : (
                          <span className={cx('tabular flex h-9 w-16 items-center justify-center font-semibold', pointsTone(cell.value), cell.source === 'prognose' && 'italic')}>
                            {fmt(cell.value, 0)}
                          </span>
                        )}
                        {cell.value !== cell.rounded && (
                          <span className="tabular text-[10px] text-slate-500">≈ {cell.rounded} P.</span>
                        )}
                        <span
                          className={cx(
                            'mt-0.5 text-[10px] leading-tight whitespace-nowrap',
                            problem
                              ? 'font-semibold text-rose-600 dark:text-rose-400'
                              : inc
                                ? 'font-semibold text-brand-700 dark:text-brand-300'
                                : 'text-slate-500',
                          )}
                        >
                          {inc ? '✓' : '✗'} {reason?.short}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded ring-2 ring-brand-500" /> <strong className="text-brand-700 dark:text-brand-300">✓ zählt im Abi</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-slate-200 opacity-60 dark:bg-slate-700" /> ✗ zählt nicht
        </span>
        <span>Grund steht unter jeder Note – Maus drauf für den ganzen Satz.</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-slate-200 dark:bg-slate-700" /> geschätzt (gestrichelt – eintippen zum Überschreiben)
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-brand-200 dark:bg-brand-800" /> von dir gesetzt
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-amber-200 dark:bg-amber-800" /> Prognose
        </span>
      </div>
    </Card>
  )
}

// ---------------------------------------------------------------- Erklärung der Kursauswahl

const KIND_INFO: Record<ReasonKind, string> = {
  lk: 'Leistungskurs – zählt immer, doppelt',
  pflicht: 'Pflichtkurs – muss eingebracht werden',
  forced: 'von dir fest eingebracht',
  raises: 'liegt über deinem Schnitt – hebt deine Punktzahl',
  pair: 'Projektkurs: im Paar über deinem Schnitt',
  filler: 'unter dem Schnitt, aber nötig für die Mindestzahl von 35 Kursen',
  deficitRule: 'unter dem Schnitt, aber nötig – erst ab 38 Kursen sind 8 Defizite erlaubt',
  provisional: 'Hochrechnung – noch keine 35 Kurse eingetragen',
  excluded: 'von dir ausgeschlossen',
  zero: '0 Punkte – gilt als nicht belegt, nicht anrechenbar',
  projectIncomplete: 'Projektkurs zählt nur mit beiden Halbjahren',
  below: 'liegt unter deinem Schnitt – würde deine Punktzahl senken',
  max: 'würde den Schnitt heben, aber höchstens 40 Kurse zählen',
}

interface ExplainRow {
  courseId: string
  kind: ReasonKind
  items: { key: string; sem: string; points: number }[]
}

function groupRows(entries: { key: string; courseId: string; sem: string; points: number; kind: ReasonKind }[]): ExplainRow[] {
  const map = new Map<string, ExplainRow>()
  for (const e of entries) {
    const id = `${e.courseId}|${e.kind}`
    const row = map.get(id) ?? { courseId: e.courseId, kind: e.kind, items: [] }
    row.items.push({ key: e.key, sem: e.sem, points: e.points })
    map.set(id, row)
  }
  return [...map.values()]
}

function SelectionExplainer({ r }: { r: SimResult }) {
  const courses = useStore((s) => s.courses)
  const toggle = useStore((s) => s.toggleBlockI)
  const b = r.blockI
  const pointsByKey = new Map(r.cells.map((c) => [c.key, c.rounded]))
  const courseById = new Map(courses.map((c) => [c.id, c]))

  const entries = Object.entries(b.reasons).map(([key, reason]) => {
    const [courseId, sem] = key.split('|')
    return { key, courseId, sem, points: pointsByKey.get(key) ?? 0, kind: reason.kind, included: reason.included }
  })
  const lk = entries.filter((e) => e.included && e.kind === 'lk').length
  const duty = entries.filter((e) => e.included && (e.kind === 'pflicht' || e.kind === 'zero')).length
  const free = entries.filter((e) => e.included && !['lk', 'pflicht', 'zero'].includes(e.kind))
  const out = entries.filter((e) => !e.included)
  const order: ReasonKind[] = ['below', 'max', 'excluded', 'zero', 'projectIncomplete']
  const outRows = groupRows(out).sort((a, z) => order.indexOf(a.kind) - order.indexOf(z.kind))
  const freeRows = groupRows(free)
  const dutyRows = groupRows(entries.filter((e) => e.included && ['lk', 'pflicht', 'zero'].includes(e.kind)))

  const action = (kind: ReasonKind, included: boolean): { label: string; mode: 'include' | 'exclude' | 'auto' } | null => {
    if (kind === 'forced' || kind === 'excluded') return { label: 'automatisch', mode: 'auto' }
    if (included && ['raises', 'pair', 'filler', 'deficitRule'].includes(kind)) return { label: 'ausschließen', mode: 'exclude' }
    if (!included && (kind === 'below' || kind === 'max')) return { label: 'einbringen', mode: 'include' }
    return null
  }

  const Row = ({ row, included }: { row: ExplainRow; included: boolean }) => {
    const c = courseById.get(row.courseId)
    const act = action(row.kind, included)
    return (
      <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center gap-2">
          <SubjectDot color={c?.color ?? '#94a3b8'} />
          <span className="font-medium">{c?.name ?? row.courseId}</span>
          {row.items.map((it) =>
            act ? (
              <button
                key={it.key}
                onClick={() => toggle(it.key, act.mode)}
                title={`Klicken: ${act.label}`}
                className={cx(
                  'tabular rounded-md border px-1.5 py-0.5 text-xs transition hover:border-brand-500',
                  included ? 'border-brand-300 text-brand-700 dark:border-brand-700 dark:text-brand-300' : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300',
                )}
              >
                {it.sem} · {it.points} P. <span className="opacity-60">({act.label})</span>
              </button>
            ) : (
              <span key={it.key} className="tabular rounded-md border border-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {it.sem} · {it.points} P.
              </span>
            ),
          )}
        </div>
        <div className={cx('mt-1 text-xs', row.kind === 'zero' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500')}>
          {KIND_INFO[row.kind]}
        </div>
      </li>
    )
  }

  return (
    <Card title="Welche Kurse zählen – und warum" icon="info">
      <p className="text-sm">
        Es zählen <strong>{b.count} von {entries.length}</strong> Halbjahreskursen: <strong>{lk}</strong> LK-Kurse (doppelt gewertet),{' '}
        <strong>{duty}</strong> Pflichtkurse und <strong>{free.length}</strong> freiwillig gewählte.
      </p>
      <p className="tabular mt-1 text-sm text-slate-500">
        Schnitt: Ø {fmt(b.average, 2)} Punkte pro Kurs → ({b.P} : {b.S}) × 40 = {fmt(b.exact, 3)} → <strong>{b.points} Punkte</strong> in Block I
      </p>

      <ol className="mt-3 list-decimal space-y-1 rounded-xl bg-brand-50 py-3 pr-3 pl-8 text-sm text-slate-700 dark:bg-brand-900/20 dark:text-slate-300">
        <li>
          <strong>Pflicht:</strong> alle 8 LK-Kurse (doppelt), die Abiturfächer und deine Pflichtbelegungen zählen immer.
        </li>
        <li>
          <strong>Auffüllen</strong> auf mindestens 35 Kurse (27 Grundkurse) mit deinen besten übrigen Kursen.
        </li>
        <li>
          <strong>Weitere Kurse</strong> (bis höchstens 40) nur, wenn sie über deinem Schnitt liegen – sonst würden sie ihn senken.
        </li>
        <li>
          <strong>Grenzen:</strong> höchstens {b.maxDeficits} Defizite bei {b.count} Kursen (davon max. 3 im LK, aktuell {b.deficits});
          Kurse mit 0 Punkten zählen nie.
        </li>
      </ol>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-brand-700 dark:text-brand-300">✓ Freiwillig eingebracht ({free.length})</h3>
          {freeRows.length === 0 ? (
            <p className="text-sm text-slate-500">Keine – es zählen nur Pflicht- und LK-Kurse.</p>
          ) : (
            <ul className="space-y-2">
              {freeRows.map((row) => (
                <Row key={`${row.courseId}|${row.kind}`} row={row} included />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">✗ Nicht eingebracht ({out.length})</h3>
          {outRows.length === 0 ? (
            <p className="text-sm text-slate-500">Alle Kurse zählen.</p>
          ) : (
            <ul className="space-y-2">
              {outRows.map((row) => (
                <Row key={`${row.courseId}|${row.kind}`} row={row} included={false} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
          Pflicht- und LK-Kurse anzeigen ({lk + duty})
        </summary>
        <ul className="mt-2 space-y-2">
          {dutyRows.map((row) => (
            <Row key={`${row.courseId}|${row.kind}`} row={row} included />
          ))}
        </ul>
      </details>
      <p className="mt-3 text-xs text-slate-500">
        Mit „einbringen“ / „ausschließen“ legst du Kurse von Hand fest – das gilt auch im Abi-Rechner. „automatisch“ hebt das
        wieder auf.
      </p>
    </Card>
  )
}

function ExamTable({ r }: { r: SimResult }) {
  const overrides = useStore((s) => s.simulation.examOverrides)
  const setOverride = useStore((s) => s.setExamOverride)
  const courses = useStore((s) => s.courses)
  return (
    <Card title="Prüfungen" icon="target">
      <ul className="space-y-2">
        {r.exams.map((e) => {
          const c = courses.find((x) => x.abiNr === e.abiNr)
          const editable = e.source !== 'real'
          const res = r.blockII.exams.find((x) => x.abiNr === e.abiNr)!
          return (
            <li key={e.abiNr} className={cx('flex items-center gap-2 rounded-xl px-2 py-1.5', SOURCE_STYLE[e.source].cls)}>
              <SubjectDot color={c?.color ?? '#94a3b8'} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {e.abiNr}. {e.name}
                </div>
                <div className="text-[11px] text-slate-500">{SOURCE_STYLE[e.source].label}</div>
              </div>
              {editable ? (
                <PointsInput
                  allowDecimals
                  value={overrides[String(e.abiNr)] ?? null}
                  placeholder={fmtNum(e.value)}
                  onChange={(v) => setOverride(String(e.abiNr), v)}
                  className={cx(overrides[String(e.abiNr)] == null && 'border-dashed')}
                />
              ) : (
                <span className="tabular w-16 text-center font-semibold">{e.value}</span>
              )}
              <div className="tabular w-14 text-right text-sm">
                <div className="font-bold">{res.points}</div>
                <div className="text-[10px] text-slate-500">
                  → {e.rounded} × {r.blockII.factor}
                </div>
              </div>
            </li>
          )
        })}
        {r.bll && (
          <li className={cx('flex items-center gap-2 rounded-xl px-2 py-1.5', SOURCE_STYLE[r.bll.source].cls)}>
            <SubjectDot color="var(--subj-other)" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">Besondere Lernleistung</div>
              <div className="text-[11px] text-slate-500">{SOURCE_STYLE[r.bll.source].label}</div>
            </div>
            {r.bll.source !== 'real' ? (
              <PointsInput
                allowDecimals
                value={overrides.bll ?? null}
                placeholder={fmtNum(r.bll.value)}
                onChange={(v) => setOverride('bll', v)}
                className={cx(overrides.bll == null && 'border-dashed')}
              />
            ) : (
              <span className="tabular w-16 text-center font-semibold">{r.bll.value}</span>
            )}
            <div className="tabular w-14 text-right text-sm">
              <div className="font-bold">{r.blockII.bll?.points}</div>
              <div className="text-[10px] text-slate-500">→ {r.bll.rounded} × 4</div>
            </div>
          </li>
        )}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        {r.bll
          ? 'Mit besonderer Lernleistung zählen alle Teile vierfach.'
          : 'Jede Prüfung zählt fünffach. Eine besondere Lernleistung kannst du im Abi-Rechner aktivieren.'}
      </p>
    </Card>
  )
}
