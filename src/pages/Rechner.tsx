import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  Q_SEMESTERS,
  computeBlockII,
  fmt,
  fmtGrade,
  gradeFromPoints,
  pointsNeededForGrade,
  examPoints,
} from '../lib/abi-calc'
import { useStore } from '../store/store'
import { useOfficialCalc } from '../store/derived'
import type { AbiNr } from '../store/types'
import { SUBJECT_BY_ID } from '../content/subjects'
import { Badge, Card, Checkbox, IssueList, PageHeader, PointsInput, Select, Stat, SubjectDot, TextInput, cx } from '../components/ui'

export function Rechner() {
  const { blockI, blockII, total, grade } = useOfficialCalc()
  const admitted = blockI.admitted && !blockI.provisional

  return (
    <div>
      <PageHeader
        title="Abi-Rechner"
        subtitle="Offizielle Berechnung nach APO-GOSt NRW mit deinen eingetragenen Noten (inklusive Prognosen)."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
        <Stat label="Block I (Q-Phase)" value={`${blockI.points} / 600`} sub={blockI.provisional ? 'Hochrechnung' : `${blockI.count} Kurse eingebracht`} />
        <Stat label="Block II (Prüfungen)" value={`${blockII.points} / 300`} sub={blockII.complete ? 'alle Prüfungen eingetragen' : 'noch unvollständig'} />
        <Stat label="Gesamt" value={`${total} / 900`} />
        <Stat
          label="Abiturnote"
          value={grade != null ? fmtGrade(grade) : '–'}
          sub={blockII.complete ? (grade == null ? 'unter 300 Punkte' : 'offizielle Tabelle') : 'erst mit allen Prüfungen – siehe Simulation'}
          tone={grade != null ? 'good' : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <BlockICard />
          <BlockIICard />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Card title="Zulassung & Bestehen" icon="shield">
            <div className="mb-3 flex items-center gap-2">
              <Badge tone={admitted ? 'green' : blockI.provisional ? 'blue' : 'red'}>
                {blockI.provisional ? 'Hochrechnung' : admitted ? 'Zulassung erfüllt' : 'Zulassung gefährdet'}
              </Badge>
              {blockII.complete && <Badge tone={blockII.passed ? 'green' : 'red'}>{blockII.passed ? 'Prüfung bestanden' : 'Prüfung nicht bestanden'}</Badge>}
            </div>
            <IssueList issues={[...blockI.issues, ...blockII.issues]} okText="Alle Regeln erfüllt." />
          </Card>
          <Zielrechner blockI={blockI.points} />
          <WasWaereWenn blockI={blockI.points} />
        </div>
      </div>
    </div>
  )
}

function BlockICard() {
  const { blockI } = useOfficialCalc()
  const courses = useStore((s) => s.courses)
  const sel = useStore((s) => s.blockI)
  const toggle = useStore((s) => s.toggleBlockI)
  const selected = new Set(blockI.selected.map((c) => c.id))
  const include = new Set(sel.include)
  const exclude = new Set(sel.exclude)

  return (
    <Card title="Block I – Qualifikationsphase" icon="grades">
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Kurse eingebracht" value={blockI.count} sub={`${blockI.countLK} LK · ${blockI.countGK} GK`} />
        <Stat label="Ø pro Kurs (P : S)" value={fmt(blockI.average, 3)} sub={`P = ${blockI.P}, S = ${blockI.S}`} />
        <Stat label="Defizite" value={`${blockI.deficits} / ${blockI.maxDeficits}`} sub={`davon LK: ${blockI.lkDeficits} / 3`} tone={blockI.deficits > blockI.maxDeficits ? 'bad' : undefined} />
        <Stat label="(P : S) · 40" value={fmt(blockI.exact, 3)} sub={`gerundet: ${blockI.points} Punkte`} />
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-slate-500">Noch keine Kurse.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="py-1.5 text-left font-medium">Fach</th>
                {Q_SEMESTERS.map((s) => (
                  <th key={s} className="py-1.5 font-medium">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <SubjectDot color={c.color} />
                      <span className="truncate">{c.name}</span>
                      {c.type === 'LK' && <Badge tone="brand">LK</Badge>}
                    </div>
                  </td>
                  {Q_SEMESTERS.map((s) => {
                    const key = `${c.id}|${s}`
                    const p = c.semesters[s].points
                    if (c.notTaken[s] || p == null)
                      return (
                        <td key={s} className="py-1.5 text-center text-slate-300 dark:text-slate-600">
                          –
                        </td>
                      )
                    const isSel = selected.has(key)
                    const mand = c.abiNr != null || c.mandatory[s] || c.type === 'LK'
                    const mode = include.has(key) ? 'include' : exclude.has(key) ? 'exclude' : 'auto'
                    return (
                      <td key={s} className="py-1 text-center">
                        <button
                          disabled={mand}
                          onClick={() => toggle(key, mode === 'auto' ? 'include' : mode === 'include' ? 'exclude' : 'auto')}
                          title={
                            (blockI.reasons[key]?.text ?? '') +
                            '\n' +
                            (mand
                              ? '(Pflichtkurs – wird immer eingebracht)'
                              : mode === 'auto'
                                ? '(Klicken: fest einbringen)'
                                : mode === 'include'
                                  ? '(Klicken: ausschließen)'
                                  : '(Klicken: wieder automatisch)')
                          }
                          className={cx(
                            'tabular inline-flex h-8 w-11 items-center justify-center rounded-lg text-sm font-semibold transition',
                            isSel
                              ? 'bg-brand-600 text-white'
                              : 'border border-slate-300 text-slate-500 dark:border-slate-700',
                            p < 5 && isSel && 'bg-rose-600',
                            mode === 'include' && 'ring-2 ring-emerald-400 ring-offset-1 dark:ring-offset-slate-900',
                            mode === 'exclude' && 'line-through opacity-60',
                            mand && 'cursor-default',
                            c.semesters[s].isForecast && 'italic',
                          )}
                        >
                          {p}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">
        Gefüllt = eingebracht (rot = Defizit). Der Rechner wählt automatisch die beste Kombination aus 35–40 Kursen. Freie
        Kurse kannst du per Klick fest einbringen (grüner Rand) oder ausschließen. LK und Pflichtkurse sind fest.
      </p>
    </Card>
  )
}

function BlockIICard() {
  const courses = useStore((s) => s.courses)
  const exams = useStore((s) => s.exams)
  const setExam = useStore((s) => s.setExam)
  const { blockII } = useOfficialCalc()

  return (
    <Card title="Block II – Abiturprüfungen" icon="target">
      <div className="space-y-3">
        {([1, 2, 3, 4] as AbiNr[]).map((nr) => {
          const c = courses.find((x) => x.abiNr === nr)
          const meta = c?.subjectId ? SUBJECT_BY_ID[c.subjectId] : null
          const e = exams[nr]
          const res = blockII.exams.find((x) => x.abiNr === nr)!
          return (
            <div key={nr} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
              <div className="flex min-w-40 flex-1 items-center gap-2">
                <SubjectDot color={c?.color ?? '#94a3b8'} />
                <div>
                  <div className="font-medium">
                    {nr}. {c?.name ?? 'Abiturfach'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {c?.type ?? (nr <= 2 ? 'LK' : 'GK')} · {meta?.examKind ?? (nr === 4 ? 'mündlich' : 'schriftlich')}
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                {nr === 4 ? 'Mündlich' : 'Schriftlich'}
                <PointsInput value={e.main} onChange={(v) => setExam(nr, { main: v })} />
              </label>
              {nr !== 4 && (
                <label className="flex items-center gap-2 text-xs text-slate-500" title="Freiwillige oder angeordnete mündliche Prüfung (Abweichungs-/Bestehensprüfung)">
                  + mündl.
                  <PointsInput value={e.extraOral} onChange={(v) => setExam(nr, { extraOral: v })} placeholder="–" />
                </label>
              )}
              <div className="tabular w-20 text-right">
                <div className="text-lg font-bold">{res.missing ? '–' : res.points}</div>
                <div className="text-[11px] text-slate-500">× {blockII.factor} gewertet</div>
              </div>
            </div>
          )
        })}
        <BllRow />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Jede Prüfung zählt fünffach, mit besonderer Lernleistung vierfach. Mit mündlicher Zusatzprüfung zählt schriftlich :
        mündlich = 2 : 1, also ((2 · schriftlich + mündlich) · {blockII.factor}) : 3.
      </p>
    </Card>
  )
}

/** Besondere Lernleistung: 5. Komponente in Block II (Merkblatt MSB NRW). */
function BllRow() {
  const bll = useStore((s) => s.bll)
  const setBll = useStore((s) => s.setBll)
  return (
    <div
      className={cx(
        'rounded-xl border border-dashed px-3 py-2.5',
        bll.enabled ? 'border-brand-300 bg-brand-50/50 dark:border-brand-700 dark:bg-brand-900/20' : 'border-slate-300 dark:border-slate-700',
      )}
    >
      <Checkbox
        checked={bll.enabled}
        onChange={(v) => setBll({ enabled: v })}
        label={<span className="font-medium">Besondere Lernleistung einbringen (optional)</span>}
      />
      {bll.enabled ? (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <TextInput
            className="max-w-xs min-w-40 flex-1"
            placeholder="z. B. Projektkurs Mathe, Jugend forscht"
            value={bll.title}
            onChange={(e) => setBll({ title: e.target.value })}
          />
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Punkte
            <PointsInput value={bll.points} onChange={(v) => setBll({ points: v })} />
          </label>
          <div className="tabular ml-auto w-20 text-right">
            <div className="text-lg font-bold">{bll.points == null ? '–' : bll.points * 4}</div>
            <div className="text-[11px] text-slate-500">× 4 gewertet</div>
          </div>
        </div>
      ) : (
        <p className="mt-1 text-xs text-slate-500">
          Nur ankreuzen, wenn du z. B. einen Projektkurs als besondere Lernleistung einbringst. Dann zählen alle vier Prüfungen
          vierfach und die Lernleistung vierfach. Ein so eingebrachter Projektkurs zählt nicht zusätzlich in Block I.
        </p>
      )}
    </div>
  )
}

const GRADES = Array.from({ length: 31 }, (_, i) => Math.round((1 + i * 0.1) * 10) / 10)

function Zielrechner({ blockI }: { blockI: number }) {
  const [target, setTarget] = useState(2.0)
  const bllEnabled = useStore((s) => s.bll.enabled)
  const needed = pointsNeededForGrade(target)
  const needII = needed - blockI
  // ohne BLL: 4 Prüfungen × 5 = 20; mit BLL: (4 Prüfungen + BLL) × 4 = 20 → Schnitt pro Teil
  const perExam = needII / 20
  const parts = bllEnabled ? 'den vier Prüfungen und der besonderen Lernleistung' : 'jeder der vier Prüfungen'
  return (
    <Card title="Zielrechner" icon="target">
      <div className="flex items-center gap-2 text-sm">
        Ich möchte eine
        <Select className="w-24" value={target} onChange={(e) => setTarget(Number(e.target.value))}>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {fmtGrade(g)}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <div>
          Dafür brauchst du insgesamt <strong className="tabular">{needed}</strong> Punkte.
        </div>
        <div>
          Mit {blockI} Punkten in Block I fehlen <strong className="tabular">{Math.max(0, needII)}</strong> Punkte aus den Prüfungen.
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-brand-50 p-3 text-sm dark:bg-brand-900/30">
        {needII <= 100 ? (
          <span>Schon mit den Mindestanforderungen (je 5 Punkte) erreichbar.</span>
        ) : perExam > 15 ? (
          <span>Mit dem aktuellen Block I leider nicht erreichbar (bräuchte über 15 Punkte pro Prüfung).</span>
        ) : (
          <span>
            Das sind im Schnitt <strong className="tabular">{fmt(perExam, 3)}</strong> Punkte – also mindestens{' '}
            <strong>{Math.ceil(perExam - 1e-9)}</strong> Punkte in {parts}.
          </span>
        )}
      </div>
    </Card>
  )
}

function WasWaereWenn({ blockI }: { blockI: number }) {
  const courses = useStore((s) => s.courses)
  const exams = useStore((s) => s.exams)
  const initial = useMemo(() => {
    const out: Record<number, number> = {}
    for (const nr of [1, 2, 3, 4] as AbiNr[]) {
      const c = courses.find((x) => x.abiNr === nr)
      const vals = c ? Q_SEMESTERS.map((s) => c.semesters[s].points).filter((p): p is number => p != null) : []
      out[nr] = exams[nr].main ?? (vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 10)
    }
    return out
  }, [courses, exams])
  const [vals, setVals] = useState<Record<number, number>>(initial)
  const bll = useStore((s) => s.bll)
  const res = computeBlockII(
    ([1, 2, 3, 4] as AbiNr[]).map((nr) => ({
      abiNr: nr,
      name: '',
      isLK: courses.find((c) => c.abiNr === nr)?.type === 'LK',
      main: vals[nr],
    })),
    bll.enabled ? { points: bll.points ?? 10 } : null,
  )
  const total = blockI + res.points
  const grade = gradeFromPoints(total)

  return (
    <Card
      title="Was wäre, wenn …?"
      icon="sparkles"
      action={
        <button className="text-xs text-brand-600 hover:underline" onClick={() => setVals(initial)}>
          zurücksetzen
        </button>
      }
    >
      <div className="space-y-3">
        {([1, 2, 3, 4] as AbiNr[]).map((nr) => {
          const c = courses.find((x) => x.abiNr === nr)
          return (
            <div key={nr}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <SubjectDot color={c?.color ?? '#94a3b8'} /> {c?.name ?? `${nr}. Fach`}
                </span>
                <span className="tabular font-semibold">
                  {vals[nr]} P. <span className="text-xs font-normal text-slate-500">→ {examPoints(vals[nr], null, res.factor)}</span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={vals[nr]}
                onChange={(e) => setVals({ ...vals, [nr]: Number(e.target.value) })}
                className="w-full accent-brand-600"
                aria-label={`Prüfungspunkte ${c?.name ?? nr}`}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-end justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
        <div className="text-sm">
          {blockI} + {res.points} = <strong className="tabular">{total}</strong> Punkte
        </div>
        <div className="tabular text-2xl font-bold text-brand-600 dark:text-brand-300">{grade == null ? '–' : fmtGrade(grade)}</div>
      </div>
      {!res.passed && <p className="mt-2 text-xs text-rose-600">Mit diesen Werten wären die Bestehensregeln in Block II nicht erfüllt.</p>}
      <p className="mt-2 text-xs text-slate-500">
        Für eine Hochrechnung mit Kommazahlen und fehlenden Halbjahren nutze die <Link to="/simulation" className="text-brand-600 hover:underline">Abi-Simulation</Link>.
      </p>
    </Card>
  )
}
