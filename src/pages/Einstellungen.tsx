import { useRef, useState } from 'react'
import { ROUNDING_LABELS, type RoundingMode } from '../lib/abi-calc'
import {
  backupNow,
  connectBackupFile,
  disconnectBackupFile,
  downloadBackup,
  fileBackupSupported,
  importBackupFile,
  reconnectBackupFile,
  useBackup,
} from '../lib/backup'
import { formatDate } from '../lib/dates'
import { SUBJECTS } from '../content/subjects'
import { useStore } from '../store/store'
import { Badge, Button, Callout, Card, Field, PageHeader, Select, SubjectDot, TextInput } from '../components/ui'
import { Icon } from '../components/Icon'

export function Einstellungen() {
  return (
    <div>
      <PageHeader title="Einstellungen & Backup" subtitle="Abi-Termine, Lerneinstellungen und die Sicherung deiner Daten." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <BackupCard />
          <DangerCard />
        </div>
        <div className="space-y-6">
          <AbiCard />
          <GeneralCard />
        </div>
      </div>
    </div>
  )
}

function BackupCard() {
  const { status, fileName, lastWrite, error, persisted } = useBackup()
  const lastBackupAt = useStore((s) => s.meta.lastBackupAt)
  const inputRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, setPending] = useState<File | null>(null)

  return (
    <Card title="Datensicherung" icon="shield">
      <Callout tone="green" icon="check">
        <strong>Deine Daten sind sicher gespeichert.</strong> Jede Änderung wird sofort im Browser gespeichert – auch wenn du
        die Seite oder den Browser schließt, ist beim nächsten Öffnen alles wieder da.
        {persisted && ' Der Browser hat dauerhaften Speicher zugesagt.'}
      </Callout>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Verloren gehen könnten die Daten nur, wenn du die Browserdaten (Cookies/Websitedaten) löschst oder die App unter
        einer anderen Adresse öffnest. Starte sie deshalb immer über <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">ABI-starten.bat</code>{' '}
        (Adresse <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">localhost:5180</code>) – und mach zusätzlich ein Backup:
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-2 font-semibold">
          <Icon name="folder" className="size-4 text-brand-500" /> Automatisches Backup in eine Datei
          {status === 'active' && <Badge tone="green">aktiv</Badge>}
          {status === 'needs-permission' && <Badge tone="amber">Erlaubnis nötig</Badge>}
          {status === 'error' && <Badge tone="red">Fehler</Badge>}
        </div>
        {!fileBackupSupported() ? (
          <p className="mt-2 text-sm text-slate-500">
            Dein Browser unterstützt das nicht. In Chrome oder Edge funktioniert es – sonst nutze den Export unten.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-500">
              Wähle einmal eine Datei (z. B. in deinem OneDrive- oder Dokumente-Ordner). Danach speichert die App jede
              Änderung automatisch auch dorthin.
            </p>
            {fileName && (
              <p className="mt-2 text-sm">
                Datei: <strong>{fileName}</strong>
                {lastWrite && <span className="text-slate-500"> · zuletzt geschrieben {new Date(lastWrite).toLocaleTimeString('de-DE')}</span>}
              </p>
            )}
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {status === 'needs-permission' ? (
                <Button variant="primary" icon="link" onClick={() => reconnectBackupFile()}>
                  Backup wieder verbinden
                </Button>
              ) : status === 'active' ? (
                <>
                  <Button icon="check" onClick={() => backupNow()}>
                    Jetzt sichern
                  </Button>
                  <Button variant="ghost" onClick={() => disconnectBackupFile()}>
                    Trennen
                  </Button>
                </>
              ) : (
                <Button variant="primary" icon="folder" onClick={() => connectBackupFile()}>
                  Backup-Datei wählen
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div className="font-semibold">Export & Import</div>
        <p className="mt-1 text-sm text-slate-500">
          {lastBackupAt ? `Letztes Backup: ${formatDate(lastBackupAt.slice(0, 10))}` : 'Noch kein Backup erstellt.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button icon="download" onClick={() => downloadBackup()}>
            Backup herunterladen
          </Button>
          <Button icon="upload" onClick={() => inputRef.current?.click()}>
            Backup wiederherstellen
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setPending(f)
              e.target.value = ''
            }}
          />
        </div>
        {pending && (
          <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
            „{pending.name}“ wiederherstellen? Deine aktuellen Daten werden dabei ersetzt.
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={async () => {
                  try {
                    await importBackupFile(pending)
                    setMsg({ ok: true, text: 'Backup erfolgreich wiederhergestellt.' })
                  } catch (err) {
                    setMsg({ ok: false, text: err instanceof Error ? err.message : 'Import fehlgeschlagen.' })
                  }
                  setPending(null)
                }}
              >
                Ja, wiederherstellen
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPending(null)}>
                Abbrechen
              </Button>
            </div>
          </div>
        )}
        {msg && <p className={`mt-2 text-sm ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{msg.text}</p>}
      </div>
    </Card>
  )
}

function AbiCard() {
  const examDates = useStore((s) => s.settings.examDates)
  const setExamDate = useStore((s) => s.setExamDate)
  const rounding = useStore((s) => s.settings.roundingMode)
  const setSettings = useStore((s) => s.setSettings)
  return (
    <Card title="Abitur 2027" icon="target">
      <div className="space-y-3">
        {SUBJECTS.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3">
            <span className="flex w-40 items-center gap-2 text-sm font-medium">
              <SubjectDot color={s.color} />
              {s.abiNr}. {s.name}
            </span>
            <TextInput type="date" className="w-44" value={examDates[s.id]} onChange={(e) => e.target.value && setExamDate(s.id, e.target.value)} />
            {s.altExamDates && (
              <span className="flex gap-1">
                {[s.defaultExamDate, ...s.altExamDates].map((d) => (
                  <Button key={d} size="sm" variant={examDates[s.id] === d ? 'primary' : 'ghost'} onClick={() => setExamDate(s.id, d)}>
                    {formatDate(d).slice(0, 10)}
                  </Button>
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Geographie-LK wird laut Erlass am 13.04. oder 19.04.2027 geschrieben – welcher Termin für dich gilt, legt deine Schule
        fest. Für Bio (mündlich) ist der 10.05. der früheste Termin.
      </p>
      <div className="mt-5">
        <Field label="Rundung in der Abi-Simulation">
          <Select value={rounding} onChange={(e) => setSettings({ roundingMode: e.target.value as RoundingMode })}>
            {(Object.keys(ROUNDING_LABELS) as RoundingMode[]).map((m) => (
              <option key={m} value={m}>
                {ROUNDING_LABELS[m]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Card>
  )
}

function GeneralCard() {
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  return (
    <Card title="Allgemein" icon="settings">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dein Vorname (für die Begrüßung)">
          <TextInput value={settings.name} onChange={(e) => setSettings({ name: e.target.value })} />
        </Field>
        <Field label="Darstellung">
          <Select value={settings.theme} onChange={(e) => setSettings({ theme: e.target.value as typeof settings.theme })}>
            <option value="system">wie das System</option>
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
          </Select>
        </Field>
        <Field label="Neue Karteikarten pro Runde">
          <Select value={settings.newCardsPerDay} onChange={(e) => setSettings({ newCardsPerDay: Number(e.target.value) })}>
            {[5, 10, 15, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Lernziel pro Woche">
          <Select value={settings.weeklyGoalHours} onChange={(e) => setSettings({ weeklyGoalHours: Number(e.target.value) })}>
            {[3, 5, 7, 10, 12, 15, 20, 25, 30].map((h) => (
              <option key={h} value={h}>
                {h} Stunden
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Card>
  )
}

function DangerCard() {
  const resetAll = useStore((s) => s.resetAll)
  const [confirm, setConfirm] = useState('')
  return (
    <Card title="Alle Daten zurücksetzen" icon="alert">
      <p className="text-sm text-slate-500">
        Löscht alle Noten, Lernstände, Termine und Einstellungen in diesem Browser. Lade vorher ein Backup herunter. Zum
        Bestätigen <strong>LÖSCHEN</strong> eintippen.
      </p>
      <div className="mt-3 flex gap-2">
        <TextInput className="max-w-40" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="LÖSCHEN" />
        <Button
          variant="danger"
          icon="trash"
          disabled={confirm !== 'LÖSCHEN'}
          onClick={() => {
            resetAll()
            setConfirm('')
          }}
        >
          Zurücksetzen
        </Button>
      </div>
    </Card>
  )
}
