# Abi-Cockpit 2027

Deine persönliche Web-App für das **Abitur 2027 in NRW**: Noten, Abi-Schnitt, Lernplan, Karteikarten, Quiz, Lern-Timer und Termine an einem Ort.

**Deine Abiturfächer:**
1. Geographie (LK, schriftlich)
2. Latein (LK, schriftlich)
3. Mathematik (GK, schriftlich, WTR)
4. Biologie (GK, mündlich)

---

## Online nutzen

**https://noblefreddy.github.io/ABI/** – funktioniert auch auf dem Handy (im Browser „Zum Startbildschirm hinzufügen“).

Bei jedem Hochladen auf `main` baut GitHub die Seite automatisch (inkl. Tests) und legt das fertige Ergebnis in den Branch **`gh-pages`** (`.github/workflows/deploy.yml`). GitHub Pages veröffentlicht diesen Branch. Einstellung dafür: **Settings → Pages → Source: „Deploy from a branch“ → Branch `gh-pages`, Ordner `/ (root)`**.

> Nicht `main` als Quelle wählen – dort liegt nur der Quellcode, das ergibt eine weiße Seite.

> Die Daten liegen immer im Browser des jeweiligen Geräts. Online-Version, lokale Version und Handy haben also **getrennte** Daten. Zum Übertragen: unter „Einstellungen & Backup“ ein Backup herunterladen und auf dem anderen Gerät wiederherstellen.

## Lokal starten

**Doppelklick auf `ABI-starten.bat`**
- Beim ersten Start werden die nötigen Pakete installiert. Das dauert einmalig etwa eine Minute.
- Danach öffnet sich der Browser mit `http://localhost:5180`.
- Das schwarze Fenster offen lassen, solange du die App nutzt. Zum Beenden das Fenster schließen.

Alternativ im Terminal:

```bash
npm install
```

```bash
npm start
```

> Wichtig: Öffne die App immer über `localhost:5180`. Der Browser speichert die Daten pro Adresse. Unter einer anderen Adresse oder einem anderen Port sähe die App leer aus, obwohl die Daten noch da sind.

---

## Gehen meine Daten verloren, wenn ich die Seite schließe?

**Nein.**
- Jede Änderung wird sofort im Browser gespeichert und ist auch nach dem Schließen von Tab, Browser oder PC wieder da.
- Die App bittet den Browser außerdem um dauerhaften Speicher, damit er die Daten nicht von selbst aufräumt.

Verloren gehen könnten die Daten nur, wenn du die **Browserdaten löschst** (Cookies/Websitedaten für localhost) oder einen anderen Browser nutzt. Dafür gibt es unter **Einstellungen & Backup** zwei Absicherungen:

1. **Automatisches Backup in eine Datei** (Chrome/Edge):
   - Wähle einmal eine Datei, am besten in OneDrive oder Dokumente.
   - Ab dann speichert die App jede Änderung zusätzlich dorthin.
   - Nach einem Neustart fragt der Browser eventuell einmal nach Erlaubnis („Backup wieder verbinden“).
2. **Backup herunterladen / wiederherstellen:** Die Datei enthält alle Daten und lässt sich jederzeit wieder einspielen, auch auf einem anderen PC.

Wenn länger als 7 Tage kein Backup gemacht wurde, erinnert dich die App daran.

---

## Funktionen

| Bereich | Was du damit machst |
|---|---|
| **Start** | Countdown zu jeder Prüfung, Abi-Prognose, Lernfortschritt, fällige Karteikarten, Termine, To-dos |
| **Noten & Kurse** | Halbjahresnoten Q1.1–Q2.2 (0–15 Punkte), Prognosen markieren, Einzelnoten (Klausuren/sonstige Mitarbeit) mit Notenvorschlag, Pflichtkurse markieren |
| **Abi-Rechner** | Offizielle Berechnung nach APO-GOSt NRW: Block I mit automatischer Auswahl der besten 35–40 Kurse, Defizitprüfung, Block II mit mündlicher Zusatzprüfung, Zielrechner, Was-wäre-wenn |
| **Abi-Simulation** | Hochrechnung des ganzen Abis aus den bisherigen Noten. Kommazahlen mit bis zu 3 Nachkommastellen, exakte Werte auf 3 Nachkommastellen, Rundung einstellbar (sicher/abrunden, mathematisch, optimistisch/aufrunden), schlechtester/realistischer/bester Fall |
| **Lernplan & Themen** | Alle Schwerpunkte der Abiturvorgaben 2027, Fokus-Themen markiert, Status und Selbsteinschätzung, automatischer Wochenplan bis zur Prüfung, schwächste Themen, Altklausuren-Tracker |
| **Karteikarten** | Rund 390 vorbereitete Karten plus eigene. Wiederholung mit Spaced Repetition (SM-2), Formeln werden schön dargestellt |
| **Quiz** | Rund 150 Multiple-Choice-Fragen mit Erklärungen, pro Thema oder gemischt, falsche Fragen gezielt wiederholen |
| **Lern-Timer** | Pomodoro und Stoppuhr, Lernzeit pro Fach, Wochenziel, Lernserie, Diagramme und Aktivitäts-Heatmap |
| **Kalender & To-dos** | Offizielle Abi-Termine 2027 sind eingetragen, dazu eigene Klausuren, Vorabi, Abgaben und Aufgaben |

### Tastenkürzel

**Karteikarten:**
- Leertaste: Antwort zeigen
- 1–4: bewerten (Nochmal, Schwer, Gut, Einfach)

**Quiz:**
- 1–4: Antwort wählen
- Enter: nächste Frage

---

## Grundlagen der Berechnung (NRW, Abitur 2027)

**Block I**
- Formel: (P ÷ S) × 40, mathematisch gerundet. LK-Kurse zählen doppelt.
- Umfang: 35–40 Kurse, mindestens 200 Punkte.
- Defizite: höchstens 7 bei 35–37 Kursen, höchstens 8 bei 38–40 Kursen, davon höchstens 3 im LK.
- Kurse mit 0 Punkten gelten als nicht belegt.

**Zulassung**
- Mindestens 38 anrechenbare Kurse belegt: 30 Grundkurse und 8 Leistungskurse.
- Vertiefungskurse sind nicht anrechenbar.

**Block II**
- Jede der 4 Prüfungen zählt fünffach, mindestens 100 Punkte.
- Mit **besonderer Lernleistung** (im Abi-Rechner aktivierbar) zählen alle 4 Prüfungen und die Lernleistung vierfach.
- In 2 Fächern (darunter ein LK) jeweils mindestens 5 Punkte einfach.
- Mit mündlicher Zusatzprüfung zählen schriftlich und mündlich im Verhältnis 2 : 1.

**Note:** 17/3 − Gesamtpunkte/180, auf eine Nachkommastelle abgeschnitten. Ab 823 Punkten gibt es die 1,0, mit 300 Punkten die 4,0.

**Quellen:**
- Merkblatt zur Berechnung der Gesamtqualifikation (MSB NRW, Stand August 2018). Alle vier Rechenbeispiele daraus sind als automatische Tests hinterlegt.
- APO-GOSt
- „Zentralabitur 2027 – Vorgaben“ für Geographie, Latein, Mathematik und Biologie
- Termine nach BASS 13-32 Nr. 6

Die Pflicht-Markierungen bei den Kursen sind ein Vorschlag nach § 28 APO-GOSt. Gleiche sie im Zweifel mit deiner Oberstufenkoordination ab.

Die Lerninhalte sind Basiswissen zum Wiederholen und ersetzen nicht den Unterricht. Karten lassen sich bearbeiten oder ausblenden.

---

## Für Entwickler

```bash
npm test
```

```bash
npm run build
```

- **Technik:** Vite, React, TypeScript, Tailwind CSS 4, Zustand (persist), KaTeX
- **Rechenlogik:** `src/lib/abi-calc.ts`, `src/lib/abi-simulation.ts` (mit Tests)
- **Lerninhalte:** `src/content/*.cards.ts` (Themenbäume in `src/content/<fach>.ts`)
- **Datenspeicherung und Backup:** `src/store/store.ts`, `src/lib/backup.ts`

Hier ließe sich später auch eine Synchronisation ergänzen, z. B. für das Handy.
