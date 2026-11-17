import { buildCards, buildQuiz, type CardTuple, type QuizTuple } from './build'

const T = {
  tropen: 'geo-lw-tropen',
  intensiv: 'geo-lw-intensiv',
  nachhaltig: 'geo-lw-nachhaltig',
  struktur: 'geo-sw-strukturwandel',
  wachstum: 'geo-sw-wachstum',
  stadt: 'geo-st-merkmale',
  metropol: 'geo-st-metropol',
  stadtdemo: 'geo-st-demografie',
  disp: 'geo-dis-merkmale',
  demo: 'geo-dis-demografie',
  strat: 'geo-dis-strategien',
  tert: 'geo-dl-tertiaer',
  tour: 'geo-dl-tourismus',
  meth: 'geo-methoden',
}

const cards: CardTuple[] = [
  // ---------------------------------------------------------------- IF 3 Landwirtschaft
  [T.tropen, `Was kennzeichnet eine **Plantage**?`, `- landwirtschaftlicher **Großbetrieb** in den Tropen/Subtropen
- **Monokultur** von Dauerkulturen (z. B. Kaffee, Kakao, Bananen, Ölpalmen, Tee)
- **Exportorientierung** (Cash Crops), oft ausländisches Kapital
- viele Lohnarbeitskräfte, hoher Kapitaleinsatz
- häufig Aufbereitung/Verarbeitung direkt vor Ort`],
  [T.tropen, `Unterschied **Cash Crops** – **Food Crops**?`, `**Cash Crops** werden für den Verkauf (meist Export) angebaut, z. B. Kaffee, Kakao, Soja, Palmöl.
**Food Crops** dienen der Ernährung der eigenen Bevölkerung bzw. der Selbstversorgung (Subsistenz), z. B. Maniok, Hirse, Mais.`],
  [T.tropen, `Was ist **Shifting Cultivation** (Wanderfeldbau)?`, `Traditionelle Landnutzung im tropischen Regenwald:
- Fläche wird durch **Brandrodung** frei gemacht, Asche düngt kurzzeitig
- 2–3 Jahre Anbau, dann sinkt die Bodenfruchtbarkeit
- lange **Brache** (10–20 Jahre), Wald regeneriert sich
- nachhaltig nur bei **geringer Bevölkerungsdichte**; bei Verkürzung der Brache → Degradierung`],
  [T.tropen, `Warum sind die Böden im tropischen Regenwald trotz üppiger Vegetation **nährstoffarm**?`, `- Tiefgründig verwitterte, alte Böden (z. B. Ferralsole) mit **Zweischicht-Tonmineralen (Kaolinit)** → geringe Austauschkapazität
- Hohe Niederschläge **waschen Nährstoffe aus**
- Nährstoffe stecken fast vollständig in der **Biomasse**: kurzgeschlossener Kreislauf über schnelle Zersetzung und **Mykorrhiza**-Pilze
→ Nach Rodung bricht der Kreislauf zusammen, Böden verarmen schnell.`],
  [T.tropen, `Was ist **Agroforstwirtschaft**?`, `Kombination von **Bäumen/Sträuchern mit Ackerkulturen und/oder Tierhaltung** auf derselben Fläche (z. B. Kakao im Schatten von Edelhölzern).
Vorteile: Erosionsschutz, Humusaufbau, Nährstoffkreislauf ähnlich dem Naturwald, mehrere Einkommensquellen, Kohlenstoffspeicher → nachhaltige Alternative zu Monokulturen.`],
  [T.tropen, `Nenne Ursachen der **Entwaldung** im Amazonasgebiet.`, `- **Rinderweiden** (größter Treiber)
- **Sojaanbau** (v. a. als Futtermittel für den Weltmarkt)
- Holzeinschlag, Bergbau, Infrastruktur (Straßen wie die BR-163)
- Landspekulation, schwache Kontrollen
→ Globale Nachfrage (Fleisch, Futtermittel) verbindet die Entwaldung mit Konsum in Industrieländern.`],
  [T.tropen, `Welche Folgen hat der **Ölpalmenanbau** in Indonesien/Malaysia?`, `**Ökonomisch:** Exporteinnahmen, Arbeitsplätze, Einkommen für Kleinbauern.
**Ökologisch:** Rodung von Regenwald und **Torfmooren** (hohe CO₂-Emissionen, Brände), Verlust von Biodiversität (z. B. Orang-Utan), Monokultur, Pestizide.
**Sozial:** Landkonflikte mit indigenen Gruppen, teils schlechte Arbeitsbedingungen.
Lösungsansätze: Zertifizierung (RSPO), Anbau auf degradierten Flächen.`],
  [T.tropen, `Was versteht man unter **Terms of Trade** und warum sind sie für Rohstoffexportländer oft ungünstig?`, `Terms of Trade = Verhältnis von **Exportpreisen zu Importpreisen** eines Landes.
Agrarrohstoffe unterliegen starken **Preisschwankungen** und langfristig oft sinkenden Realpreisen, während Industriegüter teurer werden → ein Land muss mehr exportieren, um gleich viel importieren zu können.`],
  [T.tropen, `Was bedeutet **Land Grabbing**?`, `Großflächiger **Kauf oder die Pacht von Agrarland** durch Investoren, Konzerne oder Staaten – oft in Ländern des Globalen Südens – für Exportproduktion (Nahrung, Futtermittel, Agrartreibstoffe).
Folgen: Verdrängung lokaler Kleinbauern, Verlust von Ernährungssouveränität, Wasserkonflikte.`],
  [T.tropen, `Was ist das Ziel des **Fairen Handels**?`, `Produzenten im Globalen Süden erhalten **Mindestpreise** und eine **Fairtrade-Prämie** für Gemeinschaftsprojekte; dazu langfristige Lieferbeziehungen, Verbot ausbeuterischer Kinderarbeit, Umweltstandards.
Grenzen: geringer Marktanteil, Kosten der Zertifizierung, Wirkung auf die ärmsten Landlosen begrenzt.`],

  [T.intensiv, `Was versteht man unter **Agrobusiness**?`, `Die **Verflechtung der Landwirtschaft mit vor- und nachgelagerten Wirtschaftsbereichen** (Saatgut, Dünger, Futtermittel, Maschinen ↔ Verarbeitung, Handel, Logistik) unter der Kontrolle großer Unternehmen.
Kennzeichen: hoher Kapitaleinsatz, Spezialisierung, Massenproduktion, Vertragslandwirtschaft.`],
  [T.intensiv, `Unterschied **vertikale** und **horizontale Integration** im Agrobusiness?`, `**Vertikal:** Ein Unternehmen kontrolliert **mehrere Stufen der Wertschöpfungskette** (z. B. Futtermittel → Mast → Schlachtung → Vermarktung).
**Horizontal:** Zusammenschluss von Unternehmen **derselben Stufe** (z. B. mehrere Schlachthöfe) → Marktmacht.`],
  [T.intensiv, `Was ist **Veredelungswirtschaft**? Nenne ein deutsches Beispielgebiet.`, `Umwandlung **pflanzlicher Erzeugnisse (Futtermittel) in tierische Produkte** (Fleisch, Eier, Milch) – meist in Massentierhaltung mit importiertem Futter (Soja).
Beispiel: **Südoldenburg** (Landkreise Vechta und Cloppenburg) – „Schweine- und Geflügelgürtel“; Probleme: Gülleüberschuss, Nitrat im Grundwasser, Tierwohl, Geruch.`],
  [T.intensiv, `Wodurch kommt es bei Bewässerungsfeldbau in Trockengebieten zur **Versalzung**?`, `- Bewässerungswasser enthält gelöste Salze
- hohe **Verdunstung** → Wasser verdunstet, Salze bleiben zurück
- zu viel Bewässerung ohne **Drainage** → Grundwasserspiegel steigt, **kapillarer Aufstieg** bringt Salze an die Oberfläche
Gegenmaßnahmen: Drainage, Tröpfchenbewässerung, salztolerante Sorten, Auswaschung mit Überschusswasser.`],
  [T.intensiv, `Was kennzeichnet den Gemüseanbau in **Almería** (Südspanien)?`, `- „**Plastikmeer**“: über 30 000 ha Gewächshäuser (Invernaderos)
- **Enarenado**-Verfahren: Schichten aus Mist und Sand speichern Wärme/Feuchte
- Ganzjährige Produktion für den europäischen Markt (Tomaten, Paprika …)
Probleme: **Übernutzung des Grundwassers**, Versalzung, Plastikmüll, Pestizide, prekäre Arbeitsbedingungen migrantischer Erntehelfer.`],
  [T.intensiv, `Nenne Merkmale der **Intensivierung** in der Landwirtschaft der gemäßigten Zone.`, `- **Mechanisierung** und Automatisierung
- **Spezialisierung** auf wenige Produkte, größere Betriebe (Betriebskonzentration)
- hoher Einsatz von **Dünger, Pflanzenschutzmitteln**, Hochleistungssorten/-rassen
- Flurbereinigung, größere Schläge
- steigende Flächenproduktivität bei sinkender Zahl der Beschäftigten`],
  [T.intensiv, `Welche Rolle spielt **Kalifornien** als Beispiel intensiver Landwirtschaft in den Subtropen?`, `Central Valley: Obst, Gemüse, Nüsse, Wein auf Bewässerungsbasis (Wasser aus der Sierra Nevada über Kanäle/Aquädukte).
Probleme: Dürren, **Grundwasserabsenkung** (Landabsenkung), Konkurrenz um Wasser mit Städten, Versalzung → Anpassung durch effizientere Bewässerung und Wasserrechte.`],

  [T.nachhaltig, `Was ist **Desertifikation**?`, `Die **Degradierung von Land in Trockengebieten** (arid, semiarid, subhumid) durch **Klimaschwankungen und menschliche Aktivitäten** (Überweidung, Abholzung für Brennholz, falsche Bewässerung, Ausweitung des Ackerbaus).
Beispiel: **Sahelzone**. Folgen: Bodenerosion, sinkende Erträge, Migration.`],
  [T.nachhaltig, `Wie wirkt sich der **Klimawandel** auf die Landwirtschaft aus? (Fokus 2027)`, `- Verschiebung der **Anbaugrenzen** polwärts und in größere Höhen
- häufigere **Dürren, Hitzewellen, Starkregen** (Erosion, Ernteausfälle)
- Wasserknappheit, Versalzung in Trockengebieten
- neue Schädlinge/Krankheiten, verschobene Vegetationsperioden
- teils positive Effekte in höheren Breiten (längere Wachstumszeit, CO₂-Düngeeffekt)
→ Globaler Süden ist meist stärker betroffen.`],
  [T.nachhaltig, `Wie trägt die Landwirtschaft selbst zum **Klimawandel** bei?`, `- **Methan (CH₄):** Wiederkäuer (Rinder), Nassreisanbau, Gülle
- **Lachgas (N₂O):** Stickstoffdüngung
- **CO₂:** Landnutzungsänderung (Rodung, Trockenlegung von Mooren), Maschinen, Düngerproduktion`],
  [T.nachhaltig, `Nenne **Anpassungsstrategien** der Landwirtschaft an den Klimawandel.`, `- hitze-/dürretolerante Sorten, angepasste Fruchtfolgen, Mischkulturen
- effiziente Bewässerung (Tröpfchen), Wasserspeicherung
- **Humusaufbau**, Zwischenfrüchte, Mulchen (Wasserspeicherung, Erosionsschutz)
- Agroforst, Hecken (Windschutz)
- Versicherungen, Diversifizierung der Einkommen`],
  [T.nachhaltig, `Was ist **virtuelles Wasser**?`, `Die Wassermenge, die für die **Herstellung eines Produkts** insgesamt verbraucht wird (z. B. ca. 15 000 l für 1 kg Rindfleisch, ca. 140 l für eine Tasse Kaffee).
Über den Handel wird virtuelles Wasser „exportiert“ – problematisch, wenn wasserarme Regionen wasserintensive Exportgüter produzieren.`],
  [T.nachhaltig, `Was kennzeichnet **ökologischen Landbau**?`, `- kein Einsatz synthetischer Dünger und Pestizide, keine Gentechnik
- geschlossene Nährstoffkreisläufe, vielfältige Fruchtfolgen, Leguminosen
- artgerechte Tierhaltung mit Flächenbindung
Vorteile: Boden-, Wasser-, Artenschutz. Nachteile: geringere Erträge → höherer Flächenbedarf, höhere Preise.`],
  [T.nachhaltig, `Was ist **Precision Farming**?`, `**Teilflächenspezifische Bewirtschaftung** mithilfe von GPS, Sensoren, Drohnen, Satellitendaten und Software: Dünger, Wasser und Pflanzenschutz werden genau dort und so viel eingesetzt wie nötig.
→ Ressourcenschonung, Kostensenkung; aber hohe Investitionen, Datenabhängigkeit, eher für Großbetriebe.`],
  [T.nachhaltig, `Formen der **Bodenerosion** und Schutzmaßnahmen?`, `**Wassererosion** (Starkregen, Hanglage, unbedeckter Boden) und **Winderosion** (trockene, offene Flächen).
Schutz: ganzjährige Bodenbedeckung, Konturpflügen (hangparallel), Terrassen, Hecken/Windschutzstreifen, Direktsaat/Mulchsaat, Agroforst.`],

  // ---------------------------------------------------------------- IF 4 Standortfaktoren
  [T.struktur, `Unterschied **harte** und **weiche Standortfaktoren**?`, `**Harte** (quantifizierbar, direkt kostenwirksam): Verkehrsanbindung, Flächenangebot und -preise, Arbeitskräfte, Lohnkosten, Steuern/Subventionen, Energie, Absatzmarkt, Rohstoffe.
**Weiche** (schwer messbar): Image, Wohn- und Freizeitwert, Kultur- und Bildungsangebot, Wirtschaftsklima, Verwaltungsfreundlichkeit, Umweltqualität.
→ Im Strukturwandel gewinnen weiche Faktoren und Wissen an Bedeutung.`],
  [T.struktur, `Warum war das **Ruhrgebiet** ein klassischer Montanstandort?`, `- Steinkohlevorkommen (Kohle als Energie und für Koks)
- Eisenerz anfangs vor Ort, später Import über Rhein/Häfen
- Wasserwege (Rhein, Kanäle), dichtes Eisenbahnnetz
- große Zahl an Arbeitskräften (Zuwanderung)
→ Kohle und Stahl bildeten einen eng verflochtenen Industriekomplex.`],
  [T.struktur, `Wodurch wurde der **Strukturwandel im Ruhrgebiet** ausgelöst?`, `- **Kohlekrise ab 1958:** billigere Importkohle und Erdöl, teurer Untertagebau
- **Stahlkrise ab den 1970ern:** Überkapazitäten, Konkurrenz aus Asien, Rationalisierung
- Monostruktur → hohe Arbeitslosigkeit, Abwanderung, Industriebrachen
- 2018 schloss die letzte Steinkohlezeche (Prosper-Haniel in Bottrop).`],
  [T.struktur, `Welche Maßnahmen prägten den **Strukturwandel im Ruhrgebiet**?`, `- Gründung von **Hochschulen** ab den 1960ern (Ruhr-Universität Bochum 1965) → Wissenschaft, Technologiezentren
- Ansiedlung von Dienstleistung, Logistik, Gesundheitswirtschaft, IT
- **IBA Emscher Park (1989–1999):** ökologischer Umbau der Emscher, Industriekultur (Landschaftspark Duisburg-Nord, Zeche Zollverein – UNESCO-Welterbe 2001)
- Revitalisierung von Brachen (z. B. CentrO Oberhausen, Phoenix-See Dortmund)`],
  [T.struktur, `Was ist **Deindustrialisierung**?`, `Der **Rückgang des industriellen Sektors** (Beschäftigte und Wertschöpfung) in einer Region oder einem Land, z. B. durch Rationalisierung, Verlagerung in Billiglohnländer oder Nachfragerückgang.
Gleichzeitig wächst meist der Dienstleistungssektor (**Tertiärisierung**).`],
  [T.struktur, `Was versteht man unter der **Revitalisierung von Industriebrachen**?`, `Die **Wiedernutzung ehemals industriell genutzter Flächen** (Brownfields) für neue Zwecke: Gewerbe, Wohnen, Freizeit, Kultur, Grünflächen.
Herausforderungen: Altlasten (Bodenkontamination), Kosten, Planung. Vorteile: Flächenrecycling statt Neuversiegelung auf der „grünen Wiese“.`],
  [T.struktur, `Was beschreibt das Modell des **Lebenszyklus von Industrieregionen**?`, `Industrieregionen durchlaufen Phasen wie Produkte: **Aufstieg** (Gründung, Wachstum), **Reife/Blüte**, **Stagnation und Niedergang** (veraltete Branchen, Monostruktur, „Lock-in“) und ggf. **Erneuerung** durch Strukturwandel, Innovation und Diversifizierung.`],

  [T.wachstum, `Was ist ein **Cluster** (nach Porter)?`, `Eine **räumliche Konzentration von Unternehmen einer Branche** und verbundener Einrichtungen (Zulieferer, Dienstleister, Hochschulen, Forschungsinstitute), die zusammenarbeiten und konkurrieren.
Vorteile: Wissensaustausch, spezialisierte Arbeitskräfte, Innovation, gemeinsame Infrastruktur. Beispiel: Silicon Valley, Medizintechnik in Tuttlingen.`],
  [T.wachstum, `Was sind **Agglomerationsvorteile**?`, `Vorteile durch die **räumliche Ballung** von Unternehmen und Menschen:
- **Lokalisationsvorteile:** viele Betriebe derselben Branche (Zulieferer, Fachkräfte)
- **Urbanisationsvorteile:** große Stadt mit vielfältiger Infrastruktur, Markt, Dienstleistungen
- Fühlungsvorteile (persönlicher Austausch)
Nachteile bei zu starker Ballung: hohe Mieten, Verkehr, Umweltbelastung (Agglomerationsnachteile).`],
  [T.wachstum, `Was beschreiben die **Kondratieff-Zyklen**?`, `Lange Konjunkturwellen (ca. **40–60 Jahre**), ausgelöst durch **Basisinnovationen**:
1. Dampfmaschine/Textil, 2. Eisenbahn/Stahl, 3. Elektrotechnik/Chemie, 4. Automobil/Petrochemie, 5. Informations- und Kommunikationstechnik, 6. (diskutiert) Gesundheit, Umwelt, KI.
Regionen, die neue Basisinnovationen tragen, werden zu Wachstumsregionen.`],
  [T.wachstum, `Welche Standortfaktoren zeichnen **High-Tech-Wachstumsregionen** aus?`, `- Hochschulen und Forschungseinrichtungen (Wissenstransfer, Spin-offs)
- hochqualifizierte Arbeitskräfte, attraktive weiche Standortfaktoren
- **Risikokapital**, Gründerkultur, Netzwerke
- sehr gute digitale und Verkehrsinfrastruktur (Flughafen)
Beispiele: Silicon Valley, Raum München, Region Bangalore.`],
  [T.wachstum, `Inwiefern ist **digitale Infrastruktur** ein neuer Standortfaktor? (Fokus 2027)`, `Breitband/Glasfaser, 5G und **Rechenzentren** sind Voraussetzung für datenintensive Unternehmen, Homeoffice, Industrie 4.0 und Onlinehandel.
Räume mit schlechter Anbindung (oft ländliche Regionen) fallen zurück → **digitale Kluft** verstärkt Disparitäten; gute Anbindung kann ländliche Räume aber auch aufwerten.`],
  [T.wachstum, `Wie verändert der **Onlinehandel** Raumstrukturen? (Fokus 2027)`, `- Neue **Logistikzentren** an Autobahnknoten und in Stadtnähe (Flächenverbrauch, Lkw-Verkehr)
- mehr Lieferverkehr auf der „**letzten Meile**“ (KEP-Dienste)
- Bedeutungsverlust des stationären Einzelhandels → **Leerstand in Innenstädten**, Umnutzung zu Wohnen/Gastronomie/Erlebnis
- Konzentration bei großen Plattformen`],
  [T.wachstum, `Wie verändern Homeoffice und Digitalisierung die **Pendlerströme**? (Fokus 2027)`, `- weniger tägliche Pendelfahrten, Spitzen im Berufsverkehr flachen ab
- Beschäftigte akzeptieren **größere Distanzen** zum Arbeitsort, da nur an einzelnen Tagen gependelt wird
- steigende Nachfrage nach Wohnraum im **Umland/ländlichen Raum**
- Büroflächen in Zentren werden teilweise umgenutzt`],
  [T.wachstum, `Was meint die **Verlagerung von Arbeitsplätzen** im Kontext der Digitalisierung? (Fokus 2027)`, `- **Offshoring** digitaler Dienstleistungen (IT, Callcenter, Buchhaltung) in Länder mit niedrigeren Löhnen (z. B. Indien, Osteuropa)
- Automatisierung ersetzt Routinetätigkeiten, schafft neue hochqualifizierte Jobs
- ortsunabhängiges Arbeiten (Remote Work) löst Arbeitsplatz und Wohnort teilweise voneinander`],

  // ---------------------------------------------------------------- IF 5 Stadt
  [T.stadt, `Beschreibe das **Ringmodell nach Burgess**.`, `Konzentrische Zonen um den Stadtkern (Chicago, 1920er):
1. **CBD** (Central Business District)
2. Übergangszone (Mischnutzung, Verfall, Zuwanderer)
3. Wohngebiete der Arbeiter
4. Wohngebiete der Mittelschicht
5. Pendlerzone
Kritik: idealisiert, berücksichtigt Verkehrsachsen und Topografie nicht.`],
  [T.stadt, `Was beschreibt das **Sektorenmodell nach Hoyt**?`, `Die Stadt wächst in **Sektoren entlang von Verkehrsachsen**; Viertel gleicher Nutzung bzw. sozialer Schicht dehnen sich keilförmig vom Zentrum nach außen aus (z. B. Oberschicht-Sektor, Industrie-Sektor entlang Bahnlinie).`],
  [T.stadt, `Was ist das **Mehrkernmodell (Harris & Ullman)**?`, `Städte entwickeln sich um **mehrere Kerne** (CBD, Industriegebiete, Nebenzentren, Hochschule, Flughafen) statt um einen einzigen Mittelpunkt → realistischer für heutige polyzentrische Stadtregionen.`],
  [T.stadt, `Was ist **Gentrifizierung**? Nenne die typischen Phasen.`, `Aufwertung eines (innenstadtnahen) Wohnviertels mit **Verdrängung** der angestammten, einkommensschwächeren Bevölkerung.
Phasen: 1. **Pioniere** (Studierende, Künstler) ziehen wegen günstiger Mieten zu → 2. Viertel wird „hip“, Investitionen, Sanierung → 3. **Gentrifier** (gut verdienende Haushalte) ziehen zu, Mieten steigen → 4. Verdrängung, Umwandlung in Eigentumswohnungen.
Gegenmaßnahmen: Milieuschutz, Mietpreisbremse, sozialer Wohnungsbau.`],
  [T.stadt, `Was versteht man unter **Segregation**?`, `Die **räumliche Trennung** von Bevölkerungsgruppen in einer Stadt nach sozialen (Einkommen), ethnischen oder demografischen Merkmalen (Alter, Haushaltsform).
Ursachen: Wohnungsmarkt (Mietpreise), Diskriminierung, freiwillige Nähe zu Gleichen. Folgen: Benachteiligung von Quartieren, Bildungsungleichheit.`],
  [T.stadt, `Was sind **Suburbanisierung** und **Reurbanisierung**?`, `**Suburbanisierung:** Verlagerung von Bevölkerung, Gewerbe und Handel aus der Kernstadt ins **Umland** (Eigenheim im Grünen, Auto, Flächenpreise) → Zersiedelung, Pendlerverkehr.
**Reurbanisierung:** Wiedergewinn von Bevölkerung in der **Kernstadt** (urbane Lebensstile, kurze Wege, Single-/Doppelverdiener-Haushalte, Aufwertung der Innenstädte).`],
  [T.stadt, `Wie entsteht eine **urbane Hitzeinsel**? (Fokus Klimawandel)`, `- **Versiegelung** (Asphalt, Beton) speichert Wärme und gibt sie nachts ab
- wenig Vegetation und Wasser → geringe **Verdunstungskühlung**
- dichte Bebauung behindert **Luftaustausch** (Frischluftschneisen fehlen)
- Abwärme aus Verkehr, Industrie, Klimaanlagen
→ Städte sind besonders nachts mehrere Grad wärmer als das Umland; Klimawandel verstärkt Hitzestress.`],
  [T.stadt, `Nenne Maßnahmen zur **Klimaanpassung von Städten**. (Fokus 2027)`, `- **Grün- und Wasserflächen**, Stadtbäume, Dach- und Fassadenbegrünung
- **Frischluftschneisen** freihalten
- Entsiegelung, helle Oberflächen (Albedo)
- **Schwammstadt**-Prinzip gegen Starkregen
- Hitzeaktionspläne, Verschattung, kühle Räume für vulnerable Gruppen`],
  [T.stadt, `Was ist das Prinzip der **Schwammstadt**?`, `Regenwasser wird **dort, wo es fällt, aufgenommen und gespeichert** statt schnell in die Kanalisation abgeleitet: Versickerungsmulden, Rigolen, Gründächer, Zisternen, entsiegelte Flächen.
Nutzen: Schutz vor Überflutung bei Starkregen, Wasser für Stadtgrün in Trockenzeiten, Kühlung durch Verdunstung.`],
  [T.stadt, `Was kennzeichnet eine **Smart City**? (Fokus Digitalisierung)`, `Einsatz digitaler Technologien zur effizienteren und nachhaltigeren Stadtentwicklung: intelligente Verkehrssteuerung, Sharing-Angebote, Sensorik für Energie, Wasser und Luftqualität, digitale Verwaltung, Bürgerbeteiligung.
Kritik: Datenschutz, Überwachung, Abhängigkeit von Tech-Konzernen, digitale Spaltung.`],
  [T.stadt, `Wie verändert die Digitalisierung die **Innenstädte**? (Fokus 2027)`, `- Onlinehandel → sinkende Passantenfrequenz, **Leerstand**, Filialschließungen
- Umnutzung von Ladenlokalen (Gastronomie, Wohnen, Coworking, Pop-up-Stores, Bildung)
- Innenstadt als **Erlebnis- und Begegnungsort** statt reiner Einkaufsort
- Click & Collect, digitale Schaufenster`],

  [T.metropol, `Unterschied **Verstädterungsgrad** und **Verstädterungsrate**?`, `**Verstädterungsgrad:** **Anteil** der in Städten lebenden Bevölkerung an der Gesamtbevölkerung (in %).
**Verstädterungsrate:** **Wachstum** dieses Anteils bzw. der Stadtbevölkerung pro Jahr.
Industrieländer: hoher Grad, geringe Rate; Länder des Globalen Südens: oft geringer Grad, hohe Rate.`],
  [T.metropol, `Was ist eine **Megastadt**, was eine **Global City**?`, `**Megastadt:** Stadt bzw. Agglomeration mit **mehr als 10 Mio. Einwohnern** (quantitatives Kriterium), z. B. Lagos, Dhaka.
**Global City** (Saskia Sassen): **Steuerungszentrale der Weltwirtschaft** mit Konzernzentralen, Börsen, Finanz- und unternehmensnahen Dienstleistungen (qualitatives Kriterium), z. B. New York, London, Tokio. Nicht jede Megastadt ist eine Global City.`],
  [T.metropol, `Was bedeutet **Metropolisierung** und was ist eine **Primatstadt**?`, `**Metropolisierung:** Konzentration von Bevölkerung, Wirtschaft, Macht und Kultur auf **wenige große Städte** eines Landes.
**Primatstadt:** Die größte Stadt ist um ein Vielfaches größer als die zweitgrößte und dominiert das Land (z. B. Lima, Bangkok) – Ausdruck starker räumlicher Disparitäten.`],
  [T.metropol, `Nenne **Push- und Pull-Faktoren** der Land-Stadt-Wanderung.`, `**Push (ländlicher Raum):** Armut, fehlende Arbeitsplätze, Landknappheit, schlechte Bildung/Gesundheitsversorgung, Dürren/Klimafolgen, Konflikte.
**Pull (Stadt):** Hoffnung auf Arbeit und Einkommen, Bildung, medizinische Versorgung, Infrastruktur, städtisches Leben, soziale Netzwerke bereits Zugewanderter.`],
  [T.metropol, `Was versteht man unter **Marginalisierung** und **Marginalsiedlungen**?`, `**Marginalisierung:** Prozess, durch den Bevölkerungsgruppen an den **gesellschaftlichen und räumlichen Rand** gedrängt werden (Armut, fehlender Zugang zu Arbeit, Bildung, Infrastruktur).
**Marginalsiedlungen** (Favelas, Slums, Barriadas): oft **informelle** Siedlungen ohne Landtitel, mit mangelhafter Infrastruktur (Wasser, Abwasser, Strom), häufig in Risikolagen (Hänge, Überschwemmungsgebiete).`],
  [T.metropol, `Was ist der **informelle Sektor**?`, `Wirtschaftliche Tätigkeiten **außerhalb staatlicher Regulierung** (keine Steuern, kein Arbeitsvertrag, keine soziale Absicherung), z. B. Straßenhandel, Müllsammeln, Kleinhandwerk.
Bedeutung: Überlebensstrategie und Einkommensquelle für viele Stadtbewohner im Globalen Süden; Nachteile: Unsicherheit, geringe Löhne, kein Arbeitsschutz.`],
  [T.metropol, `Was ist **Fragmentierung** in Metropolen?`, `Das kleinräumige Nebeneinander stark unterschiedlicher, voneinander **abgeschotteter Stadtbereiche**: **Gated Communities**, Malls und Business-Parks der Wohlhabenden direkt neben Marginalsiedlungen – verbunden mit sozialer Polarisierung und Sicherheitsdenken.`],
  [T.metropol, `Nenne Probleme schnell wachsender Megastädte und Lösungsansätze.`, `**Probleme:** Wohnungsnot, informelle Siedlungen, Verkehrsinfarkt, Luft- und Wasserverschmutzung, Müll, unzureichende Ver- und Entsorgung, Kriminalität, Überlastung der Verwaltung.
**Ansätze:** Slum-Upgrading (Infrastruktur statt Abriss), sozialer Wohnungsbau, ÖPNV (z. B. Bus Rapid Transit, Seilbahnen wie in Medellín), Dezentralisierung, Stärkung ländlicher Räume.`],

  [T.stadtdemo, `Welche Herausforderungen bringt der **demografische Wandel** für Städte?`, `- **Alterung:** Bedarf an barrierefreiem Wohnraum, Pflege, ÖPNV-Anpassung
- **Schrumpfung** (v. a. in strukturschwachen Regionen): Leerstand, unterausgelastete Infrastruktur, Rückbau
- **Wachstum** in Schwarmstädten: Wohnungsmangel, steigende Mieten
- Zuwanderung: Integration, Bildung, Quartiersentwicklung`],
  [T.stadtdemo, `Was versteht man unter **Stadtumbau** in schrumpfenden Städten?`, `Gezielte Anpassung an sinkende Bevölkerung: **Rückbau** leerstehender Wohnungen (v. a. Plattenbauten), Aufwertung von Quartieren, Umnutzung von Flächen zu Grün, Konzentration der Infrastruktur.
Beispiel: Programme „Stadtumbau Ost/West“ in Deutschland.`],
  [T.stadtdemo, `Welche **Leitbilder** prägen die zukunftsorientierte Stadtentwicklung?`, `- **kompakte Stadt / Stadt der kurzen Wege:** Nutzungsmischung, Innenentwicklung vor Außenentwicklung
- **nachhaltige, klimagerechte Stadt** (Leipzig-Charta)
- **soziale Stadt:** Durchmischung, Teilhabe
- autoarme/fahrradfreundliche Stadt, 15-Minuten-Stadt`],

  // ---------------------------------------------------------------- IF 6 Disparitäten
  [T.disp, `Was misst der **Human Development Index (HDI)**?`, `Ein zusammengesetzter Entwicklungsindex (UNDP, Werte 0–1) aus drei Dimensionen:
1. **Gesundheit:** Lebenserwartung bei Geburt
2. **Bildung:** mittlere und erwartete Schulbesuchsjahre
3. **Lebensstandard:** Bruttonationaleinkommen pro Kopf (Kaufkraftparität)
Vorteil gegenüber BIP/Kopf: mehrdimensional.`],
  [T.disp, `Was gibt der **Gini-Koeffizient** an?`, `Das Maß für die **Ungleichverteilung** (meist von Einkommen oder Vermögen) in einer Gesellschaft: **0 = völlige Gleichverteilung**, **1 (bzw. 100) = maximale Ungleichheit**.
Grundlage ist die Lorenzkurve.`],
  [T.disp, `Warum ist das **BIP pro Kopf** als Entwicklungsindikator nur begrenzt aussagekräftig?`, `- Durchschnittswert verdeckt **Ungleichverteilung**
- informeller Sektor und Subsistenz werden kaum erfasst
- sagt nichts über Bildung, Gesundheit, Umweltqualität, Freiheit aus
- Preisniveauunterschiede (deshalb Kaufkraftparität)`],
  [T.disp, `Was besagt die **Modernisierungstheorie**, was die **Dependenztheorie**?`, `**Modernisierungstheorie:** Unterentwicklung hat **interne Ursachen** (traditionelle Strukturen); Entwicklung erfolgt durch Nachholen des westlichen Weges (Industrialisierung, Kapital, Technologie) – Stufenmodell (Rostow).
**Dependenztheorie:** Unterentwicklung entsteht durch **externe Abhängigkeit** von den Industrieländern (Kolonialismus, ungleicher Tausch, Rohstoffexport) – Zentrum beutet Peripherie aus.`],
  [T.disp, `Erkläre das **Zentrum-Peripherie-Modell**.`, `**Zentren** (wirtschaftsstarke Räume) ziehen Kapital, Arbeitskräfte und Innovationen an (**Entzugseffekte/Backwash**), während **Peripherien** zurückfallen. Ausbreitungseffekte (Spread) in die Peripherie sind oft schwächer.
Gilt auf globaler, nationaler und regionaler Ebene (z. B. Küste vs. Hinterland in China).`],
  [T.disp, `Nenne **Ursachen räumlicher Disparitäten**.`, `- naturräumliche Faktoren (Klima, Relief, Rohstoffe, Lage zum Meer)
- historische Faktoren (Kolonialismus, Industrialisierungszeitpunkt)
- politische Faktoren (Stabilität, Korruption, Bildungssystem, Förderung bestimmter Regionen)
- wirtschaftliche Faktoren (Agglomeration, Infrastruktur, Weltmarkteinbindung)
- demografische Faktoren (Bevölkerungswachstum, Abwanderung)`],

  [T.demo, `Beschreibe das **Modell des demografischen Übergangs**.`, `Fünf Phasen:
1. **Prätransformativ:** hohe Geburten- und Sterberate, geringes Wachstum
2. **Frühtransformativ:** Sterberate sinkt (Medizin, Hygiene, Ernährung), Geburtenrate bleibt hoch → Wachstum steigt
3. **Mitteltransformativ:** Geburtenrate beginnt zu sinken, maximales Wachstum
4. **Spättransformativ:** Geburtenrate sinkt stark, Wachstum nimmt ab
5. **Posttransformativ:** niedrige Geburten- und Sterberate, Stagnation oder Schrumpfung
Kritik: basiert auf europäischer Entwicklung, nicht zwingend übertragbar.`],
  [T.demo, `Welche Formen von **Bevölkerungspyramiden** gibt es und wofür stehen sie?`, `- **Pyramide:** hohe Geburtenrate, junge Bevölkerung, starkes Wachstum (z. B. Niger)
- **Glocke:** stabile Bevölkerung, Geburten- und Sterberate ähnlich
- **Urne:** niedrige Geburtenrate, Überalterung, Schrumpfung (z. B. Japan, Deutschland)`],
  [T.demo, `Was versteht man unter **Tragfähigkeit** eines Raumes?`, `Die **maximale Zahl von Menschen**, die in einem Raum auf Dauer unter Berücksichtigung des Lebensstandards und ohne Schädigung der natürlichen Lebensgrundlagen versorgt werden kann.
Abhängig von Naturraum, Technik, Wirtschaft, Handel und Konsumniveau.`],
  [T.demo, `Gegenüberstellung **Malthus** und **Boserup**?`, `**Malthus (1798):** Bevölkerung wächst exponentiell, Nahrungsmittelproduktion nur linear → Hungerkrisen begrenzen die Bevölkerung.
**Boserup (1965):** Bevölkerungsdruck führt zu **Innovationen und Intensivierung** der Landwirtschaft → Tragfähigkeit steigt.`],
  [T.demo, `Was ist die **demografische Dividende**?`, `Ein wirtschaftliches **Wachstumspotenzial**, das entsteht, wenn nach sinkender Geburtenrate der **Anteil der Erwerbsfähigen** groß ist und der Anteil abhängiger Kinder und Älterer klein.
Wird nur genutzt, wenn genug Arbeitsplätze, Bildung und Gesundheitsversorgung vorhanden sind.`],
  [T.demo, `Welche Fertilitätsrate gilt als **bestandserhaltend**?`, `Etwa **2,1 Kinder pro Frau** (in Ländern mit niedriger Kindersterblichkeit). Liegt sie dauerhaft darunter, schrumpft die Bevölkerung ohne Zuwanderung.`],

  [T.strat, `Was ist die **Agenda 2030**?`, `Ein 2015 von den Vereinten Nationen beschlossener Aktionsplan mit **17 Zielen für nachhaltige Entwicklung (SDGs)**, z. B. keine Armut, kein Hunger, hochwertige Bildung, Geschlechtergleichheit, Klimaschutz.
Gilt für **alle Staaten** (nicht nur Entwicklungsländer) und verbindet ökologische, soziale und ökonomische Dimensionen.`],
  [T.strat, `Was versteht man unter **Hilfe zur Selbsthilfe**?`, `Entwicklungszusammenarbeit, die die Betroffenen **befähigt, ihre Lage selbst zu verbessern**, statt dauerhaft Güter zu liefern: Bildung, Ausbildung, angepasste Technologie, Kredite, Stärkung lokaler Strukturen und Partizipation („bottom-up“).`],
  [T.strat, `Wie funktionieren **Mikrokredite**?`, `**Kleine Kredite ohne klassische Sicherheiten** für Arme (oft Frauen) zur Gründung von Kleinunternehmen; Sicherheit durch Gruppenhaftung.
Bekannt durch Muhammad Yunus / **Grameen Bank** (Bangladesch, Friedensnobelpreis 2006).
Kritik: teils hohe Zinsen, Überschuldung, begrenzte Wirkung auf Armut.`],
  [T.strat, `Was sind **Sonderwirtschaftszonen**?`, `Abgegrenzte Gebiete mit **besonderen wirtschaftlichen Regeln** (Steuervorteile, Zollfreiheit, vereinfachte Verwaltung), um **ausländische Investitionen** und Exporte anzuziehen.
Beispiel: **Shenzhen** (China, seit 1980). Folgen: Wachstum, aber regionale Disparitäten zwischen Küste und Hinterland.`],
  [T.strat, `Was ist die Idee von **Wachstumspolen**?`, `Gezielte Förderung **ausgewählter Zentren** mit Investitionen und Infrastruktur, damit von dort Wachstum in das Umland ausstrahlt (**Spread-Effekte**).
Problem: oft überwiegen Entzugseffekte – die Pole wachsen, die Peripherie profitiert kaum.`],
  [T.strat, `Unterschied **Top-down-** und **Bottom-up-**Strategien?`, `**Top-down:** Planung und Großprojekte „von oben“ durch Staat/Geber (z. B. Staudämme, Industrieansiedlung).
**Bottom-up:** Entwicklung „von unten“ mit Beteiligung der lokalen Bevölkerung, kleine angepasste Projekte, Grundbedürfnisorientierung.`],
  [T.strat, `Nenne Instrumente zum Abbau **regionaler Disparitäten** in Deutschland/EU.`, `- EU-Strukturfonds (EFRE, ESF), Kohäsionspolitik
- Gemeinschaftsaufgabe „Verbesserung der regionalen Wirtschaftsstruktur“ (GRW)
- Länderfinanzausgleich
- Infrastrukturförderung (Breitband, Verkehr), Hochschulgründungen
- Strukturstärkungsgesetz für Kohleregionen`],

  // ---------------------------------------------------------------- IF 7 Dienstleistungen
  [T.tert, `Was besagt die **Drei-Sektoren-Hypothese (Fourastié)**?`, `Mit zunehmender Entwicklung verschiebt sich die Beschäftigung vom **primären** (Land-, Forstwirtschaft, Fischerei) über den **sekundären** (Industrie, Handwerk, Bau) zum **tertiären Sektor** (Dienstleistungen).
Ursachen: Produktivitätssteigerung in Landwirtschaft und Industrie, steigende Nachfrage nach Dienstleistungen bei höherem Einkommen.`],
  [T.tert, `Was ist der **quartäre Sektor**?`, `Ausgliederung **wissens- und informationsbasierter Dienstleistungen** aus dem tertiären Sektor: Forschung und Entwicklung, Beratung, IT, Medien, Finanzwesen, Bildung.`],
  [T.tert, `Unterschied **unternehmensnahe** und **haushaltsnahe (konsumorientierte) Dienstleistungen**?`, `**Unternehmensnah (produktionsorientiert):** für Unternehmen, z. B. Unternehmensberatung, Werbung, Logistik, IT-Services, Finanzdienstleistungen – konzentrieren sich in Großstädten/Global Cities.
**Haushaltsnah:** für private Endverbraucher, z. B. Einzelhandel, Friseur, Gastronomie, Pflege – verteilen sich eher entsprechend der Bevölkerung.`],
  [T.tert, `Was bedeuten **Outsourcing** und **Offshoring**?`, `**Outsourcing:** Auslagerung von Unternehmensaufgaben an **externe Firmen** (z. B. Reinigung, IT, Buchhaltung) → Zunahme statistisch erfasster Dienstleistungen.
**Offshoring:** Verlagerung von Tätigkeiten **ins Ausland**, meist in Länder mit geringeren Lohnkosten (z. B. IT-Dienstleistungen nach Indien).`],
  [T.tert, `Warum wächst der **Logistiksektor** und wo siedelt er sich an?`, `Wachstum durch Globalisierung (internationale Arbeitsteilung, Containerisierung), Just-in-time-Produktion und **Onlinehandel**.
Standorte: verkehrsgünstig an **Autobahnkreuzen, Häfen, Flughäfen**, günstige große Flächen, Nähe zu Ballungsräumen (z. B. Raum Duisburg/„Logport“, Hamm, Bad Hersfeld).`],
  [T.tert, `Was versteht man unter **Plattformökonomie**?`, `Geschäftsmodelle, bei denen **digitale Plattformen** Anbieter und Nachfrager vermitteln (z. B. Amazon Marketplace, Uber, Airbnb, Lieferdienste).
Merkmale: Netzwerkeffekte, Marktmacht weniger Konzerne, neue Arbeitsformen (Gig-Economy, oft prekär), Veränderung von Stadträumen (z. B. Wohnraumentzug durch Ferienwohnungen).`],

  [T.tour, `Beschreibe das **Lebenszyklusmodell nach Butler**.`, `Entwicklung eines Tourismusziels in Phasen:
1. **Erkundung** (wenige Individualreisende)
2. **Erschließung/Beteiligung** (erste lokale Angebote)
3. **Entwicklung** (starkes Wachstum, externe Investoren, Massentourismus)
4. **Konsolidierung** (Wachstum verlangsamt sich)
5. **Stagnation** (Kapazitätsgrenze, Imageprobleme)
6. danach **Niedergang** oder **Erneuerung** (Rejuvenation durch neue Angebote)`],
  [T.tour, `Was ist die **Sickerrate** (Leakage) im Tourismus?`, `Der **Anteil der Tourismuseinnahmen, der ins Ausland abfließt** und nicht im Zielland bleibt: Gewinne ausländischer Hotelketten/Reiseveranstalter, Importe von Lebensmitteln und Ausstattung, Gehälter ausländischer Manager.
In Ländern des Globalen Südens oft sehr hoch (teils über 50 %), v. a. bei All-inclusive-Angeboten.`],
  [T.tour, `Was beschreibt der **Multiplikatoreffekt** im Tourismus?`, `Touristische Ausgaben lösen **weitere Wirtschaftsaktivität** aus: Hotels kaufen bei lokalen Bauern ein, Angestellte geben ihr Einkommen vor Ort aus usw.
Je stärker lokale Wirtschaftskreisläufe eingebunden sind (geringe Sickerrate), desto größer der Effekt.`],
  [T.tour, `Was ist **Overtourism** und welche Gegenmaßnahmen gibt es?`, `Überlastung eines Zielorts durch zu viele Touristen: Verdrängung von Einwohnern (Ferienwohnungen, steigende Mieten), Überfüllung, Umweltschäden, Konflikte (z. B. **Venedig, Barcelona, Dubrovnik**).
Maßnahmen: Eintrittsgebühren/Tagesticket (Venedig seit 2024), Besucherlenkung, Kontingente, Begrenzung von Kreuzfahrtschiffen und Ferienwohnungen, Tourismussteuer.`],
  [T.tour, `Was kennzeichnet **nachhaltigen Tourismus / Ökotourismus**?`, `Tourismus, der **ökologisch verträglich, sozial gerecht und wirtschaftlich tragfähig** ist: Schutz der Natur, Beteiligung und Einkommen der lokalen Bevölkerung, Respekt vor Kultur, geringe Sickerrate.
Problem: Fernreisen verursachen hohe CO₂-Emissionen; „Greenwashing“.`],
  [T.tour, `Chancen und Risiken des Tourismus für **Länder des Globalen Südens**?`, `**Chancen:** Devisen, Arbeitsplätze, Infrastrukturausbau, Multiplikatoreffekt, Wertschätzung von Natur und Kultur.
**Risiken:** hohe Sickerrate, saisonale/prekäre Jobs, Abhängigkeit (Krisen wie Pandemie), Wasser- und Flächenkonkurrenz, Umweltschäden, kulturelle Überformung, Enklaventourismus.`],
  [T.tour, `Was ist **Enklaventourismus**?`, `Touristen bleiben in **abgeschlossenen Anlagen** (Resorts, All-inclusive-Hotels), die kaum mit der lokalen Wirtschaft verbunden sind → geringer Nutzen für die Bevölkerung, hohe Sickerrate, soziale Abschottung.`],

  // ---------------------------------------------------------------- Methoden
  [T.meth, `Wie wertest du ein **Klimadiagramm** aus?`, `1. Station, Lage (Koordinaten, Höhe), Klimazone einordnen
2. **Jahresmitteltemperatur** und Jahresniederschlag
3. **Temperaturverlauf**: Amplitude, wärmster/kältester Monat (Tageszeitenklima vs. Jahreszeitenklima)
4. **Niederschlagsverteilung**: Regenzeit/Trockenzeit
5. **humide/aride Monate** (Niederschlagskurve über/unter Temperaturkurve, 1 °C ≙ 2 mm)
6. Folgerungen für Vegetation und Landwirtschaft (z. B. Bewässerungsbedarf)`],
  [T.meth, `Was verlangen die Operatoren der **Anforderungsbereiche I, II, III**?`, `**AFB I (Reproduktion):** nennen, beschreiben, darstellen, lokalisieren
**AFB II (Reorganisation/Transfer):** erläutern, erklären, analysieren, charakterisieren, vergleichen, einordnen
**AFB III (Reflexion/Problemlösung):** beurteilen, bewerten, erörtern, Stellung nehmen, entwickeln, überprüfen`],
  [T.meth, `Unterschied **beurteilen** und **bewerten**?`, `**Beurteilen:** Aussage/Maßnahme an **fachlichen Kriterien** prüfen und zu einem begründeten Sachurteil kommen.
**Bewerten:** zusätzlich **eigene Wertmaßstäbe** (z. B. Nachhaltigkeit, Gerechtigkeit) offenlegen und ein begründetes **Werturteil** fällen.`],
  [T.meth, `Wie baust du eine gute Antwort in der **Geographie-Klausur** auf?`, `- **Einleitung:** Raum verorten (Lage, Atlas), Thema/Fragestellung nennen
- **Hauptteil:** strukturiert nach Aspekten, jede Aussage mit **Materialbeleg** (M1, M2 …) und Atlas; Fachbegriffe nutzen, Zusammenhänge erklären (Ursache → Wirkung)
- **Fazit:** Ergebnis bündeln, bei AFB III begründetes Urteil mit Abwägung von Pro und Contra`],
  [T.meth, `Worauf achtest du bei der Auswertung von **Statistiken und Diagrammen**?`, `- Thema, Quelle, Zeitraum, Raumbezug, Einheiten (absolute Zahlen vs. %)
- Kernaussage/Trend formulieren, Extremwerte, Brüche, Vergleiche
- Ursachen erklären (mit Fachwissen), Grenzen der Aussagekraft (Skala, Basisjahr, fehlende Werte)`],
]

const quiz: QuizTuple[] = [
  [T.tropen, `Warum verlieren gerodete Flächen im tropischen Regenwald schnell ihre Fruchtbarkeit?`, [`Die Nährstoffe sind hauptsächlich in der Biomasse gespeichert und werden nach der Rodung ausgewaschen`, `Die Böden enthalten zu viele Dreischicht-Tonminerale`, `Es fehlt an Niederschlag`, `Die Temperaturen sind zu niedrig für Zersetzung`], 0, `Nährstoffarme, alte Böden mit Kaolinit; der Kreislauf ist kurzgeschlossen über Biomasse und Mykorrhiza.`],
  [T.tropen, `Welche Aussage beschreibt eine Plantage?`, [`Kleinbäuerlicher Mischanbau zur Selbstversorgung`, `Exportorientierter Großbetrieb mit Monokultur`, `Wanderfeldbau mit Brandrodung`, `Weidewirtschaft in Trockengebieten`], 1],
  [T.tropen, `Was ist der größte direkte Treiber der Entwaldung im Amazonasgebiet?`, [`Tourismus`, `Rinderweiden`, `Kaffeeanbau`, `Wasserkraft`], 1],
  [T.tropen, `Wann ist Shifting Cultivation nachhaltig?`, [`Bei hoher Bevölkerungsdichte`, `Wenn die Brache lang genug ist und die Bevölkerungsdichte gering`, `Nur mit Kunstdünger`, `Nur in Savannen`], 1],
  [T.intensiv, `Was versteht man unter vertikaler Integration im Agrobusiness?`, [`Zusammenschluss mehrerer Schlachthöfe`, `Ein Unternehmen kontrolliert mehrere Stufen der Wertschöpfungskette`, `Anbau in Gewächshäusern auf mehreren Etagen`, `Förderung durch die EU`], 1],
  [T.intensiv, `Hauptursache der Versalzung bei Bewässerung in Trockengebieten?`, [`Zu wenig Bewässerung`, `Hohe Verdunstung und fehlende Drainage`, `Saurer Regen`, `Zu viel Humus`], 1],
  [T.intensiv, `Wofür steht das „Plastikmeer“ von Almería?`, [`Plastikmüll im Mittelmeer`, `Ausgedehnte Gewächshauslandschaft für Gemüseexport`, `Ein Meeresschutzgebiet`, `Salinen zur Salzgewinnung`], 1],
  [T.nachhaltig, `Welches Treibhausgas entsteht vor allem durch Stickstoffdüngung?`, [`Methan`, `Lachgas (N₂O)`, `Kohlenmonoxid`, `Ozon`], 1],
  [T.nachhaltig, `Was beschreibt „virtuelles Wasser“?`, [`Grundwasser unter Wüsten`, `Die bei der Herstellung eines Produkts insgesamt verbrauchte Wassermenge`, `Wasser in Wolken`, `Wasser in Datenzentren`], 1],
  [T.nachhaltig, `Welche Maßnahme schützt am direktesten vor Wassererosion am Hang?`, [`Hangabwärts pflügen`, `Konturpflügen und ganzjährige Bodenbedeckung`, `Mehr Kunstdünger`, `Hecken entfernen`], 1],
  [T.struktur, `Was löste ab 1958 die Krise im Ruhrgebiet aus?`, [`Die Stahlkrise`, `Billigere Importkohle und Erdöl (Kohlekrise)`, `Die Ölkrise von 1973`, `Die Wiedervereinigung`], 1],
  [T.struktur, `Welcher Faktor ist ein weicher Standortfaktor?`, [`Autobahnanschluss`, `Gewerbesteuersatz`, `Freizeit- und Kulturangebot`, `Grundstückspreis`], 2],
  [T.struktur, `Was war die IBA Emscher Park?`, [`Ein Kohlekraftwerk`, `Ein Programm zum ökologischen und städtebaulichen Umbau des Ruhrgebiets (1989–1999)`, `Ein Freizeitpark in Essen`, `Eine Autobahn`], 1],
  [T.wachstum, `Was beschreiben die Kondratieff-Zyklen?`, [`Saisonale Arbeitslosigkeit`, `Lange Konjunkturwellen, ausgelöst durch Basisinnovationen`, `Den Lebenszyklus von Touristenzielen`, `Bevölkerungswachstum`], 1],
  [T.wachstum, `Welche Folge hat der Onlinehandel NICHT typischerweise?`, [`Mehr Logistikzentren an Autobahnen`, `Mehr Lieferverkehr auf der letzten Meile`, `Steigende Passantenfrequenz in Innenstädten`, `Leerstand im stationären Einzelhandel`], 2],
  [T.wachstum, `Ein Cluster ist …`, [`eine räumliche Konzentration verbundener Unternehmen und Einrichtungen einer Branche`, `ein einzelnes Großunternehmen`, `ein Gewerbegebiet ohne Bezug der Firmen zueinander`, `eine Sonderwirtschaftszone`], 0],
  [T.stadt, `Welches Stadtmodell geht von keilförmigen Sektoren entlang von Verkehrsachsen aus?`, [`Burgess`, `Hoyt`, `Harris & Ullman`, `Christaller`], 1],
  [T.stadt, `Wer zieht in der ersten Phase der Gentrifizierung typischerweise zu?`, [`Gutverdienende Familien`, `Pioniere wie Studierende und Kunstschaffende`, `Rentner`, `Investoren`], 1],
  [T.stadt, `Was ist KEINE Ursache der urbanen Hitzeinsel?`, [`Versiegelung`, `Fehlende Verdunstung`, `Frischluftschneisen`, `Abwärme`], 2],
  [T.stadt, `Das Schwammstadt-Prinzip zielt darauf, …`, [`Regenwasser schnell abzuleiten`, `Regenwasser vor Ort zu speichern, zu versickern und zu verdunsten`, `Hochhäuser zu bauen`, `Grünflächen zu versiegeln`], 1],
  [T.metropol, `Was unterscheidet eine Global City von einer Megastadt?`, [`Die Einwohnerzahl über 10 Mio.`, `Ihre Funktion als Steuerungszentrale der Weltwirtschaft`, `Ihre Lage an der Küste`, `Ihr Alter`], 1],
  [T.metropol, `Eine Primatstadt …`, [`ist die Hauptstadt eines Bundeslandes`, `ist um ein Vielfaches größer als die zweitgrößte Stadt des Landes`, `hat weniger als 1 Mio. Einwohner`, `liegt immer im Landesinneren`], 1],
  [T.metropol, `Was ist ein Pull-Faktor der Land-Stadt-Wanderung?`, [`Dürre im Dorf`, `Landknappheit`, `Hoffnung auf Arbeit und Bildung in der Stadt`, `Fehlende Gesundheitsversorgung auf dem Land`], 2],
  [T.metropol, `Der Verstädterungsgrad gibt an …`, [`wie schnell Städte wachsen`, `den Anteil der Stadtbevölkerung an der Gesamtbevölkerung`, `die Zahl der Megastädte`, `die Dichte der Bebauung`], 1],
  [T.disp, `Welche drei Dimensionen fasst der HDI zusammen?`, [`Einkommen, Export, Industrie`, `Gesundheit, Bildung, Lebensstandard`, `Bevölkerung, Fläche, Klima`, `Demokratie, Pressefreiheit, Korruption`], 1],
  [T.disp, `Ein Gini-Koeffizient nahe 0 bedeutet …`, [`hohe Ungleichheit`, `nahezu gleichmäßige Verteilung`, `hohe Inflation`, `geringes BIP`], 1],
  [T.disp, `Die Dependenztheorie sieht die Ursache von Unterentwicklung vor allem in …`, [`traditionellen Strukturen im Land`, `der Abhängigkeit von den Industrieländern`, `dem Klima`, `zu hoher Bildung`], 1],
  [T.demo, `In welcher Phase des demografischen Übergangs ist das Bevölkerungswachstum am größten?`, [`Prätransformativ`, `Mitteltransformativ`, `Posttransformativ`, `In allen gleich`], 1],
  [T.demo, `Welche Pyramidenform steht für eine schrumpfende, alternde Bevölkerung?`, [`Pyramide`, `Glocke`, `Urne`, `Zylinder`], 2],
  [T.demo, `Wer vertrat die These, dass Bevölkerungsdruck Innovationen in der Landwirtschaft auslöst?`, [`Malthus`, `Boserup`, `Burgess`, `Fourastié`], 1],
  [T.strat, `Wie viele Nachhaltigkeitsziele (SDGs) umfasst die Agenda 2030?`, [`8`, `12`, `17`, `25`], 2],
  [T.strat, `Mikrokredite wurden bekannt durch …`, [`die Weltbank in Brasilien`, `die Grameen Bank in Bangladesch`, `die EU-Strukturfonds`, `die Sonderwirtschaftszone Shenzhen`], 1],
  [T.tert, `Nach Fourastié verschiebt sich die Beschäftigung mit zunehmender Entwicklung …`, [`vom tertiären zum primären Sektor`, `vom primären über den sekundären zum tertiären Sektor`, `nur innerhalb des sekundären Sektors`, `gar nicht`], 1],
  [T.tert, `Was ist Offshoring?`, [`Auslagerung von Aufgaben an eine externe Firma im Inland`, `Verlagerung von Tätigkeiten ins Ausland`, `Ausbau von Häfen`, `Windkraft auf See`], 1],
  [T.tour, `In welcher Phase des Butler-Modells setzt Massentourismus mit externen Investoren ein?`, [`Erkundung`, `Entwicklung`, `Stagnation`, `Niedergang`], 1],
  [T.tour, `Eine hohe Sickerrate bedeutet …`, [`viele Einnahmen bleiben im Land`, `ein großer Teil der Einnahmen fließt ins Ausland ab`, `viele Touristen kehren zurück`, `starke Umweltbelastung`], 1],
  [T.meth, `„Erläutern“ gehört zu welchem Anforderungsbereich?`, [`AFB I`, `AFB II`, `AFB III`, `keinem`], 1],
  [T.meth, `Im Klimadiagramm (Walter/Lieth) ist ein Monat arid, wenn …`, [`die Niederschlagskurve über der Temperaturkurve liegt`, `die Niederschlagskurve unter der Temperaturkurve liegt`, `die Temperatur unter 0 °C liegt`, `es mehr als 100 mm regnet`], 1],
]

export const geoCards = buildCards('geo', cards)
export const geoQuiz = buildQuiz('geo', quiz)
