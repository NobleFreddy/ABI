import { buildCards, buildQuiz, type CardTuple, type QuizTuple } from './build'

const T = {
  neuron: 'bio-neuron',
  syn: 'bio-synapse',
  nverf: 'bio-neuro-verfahren',
  stw: 'bio-stw-grundlagen',
  fs: 'bio-fotosynthese',
  za: 'bio-zellatmung',
  chrom: 'bio-chromatografie',
  oeko: 'bio-oeko-strukturen',
  mensch: 'bio-oeko-mensch',
  overf: 'bio-oeko-verfahren',
  mol: 'bio-molgen',
  hum: 'bio-humangenetik',
  evo: 'bio-evolution',
  stamm: 'bio-stammbaum',
}

const cards: CardTuple[] = [
  // ---------------------------------------------------------------- Neuron
  [T.neuron, `Beschreibe den **Bau einer Nervenzelle** (Neuron).`, `- **Dendriten:** nehmen Signale auf
- **Zellkörper (Soma)** mit Zellkern: verrechnet Signale
- **Axonhügel:** hier entsteht das Aktionspotenzial (Schwellenwert)
- **Axon (Neurit):** leitet die Erregung weiter, oft mit **Myelinscheide** (Schwann-Zellen) und **Ranvier'schen Schnürringen**
- **Endknöpfchen (Synapsen):** Übertragung auf die nächste Zelle`],
  [T.neuron, `Was ist das **Ruhepotenzial** und wie hoch ist es?`, `Die **Spannung über der Membran** eines nicht erregten Neurons: ca. **−70 mV** (innen negativ gegenüber außen).`],
  [T.neuron, `Erkläre die **Entstehung des Ruhepotenzials**.`, `1. **Ungleiche Ionenverteilung:** innen viel **K⁺** und organische Anionen (A⁻), außen viel **Na⁺** und Cl⁻
2. **Selektive Permeabilität:** In Ruhe sind vor allem **K⁺-Leckkanäle** offen
3. K⁺ diffundiert dem Konzentrationsgefälle folgend **nach außen**; die großen A⁻ können nicht folgen → innen wird negativ
4. Das entstehende **elektrische Feld** zieht K⁺ zurück → **Gleichgewicht** (chemischer Gradient = elektrische Kraft)
5. Die **Natrium-Kalium-Pumpe** (3 Na⁺ raus, 2 K⁺ rein, ATP) hält die Gradienten gegen Leckströme aufrecht`],
  [T.neuron, `Welche Aufgabe hat die **Natrium-Kalium-Pumpe**?`, `Sie transportiert unter **ATP-Verbrauch** aktiv **3 Na⁺ nach außen und 2 K⁺ nach innen** und erhält so die Konzentrationsgradienten aufrecht, die durch Leckströme und Aktionspotenziale abgebaut würden. Sie trägt außerdem leicht zur negativen Ladung innen bei (elektrogen).`],
  [T.neuron, `Beschreibe den **Ablauf eines Aktionspotenzials**.`, `1. **Depolarisation** bis zum **Schwellenwert** (ca. −50 mV)
2. **Spannungsgesteuerte Na⁺-Kanäle öffnen** → Na⁺ strömt ein → Membranpotenzial steigt bis ca. **+30 mV** (Overshoot)
3. **Repolarisation:** Na⁺-Kanäle werden **inaktiviert**, spannungsgesteuerte **K⁺-Kanäle öffnen** verzögert → K⁺ strömt aus
4. **Hyperpolarisation** (unter −70 mV), da K⁺-Kanäle langsam schließen
5. Rückkehr zum Ruhepotenzial
Dauer: ca. 1–2 ms.`],
  [T.neuron, `Was bedeutet das **Alles-oder-Nichts-Prinzip**?`, `Ein Aktionspotenzial entsteht **nur, wenn der Schwellenwert erreicht** wird – dann aber **immer in voller Höhe**. Unterschwellige Reize lösen keins aus. Die Reizstärke wird daher nicht über die Amplitude, sondern über die **Frequenz** der Aktionspotenziale codiert.`],
  [T.neuron, `Was ist die **Refraktärzeit** und welche Bedeutung hat sie?`, `**Absolute Refraktärzeit:** Na⁺-Kanäle sind inaktiviert → **kein neues AP** möglich.
**Relative Refraktärzeit:** nur durch stärkere Reize auslösbar.
Bedeutung: **gerichtete Erregungsleitung** (kein Zurücklaufen) und Begrenzung der maximalen AP-Frequenz.`],
  [T.neuron, `Wie wird die **Reizstärke codiert**?`, `- Am **Axon**: durch die **Frequenz** der Aktionspotenziale (Frequenzmodulation) – stärkerer Reiz → mehr APs pro Zeit
- An der **Synapse**: durch die **Menge des ausgeschütteten Transmitters** → unterschiedlich große postsynaptische Potenziale (Amplitudenmodulation)`],
  [T.neuron, `Unterschied **kontinuierliche** und **saltatorische Erregungsleitung**?`, `**Kontinuierlich** (marklose Axone): Das AP wird an **jeder Stelle** der Membran neu gebildet → langsam (ca. 1–3 m/s).
**Saltatorisch** (myelinisierte Axone): Die Myelinscheide isoliert; APs entstehen **nur an den Ranvier'schen Schnürringen**, dazwischen breitet sich die Erregung elektrisch (Ausgleichsströme) aus → „springt“ von Schnürring zu Schnürring, **schnell (bis ca. 100 m/s)** und **energiesparend** (weniger Ionen müssen zurückgepumpt werden).`],
  [T.neuron, `Wovon hängt die **Leitungsgeschwindigkeit** eines Axons ab?`, `- **Myelinisierung** (saltatorisch viel schneller)
- **Axondurchmesser** (größer → geringerer Innenwiderstand → schneller; z. B. Riesenaxon des Tintenfischs)
- Temperatur
Beim Wirbeltier ermöglicht die Myelinscheide hohe Geschwindigkeit bei dünnen Axonen → platzsparend.`],

  // ---------------------------------------------------------------- Synapse
  [T.syn, `Beschreibe die **Erregungsübertragung an einer erregenden chemischen Synapse** (Schritt für Schritt).`, `1. AP erreicht das **Endknöpfchen**
2. **Spannungsgesteuerte Ca²⁺-Kanäle** öffnen → Ca²⁺ strömt ein
3. **Vesikel** mit Transmitter (z. B. **Acetylcholin**) verschmelzen mit der präsynaptischen Membran (**Exozytose**)
4. Transmitter diffundiert durch den **synaptischen Spalt**
5. Bindung an **Rezeptoren** (ligandengesteuerte Na⁺-Kanäle) der postsynaptischen Membran → Na⁺-Einstrom → **EPSP** (Depolarisation)
6. **Acetylcholinesterase** spaltet ACh in Acetat und Cholin → Signal endet; Cholin wird wieder aufgenommen und recycelt`],
  [T.syn, `Was ist ein **EPSP**?`, `Ein **erregendes postsynaptisches Potenzial**: eine **Depolarisation** der postsynaptischen Membran durch Na⁺-Einstrom. Es ist **graduiert** (Höhe abhängig von der Transmittermenge), breitet sich abnehmend aus und kann am Axonhügel mit anderen summiert ein AP auslösen.`],
  [T.syn, `Warum ist die Erregungsübertragung an chemischen Synapsen **nur in eine Richtung** möglich?`, `Nur die **präsynaptische** Seite enthält **Vesikel mit Transmitter**, nur die **postsynaptische** Membran besitzt die passenden **Rezeptoren**.`],
  [T.syn, `Was ist die **neuromuskuläre Synapse (motorische Endplatte)**?`, `Die Synapse zwischen **Motoneuron und Muskelfaser**. Transmitter ist **Acetylcholin**; es löst ein **Endplattenpotenzial** aus, das ein Muskelaktionspotenzial und damit die **Kontraktion** bewirkt.`],
  [T.syn, `Unterschied **Agonist** und **Antagonist**?`, `**Agonist:** bindet an den Rezeptor und **wirkt wie der Transmitter** (aktiviert ihn), z. B. Nikotin am nikotinischen ACh-Rezeptor.
**Antagonist:** bindet an den Rezeptor, **aktiviert ihn aber nicht** und blockiert ihn für den Transmitter, z. B. Curare.`],
  [T.syn, `Wie wirkt **Curare**?`, `**Kompetitiver Antagonist** am Acetylcholin-Rezeptor der motorischen Endplatte: blockiert die Rezeptoren → kein Endplattenpotenzial → **schlaffe Lähmung** (Atemlähmung). Wirkung kann durch mehr ACh (Hemmung der Acetylcholinesterase) teilweise aufgehoben werden.`],
  [T.syn, `Wie wirken **E 605 (Parathion)** oder das Nervengift **Sarin**?`, `Sie **hemmen die Acetylcholinesterase** → ACh wird nicht abgebaut und bleibt im synaptischen Spalt → **Dauererregung** der postsynaptischen Membran → Krämpfe, schließlich Lähmung (Atemstillstand). Gegenmittel z. B. Atropin.`],
  [T.syn, `Wie wirkt **Botulinumtoxin** („Botox“)?`, `Es **verhindert die Ausschüttung (Exozytose) von Acetylcholin** aus den Vesikeln → keine Erregungsübertragung auf den Muskel → **schlaffe Lähmung**. Medizinisch in kleinsten Dosen gegen Muskelkrämpfe oder kosmetisch genutzt.`],
  [T.syn, `Wie wirken **Kokain** und **Antidepressiva vom SSRI-Typ** an Synapsen?`, `Beide sind **Wiederaufnahmehemmer**: Kokain blockiert die Wiederaufnahme von **Dopamin** (und Noradrenalin), SSRI die von **Serotonin** in die präsynaptische Zelle → Transmitter bleibt länger im Spalt → **verstärkte/verlängerte Wirkung**.`],
  [T.syn, `Wie gehst du im Abi bei der **Analyse einer Stoffwirkung an Synapsen** vor?`, `1. Normale Abläufe an der Synapse kurz darstellen
2. **Angriffsort** des Stoffes bestimmen (Ca²⁺-Kanal, Exozytose, Rezeptor, Enzym, Wiederaufnahme)
3. Wirkmechanismus beschreiben (Agonist, Antagonist, Hemmstoff)
4. **Folgen** für postsynaptisches Potenzial und Organismus ableiten (Dauererregung vs. Lähmung)`],

  [T.nverf, `Wie werden **Membranpotenziale abgeleitet**? (Fokus 2027)`, `Eine **Mikroelektrode** (feine Glaskapillare) wird **in das Axon** eingestochen, eine **Bezugselektrode** liegt in der Außenflüssigkeit. Ein **Spannungsmessgerät/Oszilloskop** zeigt die Potenzialdifferenz zwischen innen und außen an.
Solange beide Elektroden außen sind: 0 mV; nach dem Einstechen springt der Wert auf das Ruhepotenzial (ca. −70 mV). Klassisch am **Riesenaxon des Tintenfischs**.`],
  [T.nverf, `Wie interpretierst du eine **Messkurve eines Aktionspotenzials**?`, `- x-Achse Zeit (ms), y-Achse Membranpotenzial (mV)
- Ruhepotenzial-Niveau, Schwellenwert, Anstieg (Depolarisation, Na⁺-Einstrom), Spitze (+30 mV), Abfall (Repolarisation, K⁺-Ausstrom), Unterschwingen (Hyperpolarisation)
- bei Versuchen mit Hemmstoffen (z. B. Tetrodotoxin blockiert Na⁺-Kanäle) Abweichungen erklären`],

  // ---------------------------------------------------------------- Stoffwechsel Grundlagen
  [T.stw, `Was ist **ATP** und wie dient es als Energieträger?`, `**Adenosintriphosphat**: universeller Energieträger der Zelle. Die **Hydrolyse ATP → ADP + Pᵢ** ist stark **exergonisch** und wird an **endergonische** Reaktionen gekoppelt (Energiekopplung), z. B. Muskelkontraktion, aktiver Transport, Synthesen. ADP wird in Zellatmung/Fotosynthese wieder zu ATP regeneriert (**ATP-ADP-System**).`],
  [T.stw, `Was sind **Redoxreaktionen** und welche Rolle spielen NAD⁺/NADP⁺?`, `**Oxidation** = Abgabe von Elektronen, **Reduktion** = Aufnahme; beide sind gekoppelt.
**NAD⁺/NADH** (Zellatmung), **NADP⁺/NADPH** (Fotosynthese) und **FAD/FADH₂** sind **Elektronen- bzw. Wasserstoffüberträger**: Sie nehmen Elektronen bei Oxidationen auf und geben sie an anderer Stelle wieder ab (Reduktionsäquivalente).`],
  [T.stw, `Wie hängen **aufbauender und abbauender Stoffwechsel** zusammen?`, `**Aufbauend (anabol), z. B. Fotosynthese:** aus energiearmen Stoffen (CO₂, H₂O) entstehen energiereiche (Glucose) – Energie wird gespeichert (endergonisch).
**Abbauend (katabol), z. B. Zellatmung:** Glucose wird zu CO₂ und H₂O abgebaut, Energie wird in Form von ATP nutzbar.
Die Produkte des einen sind die Ausgangsstoffe des anderen → **Kreislauf von Stoffen**, **Energie fließt** (von Licht zu Wärme).`],
  [T.stw, `Wie werden Stoffwechselwege **auf Enzymebene reguliert**?`, `- **Kompetitive Hemmung:** Hemmstoff ähnelt dem Substrat und besetzt das **aktive Zentrum** (durch mehr Substrat aufhebbar)
- **Allosterische Regulation:** Effektor bindet an eine **andere Stelle** und verändert die Form des Enzyms (Hemmung oder Aktivierung)
- **Endprodukthemmung (negative Rückkopplung):** Das Endprodukt eines Weges hemmt ein Enzym am Anfang (z. B. ATP hemmt die Phosphofructokinase der Glykolyse)`],
  [T.stw, `Was versteht man unter **chemiosmotischer ATP-Bildung**?`, `An einer Membran wird ein **Protonengradient** (H⁺-Konzentrations- und Ladungsgefälle) aufgebaut. Die Protonen strömen durch das Enzym **ATP-Synthase** zurück; die dabei frei werdende Energie wird zur Synthese von **ATP aus ADP + Pᵢ** genutzt (Mitchell).
- Mitochondrium: H⁺ wird in den **Intermembranraum** gepumpt
- Chloroplast: H⁺ sammelt sich im **Thylakoidinnenraum**`],
  [T.stw, `Warum sind **Kompartimente** für den Stoffwechsel wichtig?`, `Durch Membranen getrennte Reaktionsräume (z. B. Mitochondrienmatrix, Thylakoidinnenraum) ermöglichen **unterschiedliche Bedingungen** nebeneinander (pH, Konzentrationen), den **Aufbau von Gradienten** (Voraussetzung für chemiosmotische ATP-Bildung) und die Ordnung von Reaktionsketten. Stoffe werden über Transportproteine gezielt zwischen Kompartimenten ausgetauscht.`],

  // ---------------------------------------------------------------- Fotosynthese
  [T.fs, `Wie lautet die **Bruttogleichung der Fotosynthese**?`, `6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O (mit Lichtenergie, Chlorophyll)
vereinfacht: 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂
Der **Sauerstoff stammt aus dem Wasser** (Nachweis mit ¹⁸O).`],
  [T.fs, `Beschreibe den **Blattaufbau** und seine Angepasstheit an die Fotosynthese.`, `- **Cuticula** + obere **Epidermis**: Verdunstungsschutz, lichtdurchlässig
- **Palisadengewebe**: dicht gepackte Zellen mit **vielen Chloroplasten** → Hauptort der Fotosynthese
- **Schwammgewebe** mit großen **Interzellularen** → Gasaustausch
- untere Epidermis mit **Spaltöffnungen (Stomata)** und Schließzellen → Regulation von CO₂-Aufnahme und Wasserabgabe
- **Leitbündel**: Xylem (Wasser, Mineralstoffe), Phloem (Assimilate)
Sonnenblätter sind dicker (mehrschichtiges Palisadengewebe) als Schattenblätter.`],
  [T.fs, `Beschreibe den **Feinbau eines Chloroplasten**.`, `- **Doppelmembran** (Hülle)
- **Thylakoide** (gestapelt zu **Grana**) mit Chlorophyll und Fotosystemen → Ort der **Primärreaktionen**
- **Stroma** (Grundsubstanz) → Ort des **Calvin-Zyklus**
- eigene ringförmige **DNA** und 70S-Ribosomen, Stärkekörner
(Hinweis auf **Endosymbiontentheorie**)`],
  [T.fs, `Was zeigt das **Absorptionsspektrum** von Chlorophyll?`, `Chlorophyll a und b absorbieren vor allem **blaues (ca. 430–450 nm)** und **rotes Licht (ca. 640–680 nm)**. **Grünes Licht** wird kaum absorbiert, sondern reflektiert („Grünlücke“) → Blätter erscheinen grün. **Carotinoide** als akzessorische Pigmente absorbieren zusätzlich im Blau-Grün-Bereich.`],
  [T.fs, `Was ist das **Wirkungsspektrum** und wie wurde es nachgewiesen?`, `Es zeigt die **Fotosyntheserate in Abhängigkeit von der Wellenlänge**. Es entspricht weitgehend dem Absorptionsspektrum der Pigmente (hohe Rate bei Blau und Rot).
**Engelmann-Versuch:** Eine Fadenalge wird mit Spektralfarben beleuchtet; **sauerstoffliebende Bakterien** sammeln sich dort, wo viel O₂ entsteht – im roten und blauen Bereich.`],
  [T.fs, `Wie hängt die **Fotosyntheserate von der Lichtintensität** ab?`, `- Bei Dunkelheit: nur Zellatmung → **CO₂-Abgabe**
- **Lichtkompensationspunkt:** Fotosynthese = Zellatmung (Netto-Gaswechsel null)
- mit steigender Lichtintensität zunächst **linearer Anstieg**
- **Lichtsättigung:** Plateau, weil nun ein anderer Faktor begrenzt (CO₂, Temperatur/Enzyme)
Schattenpflanzen: niedriger Kompensationspunkt und frühere Sättigung.`],
  [T.fs, `Wie beeinflussen **CO₂-Konzentration und Temperatur** die Fotosyntheserate?`, `- **CO₂:** Rate steigt mit der CO₂-Konzentration bis zur Sättigung (CO₂ ist in der Natur oft der begrenzende Faktor)
- **Temperatur:** **Optimumkurve**, weil die Enzyme des Calvin-Zyklus temperaturabhängig sind (RGT-Regel bis zum Optimum, danach Denaturierung); die Lichtreaktionen selbst sind kaum temperaturabhängig
→ **Prinzip des begrenzenden Faktors** (Minimumfaktor).`],
  [T.fs, `Was passiert in den **Primärreaktionen** (lichtabhängige Reaktionen)?`, `Ort: **Thylakoidmembran**
- **Lichtabsorption** durch Pigmente in den Fotosystemen (PS II und PS I)
- **Fotolyse des Wassers** an PS II: 2 H₂O → 4 H⁺ + 4 e⁻ + O₂ → **Sauerstoff entsteht**
- **Elektronentransport** über eine Kette (PS II → PS I) → Aufbau eines **H⁺-Gradienten** → **ATP** über ATP-Synthase
- Elektronen reduzieren **NADP⁺ zu NADPH + H⁺**
Produkte: **ATP und NADPH** (und O₂)`],
  [T.fs, `Beschreibe den **Calvin-Zyklus** in drei Phasen.`, `Ort: **Stroma**
1. **Fixierung:** CO₂ wird durch das Enzym **RubisCO** an **Ribulose-1,5-bisphosphat** (C₅) gebunden → instabiles C₆ zerfällt in **2 × 3-Phosphoglycerat** (C₃)
2. **Reduktion:** Mit **ATP und NADPH** entsteht **Glycerinaldehyd-3-phosphat** (GAP/G3P) – daraus wird u. a. Glucose aufgebaut
3. **Regeneration:** Aus dem Großteil des GAP wird unter **ATP-Verbrauch** wieder Ribulose-1,5-bisphosphat gebildet
Für 1 Glucose: 6 Umläufe, 6 CO₂, 18 ATP, 12 NADPH.`],
  [T.fs, `Wie hängen **Primär- und Sekundärreaktionen** zusammen?`, `Die Primärreaktionen liefern **ATP und NADPH** für den Calvin-Zyklus (Sekundärreaktionen); dieser gibt **ADP, Pᵢ und NADP⁺** zurück. Ohne Licht stoppt daher nach kurzer Zeit auch der Calvin-Zyklus.`],

  // ---------------------------------------------------------------- Zellatmung
  [T.za, `Wie lautet die **Bruttogleichung der Zellatmung**?`, `C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O (+ Energie, bis zu ca. 36–38 ATP nach Schulbuchrechnung; realistisch ca. 30–32 ATP)`],
  [T.za, `Beschreibe den **Bau eines Mitochondriums** und seine Angepasstheiten.`, `- **Doppelmembran**: äußere Membran, **innere Membran mit Cristae** (Faltungen → große Oberfläche für Atmungskette und ATP-Synthase)
- **Intermembranraum** (H⁺-Speicher für den Gradienten)
- **Matrix**: Ort von oxidativer Decarboxylierung und Citratzyklus
- eigene DNA und Ribosomen (Endosymbiontentheorie)`],
  [T.za, `Was passiert in der **Glykolyse**?`, `Ort: **Cytoplasma**
Glucose (C₆) wird schrittweise in **2 Pyruvat** (C₃) zerlegt.
Bilanz: **2 ATP (netto)** und **2 NADH + H⁺**. Kein Sauerstoff nötig.`],
  [T.za, `Was passiert bei der **oxidativen Decarboxylierung**?`, `Ort: **Mitochondrienmatrix**
Pyruvat (C₃) wird zu **Acetyl-CoA** (C₂) umgewandelt: **CO₂ wird abgespalten** (Decarboxylierung) und NAD⁺ zu **NADH** reduziert (Oxidation).
Pro Glucose: 2 CO₂, 2 NADH.`],
  [T.za, `Was passiert im **Citratzyklus** (Tricarbonsäurezyklus)?`, `Ort: **Matrix**
Acetyl-CoA (C₂) verbindet sich mit **Oxalacetat** (C₄) zu **Citrat** (C₆), das schrittweise wieder zu Oxalacetat abgebaut wird.
Pro Umlauf: **2 CO₂, 3 NADH, 1 FADH₂, 1 ATP** (GTP) – pro Glucose läuft er **zweimal**.
Der Kohlenstoff der Glucose ist danach vollständig zu CO₂ oxidiert.`],
  [T.za, `Wie funktioniert die **Atmungskette**?`, `Ort: **innere Mitochondrienmembran**
- NADH und FADH₂ geben **Elektronen** an eine Kette von Proteinkomplexen ab
- Die Energie des Elektronentransports wird genutzt, um **H⁺ in den Intermembranraum zu pumpen** → Protonengradient
- **Sauerstoff** ist der **Endakzeptor** der Elektronen → es entsteht **Wasser**
- H⁺ strömen durch die **ATP-Synthase** zurück → **ATP** (chemiosmotisch)
Hier entsteht der größte Teil des ATP.`],
  [T.za, `Stelle die **Energiebilanz der Zellatmung** auf (Schulbuchrechnung).`, `- Glykolyse: 2 ATP, 2 NADH
- oxidative Decarboxylierung: 2 NADH
- Citratzyklus: 2 ATP, 6 NADH, 2 FADH₂
- Atmungskette: aus 10 NADH und 2 FADH₂ ca. 32–34 ATP
→ **insgesamt ca. 36–38 ATP** pro Glucose (neuere Werte: ca. 30–32).`],
  [T.za, `Warum ist **Sauerstoff** für die Zellatmung unverzichtbar?`, `O₂ ist **Endakzeptor der Elektronen** in der Atmungskette. Fehlt er, stockt die Atmungskette, NADH kann nicht mehr oxidiert werden, der Citratzyklus kommt zum Erliegen → nur noch Glykolyse (+ Gärung) mit 2 ATP pro Glucose.`],

  [T.chrom, `Was ist das **Prinzip der Chromatografie**?`, `Trennung eines **Stoffgemisches** aufgrund unterschiedlicher Verteilung der Stoffe zwischen einer **stationären Phase** (z. B. Kieselgel-Platte) und einer **mobilen Phase** (Laufmittel). Stoffe, die stärker an der stationären Phase haften (meist polarere), wandern langsamer.`],
  [T.chrom, `Wie führst du eine **Dünnschichtchromatografie von Blattfarbstoffen** durch? (Fokus 2027)`, `1. Blätter mit Sand und Lösungsmittel (z. B. Aceton) **zerreiben**, Extrakt abfiltrieren
2. Extrakt als **Startlinie** auf die DC-Platte (mit Bleistift markiert) auftragen
3. Platte in ein Gefäß mit wenig **Laufmittel** stellen (Startlinie über dem Laufmittel!), abdecken
4. Laufmittel steigt auf, Farbstoffe trennen sich
5. **Laufmittelfront markieren**, Banden auswerten (Rf-Werte)`],
  [T.chrom, `Was ist der **Rf-Wert**?`, `Rf = Laufstrecke der Substanz ÷ Laufstrecke der Laufmittelfront (Wert zwischen 0 und 1). Er ist unter gleichen Bedingungen **charakteristisch** für einen Stoff und erlaubt die Identifizierung.`],
  [T.chrom, `Welche **Blattfarbstoffe** kann man im Chromatogramm unterscheiden?`, `- **Carotine** (orange-gelb, sehr unpolar → laufen am weitesten)
- **Chlorophyll a** (blaugrün)
- **Chlorophyll b** (gelbgrün, etwas polarer als Chlorophyll a)
- **Xanthophylle** (gelb, z. B. Lutein)
Die genaue Reihenfolge hängt vom Laufmittel ab; Chlorophyll a läuft meist vor Chlorophyll b.`],

  // ---------------------------------------------------------------- Ökologie
  [T.oeko, `Unterschied **Biotop**, **Biozönose** und **Ökosystem**?`, `**Biotop:** Lebensraum mit seinen **abiotischen** Bedingungen.
**Biozönose:** **Lebensgemeinschaft** aller Organismen in diesem Raum.
**Ökosystem:** Biotop + Biozönose mit ihren Wechselwirkungen.`],
  [T.oeko, `Nenne **abiotische** und **biotische Faktoren**.`, `**Abiotisch** (unbelebt): Temperatur, Licht, Wasser/Feuchtigkeit, pH-Wert, Salzgehalt, Wind, Bodenbeschaffenheit, Mineralstoffe.
**Biotisch** (belebt): Konkurrenz (intra-/interspezifisch), Räuber, Parasiten, Symbionten, Nahrungsangebot, Krankheitserreger.`],
  [T.oeko, `Was zeigt eine **Toleranzkurve**?`, `Die **Vitalität** (Aktivität, Wachstum) einer Art in Abhängigkeit von einem Umweltfaktor:
- **Optimum** (höchste Vitalität), **Pessima** (Überleben ohne Fortpflanzung)
- **Minimum** und **Maximum** begrenzen den **Toleranzbereich**
- **Präferendum**: bevorzugter Bereich
**euryök** = weiter Toleranzbereich, **stenök** = enger Toleranzbereich (gute **Zeigerarten**).`],
  [T.oeko, `Unterschied **physiologische** und **ökologische Potenz**?`, `**Physiologische Potenz:** Toleranzbereich einer Art **ohne Konkurrenz** (z. B. im Labor).
**Ökologische Potenz:** tatsächlicher Bereich **unter natürlichen Bedingungen mit Konkurrenz** – meist **enger oder verschoben**.
Beispiel: Kiefer wächst physiologisch am besten auf mittleren Böden, kommt in der Natur aber v. a. auf sehr trockenen oder nassen Standorten vor, weil sie dort konkurrenzfähig ist.`],
  [T.oeko, `Beschreibe den **Kohlenstoffkreislauf**.`, `- **Fotosynthese** der Produzenten bindet CO₂ aus Luft/Wasser in Biomasse
- **Konsumenten** nehmen Kohlenstoff über die Nahrung auf
- **Zellatmung** aller Lebewesen und **Zersetzung** durch Destruenten setzen CO₂ frei
- **Speicher:** Atmosphäre, Ozeane, Biomasse, Böden/Moore, fossile Lagerstätten, Kalkgestein
- **Mensch:** Verbrennung fossiler Energieträger und Rodung → CO₂-Anstieg (vorindustriell ca. 280 ppm, heute über 420 ppm)`],
  [T.oeko, `Was ist ein **Nahrungsnetz** und welche Trophieebenen gibt es?`, `Die Verknüpfung vieler **Nahrungsketten** in einem Ökosystem.
- **Produzenten** (Pflanzen, Algen: Fotosynthese)
- **Konsumenten** 1. Ordnung (Pflanzenfresser), 2. und 3. Ordnung (Fleischfresser)
- **Destruenten** (Bakterien, Pilze: zersetzen tote Biomasse zu anorganischen Stoffen)`],
  [T.oeko, `Warum spricht man von **Stoffkreislauf**, aber von **Energiefluss**?`, `**Stoffe** (C, N, Mineralstoffe) werden über Destruenten **wiederverwertet** und kreisen.
**Energie** gelangt als **Licht** in das Ökosystem und verlässt es als **Wärme** (Zellatmung). Pro Trophieebene wird nur etwa **10 %** der Energie weitergegeben → **Energiepyramide**; deshalb sind Nahrungsketten kurz.`],
  [T.oeko, `Unterschied **intra-** und **interspezifische Konkurrenz**?`, `**Intraspezifisch:** Konkurrenz **innerhalb einer Art** um Nahrung, Raum, Partner – meist besonders stark (gleiche Ansprüche), wirkt **dichteabhängig** regulierend.
**Interspezifisch:** Konkurrenz **zwischen verschiedenen Arten** um dieselben begrenzten Ressourcen.`],
  [T.oeko, `Was besagt das **Konkurrenzausschlussprinzip**?`, `Zwei Arten mit **identischen ökologischen Nischen** können auf Dauer **nicht im selben Lebensraum koexistieren** – die konkurrenzstärkere verdrängt die andere (Gause).
Koexistenz ist möglich durch **Konkurrenzvermeidung/Einnischung** (unterschiedliche Nahrung, Jagdzeiten, Bereiche).`],
  [T.oeko, `Unterschied **Parasitismus** und **Symbiose**?`, `**Parasitismus:** Ein Organismus (Parasit) lebt **auf Kosten** eines anderen (Wirt) und **schädigt** ihn, meist ohne ihn sofort zu töten (Ekto-/Endoparasiten, z. B. Zecke, Bandwurm).
**Symbiose:** Zusammenleben zweier Arten **zum gegenseitigen Nutzen**, z. B. **Flechten** (Pilz + Alge), **Mykorrhiza** (Pilz + Baumwurzel), **Knöllchenbakterien** + Leguminosen.`],
  [T.oeko, `Welche Regeln beschreiben **Räuber-Beute-Beziehungen** (Lotka-Volterra)?`, `1. Die Populationsgrößen von Räuber und Beute **schwanken periodisch**, die Maxima der Räuber folgen **phasenverzögert** denen der Beute.
2. Langfristig bleiben die **Mittelwerte** beider Populationen konstant.
3. Werden beide gleich stark dezimiert, **erholt sich die Beute schneller**.
Einschränkung: idealisiertes Modell (nur eine Räuber- und eine Beuteart, ohne andere Faktoren).`],
  [T.oeko, `Was ist eine **ökologische Nische**?`, `Die **Gesamtheit der Beziehungen einer Art zu den biotischen und abiotischen Umweltfaktoren** – ihre „Rolle“ im Ökosystem (Ernährungsweise, Aktivitätszeit, Ansprüche). **Kein Ort**, sondern ein Beziehungsgefüge.
**Fundamentale Nische** (ohne Konkurrenz) vs. **realisierte Nische** (mit Konkurrenz). Arten in verschiedenen Kontinenten mit ähnlicher Nische = **Stellenäquivalenz**.`],

  [T.mensch, `Erkläre den **natürlichen** und den **anthropogenen Treibhauseffekt**.`, `**Natürlich:** Kurzwellige Sonnenstrahlung erwärmt die Erde; die Erde gibt **langwellige Wärmestrahlung** ab, die von **Treibhausgasen** (H₂O, CO₂, CH₄, N₂O) teilweise absorbiert und zurückgestrahlt wird → mittlere Temperatur ca. **+15 °C statt −18 °C**.
**Anthropogen:** Zusätzliche Treibhausgase (fossile Brennstoffe, Rodung, Landwirtschaft) verstärken den Effekt → **globale Erwärmung**.`],
  [T.mensch, `Nenne **ökologische Folgen des Klimawandels**.`, `- **Arealverschiebungen** von Arten (pol- und höhenwärts), Aussterben stenöker Arten
- veränderte **Phänologie** (früheres Blühen) → zeitliche Fehlanpassung („Mismatch“) z. B. zwischen Bestäubern und Blüten
- **Ozeanversauerung** (CO₂ → Kohlensäure) → Korallenbleiche, Probleme für Kalkschaler
- Meeresspiegelanstieg, Extremwetter, Ausbreitung von Schädlingen und Krankheitserregern`],
  [T.mensch, `Erkläre die **Eutrophierung eines Sees** als Ursache-Wirkungs-Kette.`, `1. **Nährstoffeintrag** (Phosphat, Nitrat aus Dünger/Abwasser)
2. **Algenblüte** im Oberflächenwasser
3. Abgestorbene Algen sinken ab, **Destruenten** zersetzen sie unter **O₂-Verbrauch**
4. **Sauerstoffmangel** im Tiefenwasser → Fischsterben, anaerober Abbau (Faulschlamm, H₂S, Methan)
5. Phosphat wird aus dem Sediment freigesetzt → **Selbstverstärkung**
Maßnahmen: Kläranlagen mit Phosphatfällung, Uferrandstreifen, Tiefenwasserbelüftung, Entschlammung.`],
  [T.mensch, `Was ist **Ökosystemmanagement**?`, `Ein Vorgehen, das Ökosysteme so nutzt und pflegt, dass ihre **Funktionen und ihre Biodiversität langfristig erhalten** bleiben: Ursachen von Schäden analysieren (Ursache-Wirkungs-Zusammenhänge), Maßnahmen planen (Schutz, Nutzungsregeln, Renaturierung), Erfolg überwachen (Monitoring).`],
  [T.mensch, `Was bedeutet **Renaturierung**? Nenne ein Beispiel.`, `Die **Rückführung** eines vom Menschen veränderten Ökosystems in einen naturnäheren Zustand.
Beispiele: **Wiedervernässung von Mooren** (Moore speichern viel Kohlenstoff; trockengelegte Moore setzen CO₂ frei), Rückbau begradigter Flüsse, Auenrenaturierung (z. B. Emscher im Ruhrgebiet).`],
  [T.mensch, `Was ist **Nachhaltigkeit** in der Nutzung von Ökosystemen?`, `Nur so viel nutzen, wie sich **auf natürliche Weise regenerieren** kann, damit auch künftige Generationen die Ressourcen nutzen können (z. B. Holzeinschlag ≤ Zuwachs, Fischfang unterhalb der Reproduktionsrate). Drei Säulen: ökologisch, ökonomisch, sozial.`],
  [T.mensch, `Was umfasst **Biodiversität** und warum ist sie wichtig?`, `Drei Ebenen: **genetische Vielfalt**, **Artenvielfalt**, **Vielfalt der Ökosysteme**.
Bedeutung: **Ökosystemdienstleistungen** (Bestäubung, Wasserreinigung, Bodenfruchtbarkeit, Klimaregulation), Stabilität und Resilienz von Ökosystemen, Rohstoffe und Medikamente, ethischer Eigenwert.
Bedrohungen: Lebensraumzerstörung, Klimawandel, Übernutzung, Verschmutzung, **invasive Arten (Neobiota)**.`],

  [T.overf, `Wie arbeitet man mit einem **dichotomen Bestimmungsschlüssel**? (Fokus 2027)`, `Man vergleicht das Lebewesen Schritt für Schritt mit **jeweils zwei sich ausschließenden Merkmalsbeschreibungen** (z. B. „Blätter gegenständig“ – „Blätter wechselständig“) und folgt dem passenden Verweis, bis man beim **Artnamen** ankommt. Wichtig: Merkmale genau prüfen, Fachbegriffe kennen, im Zweifel zurückgehen.`],
  [T.overf, `Wie erfasst man **abiotische Faktoren** und Arten in einem Areal?`, `**Abiotisch:** Messgeräte – Thermometer (Luft-/Bodentemperatur), Luxmeter (Licht), Hygrometer (Luftfeuchte), pH-Messung, Bodenfeuchte, Wind.
**Arten (qualitativ):** Artenliste einer Probefläche erstellen, Arten mit Bestimmungsschlüssel bestimmen, Zeigerarten nutzen.`],

  // ---------------------------------------------------------------- Molekulargenetik
  [T.mol, `Beschreibe den **Bau der DNA**.`, `- **Doppelhelix** aus zwei **antiparallelen** Strängen (5'→3' und 3'→5')
- Nukleotide aus **Desoxyribose, Phosphat und Base** (A, T, G, C)
- Zucker-Phosphat-Rückgrat außen, Basen innen
- **komplementäre Basenpaarung:** A–T (2 H-Brücken), G–C (3 H-Brücken)
(Watson & Crick 1953)`],
  [T.mol, `Was bedeutet **semikonservative Replikation** und wie wurde sie nachgewiesen?`, `Jede neue DNA-Doppelhelix besteht aus **einem alten (Matrizen-) und einem neu synthetisierten Strang**.
Nachweis: **Meselson-Stahl-Experiment** (1958) – Bakterien in schwerem ¹⁵N, dann in leichtem ¹⁴N; Dichtegradientenzentrifugation zeigte nach einer Generation nur **mittelschwere** DNA, nach zwei Generationen mittelschwere und leichte.`],
  [T.mol, `Beschreibe den **Ablauf der Replikation**.`, `1. **Helikase** entwindet die Doppelhelix (Replikationsgabel)
2. **Primase** setzt kurze RNA-Primer
3. **DNA-Polymerase** synthetisiert neue Stränge **nur in 5'→3'-Richtung**
- **Leitstrang:** kontinuierlich
- **Folgestrang:** diskontinuierlich in **Okazaki-Fragmenten**
4. Primer werden ersetzt, **Ligase** verknüpft die Fragmente`],
  [T.mol, `Beschreibe die **Transkription**.`, `Ort: **Zellkern** (Eukaryoten)
1. **Initiation:** RNA-Polymerase bindet an den **Promotor** (mit Hilfe von Transkriptionsfaktoren)
2. **Elongation:** Sie liest den **codogenen Strang** (3'→5') und baut **mRNA** komplementär in 5'→3'-Richtung auf (**Uracil statt Thymin**)
3. **Termination** am Terminator
Bei Eukaryoten folgt die **Prozessierung**: 5'-Cap, Poly-A-Schwanz, **Spleißen** (Introns raus, Exons verbunden; alternatives Spleißen möglich).`],
  [T.mol, `Beschreibe die **Translation**.`, `Ort: **Ribosomen** im Cytoplasma
1. **Initiation:** Ribosom bindet an die mRNA, beginnt am **Startcodon AUG** (Methionin)
2. **Elongation:** **tRNAs** mit passendem **Anticodon** bringen Aminosäuren; Peptidbindungen verknüpfen sie; das Ribosom wandert Codon für Codon weiter
3. **Termination:** am **Stoppcodon** (UAA, UAG, UGA) löst sich das Polypeptid`],
  [T.mol, `Nenne die **Eigenschaften des genetischen Codes**.`, `- **Triplett-Code** (3 Basen = 1 Codon = 1 Aminosäure)
- **universell** (bei fast allen Lebewesen gleich)
- **degeneriert/redundant** (mehrere Codons für eine Aminosäure; 61 Codons für 20 AS)
- **eindeutig** (ein Codon = eine AS)
- **kommafrei und nicht überlappend**
- Start- und Stoppcodons`],
  [T.mol, `Wie wird die **Genaktivität bei Eukaryoten durch Transkriptionsfaktoren** reguliert?`, `**Transkriptionsfaktoren** sind Proteine, die an DNA-Abschnitte (Promotor, **Enhancer**, Silencer) binden. Allgemeine TF ermöglichen die Bindung der RNA-Polymerase; spezifische **Aktivatoren** verstärken, **Repressoren** hemmen die Transkription.
So exprimieren verschiedene Zelltypen trotz gleicher DNA unterschiedliche Gene (Zelldifferenzierung), z. B. gesteuert durch Hormone.`],
  [T.mol, `Was ist **DNA-Methylierung** (Epigenetik)?`, `Anhängen von **Methylgruppen an Cytosin** (v. a. in CG-reichen Promotorregionen). Stark methylierte Gene werden **abgeschaltet** (Transkriptionsfaktoren können nicht binden, Chromatin verdichtet sich).
**Epigenetik:** vererbbare Veränderungen der **Genaktivität ohne Änderung der Basensequenz** – beeinflusst durch Umwelt (Ernährung, Stress), werden bei Zellteilungen weitergegeben, sind aber umkehrbar.`],
  [T.mol, `Welche **Genmutationen** gibt es und welche Folgen haben sie?`, `**Substitution** (Basenaustausch):
- **stumm:** gleiche Aminosäure (Redundanz)
- **Missense:** andere Aminosäure (z. B. Sichelzellanämie)
- **Nonsense:** Stoppcodon → verkürztes Protein
**Insertion/Deletion** (nicht durch 3 teilbar): **Rasterverschiebung** → ab der Mutation völlig veränderte Aminosäuresequenz, meist funktionsloses Protein.`],
  [T.mol, `Erkläre die **Sichelzellanämie** als Beispiel für den Zusammenhang Gen – Protein – Merkmal.`, `**Punktmutation** im β-Globin-Gen: Ein Basenaustausch führt zu **Valin statt Glutaminsäure** an Position 6 → Hämoglobin S verklumpt bei O₂-Mangel → **sichelförmige Erythrocyten** → Gefäßverschlüsse, Anämie.
Autosomal-rezessiv vererbt; **Heterozygote** sind relativ **malariaresistent** → Selektionsvorteil in Malariagebieten (Heterozygotenvorteil).`],

  // ---------------------------------------------------------------- Humangenetik
  [T.hum, `Woran erkennst du im Stammbaum einen **autosomal-rezessiven** Erbgang?`, `- Merkmal kann **Generationen überspringen**
- **zwei gesunde Eltern** können ein **krankes Kind** haben (beide heterozygote Überträger)
- beide Geschlechter gleich häufig betroffen
Beispiele: **Mukoviszidose**, Phenylketonurie, Sichelzellanämie.`],
  [T.hum, `Woran erkennst du einen **autosomal-dominanten** Erbgang?`, `- Merkmal tritt in **jeder Generation** auf
- jedes betroffene Kind hat **mindestens einen betroffenen Elternteil**
- zwei Betroffene können ein gesundes Kind haben (beide heterozygot)
- beide Geschlechter gleich häufig
Beispiel: **Chorea Huntington** (Ausbruch meist erst im Erwachsenenalter).`],
  [T.hum, `Woran erkennst du einen **X-chromosomal-rezessiven** Erbgang?`, `- **überwiegend Männer** betroffen (nur ein X-Chromosom, hemizygot)
- Übertragung über **gesunde Mütter (Konduktorinnen)**
- **keine Vater-Sohn-Vererbung**
- Töchter eines betroffenen Vaters sind mindestens Überträgerinnen
Beispiele: **Rot-Grün-Sehschwäche**, **Bluterkrankheit (Hämophilie A)**.`],
  [T.hum, `Wie gehst du bei der **Stammbaumanalyse** vor?`, `1. **Dominant oder rezessiv?** Gesunde Eltern mit krankem Kind → rezessiv; betroffene Eltern mit gesundem Kind → dominant
2. **Autosomal oder gonosomal?** Ausschlusskriterien prüfen (z. B. kranke Tochter eines gesunden Vaters → nicht X-rezessiv; Vater-Sohn-Vererbung → nicht X-chromosomal)
3. **Genotypen** ableiten und **Wahrscheinlichkeiten** berechnen (Kreuzungsschema)`],
  [T.hum, `Was ist **Mukoviszidose (Cystische Fibrose)**?`, `Autosomal-rezessive Erbkrankheit durch Mutation im **CFTR-Gen** (Chloridionenkanal). Fehlender/defekter Kanal → **zäher Schleim** in Lunge, Bauchspeicheldrüse, Darm → Infektionen, Verdauungsprobleme. Häufigste schwere Erbkrankheit in Europa; neue Medikamente (CFTR-Modulatoren) verbessern die Funktion.`],
  [T.hum, `Welche **Gentests** gibt es und welche ethischen Fragen stellen sich?`, `- **Pränataldiagnostik** (Fruchtwasseruntersuchung, Chorionzottenbiopsie, nicht-invasiver Bluttest NIPT)
- **Heterozygotentest** (Überträgerstatus bei Kinderwunsch)
- **prädiktiver Test** (z. B. Huntington)
Ethische Fragen: Recht auf Nichtwissen, psychische Belastung, Schwangerschaftsabbruch, Diskriminierung (Versicherungen), Datenschutz → **genetische Beratung** ist wichtig (Gendiagnostikgesetz).`],
  [T.hum, `Was ist **Gentherapie**? Unterschied somatisch – Keimbahn?`, `Einbringen oder Korrektur von Genen, um eine Krankheit zu behandeln.
- **Somatische Gentherapie:** Körperzellen werden verändert (ex vivo oder in vivo, z. B. mit **viralen Vektoren** oder **CRISPR/Cas9**) → **nicht vererbbar**; z. B. bei spinaler Muskelatrophie oder Sichelzellanämie zugelassen
- **Keimbahntherapie:** Veränderung von Keimzellen/Embryonen → **vererbbar**; in Deutschland **verboten** (Embryonenschutzgesetz)
Risiken: Immunreaktionen, falscher Einbauort, hohe Kosten, ethische Fragen.`],

  // ---------------------------------------------------------------- Evolution
  [T.evo, `Nenne die **Evolutionsfaktoren** der synthetischen Evolutionstheorie.`, `- **Mutation:** neue Allele (ungerichtet)
- **Rekombination:** Neukombination bei Meiose und Befruchtung → Variabilität
- **Selektion:** unterschiedlicher Fortpflanzungserfolg je nach Angepasstheit
- **Gendrift:** zufällige Veränderung der Allelhäufigkeiten (v. a. in kleinen Populationen)
- **Isolation:** unterbindet Genfluss → Artbildung
- Migration/Genfluss
Einheit der Evolution ist die **Population** mit ihrem **Genpool**.`],
  [T.evo, `Welche **Formen der Selektion** gibt es?`, `- **stabilisierend:** Extreme werden benachteiligt, der Mittelwert bleibt (konstante Umwelt)
- **gerichtet (transformierend):** eine Extremform ist im Vorteil → Verschiebung des Mittelwerts (z. B. Antibiotikaresistenz, Industriemelanismus beim Birkenspanner)
- **disruptiv (aufspaltend):** beide Extreme im Vorteil → Aufspaltung, mögliche Artbildung
- **sexuelle Selektion:** Partnerwahl/Konkurrenz um Partner`],
  [T.evo, `Was ist **Gendrift**? Nenne zwei Sonderformen.`, `Die **zufällige Veränderung der Allelhäufigkeiten**, unabhängig von der Angepasstheit – besonders stark in **kleinen Populationen**.
- **Flaschenhalseffekt:** Population wird durch ein Ereignis drastisch verkleinert (z. B. Gepard, See-Elefant) → geringe genetische Vielfalt
- **Gründereffekt:** Wenige Individuen gründen eine neue Population (z. B. auf Inseln) → Allelhäufigkeiten weichen zufällig ab`],
  [T.evo, `Was ist **reproduktive Fitness**?`, `Der **Fortpflanzungserfolg** eines Individuums: sein Beitrag (Anzahl fortpflanzungsfähiger Nachkommen) zum **Genpool der nächsten Generation** im Vergleich zu anderen.
**Gesamtfitness** = direkte Fitness (eigene Nachkommen) + **indirekte Fitness** (Unterstützung Verwandter mit gleichen Genen → **Verwandtenselektion**).`],
  [T.evo, `Was bedeuten **adaptiver Wert von Verhalten** und **Kosten-Nutzen-Analyse**?`, `Verhalten ist durch Selektion entstanden, wenn es die **Fitness erhöht** (adaptiver Wert).
**Kosten-Nutzen-Analyse:** Ein Verhalten lohnt sich, wenn der **Nutzen** (z. B. Energiegewinn, Paarungserfolg) die **Kosten** (Energieaufwand, Zeit, Risiko durch Räuber) übersteigt – z. B. **optimale Nahrungssuche**, Revierverteidigung nur bei mittlerer Ressourcendichte.`],
  [T.evo, `Was ist **Koevolution**? Nenne Beispiele.`, `Die **wechselseitige evolutive Anpassung** zweier Arten, die stark aufeinander einwirken:
- Blüten und **Bestäuber** (Spornlänge – Rüssellänge)
- **Wirt und Parasit** (Abwehr – Gegenanpassung, „Wettrüsten“)
- Räuber und Beute (Tarnung – bessere Sinne)`],
  [T.evo, `Unterscheide **Lamarck** und **Darwin** am Beispiel des Giraffenhalses.`, `**Lamarck:** Giraffen streckten den Hals, um an Blätter zu kommen; die durch **Gebrauch erworbene Verlängerung** wurde **vererbt** (Vererbung erworbener Eigenschaften – widerlegt).
**Darwin:** In der Population gab es **zufällig Variation** der Halslänge; Tiere mit längeren Hälsen hatten **mehr Nachkommen** (Selektion) → Anteil langhalsiger Tiere nahm über Generationen zu.`],
  [T.evo, `Warum ist **Kreationismus / Intelligent Design** keine naturwissenschaftliche Theorie?`, `Er beruft sich auf **übernatürliche Ursachen** (Schöpfer), ist **nicht überprüfbar bzw. falsifizierbar** und macht keine testbaren Vorhersagen. Naturwissenschaft erklärt Phänomene durch **natürliche, empirisch prüfbare Ursachen**. Die Evolutionstheorie wird durch viele unabhängige Belege gestützt (Fossilien, Homologien, Molekularbiologie, Beobachtung).`],

  // ---------------------------------------------------------------- Artbildung, Stammbäume
  [T.stamm, `Was besagt der **populationsgenetische (biologische) Artbegriff**?`, `Eine Art ist eine **Fortpflanzungsgemeinschaft**: Individuen, die sich untereinander **fruchtbar fortpflanzen** können und von anderen solchen Gruppen **reproduktiv isoliert** sind (Mayr).
Grenzen: nicht anwendbar auf ungeschlechtliche Organismen und Fossilien → dort morphologischer Artbegriff.`],
  [T.stamm, `Erkläre die **allopatrische Artbildung**.`, `1. Eine Population wird **geografisch getrennt** (Gebirge, Meer, Fluss)
2. Kein Genfluss mehr; durch **Mutation, Selektion (unterschiedliche Umwelt) und Gendrift** entwickeln sich die Teilpopulationen auseinander
3. Es entsteht **reproduktive Isolation** → treffen sie wieder aufeinander, können sie sich nicht mehr fruchtbar kreuzen → zwei Arten
Beispiel: **Darwinfinken** auf Galápagos (adaptive Radiation).`],
  [T.stamm, `Was ist **sympatrische Artbildung**?`, `Artbildung **ohne geografische Trennung** im selben Gebiet, z. B. durch
- **Polyploidisierung** bei Pflanzen (sofortige Isolation)
- Einnischung in unterschiedliche ökologische Nischen (z. B. Wirtspflanzen bei Insekten)
- zeitliche oder Verhaltensisolation (unterschiedliche Balzrufe)`],
  [T.stamm, `Nenne **Isolationsmechanismen**.`, `**Präzygotisch** (vor der Befruchtung): geografisch, **ökologisch** (verschiedene Lebensräume), **zeitlich** (Paarungszeiten), **ethologisch** (Balzverhalten), **mechanisch** (Geschlechtsorgane passen nicht), **gametisch** (Ei und Spermium verschmelzen nicht).
**Postzygotisch** (nach der Befruchtung): Hybriden sterben ab oder sind **unfruchtbar** (z. B. Maultier).`],
  [T.stamm, `Unterschied **Homologie** und **Analogie**?`, `**Homologie:** Ähnlichkeit aufgrund **gemeinsamer Abstammung** – gleicher Grundbauplan, evtl. unterschiedliche Funktion (z. B. Vorderextremitäten von Mensch, Fledermaus, Wal). Kriterien: Lage, spezifische Qualität, Stetigkeit (Zwischenformen).
**Analogie:** Ähnlichkeit durch **Anpassung an ähnliche Umweltbedingungen** (**Konvergenz**), **ohne** gemeinsame Abstammung (z. B. Flügel von Vogel und Insekt, Grabbeine von Maulwurf und Maulwurfsgrille).`],
  [T.stamm, `Was sind **molekularbiologische Homologien**?`, `Ähnlichkeiten in **DNA-Basensequenzen** oder **Aminosäuresequenzen** von Proteinen (z. B. Cytochrom c). **Je weniger Unterschiede, desto näher verwandt.** Methoden: Sequenzvergleich, DNA-Hybridisierung. Über konstante Mutationsraten lässt sich der Zeitpunkt der Trennung abschätzen (**molekulare Uhr**).`],
  [T.stamm, `Unterschied **ursprüngliche** und **abgeleitete Merkmale**?`, `**Ursprüngliche (plesiomorphe) Merkmale:** schon bei den gemeinsamen Vorfahren vorhanden – sagen wenig über nähere Verwandtschaft aus.
**Abgeleitete (apomorphe) Merkmale:** in einer Linie **neu entstanden**. **Gemeinsame abgeleitete Merkmale** begründen eine Verwandtschaftsgruppe (Stammbaum/Kladogramm).`],
  [T.stamm, `Wie liest bzw. erstellst du einen **Stammbaum (Kladogramm)**?`, `- Verzweigungspunkte = **gemeinsame Vorfahren**, an denen sich Linien trennen
- Arten sind umso näher verwandt, je **jünger ihr letzter gemeinsamer Vorfahr** ist
- Merkmale (abgeleitete) werden an den Ästen eingetragen
- **Sparsamkeitsprinzip:** Der Stammbaum mit den wenigsten Merkmalsänderungen ist am wahrscheinlichsten`],
]

const quiz: QuizTuple[] = [
  [T.neuron, `Welches Ion strömt beim Ruhepotenzial hauptsächlich durch offene Leckkanäle aus?`, [`Na⁺`, `K⁺`, `Cl⁻`, `Ca²⁺`], 1],
  [T.neuron, `Wie viele Ionen transportiert die Na⁺/K⁺-Pumpe pro Zyklus?`, [`2 Na⁺ raus, 3 K⁺ rein`, `3 Na⁺ raus, 2 K⁺ rein`, `1 Na⁺ raus, 1 K⁺ rein`, `3 K⁺ raus, 2 Na⁺ rein`], 1],
  [T.neuron, `Was verursacht die Depolarisation beim Aktionspotenzial?`, [`K⁺-Ausstrom`, `Na⁺-Einstrom durch spannungsgesteuerte Kanäle`, `Cl⁻-Einstrom`, `Die Na⁺/K⁺-Pumpe`], 1],
  [T.neuron, `Wie wird die Reizstärke am Axon codiert?`, [`Über die Höhe der Aktionspotenziale`, `Über die Frequenz der Aktionspotenziale`, `Über die Dauer eines einzelnen APs`, `Gar nicht`], 1],
  [T.neuron, `Wo entstehen bei saltatorischer Erregungsleitung die Aktionspotenziale?`, [`Überall am Axon`, `Nur an den Ranvier'schen Schnürringen`, `Nur am Endknöpfchen`, `In der Myelinscheide`], 1],
  [T.neuron, `Was bewirkt die absolute Refraktärzeit?`, [`Die Verstärkung des Signals`, `Die gerichtete Weiterleitung, da inaktivierte Na⁺-Kanäle kein neues AP zulassen`, `Die Ausschüttung von Transmitter`, `Die Hyperpolarisation`], 1],
  [T.syn, `Welches Ion löst an der präsynaptischen Endigung die Transmitterausschüttung aus?`, [`Na⁺`, `K⁺`, `Ca²⁺`, `Cl⁻`], 2],
  [T.syn, `Wie wirkt ein Hemmstoff der Acetylcholinesterase (z. B. E 605)?`, [`Schlaffe Lähmung durch fehlenden Transmitter`, `Dauererregung, weil ACh nicht abgebaut wird`, `Blockade der Ca²⁺-Kanäle`, `Kein Einfluss`], 1],
  [T.syn, `Curare ist …`, [`ein Agonist am ACh-Rezeptor`, `ein kompetitiver Antagonist am ACh-Rezeptor`, `ein Hemmstoff der Wiederaufnahme`, `ein Ca²⁺-Kanal-Öffner`], 1],
  [T.syn, `Botulinumtoxin führt zu …`, [`Dauerkrampf`, `schlaffer Lähmung durch blockierte ACh-Freisetzung`, `verstärkter Wahrnehmung`, `Hyperpolarisation am Axon`], 1],
  [T.nverf, `Wo befinden sich die Elektroden bei der Messung des Ruhepotenzials?`, [`Beide außen`, `Eine im Axon, eine außen (Bezugselektrode)`, `Beide im Axon`, `Am Muskel`], 1],
  [T.stw, `Bei der chemiosmotischen ATP-Bildung strömen … durch die ATP-Synthase.`, [`Elektronen`, `Protonen (H⁺)`, `Natriumionen`, `Glucosemoleküle`], 1],
  [T.stw, `Eine Endprodukthemmung ist ein Beispiel für …`, [`positive Rückkopplung`, `negative Rückkopplung`, `kompetitive Aktivierung`, `Denaturierung`], 1],
  [T.fs, `Woher stammt der bei der Fotosynthese freigesetzte Sauerstoff?`, [`Aus dem CO₂`, `Aus dem Wasser`, `Aus der Glucose`, `Aus dem Chlorophyll`], 1],
  [T.fs, `Welche Wellenlängen absorbiert Chlorophyll kaum?`, [`Blau`, `Rot`, `Grün`, `Violett`], 2],
  [T.fs, `Wo findet der Calvin-Zyklus statt?`, [`Thylakoidmembran`, `Stroma`, `Cytoplasma`, `Mitochondrienmatrix`], 1],
  [T.fs, `Welches Enzym fixiert CO₂ im Calvin-Zyklus?`, [`ATP-Synthase`, `RubisCO`, `Helikase`, `Acetylcholinesterase`], 1],
  [T.fs, `Was zeigte der Engelmann-Versuch?`, [`Die semikonservative Replikation`, `Dass die Fotosynthese bei blauem und rotem Licht besonders hoch ist`, `Die Lage der Gene auf Chromosomen`, `Das Ruhepotenzial`], 1],
  [T.fs, `Der Lichtkompensationspunkt ist erreicht, wenn …`, [`die Fotosynthese maximal ist`, `Fotosynthese und Zellatmung gleich groß sind`, `kein Licht vorhanden ist`, `die Spaltöffnungen geschlossen sind`], 1],
  [T.za, `Wo findet die Glykolyse statt?`, [`Mitochondrienmatrix`, `Innere Mitochondrienmembran`, `Cytoplasma`, `Zellkern`], 2],
  [T.za, `Was ist der Endakzeptor der Elektronen in der Atmungskette?`, [`NAD⁺`, `Sauerstoff`, `CO₂`, `Pyruvat`], 1],
  [T.za, `Wie oft läuft der Citratzyklus pro Glucosemolekül?`, [`einmal`, `zweimal`, `sechsmal`, `38-mal`], 1],
  [T.chrom, `Welcher Blattfarbstoff wandert bei der DC meist am weitesten?`, [`Chlorophyll b`, `Xanthophylle`, `Carotine`, `Chlorophyll a`], 2],
  [T.oeko, `Eine euryöke Art hat …`, [`einen engen Toleranzbereich`, `einen weiten Toleranzbereich`, `keine Konkurrenten`, `nur ein Präferendum`], 1],
  [T.oeko, `Was besagt die 1. Lotka-Volterra-Regel?`, [`Räuber und Beute schwanken periodisch, die Räuber phasenverzögert`, `Die Beute stirbt immer aus`, `Mittelwerte steigen ständig`, `Räuber erholen sich schneller`], 0],
  [T.oeko, `Die ökologische Nische ist …`, [`der Wohnort einer Art`, `das Beziehungsgefüge einer Art zu ihren Umweltfaktoren`, `ein Versteck`, `die Nahrungskette`], 1],
  [T.oeko, `Wie viel Energie wird etwa pro Trophieebene weitergegeben?`, [`ca. 90 %`, `ca. 50 %`, `ca. 10 %`, `ca. 1 %`], 2],
  [T.mensch, `Was führt bei der Eutrophierung zum Sauerstoffmangel im Tiefenwasser?`, [`Fotosynthese der Algen`, `Zersetzung abgestorbener Algen durch Destruenten`, `Abkühlung des Wassers`, `Fischfang`], 1],
  [T.mensch, `Welches Gas trägt NICHT zum Treibhauseffekt bei?`, [`CO₂`, `Methan`, `Lachgas`, `Stickstoff (N₂)`], 3],
  [T.mol, `Welche Base kommt in RNA statt Thymin vor?`, [`Adenin`, `Uracil`, `Cytosin`, `Guanin`], 1],
  [T.mol, `Das Meselson-Stahl-Experiment belegte …`, [`die Doppelhelix`, `die semikonservative Replikation`, `den genetischen Code`, `das Spleißen`], 1],
  [T.mol, `Eine Deletion von einer Base führt meist zu …`, [`einer stummen Mutation`, `einer Rasterverschiebung`, `keiner Veränderung`, `einer Duplikation`], 1],
  [T.mol, `Was bewirkt starke DNA-Methylierung eines Promotors?`, [`Das Gen wird abgeschaltet`, `Das Gen wird stärker abgelesen`, `Die Basensequenz ändert sich`, `Die DNA wird repliziert`], 0],
  [T.hum, `Zwei gesunde Eltern bekommen ein krankes Kind. Der Erbgang ist …`, [`dominant`, `rezessiv`, `immer X-chromosomal`, `nicht bestimmbar`], 1],
  [T.hum, `Ein typisches Merkmal X-chromosomal-rezessiver Erbgänge ist …`, [`häufige Vater-Sohn-Vererbung`, `überwiegend betroffene Männer`, `nur Frauen betroffen`, `Auftreten in jeder Generation`], 1],
  [T.evo, `Welcher Evolutionsfaktor wirkt zufällig und besonders in kleinen Populationen?`, [`Selektion`, `Gendrift`, `Koevolution`, `Rekombination`], 1],
  [T.evo, `Antibiotikaresistenz bei Bakterien ist ein Beispiel für …`, [`stabilisierende Selektion`, `gerichtete Selektion`, `disruptive Selektion`, `Gendrift`], 1],
  [T.stamm, `Flügel von Vogel und Schmetterling sind …`, [`homolog`, `analog`, `rudimentär`, `atavistisch`], 1],
  [T.stamm, `Welcher Isolationsmechanismus ist postzygotisch?`, [`Unterschiedliche Balz`, `Unterschiedliche Paarungszeit`, `Unfruchtbare Hybriden (z. B. Maultier)`, `Verschiedene Lebensräume`], 2],
  [T.stamm, `Was begründet eine Verwandtschaftsgruppe im Stammbaum?`, [`Gemeinsame ursprüngliche Merkmale`, `Gemeinsame abgeleitete Merkmale`, `Ähnliche Lebensräume`, `Gleiche Körpergröße`], 1],
]

export const bioCards = buildCards('bio', cards)
export const bioQuiz = buildQuiz('bio', quiz)
