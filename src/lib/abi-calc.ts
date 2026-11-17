/**
 * Berechnung der Gesamtqualifikation nach APO-GOSt NRW (gilt für den Abiturjahrgang 2027).
 *
 * Block I  (Qualifikationsphase): 35–40 Kurse, davon 8 LK-Kurse (doppelt gewichtet).
 *          E_I = (P : S) · 40, mathematisch gerundet, 200–600 Punkte.
 *          Defizite (< 5 Punkte): bei 35–37 Kursen max. 7, bei 38–40 Kursen max. 8,
 *          davon max. 3 im LK. Kein Pflichtkurs mit 0 Punkten.
 * Block II (Abiturprüfung): 4 Prüfungen, jeweils fünffach gewertet, 100–300 Punkte,
 *          mind. 2 Fächer mit ≥ 25 Punkten, darunter ein LK.
 *          Mündliche Zusatzprüfung im 1.–3. Fach: schriftlich : mündlich = 2 : 1.
 * Note:    N = 17/3 − P/180, auf eine Nachkommastelle abgeschnitten, 1,0 ab 823 Punkten.
 */

export const Q_SEMESTERS = ['Q1.1', 'Q1.2', 'Q2.1', 'Q2.2'] as const
export type QSemester = (typeof Q_SEMESTERS)[number]

export type RoundingMode = 'floor' | 'round' | 'ceil'

export const ROUNDING_LABELS: Record<RoundingMode, string> = {
  floor: 'Sicher (abrunden)',
  round: 'Mathematisch (wie offiziell)',
  ceil: 'Optimistisch (aufrunden)',
}

/** Rundet robust gegen Gleitkomma-Artefakte (z. B. 9.999999999 → 10). */
export function roundBy(x: number, mode: RoundingMode): number {
  const clean = Math.round(x * 1e9) / 1e9
  if (mode === 'floor') return Math.floor(clean)
  if (mode === 'ceil') return Math.ceil(clean)
  return Math.round(clean)
}

export function clampPoints(x: number): number {
  return Math.min(15, Math.max(0, x))
}

export interface CalcCourse {
  /** eindeutig pro Halbjahreskurs, z. B. "<kursId>|Q1.1" */
  id: string
  courseId: string
  name: string
  semester: QSemester
  points: number
  isLK: boolean
  /** muss eingebracht werden (Belegungsverpflichtung / Abiturfach) */
  mandatory: boolean
  /** Projektkurs: beide Halbjahre nur gemeinsam anrechenbar */
  projectGroup?: string
}

export interface Issue {
  level: 'error' | 'warning' | 'info'
  text: string
}

export interface BlockIOptions {
  /** Rundung von P/S·40 – offiziell 'round' */
  rounding?: RoundingMode
  /** Kurs-IDs, die zusätzlich eingebracht werden müssen */
  include?: Set<string>
  /** Kurs-IDs, die nicht eingebracht werden dürfen */
  exclude?: Set<string>
  /** true, wenn alle 4 Halbjahre vollständig (real oder geschätzt) vorliegen */
  complete?: boolean
}

export interface BlockIResult {
  selected: CalcCourse[]
  notSelected: CalcCourse[]
  /** gewichtete Punktsumme (LK doppelt) */
  P: number
  /** gewichtete Anzahl (LK doppelt) */
  S: number
  count: number
  countLK: number
  countGK: number
  /** P/S·40 ohne Rundung */
  exact: number
  /** gerundete Punktzahl Block I */
  points: number
  /** Durchschnitt pro Kurs (P/S) */
  average: number
  deficits: number
  lkDeficits: number
  maxDeficits: number
  provisional: boolean
  admitted: boolean
  issues: Issue[]
}

const isDeficit = (p: number) => p < 5

interface Unit {
  courses: CalcCourse[]
  avg: number
}

function evaluate(sel: CalcCourse[]) {
  let P = 0
  let S = 0
  let deficits = 0
  let lkDeficits = 0
  let countLK = 0
  for (const c of sel) {
    const w = c.isLK ? 2 : 1
    P += c.points * w
    S += w
    if (c.isLK) countLK++
    if (isDeficit(c.points)) {
      deficits++
      if (c.isLK) lkDeficits++
    }
  }
  return { P, S, deficits, lkDeficits, countLK, countGK: sel.length - countLK, avg: S ? P / S : 0 }
}

function maxDeficitsFor(count: number) {
  return count >= 38 ? 8 : 7
}

/** Wählt die anrechenbaren Kurse so, dass die Punktzahl in Block I maximal wird. */
export function computeBlockI(all: CalcCourse[], opts: BlockIOptions = {}): BlockIResult {
  const rounding = opts.rounding ?? 'round'
  const include = opts.include ?? new Set<string>()
  const exclude = opts.exclude ?? new Set<string>()
  const available = all.filter((c) => !exclude.has(c.id))
  const issues: Issue[] = []

  // Pflicht = Belegungsverpflichtung (inkl. LK) oder vom Nutzer fest eingebracht.
  // § 28 APO-GOSt: Mit 0 Punkten abgeschlossene Kurse gelten als nicht belegt → nicht anrechenbar,
  // deshalb kann ein freiwilliger 0-Punkte-Kurs auch nicht „fest eingebracht“ werden.
  const isDuty = (c: CalcCourse) => c.mandatory || c.isLK
  const isMand = (c: CalcCourse) => isDuty(c) || (include.has(c.id) && c.points > 0)
  const mandatory = available.filter(isMand)
  const optional = available.filter((c) => !isMand(c) && c.points > 0)

  // Optionale Kurse zu Einheiten bündeln (Projektkurs = 2 Halbjahre gemeinsam)
  const groups = new Map<string, CalcCourse[]>()
  const units: Unit[] = []
  for (const c of optional) {
    if (c.projectGroup) {
      const g = groups.get(c.projectGroup) ?? []
      g.push(c)
      groups.set(c.projectGroup, g)
    } else units.push({ courses: [c], avg: c.points })
  }
  for (const g of groups.values()) {
    if (g.length >= 2) units.push({ courses: g, avg: g.reduce((s, c) => s + c.points, 0) / g.length })
  }
  units.sort((a, b) => b.avg - a.avg)

  let selected: CalcCourse[]
  let provisional = false

  if (available.length < 35) {
    // Noch nicht genug Kurse: alles Vorhandene als Hochrechnung werten
    selected = [...mandatory, ...units.flatMap((u) => u.courses)]
    provisional = true
  } else {
    let best: { sel: CalcCourse[]; valid: boolean; avg: number } | null = null
    const minTotal = Math.max(35, mandatory.length)
    for (let target = minTotal; target <= Math.max(minTotal, 40); target++) {
      const sel = [...mandatory]
      for (const u of units) {
        if (sel.length >= target) break
        if (sel.length + u.courses.length > target) continue
        sel.push(...u.courses)
      }
      if (sel.length !== target && target !== minTotal) continue
      const ev = evaluate(sel)
      const valid =
        ev.deficits <= maxDeficitsFor(sel.length) &&
        ev.lkDeficits <= 3 &&
        ev.countGK >= 27 &&
        sel.length <= 40
      const better =
        !best ||
        (valid && !best.valid) ||
        (valid === best.valid && ev.avg > best.avg + 1e-12)
      if (better) best = { sel, valid, avg: ev.avg }
    }
    selected = best ? best.sel : [...mandatory]
  }

  const ev = evaluate(selected)
  const exact = ev.S ? (ev.P / ev.S) * 40 : 0
  const points = roundBy(exact, rounding)
  const maxDeficits = maxDeficitsFor(selected.length)
  const selectedIds = new Set(selected.map((c) => c.id))
  const notSelected = available.filter((c) => !selectedIds.has(c.id))

  // --- Regeln prüfen (Merkblatt MSB NRW, Stand August 2018) ---
  const zeroMandatory = mandatory.filter((c) => isDuty(c) && c.points === 0)
  for (const c of zeroMandatory) {
    issues.push({
      level: 'error',
      text: `${c.name} (${c.semester}) hat 0 Punkte – der Kurs gilt als nicht belegt, als Pflichtkurs fehlt er dann.`,
    })
  }
  if (ev.lkDeficits > 3) {
    issues.push({ level: 'error', text: `${ev.lkDeficits} Defizite im LK – erlaubt sind höchstens 3.` })
  }
  if (ev.deficits > maxDeficits) {
    issues.push({
      level: 'error',
      text: `${ev.deficits} Defizite bei ${selected.length} Kursen – erlaubt sind höchstens ${maxDeficits}.`,
    })
  } else if (ev.deficits >= maxDeficits - 1 && ev.deficits > 0) {
    issues.push({ level: 'warning', text: `${ev.deficits} von max. ${maxDeficits} Defiziten – wenig Puffer.` })
  }
  if (!provisional && points < 200) {
    issues.push({ level: 'error', text: `Block I: ${points} Punkte – mindestens 200 nötig.` })
  }
  if (provisional) {
    issues.push({
      level: 'info',
      text: `Erst ${available.length} Kurse eingetragen – Hochrechnung auf Basis des aktuellen Schnitts.`,
    })
  }
  // Zulassungsvoraussetzung: mindestens 38 anrechenbare Kurse belegt (30 GK + 8 LK).
  // Ausgeschlossene Kurse zählen als belegt, 0-Punkte-Kurse nicht.
  if (opts.complete && !provisional) {
    const belegt = all.filter((c) => c.points > 0)
    const lk = belegt.filter((c) => c.isLK).length
    const gk = belegt.length - lk
    if (lk < 8 || gk < 30) {
      issues.push({
        level: 'error',
        text: `Belegt sind ${gk} Grund- und ${lk} Leistungskurse – nötig sind mindestens 30 GK und 8 LK (38 anrechenbare Kurse).`,
      })
    }
  }

  const admitted = !issues.some((i) => i.level === 'error')

  return {
    selected,
    notSelected,
    P: ev.P,
    S: ev.S,
    count: selected.length,
    countLK: ev.countLK,
    countGK: ev.countGK,
    exact,
    points,
    average: ev.avg,
    deficits: ev.deficits,
    lkDeficits: ev.lkDeficits,
    maxDeficits,
    provisional,
    admitted,
    issues,
  }
}

// ---------------------------------------------------------------- Block II

export interface ExamCalcInput {
  abiNr: 1 | 2 | 3 | 4
  name: string
  isLK: boolean
  /** Prüfungsergebnis 0–15 (schriftlich bei 1–3, mündlich beim 4. Fach) */
  main: number | null
  /** mündliche Zusatzprüfung (nur 1.–3. Fach) */
  extraOral?: number | null
}

export interface ExamCalcResult {
  abiNr: 1 | 2 | 3 | 4
  name: string
  isLK: boolean
  /** gewertetes Ergebnis (fünffach, mit besonderer Lernleistung vierfach) */
  points: number
  exact: number
  missing: boolean
}

/**
 * Gewertetes Prüfungsergebnis: fünffach, mit besonderer Lernleistung vierfach.
 * Mit mündlicher Zusatzprüfung zählen schriftlich : mündlich = 2 : 1 (Anlage 6/7 APO-GOSt).
 */
export function examPoints(main: number, extraOral?: number | null, factor = 5): number {
  if (extraOral == null) return main * factor
  return roundBy(((2 * main + extraOral) * factor) / 3, 'round')
}

export function examPointsExact(main: number, extraOral?: number | null, factor = 5): number {
  if (extraOral == null) return main * factor
  return ((2 * main + extraOral) * factor) / 3
}

/** Besondere Lernleistung (z. B. Projektkurs oder Wettbewerbsarbeit) als 5. Komponente von Block II. */
export interface BllInput {
  /** Punkte 0–15 (einfach), null = noch offen */
  points: number | null
}

export interface BlockIIResult {
  exams: ExamCalcResult[]
  /** 5 ohne, 4 mit besonderer Lernleistung */
  factor: 4 | 5
  bll: { points: number; exact: number; missing: boolean } | null
  points: number
  exact: number
  complete: boolean
  passed: boolean
  issues: Issue[]
}

export function computeBlockII(exams: ExamCalcInput[], bll?: BllInput | null): BlockIIResult {
  const factor: 4 | 5 = bll ? 4 : 5
  const results: ExamCalcResult[] = exams.map((e) => ({
    abiNr: e.abiNr,
    name: e.name,
    isLK: e.isLK,
    points: e.main == null ? 0 : examPoints(e.main, e.extraOral, factor),
    exact: e.main == null ? 0 : examPointsExact(e.main, e.extraOral, factor),
    missing: e.main == null,
  }))
  const bllRes = bll
    ? { points: (bll.points ?? 0) * 4, exact: (bll.points ?? 0) * 4, missing: bll.points == null }
    : null
  const complete = results.every((r) => !r.missing) && !bllRes?.missing
  const points = results.reduce((s, r) => s + r.points, 0) + (bllRes?.points ?? 0)
  const exact = results.reduce((s, r) => s + r.exact, 0) + (bllRes?.exact ?? 0)
  const issues: Issue[] = []
  if (complete) {
    if (points < 100) issues.push({ level: 'error', text: `Block II: ${points} Punkte – mindestens 100 nötig.` })
    const min = 5 * factor
    const good = results.filter((r) => r.points >= min)
    if (good.length < 2 || !good.some((r) => r.isLK)) {
      issues.push({
        level: 'error',
        text: `In mindestens zwei Prüfungsfächern (darunter ein LK) sind je ${min} Punkte (= 5 Punkte einfach) nötig.`,
      })
    }
  } else {
    issues.push({ level: 'info', text: 'Noch nicht alle Prüfungsergebnisse eingetragen.' })
  }
  return {
    exams: results,
    factor,
    bll: bllRes,
    points,
    exact,
    complete,
    passed: complete && !issues.some((i) => i.level === 'error'),
    issues,
  }
}

// ---------------------------------------------------------------- Note

/** Offizielle Durchschnittsnote (Anlage zur APO-GOSt). null = unter 300 Punkte. */
export function gradeFromPoints(total: number): number | null {
  const p = Math.floor(total)
  if (p < 300) return null
  if (p >= 823) return 1.0
  return Math.floor((1020 - p) / 18) / 10
}

/** Exakter (ungekürzter) Notenwert 17/3 − P/180, nach oben auf 1,0 begrenzt. */
export function exactGradeValue(total: number): number {
  return Math.max(1, 17 / 3 - total / 180)
}

/** Mindestpunktzahl (gesamt) für eine Zielnote, z. B. 1.5 → 733. */
export function pointsNeededForGrade(grade: number): number {
  const n10 = Math.round(grade * 10)
  return Math.max(300, 1003 - 18 * n10)
}

/** Punktbereich einer Note, z. B. 1.5 → [733, 750]. */
export function pointRangeForGrade(grade: number): [number, number] {
  const n10 = Math.round(grade * 10)
  const min = pointsNeededForGrade(grade)
  const max = n10 <= 10 ? 900 : 1020 - 18 * n10
  return [min, max]
}

// ---------------------------------------------------------------- Formatierung

const fmtCache = new Map<number, Intl.NumberFormat>()
export function fmt(x: number, digits = 3): string {
  let f = fmtCache.get(digits)
  if (!f) {
    f = new Intl.NumberFormat('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits })
    fmtCache.set(digits, f)
  }
  return f.format(x)
}

/** Bis zu 3 Nachkommastellen, ohne überflüssige Nullen (10,5 statt 10,500). */
export function fmtNum(x: number): string {
  return fmt(x, 3).replace(/0+$/, '').replace(/,$/, '')
}

export function fmtGrade(g: number | null): string {
  return g == null ? '–' : fmt(g, 1)
}

/** Liest "10,667" oder "10.667" ein; erlaubt 0–15 mit max. 3 Nachkommastellen. */
export function parsePoints(input: string, allowDecimals = true): number | null {
  const t = input.trim().replace(',', '.')
  if (t === '') return null
  if (!/^\d{1,2}(\.\d{0,3})?$/.test(t)) return NaN
  const v = Number(t)
  if (!allowDecimals && !Number.isInteger(v)) return NaN
  if (v < 0 || v > 15) return NaN
  return v
}
