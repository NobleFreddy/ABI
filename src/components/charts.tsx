import { useMemo, useState } from 'react'
import { formatDay, formatMinutes, formatShort, parseISO } from '../lib/dates'
import { cx } from './ui'

export interface Series {
  key: string
  label: string
  color: string
}

export interface DayValues {
  date: string
  values: Record<string, number>
}

function niceStep(max: number) {
  for (const s of [15, 30, 60, 90, 120, 180, 240, 360, 480]) if (max / s <= 4) return s
  return 600
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`
}

export function Legend({ series }: { series: Series[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
      {series.map((s) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  )
}

/** Gestapelte Säulen: Lernminuten pro Tag, nach Fach. */
export function StackedDays({ data, series, height = 190 }: { data: DayValues[]; series: Series[]; height?: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 640
  const padL = 40
  const padR = 8
  const padT = 10
  const padB = 24
  const innerW = W - padL - padR
  const innerH = height - padT - padB
  const totals = data.map((d) => series.reduce((s, x) => s + (d.values[x.key] ?? 0), 0))
  const maxRaw = Math.max(30, ...totals)
  const step = niceStep(maxRaw)
  const max = Math.ceil(maxRaw / step) * step
  const band = innerW / data.length
  const bw = Math.min(24, band * 0.62)
  const y = (v: number) => padT + innerH - (v / max) * innerH
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step)
  const labelEvery = data.length > 21 ? 7 : data.length > 10 ? 2 : 1

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full" role="img" aria-label="Lernzeit pro Tag nach Fach">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={padL - 6} y={y(t) + 3.5} textAnchor="end" className="fill-slate-400 text-[10px]">
              {t === 0 ? '0' : t < 60 ? `${t} min` : `${(t / 60).toLocaleString('de-DE')} h`}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * band + (band - bw) / 2
          let cum = 0
          const segs = series
            .map((s) => ({ s, v: d.values[s.key] ?? 0 }))
            .filter((x) => x.v > 0)
          return (
            <g key={d.date} opacity={hover == null || hover === i ? 1 : 0.45}>
              {segs.map(({ s, v }, k) => {
                const top = y(cum + v)
                const bottom = y(cum)
                cum += v
                let h = bottom - top
                if (k > 0) h -= 2 // 2px Abstand in Flächenfarbe zum Segment darunter
                if (h <= 0.5) return null
                const isTop = k === segs.length - 1
                return isTop ? (
                  <path key={s.key} d={roundedTop(x, top, bw, h, 4)} fill={s.color} />
                ) : (
                  <rect key={s.key} x={x} y={top} width={bw} height={h} fill={s.color} />
                )
              })}
              {i % labelEvery === 0 && (
                <text x={x + bw / 2} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[10px]">
                  {formatShort(d.date)}
                </text>
              )}
              <rect
                x={padL + i * band}
                y={padT}
                width={band}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${formatDay(d.date)}: ${formatMinutes(totals[i])}`}
              />
            </g>
          )
        })}
      </svg>
      {hover != null && (
        <div
          className="pointer-events-none absolute top-0 z-10 min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900"
          style={{
            left: `${((padL + hover * band + band / 2) / W) * 100}%`,
            transform: hover > data.length / 2 ? 'translateX(-105%)' : 'translateX(5%)',
          }}
        >
          <div className="mb-1 font-semibold">{formatDay(data[hover].date)}</div>
          {series
            .filter((s) => (data[hover].values[s.key] ?? 0) > 0)
            .map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <span className="size-2 rounded-sm" style={{ background: s.color }} />
                <span className="flex-1">{s.label}</span>
                <span className="tabular">{formatMinutes(data[hover].values[s.key])}</span>
              </div>
            ))}
          <div className="mt-1 border-t border-slate-100 pt-1 font-semibold dark:border-slate-800">
            Gesamt {formatMinutes(totals[hover])}
          </div>
        </div>
      )}
    </div>
  )
}

/** Tabellenansicht als Alternative zum Diagramm. */
export function DaysTable({ data, series }: { data: DayValues[]; series: Series[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500">
            <th className="py-1 text-left font-medium">Tag</th>
            {series.map((s) => (
              <th key={s.key} className="py-1 text-right font-medium">
                {s.label}
              </th>
            ))}
            <th className="py-1 text-right font-medium">Gesamt</th>
          </tr>
        </thead>
        <tbody className="tabular">
          {data.map((d) => {
            const total = series.reduce((s, x) => s + (d.values[x.key] ?? 0), 0)
            return (
              <tr key={d.date} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-1">{formatDay(d.date)}</td>
                {series.map((s) => (
                  <td key={s.key} className="py-1 text-right">
                    {d.values[s.key] ? Math.round(d.values[s.key]) : '–'}
                  </td>
                ))}
                <td className="py-1 text-right font-semibold">{total ? formatMinutes(total) : '–'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/** Horizontale Balken mit Wert am Ende. */
export function BarList({ items }: { items: { key: string; label: string; color: string; value: number; display: string }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.key} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 truncate">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ background: i.color }} />
            {i.label}
          </span>
          <span className="h-2.5 overflow-hidden rounded-r bg-transparent">
            <span
              className="block h-full rounded-r"
              style={{ width: `${(i.value / max) * 100}%`, background: i.color, minWidth: i.value > 0 ? 3 : 0 }}
            />
          </span>
          <span className="tabular text-right text-xs text-slate-600 dark:text-slate-300">{i.display}</span>
        </li>
      ))}
    </ul>
  )
}

/** Kalender-Heatmap (Wochen × Wochentage), eine Farbe hell → dunkel. */
export function Heatmap({ values, weeks = 18, endDate }: { values: Map<string, number>; weeks?: number; endDate: string }) {
  const cells = useMemo(() => {
    const end = parseISO(endDate)
    const dayIdx = (end.getDay() + 6) % 7
    const start = new Date(end)
    start.setDate(end.getDate() - dayIdx - (weeks - 1) * 7)
    const out: { date: string; v: number; col: number; row: number; future: boolean }[] = []
    for (let w = 0; w < weeks; w++)
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start)
        dt.setDate(start.getDate() + w * 7 + d)
        const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
        out.push({ date: iso, v: values.get(iso) ?? 0, col: w, row: d, future: dt > end })
      }
    return out
  }, [values, weeks, endDate])

  const level = (v: number) => (v <= 0 ? 0 : v < 30 ? 1 : v < 60 ? 2 : v < 120 ? 3 : 4)
  const fills = ['var(--chart-empty)', 'var(--seq-1)', 'var(--seq-2)', 'var(--seq-3)', 'var(--seq-4)']
  const size = 13
  const gap = 3
  const W = weeks * (size + gap) + 22
  const H = 7 * (size + gap)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-xl" role="img" aria-label="Lernaktivität der letzten Wochen">
        {['Mo', '', 'Mi', '', 'Fr', '', 'So'].map((l, i) => (
          <text key={i} x={0} y={i * (size + gap) + size - 3} className="fill-slate-400 text-[8px]">
            {l}
          </text>
        ))}
        {cells.map((c) =>
          c.future ? null : (
            <rect
              key={c.date}
              x={22 + c.col * (size + gap)}
              y={c.row * (size + gap)}
              width={size}
              height={size}
              rx={2.5}
              fill={fills[level(c.v)]}
            >
              <title>{`${formatDay(c.date)}: ${c.v ? formatMinutes(c.v) : 'keine Lernzeit'}`}</title>
            </rect>
          ),
        )}
      </svg>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
        weniger
        {fills.map((f, i) => (
          <span key={i} className={cx('size-3 rounded-[3px]')} style={{ background: f }} />
        ))}
        mehr <span className="ml-2">(&lt; 30 min · &lt; 1 h · &lt; 2 h · ab 2 h)</span>
      </div>
    </div>
  )
}
