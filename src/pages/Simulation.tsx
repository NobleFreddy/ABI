import { useMemo } from 'react'
import { Link } from 'react-router'
import { Q_SEMESTERS, ROUNDING_LABELS, fmt, fmtGrade, fmtNum, type RoundingMode } from '../lib/abi-calc'
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
              Block I {all[m].blockI.points} · Block II {all[m].blockII.points}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SemesterTable r={r} />
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
        <div className="tabular text-sm opacity-90">exakter Notenwert {fmt(r.exact.gradeValue, 3)}</div>
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
  const selected = new Set(r.blockI.selected.map((c) => c.id))
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
                  return (
                    <td key={s} className="px-1 py-1.5 text-center">
                      <div className={cx('inline-flex flex-col items-center rounded-lg px-1 py-1', st.cls)} title={st.label}>
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
                        <span
                          className={cx(
                            'tabular mt-0.5 text-[10px]',
                            selected.has(key) ? 'font-semibold text-brand-600 dark:text-brand-300' : 'text-slate-400',
                          )}
                        >
                          {selected.has(key) ? `→ ${cell.rounded} ✓` : `→ ${cell.rounded}`}
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
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-slate-200 dark:bg-slate-700" /> geschätzt (gestrichelt = Schätzwert, eintippen zum Überschreiben)
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-brand-200 dark:bg-brand-800" /> von dir gesetzt
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded bg-amber-200 dark:bg-amber-800" /> Prognose
        </span>
        <span>„→ x ✓“ = gerundeter Wert, eingebracht</span>
      </div>
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
