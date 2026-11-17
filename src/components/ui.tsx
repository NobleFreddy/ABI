import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon, type IconName } from './Icon'
import { fmtNum, parsePoints, type Issue } from '../lib/abi-calc'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// ------------------------------------------------------------------ Layout-Bausteine

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({
  title,
  icon,
  action,
  children,
  className,
  bodyClass,
}: {
  title?: ReactNode
  icon?: IconName
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClass?: string
}) {
  return (
    <section
      className={cx(
        'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h2 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {icon && <Icon name={icon} className="size-4 shrink-0 text-brand-500" />}
            <span className="truncate">{title}</span>
          </h2>
          {action}
        </header>
      )}
      <div className={cx('p-4', bodyClass)}>{children}</div>
    </section>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
}) {
  const v: Record<BtnVariant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  }
  const s = { sm: 'h-8 px-2.5 text-xs gap-1.5', md: 'h-9 px-3.5 text-sm gap-2', lg: 'h-11 px-5 text-base gap-2' }
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        v[variant],
        s[size],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className={size === 'sm' ? 'size-3.5' : 'size-4'} />}
      {children}
    </button>
  )
}

export function IconButton({
  icon,
  label,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cx(
        'inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} className="size-4" />
    </button>
  )
}

export function Badge({ children, tone = 'slate', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', TONES[tone], className)}>
      {children}
    </span>
  )
}

export type Tone = 'slate' | 'brand' | 'green' | 'amber' | 'red' | 'blue'
const TONES: Record<Tone, string> = {
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200',
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  blue: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
}

export function SubjectDot({ color, className = 'size-2.5' }: { color: string; className?: string }) {
  return <span className={cx('inline-block shrink-0 rounded-full', className)} style={{ background: color }} />
}

export function ProgressBar({ value, color, className, label }: { value: number; color?: string; className?: string; label?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      className={cx('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'good' | 'bad' }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div
        className={cx(
          'tabular mt-0.5 text-2xl font-bold tracking-tight',
          tone === 'good' && 'text-emerald-600 dark:text-emerald-400',
          tone === 'bad' && 'text-rose-600 dark:text-rose-400',
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</div>}
    </div>
  )
}

export function EmptyState({ icon = 'info', title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-slate-800">
        <Icon name={icon} className="size-6" />
      </div>
      <div className="font-medium">{title}</div>
      {children && <div className="max-w-md text-sm text-slate-500 dark:text-slate-400">{children}</div>}
    </div>
  )
}

// ------------------------------------------------------------------ Formular-Elemente

const inputBase =
  'h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900'

export function TextInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(inputBase, className)} {...rest} />
}

export function TextArea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(inputBase, 'h-auto min-h-20 py-2', className)} {...rest} />
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(inputBase, 'pr-8', className)} {...rest}>
      {children}
    </select>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span className="block">{children}</span>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

export function Checkbox({ checked, onChange, label, className }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode; className?: string }) {
  return (
    <label className={cx('inline-flex cursor-pointer items-center gap-2 text-sm', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-slate-300 accent-brand-600"
      />
      {label}
    </label>
  )
}

/**
 * Punkte-Eingabe 0–15. Kommazahlen mit bis zu 3 Nachkommastellen (wenn erlaubt).
 * Übernimmt den Wert beim Verlassen des Feldes oder mit Enter.
 */
export function PointsInput({
  value,
  onChange,
  allowDecimals = false,
  placeholder = '–',
  className,
  title,
  muted,
}: {
  value: number | null
  onChange: (v: number | null) => void
  allowDecimals?: boolean
  placeholder?: string
  className?: string
  title?: string
  muted?: boolean
}) {
  const show = (v: number | null) => (v == null ? '' : fmtNum(v))
  const [text, setText] = useState(show(value))
  const [invalid, setInvalid] = useState(false)
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setText(show(value))
  }, [value])

  const commit = () => {
    const parsed = parsePoints(text, allowDecimals)
    if (parsed === null) {
      setInvalid(false)
      if (value !== null) onChange(null)
      return
    }
    if (Number.isNaN(parsed)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    if (parsed !== value) onChange(parsed)
    setText(show(parsed))
  }

  return (
    <input
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      title={
        title ??
        (invalid
          ? allowDecimals
            ? '0 bis 15, höchstens 3 Nachkommastellen (z. B. 10,667)'
            : 'Ganze Punkte von 0 bis 15'
          : undefined)
      }
      aria-invalid={invalid}
      onFocus={() => (focused.current = true)}
      onBlur={() => {
        focused.current = false
        commit()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        if (e.key === 'Escape') {
          setText(show(value))
          setInvalid(false)
        }
      }}
      onChange={(e) => {
        setText(e.target.value)
        setInvalid(false)
      }}
      className={cx(
        'tabular h-9 w-16 rounded-lg border bg-white px-1 text-center text-sm font-semibold outline-none transition focus:ring-2 dark:bg-slate-900',
        invalid
          ? 'border-rose-500 text-rose-600 focus:ring-rose-500/20'
          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700',
        muted && !invalid && 'text-slate-500 italic',
        className,
      )}
    />
  )
}

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  className,
}: {
  value: T
  onChange: (v: T) => void
  tabs: { value: T; label: ReactNode }[]
  className?: string
}) {
  return (
    <div className={cx('inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800', className)} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={cx(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            value === t.value
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------ Dialog

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={cx(
          'flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl dark:bg-slate-900',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
          <h3 className="font-semibold">{title}</h3>
          <IconButton icon="x" label="Schließen" onClick={onClose} />
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Ampel / Hinweise

export function IssueList({ issues, okText }: { issues: Issue[]; okText?: string }) {
  if (issues.length === 0)
    return okText ? (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
        <Icon name="check" className="size-4" /> {okText}
      </div>
    ) : null
  return (
    <ul className="space-y-1.5">
      {issues.map((i, k) => (
        <li
          key={k}
          className={cx(
            'flex items-start gap-2 rounded-lg px-3 py-2 text-sm',
            i.level === 'error' && 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
            i.level === 'warning' && 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
            i.level === 'info' && 'bg-sky-50 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
          )}
        >
          <Icon name={i.level === 'info' ? 'info' : 'alert'} className="mt-0.5 size-4 shrink-0" />
          <span>{i.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function Callout({ tone = 'blue', icon = 'info', children }: { tone?: Tone; icon?: IconName; children: ReactNode }) {
  return (
    <div className={cx('flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm', TONES[tone])}>
      <Icon name={icon} className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/** Farbige Note/Punkte-Kachel */
export function pointsTone(p: number | null): string {
  if (p == null) return 'text-slate-400'
  if (p < 5) return 'text-rose-600 dark:text-rose-400'
  if (p < 7) return 'text-amber-600 dark:text-amber-400'
  if (p >= 13) return 'text-emerald-600 dark:text-emerald-400'
  return ''
}

/** Link, der wie ein Button aussieht (kein <button> im <a>). */
export function ButtonLink({
  to,
  icon,
  children,
  variant = 'secondary',
}: {
  to: string
  icon?: IconName
  children: ReactNode
  variant?: 'primary' | 'secondary'
}) {
  return (
    <Link
      to={to}
      className={cx(
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors',
        variant === 'primary'
          ? 'bg-brand-600 text-white hover:bg-brand-700'
          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
      )}
    >
      {icon && <Icon name={icon} className="size-3.5" />}
      {children}
    </Link>
  )
}
