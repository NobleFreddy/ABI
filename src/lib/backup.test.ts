import { describe, expect, it } from 'vitest'
import { buildBackup, parseBackup } from './backup'
import { defaultData, useStore } from '../store/store'

describe('Backup', () => {
  it('Export → Import ergibt dieselben Daten', () => {
    useStore.getState().replaceAll(defaultData())
    useStore.getState().setSemester('geo', 'Q1.1', { points: 13 })
    useStore.getState().addTodo({ title: 'Altklausur 2024', priority: 1 })
    useStore.getState().setSemesterOverride('mathe|Q2.1', 10.667)

    const text = JSON.stringify(buildBackup())
    const restored = parseBackup(text)

    expect(restored.courses.find((c) => c.id === 'geo')!.semesters['Q1.1'].points).toBe(13)
    expect(restored.todos[0].title).toBe('Altklausur 2024')
    expect(restored.simulation.semesterOverrides['mathe|Q2.1']).toBe(10.667)
  })

  it('lehnt fremde oder kaputte Dateien mit verständlicher Meldung ab', () => {
    expect(() => parseBackup('kein json')).toThrow(/keine gültige JSON/)
    expect(() => parseBackup(JSON.stringify({ app: 'etwas-anderes', data: {} }))).toThrow(/keine Backup-Datei/)
    expect(() => parseBackup(JSON.stringify({ app: 'abi-cockpit', schema: 1, data: {} }))).toThrow(/Kursdaten/)
  })

  it('ergänzt fehlende Felder aus älteren Backups', () => {
    const old = { app: 'abi-cockpit', schema: 1, data: { courses: [], settings: { name: 'Alex' } } }
    const d = parseBackup(JSON.stringify(old))
    expect(d.settings.name).toBe('Alex')
    expect(d.settings.roundingMode).toBe('floor')
    expect(d.todos).toEqual([])
  })
})
