/** Datums-Hilfen. Alle Kalendertage als lokales "YYYY-MM-DD". */

const pad = (n: number) => String(n).padStart(2, '0')

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO(): string {
  return toISO(new Date())
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

/** Ganze Kalendertage von a bis b (b − a). */
export function daysBetween(a: string, b: string): number {
  const ms = parseISO(b).getTime() - parseISO(a).getTime()
  return Math.round(ms / 86400000)
}

/** Montag der Woche, in der iso liegt. */
export function weekStart(iso: string): string {
  const d = parseISO(iso)
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  return toISO(d)
}

export function isoWeek(iso: string): number {
  const d = parseISO(iso)
  const target = new Date(d.valueOf())
  const dayNr = (d.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const diff = target.getTime() - firstThursday.getTime()
  return 1 + Math.round((diff / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7)
}

const dfLong = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
const dfShort = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' })
const dfDay = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
const dfMonth = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })

export const formatDate = (iso: string) => dfLong.format(parseISO(iso))
export const formatShort = (iso: string) => dfShort.format(parseISO(iso))
export const formatDay = (iso: string) => dfDay.format(parseISO(iso))
export const formatMonth = (iso: string) => dfMonth.format(parseISO(iso))

/** Anzahl aufeinanderfolgender Tage (bis heute oder gestern) mit Aktivität. */
export function streak(activeDays: Set<string>, today = todayISO()): number {
  let day = activeDays.has(today) ? today : addDays(today, -1)
  let n = 0
  while (activeDays.has(day)) {
    n++
    day = addDays(day, -1)
  }
  return n
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}
