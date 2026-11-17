import type { SubjectId } from './types'

export interface SubjectMeta {
  id: SubjectId
  name: string
  short: string
  abiNr: 1 | 2 | 3 | 4
  type: 'LK' | 'GK'
  examKind: 'schriftlich' | 'mündlich'
  /** Tailwind-unabhängige Farbe (für Charts, Badges) */
  color: string
  defaultExamDate: string
  altExamDates?: string[]
  examInfo: string[]
}

/** Deine Abiturfächer 2027 (NRW). */
export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'geo',
    name: 'Geographie',
    short: 'EK',
    abiNr: 1,
    type: 'LK',
    examKind: 'schriftlich',
    color: 'var(--subj-geo)',
    defaultExamDate: '2027-04-13',
    altExamDates: ['2027-04-19'],
    examInfo: [
      'Schriftlich, 300 Minuten inkl. Auswahlzeit',
      '3 Aufgaben zur Auswahl (du bearbeitest eine)',
      'Hilfsmittel: Atlas, WTR, Rechtschreibwörterbuch',
      'Haupttermin Di 13.04. oder Mo 19.04.2027 – bei der Schule nachfragen',
      'Nachschreibtermin 12./13.05.2027',
    ],
  },
  {
    id: 'latein',
    name: 'Latein',
    short: 'L',
    abiNr: 2,
    type: 'LK',
    examKind: 'schriftlich',
    color: 'var(--subj-latein)',
    defaultExamDate: '2027-04-26',
    examInfo: [
      'Schriftlich, 300 Minuten inkl. Auswahlzeit',
      '2 Aufgaben zur Auswahl (Übersetzung + Interpretation)',
      'Hilfsmittel: zweisprachiges Wörterbuch, Rechtschreibwörterbuch',
      'Die Zeit beginnt, nachdem die Originaltexte einmal vorgelesen wurden',
      'Nachschreibtermin Fr 14.05.2027',
    ],
  },
  {
    id: 'mathe',
    name: 'Mathematik',
    short: 'M',
    abiNr: 3,
    type: 'GK',
    examKind: 'schriftlich',
    color: 'var(--subj-mathe)',
    defaultExamDate: '2027-05-05',
    examInfo: [
      'Schriftlich, 255 Minuten inkl. Auswahlzeit',
      'Teil 1 hilfsmittelfrei: 3 Pflichtaufgaben + 2 von 6 Wahlpflichtaufgaben',
      'Teil 2 (WTR): je 1 Aufgabe Analysis, Vektorielle Geometrie, Stochastik',
      'Hilfsmittel Teil 2: WTR, Formelsammlung (ländergemeinsam), Rechtschreibwörterbuch',
      'Nachschreibtermin Mo 24.05.2027',
    ],
  },
  {
    id: 'bio',
    name: 'Biologie',
    short: 'BI',
    abiNr: 4,
    type: 'GK',
    examKind: 'mündlich',
    color: 'var(--subj-bio)',
    defaultExamDate: '2027-05-10',
    examInfo: [
      'Mündliche Prüfung (4. Abiturfach) ab Mo 10.05.2027 – genauer Termin von der Schule',
      'Ablauf: Vorbereitungszeit (ca. 30 min) mit Material, dann ca. 20–30 min Prüfung',
      'Teil 1: zusammenhängender Vortrag zur Aufgabe, Teil 2: Prüfungsgespräch über größere Zusammenhänge',
      'Grundlage: alle Inhaltsfelder des Grundkurses',
    ],
  },
]

export const SUBJECT_BY_ID: Record<SubjectId, SubjectMeta> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<SubjectId, SubjectMeta>

export interface BuiltinEvent {
  id: string
  date: string
  title: string
  subjectId?: SubjectId
  kind: 'abi' | 'info'
}

/** Offizielle Termine Abitur 2027 (BASS 13-32 Nr. 6, Anlagen A/B). */
export function builtinEvents(examDates: Record<SubjectId, string>): BuiltinEvent[] {
  return [
    { id: 'b-vorb', date: '2027-04-05', title: 'Prüfungsvorbereitung (bis 09.04.)', kind: 'info' },
    { id: 'b-geo', date: examDates.geo, title: 'Abi Geographie LK (schriftlich)', subjectId: 'geo', kind: 'abi' },
    { id: 'b-latein', date: examDates.latein, title: 'Abi Latein LK (schriftlich)', subjectId: 'latein', kind: 'abi' },
    { id: 'b-mathe', date: examDates.mathe, title: 'Abi Mathematik GK (schriftlich)', subjectId: 'mathe', kind: 'abi' },
    { id: 'b-bio', date: examDates.bio, title: 'Abi Biologie – mündliche Prüfungen ab heute', subjectId: 'bio', kind: 'abi' },
    { id: 'b-nach-geo', date: '2027-05-12', title: 'Nachschreibtermin Geographie LK (12./13.05.)', subjectId: 'geo', kind: 'info' },
    { id: 'b-nach-latein', date: '2027-05-14', title: 'Nachschreibtermin Latein', subjectId: 'latein', kind: 'info' },
    { id: 'b-nach-mathe', date: '2027-05-24', title: 'Nachschreibtermin Mathematik', subjectId: 'mathe', kind: 'info' },
    { id: 'b-muendl-ende', date: '2027-07-02', title: 'Letzter Tag mündliche Abweichungs-/Bestehensprüfungen', kind: 'info' },
    { id: 'b-zeugnis', date: '2027-07-03', title: 'Zeugnisausgabe (spätestens)', kind: 'info' },
  ]
}

/** Vorlagen für weitere Kurse (Pflicht-Einbringung nach § 28 APO-GOSt als Vorschlag). */
export interface CourseTemplate {
  name: string
  short: string
  mandatory: [boolean, boolean, boolean, boolean]
  notTaken?: [boolean, boolean, boolean, boolean]
  hint?: string
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  { name: 'Deutsch', short: 'D', mandatory: [true, true, true, true], hint: 'Pflicht: alle 4 Kurse' },
  { name: 'Englisch', short: 'E', mandatory: [false, false, false, false] },
  { name: 'Französisch', short: 'F', mandatory: [false, false, false, false] },
  { name: 'Spanisch', short: 'S', mandatory: [false, false, false, false] },
  { name: 'Geschichte', short: 'GE', mandatory: [false, false, false, false] },
  {
    name: 'Geschichte (Zusatzkurs)',
    short: 'GE-ZK',
    mandatory: [false, false, true, true],
    notTaken: [true, true, false, false],
    hint: 'Zusatzkurs in Q2: beide Kurse Pflicht',
  },
  { name: 'Sozialwissenschaften', short: 'SW', mandatory: [false, false, false, false] },
  {
    name: 'Sozialwiss. (Zusatzkurs)',
    short: 'SW-ZK',
    mandatory: [false, false, true, true],
    notTaken: [true, true, false, false],
    hint: 'Zusatzkurs in Q2: beide Kurse Pflicht',
  },
  { name: 'Erziehungswissenschaft', short: 'PA', mandatory: [false, false, false, false] },
  { name: 'Philosophie', short: 'PL', mandatory: [true, true, false, false], hint: 'Religion/Philosophie: 2 Kurse Pflicht' },
  { name: 'Religion', short: 'R', mandatory: [true, true, false, false], hint: 'Religion/Philosophie: 2 Kurse Pflicht' },
  { name: 'Kunst', short: 'KU', mandatory: [true, true, false, false], hint: 'Kunst/Musik/Literatur: 2 Kurse Pflicht' },
  { name: 'Musik', short: 'MU', mandatory: [true, true, false, false], hint: 'Kunst/Musik/Literatur: 2 Kurse Pflicht' },
  {
    name: 'Literatur',
    short: 'LI',
    mandatory: [true, true, false, false],
    notTaken: [false, false, true, true],
    hint: 'Kunst/Musik/Literatur: 2 Kurse Pflicht',
  },
  { name: 'Physik', short: 'PH', mandatory: [false, false, false, false] },
  { name: 'Chemie', short: 'CH', mandatory: [false, false, false, false] },
  { name: 'Informatik', short: 'IF', mandatory: [false, false, false, false] },
  { name: 'Sport', short: 'SP', mandatory: [false, false, false, false] },
  {
    name: 'Projektkurs',
    short: 'PK',
    mandatory: [false, false, false, false],
    hint: 'Nur beide Halbjahre zusammen anrechenbar',
  },
]

export const COURSE_COLORS = [
  '#7c3aed',
  '#db2777',
  '#0891b2',
  '#65a30d',
  '#ca8a04',
  '#9333ea',
  '#e11d48',
  '#0284c7',
  '#16a34a',
  '#d97706',
  '#4f46e5',
  '#475569',
]
