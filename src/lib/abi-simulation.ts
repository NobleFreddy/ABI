/**
 * Abi-Simulation: rechnet aus den bisher eingetragenen Noten ein komplettes Abitur hoch.
 * Fehlende Halbjahre und Prüfungen werden geschätzt (oder von Hand überschrieben).
 * Kommazahlen (bis 3 Nachkommastellen) sind erlaubt; wo ganze Punkte nötig sind,
 * wird nach der gewählten Rundungsart gerundet.
 */
import {
  type CalcCourse,
  type QSemester,
  type RoundingMode,
  type BlockIResult,
  type BlockIIResult,
  type Issue,
  Q_SEMESTERS,
  clampPoints,
  computeBlockI,
  computeBlockII,
  computedGrade,
  exactGradeValue,
  gradeFromPoints,
  roundBy,
} from './abi-calc'

export type ValueSource = 'real' | 'prognose' | 'override' | 'estimate' | 'none'

export interface SimCourseInput {
  id: string
  name: string
  isLK: boolean
  abiNr: 1 | 2 | 3 | 4 | null
  mandatory: Partial<Record<QSemester, boolean>>
  projectGroup?: string
  /** eingetragene Halbjahresnoten (null = fehlt) */
  semesters: Partial<Record<QSemester, { points: number | null; isForecast?: boolean }>>
  /** in diesem Halbjahr nicht belegt */
  notTaken?: Partial<Record<QSemester, boolean>>
}

export interface SimExamInput {
  abiNr: 1 | 2 | 3 | 4
  /** echtes Prüfungsergebnis, falls schon bekannt */
  main: number | null
  extraOral?: number | null
}

export interface SimInput {
  courses: SimCourseInput[]
  exams: SimExamInput[]
  /** Überschreibungen "<kursId>|<Halbjahr>" → Punkte (Kommazahl erlaubt) */
  semesterOverrides: Record<string, number>
  /** Überschreibungen "<abiNr>" bzw. "bll" → Punkte (Kommazahl erlaubt) */
  examOverrides: Record<string, number>
  include?: Set<string>
  exclude?: Set<string>
  /** Besondere Lernleistung (wenn eingebracht): echtes Ergebnis oder null */
  bll?: { points: number | null } | null
}

export interface SimBll {
  value: number
  rounded: number
  source: ValueSource
}

export interface SimCell {
  key: string
  courseId: string
  semester: QSemester
  value: number
  rounded: number
  source: ValueSource
}

export interface SimExam {
  abiNr: 1 | 2 | 3 | 4
  name: string
  isLK: boolean
  value: number
  rounded: number
  source: ValueSource
  extraOral: number | null
}

export interface SimResult {
  mode: RoundingMode
  cells: SimCell[]
  exams: SimExam[]
  bll: SimBll | null
  blockI: BlockIResult
  blockII: BlockIIResult
  total: number
  grade: number | null
  /** rechnerischer Schnitt ohne Begrenzung auf 1,0 */
  computed: number | null
  passed: boolean
  exact: {
    blockI: number
    blockII: number
    total: number
    gradeValue: number
  }
  issues: Issue[]
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null)

/** Schätzwerte für fehlende Halbjahre: Fachschnitt, sonst Gesamtschnitt, sonst 10 Punkte. */
export function buildCells(input: SimInput, mode: RoundingMode): SimCell[] {
  const known: number[] = []
  for (const c of input.courses)
    for (const s of Q_SEMESTERS) {
      const p = c.semesters[s]?.points
      if (p != null && !c.notTaken?.[s]) known.push(p)
    }
  const globalAvg = avg(known) ?? 10

  const cells: SimCell[] = []
  for (const c of input.courses) {
    const own = Q_SEMESTERS.filter((s) => !c.notTaken?.[s])
      .map((s) => c.semesters[s]?.points)
      .filter((p): p is number => p != null)
    const courseAvg = avg(own) ?? globalAvg
    for (const s of Q_SEMESTERS) {
      if (c.notTaken?.[s]) continue
      const key = `${c.id}|${s}`
      const entry = c.semesters[s]
      let value: number
      let source: ValueSource
      if (entry?.points != null) {
        value = entry.points
        source = entry.isForecast ? 'prognose' : 'real'
      } else if (input.semesterOverrides[key] != null) {
        value = input.semesterOverrides[key]
        source = 'override'
      } else {
        value = courseAvg
        source = 'estimate'
      }
      value = clampPoints(value)
      cells.push({ key, courseId: c.id, semester: s, value, rounded: clampPoints(roundBy(value, mode)), source })
    }
  }
  return cells
}

function toCalcCourses(input: SimInput, cells: SimCell[], useExact: boolean): CalcCourse[] {
  const byId = new Map(input.courses.map((c) => [c.id, c]))
  return cells.map((cell) => {
    const c = byId.get(cell.courseId)!
    return {
      id: cell.key,
      courseId: c.id,
      name: c.name,
      semester: cell.semester,
      points: useExact ? cell.value : cell.rounded,
      isLK: c.isLK,
      mandatory: c.abiNr != null || !!c.mandatory[cell.semester],
      projectGroup: c.projectGroup,
    }
  })
}

export function simulate(input: SimInput, mode: RoundingMode): SimResult {
  const cells = buildCells(input, mode)
  const complete = true // Simulation füllt alle Halbjahre auf

  const blockI = computeBlockI(toCalcCourses(input, cells, false), {
    rounding: mode,
    include: input.include,
    exclude: input.exclude,
    complete,
  })
  const blockIExact = computeBlockI(toCalcCourses(input, cells, true), {
    rounding: 'round',
    include: input.include,
    exclude: input.exclude,
    complete,
  })

  // Prüfungen
  const exams: SimExam[] = []
  for (const nr of [1, 2, 3, 4] as const) {
    const course = input.courses.find((c) => c.abiNr === nr)
    const real = input.exams.find((e) => e.abiNr === nr)
    const name = course?.name ?? `${nr}. Abiturfach`
    const isLK = course?.isLK ?? nr <= 2
    let value: number
    let source: ValueSource
    if (real?.main != null) {
      value = real.main
      source = 'real'
    } else if (input.examOverrides[String(nr)] != null) {
      value = input.examOverrides[String(nr)]
      source = 'override'
    } else {
      const own = cells.filter((c) => c.courseId === course?.id).map((c) => c.value)
      value = avg(own) ?? 10
      source = 'estimate'
    }
    value = clampPoints(value)
    exams.push({
      abiNr: nr,
      name,
      isLK,
      value,
      rounded: clampPoints(roundBy(value, mode)),
      source,
      extraOral: real?.extraOral ?? null,
    })
  }

  // Besondere Lernleistung (optional): echtes Ergebnis → eigener Wert → Schnitt aller Q-Phasen-Noten
  let bll: SimBll | null = null
  if (input.bll) {
    let value: number
    let source: ValueSource
    if (input.bll.points != null) {
      value = input.bll.points
      source = 'real'
    } else if (input.examOverrides.bll != null) {
      value = input.examOverrides.bll
      source = 'override'
    } else {
      value = avg(cells.map((c) => c.value)) ?? 10
      source = 'estimate'
    }
    value = clampPoints(value)
    bll = { value, rounded: clampPoints(roundBy(value, mode)), source }
  }

  const blockII = computeBlockII(
    exams.map((e) => ({ abiNr: e.abiNr, name: e.name, isLK: e.isLK, main: e.rounded, extraOral: e.extraOral })),
    bll ? { points: bll.rounded } : null,
  )
  const blockIIExact = computeBlockII(
    exams.map((e) => ({ abiNr: e.abiNr, name: e.name, isLK: e.isLK, main: e.value, extraOral: e.extraOral })),
    bll ? { points: bll.value } : null,
  )

  const total = blockI.points + blockII.points
  const grade = gradeFromPoints(total)
  const exactTotal = blockIExact.exact + blockIIExact.exact
  const issues = [...blockI.issues.filter((i) => i.level !== 'info'), ...blockII.issues.filter((i) => i.level !== 'info')]
  if (total < 300) issues.push({ level: 'error', text: `Gesamt ${total} Punkte – mindestens 300 nötig.` })

  return {
    mode,
    cells,
    exams,
    bll,
    blockI,
    blockII,
    total,
    grade,
    computed: computedGrade(total),
    passed: blockI.admitted && blockII.passed && grade != null,
    exact: {
      blockI: blockIExact.exact,
      blockII: blockIIExact.exact,
      total: exactTotal,
      gradeValue: exactGradeValue(exactTotal),
    },
    issues,
  }
}

export function simulateAll(input: SimInput): Record<RoundingMode, SimResult> {
  return {
    floor: simulate(input, 'floor'),
    round: simulate(input, 'round'),
    ceil: simulate(input, 'ceil'),
  }
}
