import { describe, expect, it } from 'vitest'
import { type SimCourseInput, type SimInput, simulate, simulateAll } from './abi-simulation'
import { gradeFromPoints } from './abi-calc'

function course(
  id: string,
  pts: (number | null)[],
  opts: { lk?: boolean; abiNr?: 1 | 2 | 3 | 4 | null; mandatory?: boolean } = {},
): SimCourseInput {
  const sems = ['Q1.1', 'Q1.2', 'Q2.1', 'Q2.2'] as const
  return {
    id,
    name: id,
    isLK: !!opts.lk,
    abiNr: opts.abiNr ?? null,
    mandatory: Object.fromEntries(sems.map((s) => [s, !!opts.mandatory])),
    semesters: Object.fromEntries(sems.map((s, i) => [s, { points: pts[i] ?? null }])),
  }
}

function baseInput(): SimInput {
  return {
    courses: [
      course('Geo', [11, 12, null, null], { lk: true, abiNr: 1 }),
      course('Latein', [10, 9, null, null], { lk: true, abiNr: 2 }),
      course('Mathe', [8, 9, null, null], { abiNr: 3 }),
      course('Bio', [10, 11, null, null], { abiNr: 4 }),
      course('Deutsch', [9, 10, null, null], { mandatory: true }),
      course('Englisch', [11, 11, null, null]),
      course('Geschichte', [12, 13, null, null]),
      course('Physik', [7, 8, null, null]),
      course('Religion', [13, 14, null, null]),
      course('Sport', [14, 14, null, null]),
      course('Kunst', [12, 11, null, null]),
    ],
    exams: [],
    semesterOverrides: {},
    examOverrides: {},
  }
}

describe('Abi-Simulation', () => {
  it('füllt fehlende Halbjahre mit dem Fachschnitt auf', () => {
    const r = simulate(baseInput(), 'round')
    const mathe = r.cells.filter((c) => c.courseId === 'Mathe')
    expect(mathe).toHaveLength(4)
    expect(mathe[2].source).toBe('estimate')
    expect(mathe[2].value).toBeCloseTo(8.5, 5)
    expect(mathe[2].rounded).toBe(9)
    expect(r.blockI.count).toBeGreaterThanOrEqual(35)
  })

  it('akzeptiert Kommazahlen mit 3 Nachkommastellen und rundet je nach Einstellung', () => {
    const input = baseInput()
    input.semesterOverrides['Mathe|Q2.1'] = 10.667
    const floor = simulate(input, 'floor')
    const ceil = simulate(input, 'ceil')
    const round = simulate(input, 'round')
    const cell = (r: typeof floor) => r.cells.find((c) => c.key === 'Mathe|Q2.1')!
    expect(cell(floor).value).toBe(10.667)
    expect(cell(floor).source).toBe('override')
    expect(cell(floor).rounded).toBe(10)
    expect(cell(round).rounded).toBe(11)
    expect(cell(ceil).rounded).toBe(11)
  })

  it('schlechtester ≤ realistischer ≤ bester Fall', () => {
    const input = baseInput()
    input.semesterOverrides['Physik|Q2.1'] = 6.333
    input.examOverrides['1'] = 10.5
    input.examOverrides['3'] = 7.25
    const all = simulateAll(input)
    expect(all.floor.total).toBeLessThanOrEqual(all.round.total)
    expect(all.round.total).toBeLessThanOrEqual(all.ceil.total)
    expect(all.floor.grade!).toBeGreaterThanOrEqual(all.round.grade!)
    expect(all.round.grade!).toBeGreaterThanOrEqual(all.ceil.grade!)
  })

  it('exakter Wert liegt zwischen schlechtestem und bestem Fall und passt zur Note', () => {
    const input = baseInput()
    input.examOverrides['2'] = 9.333
    const all = simulateAll(input)
    const exact = all.round.exact.total
    expect(exact).toBeGreaterThanOrEqual(all.floor.total - 1)
    expect(exact).toBeLessThanOrEqual(all.ceil.total + 1)
    expect(all.round.exact.gradeValue).toBeGreaterThan(1)
    expect(all.round.exact.gradeValue).toBeLessThan(4)
    // offizielle Note gehört zur gerundeten Gesamtpunktzahl
    expect(all.round.grade).toBe(gradeFromPoints(all.round.total))
  })

  it('0 Punkte sind möglich und zählen als Defizit', () => {
    const input = baseInput()
    input.semesterOverrides['Physik|Q2.1'] = 0
    input.semesterOverrides['Physik|Q2.2'] = 0
    const r = simulate(input, 'round')
    const physik = r.cells.filter((c) => c.courseId === 'Physik' && c.semester.startsWith('Q2'))
    expect(physik.every((c) => c.rounded === 0)).toBe(true)
    // Physik ist kein Pflichtkurs → der Optimierer lässt die 0-Punkte-Kurse weg
    expect(r.blockI.selected.some((c) => c.id === 'Physik|Q2.1')).toBe(false)

    // Als Pflichtkurs führt 0 Punkte zum Ausschluss
    input.courses = input.courses.map((c) =>
      c.id === 'Physik' ? { ...c, mandatory: { 'Q1.1': true, 'Q1.2': true, 'Q2.1': true, 'Q2.2': true } } : c,
    )
    const r2 = simulate(input, 'round')
    expect(r2.passed).toBe(false)
    expect(r2.blockI.deficits).toBeGreaterThanOrEqual(2)
  })

  it('rechnet mit besonderer Lernleistung vierfach und schätzt sie, solange sie fehlt', () => {
    const input = baseInput()
    const ohne = simulate(input, 'round')
    input.bll = { points: null }
    input.examOverrides.bll = 12.5
    const mit = simulate(input, 'round')
    expect(mit.blockII.factor).toBe(4)
    expect(mit.bll?.source).toBe('override')
    expect(mit.bll?.rounded).toBe(13)
    expect(mit.blockII.bll?.points).toBe(52)
    expect(ohne.blockII.factor).toBe(5)
  })

  it('echte Prüfungsergebnisse haben Vorrang vor Schätzungen', () => {
    const input = baseInput()
    input.exams = [{ abiNr: 1, main: 13 }]
    input.examOverrides['1'] = 5
    const r = simulate(input, 'floor')
    expect(r.exams[0].source).toBe('real')
    expect(r.exams[0].rounded).toBe(13)
  })
})
