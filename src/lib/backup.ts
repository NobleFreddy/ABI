/**
 * Datensicherung:
 *  1. Autosave in localStorage übernimmt der Store (zustand/persist).
 *  2. Auto-Backup in eine Datei auf der Festplatte (File System Access API, Chrome/Edge).
 *  3. Manueller Export/Import als JSON.
 * Ein späterer Sync-Adapter (z. B. Supabase) kann hier ergänzt werden.
 */
import { create } from 'zustand'
import { useStore, pickData, normalizeData, SCHEMA_VERSION } from '../store/store'
import type { AppData } from '../store/types'
import { todayISO } from './dates'

const APP_ID = 'abi-cockpit'

export interface BackupFile {
  app: typeof APP_ID
  schema: number
  exportedAt: string
  data: AppData
}

// ------------------------------------------------------------ Typen der File System Access API

type PermissionMode = { mode: 'read' | 'readwrite' }
interface FSHandle {
  name: string
  queryPermission?: (d: PermissionMode) => Promise<PermissionState>
  requestPermission?: (d: PermissionMode) => Promise<PermissionState>
  createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>
}
type SavePicker = (opts: {
  suggestedName?: string
  types?: { description: string; accept: Record<string, string[]> }[]
}) => Promise<FSHandle>

const picker = (): SavePicker | undefined =>
  (window as unknown as { showSaveFilePicker?: SavePicker }).showSaveFilePicker

export const fileBackupSupported = () => typeof window !== 'undefined' && !!picker()

// ------------------------------------------------------------ Mini-IndexedDB für den Datei-Handle

const DB = 'abi-cockpit-backup'
const STORE = 'handles'

function idb<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1)
    open.onupgradeneeded = () => open.result.createObjectStore(STORE)
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const tx = open.result.transaction(STORE, mode)
      const req = fn(tx.objectStore(STORE))
      req.onsuccess = () => resolve(req.result as T)
      req.onerror = () => reject(req.error)
    }
  })
}
const saveHandle = (h: FSHandle | null) =>
  idb<void>('readwrite', (s) => (h ? s.put(h, 'file') : s.delete('file')))
const loadHandle = () => idb<FSHandle | undefined>('readonly', (s) => s.get('file'))

// ------------------------------------------------------------ Status (nicht persistiert)

export type FileStatus = 'unsupported' | 'none' | 'active' | 'needs-permission' | 'error'

interface BackupState {
  status: FileStatus
  fileName: string | null
  lastWrite: string | null
  error: string | null
  persisted: boolean | null
}

export const useBackup = create<BackupState>(() => ({
  status: 'none',
  fileName: null,
  lastWrite: null,
  error: null,
  persisted: null,
}))

let handle: FSHandle | null = null
let timer: ReturnType<typeof setTimeout> | null = null

export function buildBackup(): BackupFile {
  return { app: APP_ID, schema: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data: pickData(useStore.getState()) }
}

async function writeToFile() {
  if (!handle) return
  try {
    const w = await handle.createWritable()
    await w.write(JSON.stringify(buildBackup(), null, 2))
    await w.close()
    useBackup.setState({ status: 'active', lastWrite: new Date().toISOString(), error: null })
    useStore.getState().markBackup()
  } catch (e) {
    useBackup.setState({ status: 'error', error: e instanceof Error ? e.message : String(e) })
  }
}

function scheduleWrite() {
  if (!handle || useBackup.getState().status !== 'active') return
  if (timer) clearTimeout(timer)
  timer = setTimeout(writeToFile, 2500)
}

/** Beim App-Start aufrufen. */
export async function initBackup() {
  // Browser bitten, den Speicher nicht automatisch zu löschen
  try {
    if (navigator.storage?.persist) {
      const already = await navigator.storage.persisted()
      const persisted = already || (await navigator.storage.persist())
      useBackup.setState({ persisted })
    }
  } catch {
    /* ignorieren */
  }

  if (!fileBackupSupported()) {
    useBackup.setState({ status: 'unsupported' })
    return
  }
  try {
    const h = await loadHandle()
    if (h) {
      handle = h
      const perm = (await h.queryPermission?.({ mode: 'readwrite' })) ?? 'granted'
      useBackup.setState({ fileName: h.name, status: perm === 'granted' ? 'active' : 'needs-permission' })
    }
  } catch {
    /* kein Handle gespeichert */
  }

  // Änderungen am Store → verzögert in die Datei schreiben
  let prev = useStore.getState()
  useStore.subscribe((s) => {
    const changed = (Object.keys(s) as (keyof typeof s)[]).some(
      (k) => typeof s[k] !== 'function' && k !== 'meta' && s[k] !== prev[k],
    )
    prev = s
    if (changed) scheduleWrite()
  })
}

/** Datei auswählen und sofort sichern (muss durch Klick ausgelöst werden). */
export async function connectBackupFile() {
  const pick = picker()
  if (!pick) return
  try {
    const h = await pick({
      suggestedName: 'abi-cockpit-backup.json',
      types: [{ description: 'Abi-Cockpit Backup', accept: { 'application/json': ['.json'] } }],
    })
    handle = h
    await saveHandle(h)
    useBackup.setState({ fileName: h.name, status: 'active', error: null })
    await writeToFile()
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return
    useBackup.setState({ status: 'error', error: e instanceof Error ? e.message : String(e) })
  }
}

/** Nach einem Neustart den Zugriff erneut erlauben (Klick nötig). */
export async function reconnectBackupFile() {
  if (!handle) return connectBackupFile()
  const perm = (await handle.requestPermission?.({ mode: 'readwrite' })) ?? 'granted'
  if (perm === 'granted') {
    useBackup.setState({ status: 'active', error: null })
    await writeToFile()
  }
}

export async function disconnectBackupFile() {
  handle = null
  await saveHandle(null).catch(() => {})
  useBackup.setState({ status: fileBackupSupported() ? 'none' : 'unsupported', fileName: null })
}

export async function backupNow() {
  if (handle && useBackup.getState().status === 'active') await writeToFile()
}

/** Backup als Datei herunterladen. */
export function downloadBackup() {
  const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `abi-cockpit-backup-${todayISO()}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  useStore.getState().markBackup()
}

/** Backup-Datei prüfen. Wirft einen Fehler mit verständlicher Meldung. */
export function parseBackup(text: string): AppData {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('Die Datei ist keine gültige JSON-Datei.')
  }
  const f = json as Partial<BackupFile>
  if (!f || f.app !== APP_ID || typeof f.data !== 'object' || f.data == null) {
    throw new Error('Das ist keine Backup-Datei vom Abi-Cockpit.')
  }
  if (typeof f.schema === 'number' && f.schema > SCHEMA_VERSION) {
    throw new Error('Das Backup stammt aus einer neueren Version der App.')
  }
  const d = f.data as Partial<AppData>
  if (!Array.isArray(d.courses)) throw new Error('Im Backup fehlen die Kursdaten.')
  return normalizeData(d)
}

export async function importBackupFile(file: File) {
  const text = await file.text()
  const data = parseBackup(text)
  useStore.getState().replaceAll(data)
  return data
}

/** Tage seit dem letzten Backup (null = noch nie). */
export function daysSinceBackup(lastBackupAt: string | null): number | null {
  if (!lastBackupAt) return null
  return Math.floor((Date.now() - new Date(lastBackupAt).getTime()) / 86400000)
}
