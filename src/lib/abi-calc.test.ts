import { describe, expect, it } from 'vitest'
import {
  type CalcCourse,
  type QSemester,
  Q_SEMESTERS,
  computeBlockI,
  computeBlockII,
  examPoints,
  computedGrade,
  exactGradeValue,
  gradeFromPoints,
  parsePoints,
  pointsNeededForGrade,
  pointRangeForGrade,
  roundBy,
} from './abi-calc'

/** Hilfsfunktion: Fach mit Punkten pro Halbjahr (null = nicht belegt). */
function subject(
  name: string,
  pts: (number | null)[],
  opts: { lk?: boolean; mandatory?: boolean | boolean[] } = {},
): CalcCourse[] {
  const out: CalcCourse[] = []
  pts.forEach((p, i) => {
    if (p == null) return
    const sem = Q_SEMESTERS[i] as QSemester
    const mand = Array.isArray(opts.mandatory) ? opts.mandatory[i] : !!opts.mandatory
    out.push({ id: `${name}|${sem}`, courseId: name, name, semester: sem, points: p, isLK: !!opts.lk, mandatory: mand })
  })
  return out
}

describe('Block I – Beispiele aus dem Merkblatt des Schulministeriums NRW', () => {
  it('Beispiel 1: 35 Kurse → 265 Punkte, Optimierung auf 40 Kurse → 270 Punkte', () => {
    const courses = [
      ...subject('D', [6, 7, 6, 7], { lk: true }),
      ...subject('E', [5, 6, 6, 6], { lk: true }),
      ...subject('MU', [10, 10, 9, 9], { mandatory: [true, true, false, false] }),
      ...subject('GE', [6, 6, 6, 6], { mandatory: true }),
      ...subject('SW', [null, null, 5, 5], { mandatory: true }),
      ...subject('M', [5, 5, 5, 5], { mandatory: true }),
      ...subject('BI', [6, 7, 6, 6], { mandatory: true }),
      ...subject('CH', [7, 8, 7, 8]),
      ...subject('IF', [10, 9, 9, 8]),
      ...subject('PL', [4, 3, null, null], { mandatory: true }),
      ...subject('SP', [9, 9, 9, 9]),
    ]
    // Kontrollrechnung des Merkblatts mit genau 35 Kursen
    expect(roundBy((285 / 43) * 40, 'round')).toBe(265)
    const r = computeBlockI(courses, { complete: true })
    expect(r.count).toBe(40)
    expect(r.P).toBe(324)
    expect(r.S).toBe(48)
    expect(r.points).toBe(270)
    expect(r.deficits).toBe(2)
    expect(r.admitted).toBe(true)
  })

  it('Beispiel 3: 38 Kurse mit 8 Defiziten (3 im LK) → 243 Punkte, zugelassen', () => {
    const courses = [
      ...subject('D', [5, 7, 6, 7], { lk: true }),
      ...subject('M', [4, 5, 4, 4], { lk: true }),
      ...subject('E', [7, 7, 4, 5], { mandatory: true }),
      ...subject('S1', [6, 6, 4, 4], { mandatory: true }),
      ...subject('MU', [8, 7, null, null], { mandatory: true }),
      ...subject('GE', [6, 6, null, null], { mandatory: true }),
      ...subject('SW', [null, null, 5, 5], { mandatory: true }),
      ...subject('PA', [7, 7, 8, 8], { mandatory: true }),
      ...subject('BI', [7, 7, 4, 4], { mandatory: true }),
      ...subject('PL', [7, 7, 6, 7], { mandatory: true }),
      ...subject('SP', [9, 9, 9, 9], { mandatory: true }),
    ]
    const r = computeBlockI(courses, { complete: true })
    expect(r.count).toBe(38)
    expect(r.P).toBe(279)
    expect(r.S).toBe(46)
    expect(r.exact).toBeCloseTo(242.6, 1)
    expect(r.points).toBe(243)
    expect(r.deficits).toBe(8)
    expect(r.lkDeficits).toBe(3)
    expect(r.maxDeficits).toBe(8)
    expect(r.admitted).toBe(true)
  })

  it('Beispiel 2 (naturwiss. Schwerpunkt): 35 Kurse → 333 Punkte, keine weiteren Kurse über dem Schnitt', () => {
    const courses = [
      ...subject('D', [5, 5, 6, 6], { mandatory: true }),
      ...subject('E', [7, 9, 7, 8], { lk: true }),
      ...subject('L8', [5, 8, null, null]),
      ...subject('KU', [11, 12, 11, 12], { lk: true }),
      ...subject('EK', [10, 10, 10, 10], { mandatory: true }),
      ...subject('GE', [null, null, 5, 5], { mandatory: true }),
      ...subject('SW', [null, null, 6, 6], { mandatory: true }),
      ...subject('M', [5, 6, 5, 7], { mandatory: true }),
      ...subject('BI', [9, 9, 8, 9], { mandatory: true }),
      ...subject('CH', [8, 8, 9, 7], { mandatory: [false, false, true, true] }),
      ...subject('ER', [10, 10, null, null], { mandatory: true }),
      ...subject('SP', [9, 9, 8, 8]),
    ]
    expect(roundBy((358 / 43) * 40, 'round')).toBe(333)
    const r = computeBlockI(courses, { complete: true })
    expect(r.count).toBe(35)
    expect(r.P).toBe(358)
    expect(r.points).toBe(333)
    expect(r.admitted).toBe(true)
  })

  it('Beispiel 4 (mit Projektkurs): 35 Kurse → 393, mit 36 Kursen → 395 Punkte', () => {
    const courses: CalcCourse[] = [
      ...subject('D', [9, 9, 9, 9], { mandatory: true }),
      ...subject('E', [10, 10, 11, 11], { lk: true }),
      ...subject('KU', [11, 11, 11, 11], { mandatory: true }),
      ...subject('SW', [9, 9, 9, 9], { lk: true }),
      ...subject('GE', [null, null, 5, 5], { mandatory: true }),
      ...subject('M', [10, 11, 11, 10], { mandatory: true }),
      ...subject('BI', [8, 8, 8, 9], { mandatory: [false, false, true, true] }),
      ...subject('CH', [9, 9, 9, 10], { mandatory: true }),
      ...subject('KR', [9, 9, 9, 9], { mandatory: [true, true, false, false] }),
      ...subject('SP', [12, 13, 12, 12]),
      // Projektkurs Mathematik: nur beide Halbjahre gemeinsam anrechenbar
      ...subject('PK', [13, 13, null, null]).map((c) => ({ ...c, projectGroup: 'PK' })),
    ]
    expect(roundBy((423 / 43) * 40, 'round')).toBe(393)
    const r = computeBlockI(courses, { complete: true })
    expect(r.count).toBe(36)
    expect(r.P).toBe(435)
    expect(r.S).toBe(44)
    expect(r.points).toBe(395)
    expect(r.selected.filter((c) => c.courseId === 'PK')).toHaveLength(2)
  })

  it('Zulassung verlangt mindestens 30 belegte Grundkurse und 8 Leistungskurse', () => {
    const courses = [
      ...subject('LK1', [9, 9, 9, 9], { lk: true }),
      ...subject('LK2', [9, 9, 9, 9], { lk: true }),
      ...Array.from({ length: 7 }, (_, i) => subject(`G${i}`, [9, 9, 9, 9], { mandatory: i < 3 })).flat(),
    ] // 28 GK + 8 LK = 36 Kurse
    const r = computeBlockI(courses, { complete: true })
    expect(r.admitted).toBe(false)
    expect(r.issues.some((i) => i.text.includes('mindestens 30 GK und 8 LK'))).toBe(true)
  })

  it('ein freiwilliger 0-Punkte-Kurs wird auch bei „fest einbringen“ nicht angerechnet', () => {
    const courses = [
      ...subject('LK1', [9, 9, 9, 9], { lk: true }),
      ...subject('LK2', [9, 9, 9, 9], { lk: true }),
      ...Array.from({ length: 8 }, (_, i) => subject(`G${i}`, [9, 9, 9, 9])).flat(),
      ...subject('X', [0, null, null, null]),
    ]
    const r = computeBlockI(courses, { complete: true, include: new Set(['X|Q1.1']) })
    expect(r.selected.some((c) => c.id === 'X|Q1.1')).toBe(false)
    expect(r.admitted).toBe(true)
  })

  it('begründet für jeden Kurs, warum er zählt oder nicht', () => {
    const courses = [
      ...subject('D', [5, 5, 6, 6], { mandatory: true }),
      ...subject('E', [7, 9, 7, 8], { lk: true }),
      ...subject('L8', [5, 8, null, null]),
      ...subject('KU', [11, 12, 11, 12], { lk: true }),
      ...subject('EK', [10, 10, 10, 10], { mandatory: true }),
      ...subject('GE', [null, null, 5, 5], { mandatory: true }),
      ...subject('SW', [null, null, 6, 6], { mandatory: true }),
      ...subject('M', [5, 6, 5, 7], { mandatory: true }),
      ...subject('BI', [9, 9, 8, 9], { mandatory: true }),
      ...subject('CH', [8, 8, 9, 7], { mandatory: [false, false, true, true] }),
      ...subject('ER', [10, 10, null, null], { mandatory: true }),
      ...subject('SP', [9, 9, 8, 8]),
      ...subject('IF', [0, null, null, null]),
    ]
    const r = computeBlockI(courses, { complete: true, exclude: new Set(['CH|Q1.1']) })
    expect(r.reasons['E|Q1.1'].kind).toBe('lk')
    expect(r.reasons['D|Q1.1'].kind).toBe('pflicht')
    expect(r.reasons['SP|Q1.1']).toMatchObject({ included: true, kind: 'raises' })
    expect(r.reasons['L8|Q1.1']).toMatchObject({ included: false, kind: 'below' })
    expect(r.reasons['IF|Q1.1']).toMatchObject({ included: false, kind: 'zero' })
    expect(r.reasons['CH|Q1.1']).toMatchObject({ included: false, kind: 'excluded' })
    // jeder Kurs hat eine Begründung, und sie passt zur Auswahl
    const selected = new Set(r.selected.map((c) => c.id))
    for (const c of courses) expect(r.reasons[c.id].included, c.id).toBe(selected.has(c.id))
  })

  it('erklärt, wenn ein schwacher Kurs nur zum Auffüllen auf 35 Kurse zählt', () => {
    const courses = [
      ...subject('LK1', [12, 12, 12, 12], { lk: true }),
      ...subject('LK2', [12, 12, 12, 12], { lk: true }),
      ...Array.from({ length: 6 }, (_, i) => subject(`P${i}`, [12, 12, 12, 12], { mandatory: true })).flat(),
      ...subject('W', [6, 7, null, null]),
      ...subject('Z', [5, null, null, null]),
    ] // 8 LK + 24 Pflicht-GK = 32 → die 3 schwachen Kurse werden für die Mindestzahl 35 gebraucht
    const r = computeBlockI(courses, { complete: false })
    expect(r.count).toBe(35)
    expect(r.reasons['Z|Q1.1']).toMatchObject({ included: true, kind: 'filler' })
  })

  it('8 Defizite bei nur 37 Kursen sind nicht erlaubt', () => {
    const courses = [
      ...subject('D', [5, 7, 6, 7], { lk: true }),
      ...subject('M', [4, 5, 4, 4], { lk: true }),
      ...subject('E', [7, 7, 4, 5], { mandatory: true }),
      ...subject('S1', [6, 6, 4, 4], { mandatory: true }),
      ...subject('MU', [8, 7, null, null], { mandatory: true }),
      ...subject('GE', [6, 6, null, null], { mandatory: true }),
      ...subject('SW', [null, null, 5, 5], { mandatory: true }),
      ...subject('PA', [7, 7, 8, 8], { mandatory: true }),
      ...subject('BI', [7, 7, 4, 4], { mandatory: true }),
      ...subject('PL', [7, 7, 6, 7], { mandatory: true }),
      ...subject('SP', [9, 9, 9, null], { mandatory: true }),
    ]
    const r = computeBlockI(courses, { complete: true })
    expect(r.count).toBe(37)
    expect(r.maxDeficits).toBe(7)
    expect(r.admitted).toBe(false)
  })

  it('nimmt bei vielen Defiziten zusätzliche Kurse auf, um die 8er-Grenze zu erreichen', () => {
    // 35 Pflichtkurse mit 8 Defiziten, dazu 5 optionale 5-Punkte-Kurse
    const courses = [
      ...subject('LK1', [4, 4, 4, 9], { lk: true }),
      ...subject('LK2', [9, 9, 9, 9], { lk: true }),
      ...subject('A', [4, 4, 4, 4], { mandatory: true }),
      ...subject('B', [4, 9, 9, 9], { mandatory: true }),
      ...subject('C', [9, 9, 9, 9], { mandatory: true }),
      ...subject('Dx', [9, 9, 9, 9], { mandatory: true }),
      ...subject('Ex', [9, 9, 9, 9], { mandatory: true }),
      ...subject('Fx', [9, 9, 9, 9], { mandatory: true }),
      ...subject('Gx', [9, 9, 9, null], { mandatory: true }),
      ...subject('Hx', [5, 5, 5, 5]),
      ...subject('Ix', [5, null, null, null]),
    ]
    const r = computeBlockI(courses, { complete: true })
    expect(r.deficits).toBe(8)
    expect(r.count).toBeGreaterThanOrEqual(38)
    expect(r.admitted).toBe(true)
  })

  it('0 Punkte in einem Pflichtkurs verhindern die Zulassung', () => {
    const courses = [
      ...subject('LK1', [9, 9, 9, 9], { lk: true }),
      ...subject('LK2', [9, 9, 9, 9], { lk: true }),
      ...subject('A', [0, 9, 9, 9], { mandatory: true }),
      ...Array.from({ length: 7 }, (_, i) => subject(`F${i}`, [9, 9, 9, 9])).flat(),
    ]
    const r = computeBlockI(courses, { complete: true })
    expect(r.admitted).toBe(false)
    expect(r.issues.some((i) => i.text.includes('0 Punkte'))).toBe(true)
  })

  it('weniger als 35 Kurse → vorläufige Hochrechnung aus allen Kursen', () => {
    const courses = [
      ...subject('LK1', [12, 12, null, null], { lk: true }),
      ...subject('GK1', [9, 9, null, null]),
    ]
    const r = computeBlockI(courses)
    expect(r.provisional).toBe(true)
    // (12·2·2 + 9·2) / (4 + 2) · 40 = 66/6·40 = 440
    expect(r.points).toBe(440)
  })
})

describe('Block II', () => {
  it('wertet Prüfungen fünffach', () => {
    expect(examPoints(12)).toBe(60)
    expect(examPoints(0)).toBe(0)
  })
  it('mündliche Zusatzprüfung im Verhältnis 2:1 (Anlage 6)', () => {
    expect(examPoints(15, 15)).toBe(75)
    expect(examPoints(0, 15)).toBe(25)
    expect(examPoints(1, 15)).toBe(28)
    expect(examPoints(2, 15)).toBe(32)
    expect(examPoints(3, 15)).toBe(35)
    expect(examPoints(1, 0)).toBe(3)
  })
  it('mit besonderer Lernleistung zählt alles vierfach (Anlage 7)', () => {
    expect(examPoints(15, 15, 4)).toBe(60)
    expect(examPoints(0, 15, 4)).toBe(20)
    expect(examPoints(1, 15, 4)).toBe(23)
    expect(examPoints(2, 15, 4)).toBe(25)
    const r = computeBlockII(
      [
        { abiNr: 1, name: 'Geo', isLK: true, main: 5 },
        { abiNr: 2, name: 'Latein', isLK: true, main: 5 },
        { abiNr: 3, name: 'Mathe', isLK: false, main: 5 },
        { abiNr: 4, name: 'Bio', isLK: false, main: 5 },
      ],
      { points: 5 },
    )
    // Merkblatt: 2 LK × 20 + 2 GK × 20 + BLL 20 = 100
    expect(r.factor).toBe(4)
    expect(r.points).toBe(100)
    expect(r.passed).toBe(true)
    const max = computeBlockII(
      [1, 2, 3, 4].map((nr) => ({ abiNr: nr as 1 | 2 | 3 | 4, name: '', isLK: nr <= 2, main: 15 })),
      { points: 15 },
    )
    expect(max.points).toBe(300)
  })

  it('prüft die Bestehensregeln', () => {
    const ok = computeBlockII([
      { abiNr: 1, name: 'Geo', isLK: true, main: 5 },
      { abiNr: 2, name: 'Latein', isLK: true, main: 5 },
      { abiNr: 3, name: 'Mathe', isLK: false, main: 5 },
      { abiNr: 4, name: 'Bio', isLK: false, main: 5 },
    ])
    expect(ok.points).toBe(100)
    expect(ok.passed).toBe(true)

    const noLK = computeBlockII([
      { abiNr: 1, name: 'Geo', isLK: true, main: 4 },
      { abiNr: 2, name: 'Latein', isLK: true, main: 4 },
      { abiNr: 3, name: 'Mathe', isLK: false, main: 8 },
      { abiNr: 4, name: 'Bio', isLK: false, main: 8 },
    ])
    expect(noLK.points).toBe(120)
    expect(noLK.passed).toBe(false)
  })
})

describe('Durchschnittsnote', () => {
  it('entspricht der offiziellen Tabelle', () => {
    expect(gradeFromPoints(900)).toBe(1.0)
    expect(gradeFromPoints(823)).toBe(1.0)
    expect(gradeFromPoints(822)).toBe(1.1)
    expect(gradeFromPoints(805)).toBe(1.1)
    expect(gradeFromPoints(804)).toBe(1.2)
    expect(gradeFromPoints(751)).toBe(1.4)
    expect(gradeFromPoints(750)).toBe(1.5)
    expect(gradeFromPoints(733)).toBe(1.5)
    expect(gradeFromPoints(660)).toBe(2.0)
    expect(gradeFromPoints(301)).toBe(3.9)
    expect(gradeFromPoints(300)).toBe(4.0)
    expect(gradeFromPoints(299)).toBeNull()
  })
  it('Mindestpunkte pro Zielnote', () => {
    expect(pointsNeededForGrade(1.0)).toBe(823)
    expect(pointsNeededForGrade(1.5)).toBe(733)
    expect(pointsNeededForGrade(2.0)).toBe(643)
    expect(pointsNeededForGrade(4.0)).toBe(300)
    for (const g of [1.0, 1.3, 1.9, 2.4, 3.1]) {
      expect(gradeFromPoints(pointsNeededForGrade(g))).toBe(g)
      expect(gradeFromPoints(pointsNeededForGrade(g) - 1)).toBeCloseTo(g + 0.1, 5)
    }
  })
  it('exakter Notenwert passt zur offiziellen Note', () => {
    for (let p = 300; p <= 822; p++) {
      const official = gradeFromPoints(p)!
      expect(Math.floor(exactGradeValue(p) * 10 + 1e-9) / 10).toBeCloseTo(official, 5)
    }
    expect(exactGradeValue(669)).toBeCloseTo(1.95, 3)
  })
  it('rechnerischer Schnitt geht unter 1,0 – offizielle Note bleibt 1,0', () => {
    expect(computedGrade(900)).toBe(0.6)
    expect(exactGradeValue(900)).toBeCloseTo(0.667, 3)
    expect(computedGrade(895)).toBe(0.6)
    expect(computedGrade(894)).toBe(0.7)
    expect(computedGrade(859)).toBe(0.8)
    expect(computedGrade(841)).toBe(0.9)
    expect(computedGrade(840)).toBe(1.0)
    expect(computedGrade(823)).toBe(1.0)
    expect(computedGrade(822)).toBe(1.1)
    expect(computedGrade(299)).toBeNull()
    for (let p = 300; p <= 822; p++) expect(computedGrade(p)).toBe(gradeFromPoints(p))
    for (let p = 823; p <= 900; p++) expect(gradeFromPoints(p)).toBe(1.0)
    // Zielrechner auch für rechnerische Noten unter 1,0
    expect(pointsNeededForGrade(0.8)).toBe(859)
    expect(pointRangeForGrade(0.6)).toEqual([895, 900])
    expect(pointRangeForGrade(1.0)).toEqual([823, 840])
  })
})

describe('Eingabe', () => {
  it('erlaubt Kommazahlen mit bis zu 3 Nachkommastellen und 0', () => {
    expect(parsePoints('10,667')).toBe(10.667)
    expect(parsePoints('0')).toBe(0)
    expect(parsePoints('0,5')).toBe(0.5)
    expect(parsePoints('15')).toBe(15)
    expect(parsePoints('')).toBeNull()
    expect(parsePoints('16')).toBeNaN()
    expect(parsePoints('1,2345')).toBeNaN()
    expect(parsePoints('7,5', false)).toBeNaN()
  })
})
