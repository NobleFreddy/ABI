import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Icon, type IconName } from './Icon'
import { cx } from './ui'
import { useStore } from '../store/store'
import { useBackup, daysSinceBackup, downloadBackup, reconnectBackupFile } from '../lib/backup'
import { daysBetween, formatClock, todayISO } from '../lib/dates'
import { TimerController, useTimerDisplay } from './TimerController'
import { SUBJECT_BY_ID } from '../content/subjects'

const NAV: { group: string; items: { to: string; label: string; icon: IconName }[] }[] = [
  { group: '', items: [{ to: '/', label: 'Start', icon: 'home' }] },
  {
    group: 'Noten & Abi',
    items: [
      { to: '/noten', label: 'Noten & Kurse', icon: 'grades' },
      { to: '/rechner', label: 'Abi-Rechner', icon: 'calculator' },
      { to: '/simulation', label: 'Abi-Simulation', icon: 'sparkles' },
    ],
  },
  {
    group: 'Lernen',
    items: [
      { to: '/lernplan', label: 'Lernplan & Themen', icon: 'map' },
      { to: '/karteikarten', label: 'Karteikarten', icon: 'cards' },
      { to: '/quiz', label: 'Quiz', icon: 'quiz' },
      { to: '/timer', label: 'Lern-Timer', icon: 'timer' },
    ],
  },
  {
    group: 'Organisation',
    items: [
      { to: '/kalender', label: 'Kalender & To-dos', icon: 'calendar' },
      { to: '/einstellungen', label: 'Einstellungen & Backup', icon: 'settings' },
    ],
  },
]

function useApplyTheme() {
  const theme = useStore((s) => s.settings.theme)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}

function Countdown() {
  const dates = useStore((s) => s.settings.examDates)
  const today = todayISO()
  const next = Object.entries(dates)
    .map(([id, d]) => ({ id, d, days: daysBetween(today, d) }))
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days)[0]
  if (!next) return null
  const subj = SUBJECT_BY_ID[next.id as keyof typeof SUBJECT_BY_ID]
  return (
    <div className="rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 p-3 text-white shadow-sm">
      <div className="text-xs opacity-80">Nächste Abiprüfung</div>
      <div className="tabular text-2xl font-bold">{next.days === 0 ? 'Heute!' : `${next.days} Tage`}</div>
      <div className="truncate text-xs opacity-90">{subj?.name}</div>
    </div>
  )
}

function TimerPill() {
  const { running, label, remainingSec } = useTimerDisplay()
  if (!running) return null
  return (
    <NavLink
      to="/timer"
      className="tabular flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    >
      <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
      {label} · {formatClock(remainingSec)}
    </NavLink>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-center gap-2 px-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Icon name="target" className="size-5" />
        </div>
        <div>
          <div className="font-bold leading-tight">Abi-Cockpit</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">NRW · Abitur 2027</div>
        </div>
      </div>
      <Countdown />
      <TimerPill />
      <div className="flex flex-col gap-4">
        {NAV.map((g) => (
          <div key={g.group || 'main'}>
            {g.group && (
              <div className="mb-1 px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{g.group}</div>
            )}
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    end={it.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cx(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                      )
                    }
                  >
                    <Icon name={it.icon} className="size-4.5" />
                    {it.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <BackupMini />
    </nav>
  )
}

function BackupMini() {
  const status = useBackup((s) => s.status)
  const last = useStore((s) => s.meta.lastBackupAt)
  const days = daysSinceBackup(last)
  const ok = status === 'active'
  return (
    <NavLink
      to="/einstellungen"
      className="mt-auto flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
    >
      <Icon name="shield" className={cx('size-4', ok ? 'text-emerald-500' : 'text-amber-500')} />
      <span>
        Gespeichert ✓
        <br />
        {ok ? 'Auto-Backup aktiv' : days == null ? 'Noch kein Backup' : `Backup vor ${days} Tag${days === 1 ? '' : 'en'}`}
      </span>
    </NavLink>
  )
}

function BackupBanner() {
  const status = useBackup((s) => s.status)
  const last = useStore((s) => s.meta.lastBackupAt)
  const created = useStore((s) => s.meta.createdAt)
  const [hidden, setHidden] = useState(false)
  const days = daysSinceBackup(last)
  const ageDays = Math.floor((Date.now() - new Date(created).getTime()) / 86400000)

  if (hidden) return null
  if (status === 'needs-permission') {
    return (
      <Banner onClose={() => setHidden(true)}>
        Das Auto-Backup braucht nach dem Neustart deine Erlaubnis.
        <button className="ml-2 font-semibold underline" onClick={() => reconnectBackupFile()}>
          Backup wieder verbinden
        </button>
      </Banner>
    )
  }
  if (status === 'active') return null
  if ((days == null && ageDays >= 2) || (days != null && days > 7)) {
    return (
      <Banner onClose={() => setHidden(true)}>
        {days == null ? 'Du hast noch kein Backup gemacht.' : `Dein letztes Backup ist ${days} Tage her.`}
        <button className="ml-2 font-semibold underline" onClick={() => downloadBackup()}>
          Jetzt sichern
        </button>
        <NavLink to="/einstellungen" className="ml-2 underline">
          Auto-Backup einrichten
        </NavLink>
      </Banner>
    )
  }
  return null
}

function Banner({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
      <Icon name="shield" className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      <button onClick={onClose} aria-label="Hinweis schließen" className="opacity-60 hover:opacity-100">
        <Icon name="x" className="size-4" />
      </button>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  useApplyTheme()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [loc.pathname])

  return (
    <div className="min-h-dvh lg:flex">
      <TimerController />
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        <Sidebar />
      </aside>

      {/* Mobile Kopfzeile */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Menü öffnen"
        >
          <Icon name="menu" />
        </button>
        <div className="font-bold">Abi-Cockpit</div>
        <div className="ml-auto">
          <TimerPill />
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-slate-950/50" />
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <BackupBanner />
        {children}
      </main>
    </div>
  )
}
