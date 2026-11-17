import { buildCards, buildQuiz, type CardTuple, type QuizTuple } from './build'

const T = {
  cic: 'lat-cicero',
  liv: 'lat-livius',
  ov: 'lat-ovid',
  sen: 'lat-seneca',
  verg: 'lat-vergil',
  staat: 'lat-staat',
  gesch: 'lat-geschichte',
  rede: 'lat-rede',
  welt: 'lat-welt',
  philo: 'lat-philo',
  myth: 'lat-mythos',
  gram: 'lat-grammatik',
  stil: 'lat-stil',
  metr: 'lat-metrik',
  meth: 'lat-methode',
}

const cards: CardTuple[] = [
  // ---------------------------------------------------------------- Cicero, De officiis
  [T.cic, `Wann und unter welchen Umständen verfasste Cicero **De officiis**?`, `**44 v. Chr.**, nach der Ermordung Caesars, als Cicero politisch kaltgestellt war und die Republik in der Krise steckte.
Gewidmet seinem **Sohn Marcus**, der in Athen Philosophie studierte – zugleich ein politisches Vermächtnis an die römische Führungsschicht. Cicero wurde 43 v. Chr. auf Betreiben des Antonius ermordet.`],
  [T.cic, `Wie ist **De officiis** aufgebaut?`, `Drei Bücher:
- **Buch I:** das sittlich Gute (**honestum**) und die vier Kardinaltugenden
- **Buch II:** das Nützliche (**utile**)
- **Buch III:** der (scheinbare) **Konflikt zwischen honestum und utile** – Ergebnis: Was unsittlich ist, kann nie wirklich nützlich sein.`],
  [T.cic, `Auf welchen Philosophen stützt sich Cicero in De officiis vor allem?`, `Auf den Stoiker **Panaitios von Rhodos** (2. Jh. v. Chr.) und dessen Schrift über das pflichtgemäße Handeln. Cicero passt die griechische Lehre an römische Verhältnisse und Werte an.`],
  [T.cic, `Was bedeutet **officium**?`, `Die **Pflicht** bzw. das **angemessene, pflichtgemäße Handeln** in einer bestimmten Rolle und Situation (gegenüber Staat, Familie, Freunden, Mitmenschen).`],
  [T.cic, `Nenne die **vier Kardinaltugenden** nach Cicero (lateinisch).`, `1. **sapientia / prudentia** – Weisheit, Erkenntnis der Wahrheit
2. **iustitia** (mit **beneficentia/liberalitas**) – Gerechtigkeit und Wohltätigkeit: Grundlage der Gemeinschaft
3. **magnitudo animi / fortitudo** – Seelengröße, Tapferkeit
4. **temperantia / modestia** – Maßhalten, verbunden mit dem **decorum** (dem Schicklichen)`],
  [T.cic, `Was sind nach Cicero die **Grundregeln der Gerechtigkeit (iustitia)**?`, `- **niemandem schaden** (ne cui quis noceat), außer wenn man durch Unrecht herausgefordert wurde
- **Gemeinsames als gemeinsam, Eigenes als eigen** nutzen
- **Grundlage der Gerechtigkeit ist die fides** (Treue, Zuverlässigkeit gegenüber Versprechen und Verträgen)`],
  [T.cic, `Was ist das **decorum**?`, `Das **Schickliche, Angemessene** im Verhalten – das, was der menschlichen Natur, der eigenen Persönlichkeit und der jeweiligen Situation entspricht. Es zeigt sich in Worten, Taten, Auftreten; eng mit temperantia verbunden.`],
  [T.cic, `Wann ist ein Krieg nach Cicero **gerecht (bellum iustum)**?`, `- nur nach vorheriger **Forderung nach Wiedergutmachung** (rebus repetitis) und förmlicher **Ankündigung**
- Ziel muss sein, **in Frieden ohne Unrecht zu leben** (ut sine iniuria in pace vivatur)
- Besiegte sollen geschont werden, sofern sie nicht grausam waren; Verträge auch gegenüber Feinden halten`],
  [T.cic, `Erzähle das **Regulus-Exemplum** und seine Funktion in De officiis.`, `M. Atilius **Regulus** geriet im 1. Punischen Krieg in karthagische Gefangenschaft. Er sollte in Rom einen Gefangenenaustausch erwirken, **riet dem Senat aber davon ab**, weil er Rom schaden würde, und **kehrte eidgemäß nach Karthago zurück**, wo er zu Tode gequält wurde.
Funktion (Buch III): Beispiel, dass das **honestum (Eidtreue, fides)** über dem scheinbaren **utile** (eigenes Überleben) steht.`],
  [T.cic, `Wie löst Cicero den Konflikt zwischen **honestum** und **utile**?`, `Der Konflikt ist nur **scheinbar**: Was moralisch schlecht ist, kann niemals wirklich nützlich sein. Das wahre utile stimmt immer mit dem honestum überein. Wer das Gegenteil glaubt, zerstört die Grundlagen der menschlichen Gemeinschaft.`],
  [T.cic, `Welche **politische Botschaft** steckt in De officiis?`, `Eine Mahnung an die römische Elite, nach Caesars Alleinherrschaft zu **Gerechtigkeit, fides und Dienst an der res publica** zurückzukehren. Machtstreben und Tyrannei (Anspielung auf **Caesar**) werden verurteilt; der Tyrannenmord wird als vereinbar mit dem honestum dargestellt.`],
  [T.cic, `Was meint Cicero mit den **Stufen der Gemeinschaft (gradus societatis)**?`, `Die Menschen sind durch **ratio und oratio** zu einer Gemeinschaft verbunden – von der Menschheit allgemein über Volk und Bürgerschaft bis zu Verwandtschaft, Familie und Freundschaft. Die engste Bindung gilt dem **Vaterland (patria)**, dem man alles schuldet.`],

  // ---------------------------------------------------------------- Livius
  [T.liv, `Wer war **Livius** und was ist **Ab urbe condita**?`, `Titus **Livius** (59 v. Chr. – 17 n. Chr.) aus Patavium (Padua), Geschichtsschreiber der **augusteischen Zeit**.
**Ab urbe condita:** römische Geschichte von der Gründung bis 9 v. Chr. in **142 Büchern** (35 erhalten); eine **Dekade** = 10 Bücher. Die **1. Dekade** reicht von der Gründung bis 293 v. Chr.`],
  [T.liv, `Welches Ziel nennt Livius in der **Praefatio**?`, `Geschichte soll **Vorbilder (exempla)** liefern: Man soll daraus entnehmen, **was man nachahmen** und **was man meiden** soll (inde … quod imitere capias, inde … quod vites).
Dazu beklagt er den **Sittenverfall** seiner Zeit: „Wir können weder unsere Fehler noch die Heilmittel ertragen“ (nec vitia nostra nec remedia pati possumus).`],
  [T.liv, `Wie geht Livius mit **Mythen** der Frühzeit um?`, `Er erklärt, dass die Überlieferung vor der Gründung eher **dichterischen Erzählungen** als zuverlässigen Zeugnissen gleicht, und will sie **weder bestätigen noch widerlegen**. Man gestehe der Antike zu, Göttliches mit Menschlichem zu mischen, um die Anfänge der Städte erhabener zu machen.
→ realistische und mythologische Deutung stehen nebeneinander.`],
  [T.liv, `Erzähle die Gründungssage von **Romulus und Remus** (Kernpunkte).`, `- Zwillinge der Vestalin **Rhea Silvia** und des **Mars**, von König **Amulius** ausgesetzt
- von einer **Wölfin** gesäugt, vom Hirten **Faustulus** aufgezogen
- Streit um die Stadtgründung → **Vogelschau (Auspizien):** Remus sieht 6, Romulus 12 Geier
- Remus springt spöttisch über die neue Mauer und wird von Romulus getötet: „So soll es jedem ergehen, der über meine Mauern springt.“
- 753 v. Chr. (traditionelles Datum)`],
  [T.liv, `Worum geht es beim **Raub der Sabinerinnen**?`, `Rom fehlen Frauen; die Nachbarn verweigern Eheschließungen. Bei einem Fest (Consualia) rauben die Römer die Töchter der Sabiner. Im folgenden Krieg werfen sich die **Sabinerinnen zwischen die Heere** und erreichen den Frieden → **Vereinigung von Römern und Sabinern** zu einem Volk.`],
  [T.liv, `Was erzählt Livius über die **Horatier und Curiatier**?`, `Unter König **Tullus Hostilius** entscheidet ein Kampf zweier Drillingspaare den Krieg zwischen Rom und Alba Longa. Ein Horatier überlebt und siegt.
Als seine **Schwester** um ihren gefallenen Verlobten (einen Curiatier) trauert, **tötet er sie**. Er wird verurteilt, aber nach Berufung an das Volk (**provocatio**) freigesprochen – Konflikt zwischen **Staatsinteresse/virtus** und Recht/Familie.`],
  [T.liv, `Was ist die Bedeutung der **Lucretia**-Erzählung?`, `Lucretia, Inbegriff der **pudicitia** (Keuschheit), wird von **Sextus Tarquinius**, dem Königssohn, vergewaltigt. Sie berichtet es ihrem Mann und Vater und **tötet sich selbst**.
**L. Iunius Brutus** schwört Rache → **Vertreibung des Tarquinius Superbus** und **Ende der Königszeit (509 v. Chr.)**, Beginn der Republik. Private Schande wird zum politischen Wendepunkt.`],
  [T.liv, `Wofür steht **Mucius Scaevola**?`, `Während der Belagerung Roms durch den Etruskerkönig **Porsenna** will Mucius ihn töten, ersticht aber den Schreiber. Gefangen, **hält er seine rechte Hand ins Feuer**, um seine Furchtlosigkeit zu zeigen („Scaevola“ = Linkshand). Porsenna ist beeindruckt und schließt Frieden.
→ exemplum für **virtus** und Opferbereitschaft für die res publica.`],
  [T.liv, `Worum geht es in der **Verginia**-Episode?`, `Der Decemvir **Appius Claudius** begehrt die Plebejerin Verginia und lässt sie per Scheinprozess zur Sklavin erklären. Ihr **Vater tötet sie**, um ihre Freiheit und Ehre zu bewahren.
Folge: Aufstand, **Sturz der Decemvirn** (449 v. Chr.) – Parallele zu Lucretia: Willkür der Mächtigen führt zur Befreiung.`],
  [T.liv, `Welche Rolle spielt **Camillus** bei Livius?`, `Eroberer von **Veji** (396 v. Chr.), später verbannt; nach dem **Galliersturm** (ca. 390/387 v. Chr.) als Diktator Retter Roms. Er verhindert, dass die Römer nach Veji umsiedeln → gilt als **„zweiter Gründer Roms“**, Muster von pietas und virtus.`],
  [T.liv, `Welche **Gestaltungsmittel** nutzt Livius?`, `- **Reden** (oft erfunden) zur Charakterisierung und Deutung
- **dramatische, szenische Darstellung** mit Höhepunkten
- annalistische Ordnung (Jahr für Jahr)
- moralische Bewertung und Exempla
- Spannung zwischen mythischer und rationaler Erklärung`],

  // ---------------------------------------------------------------- Ovid
  [T.ov, `Was sind Ovids **Metamorphosen** (Form und Inhalt)?`, `Ein **Epos in 15 Büchern** im daktylischen **Hexameter** mit rund 250 Verwandlungssagen – ein **carmen perpetuum** von der **Weltschöpfung bis zur Gegenwart** (Vergöttlichung Caesars, Lob des Augustus).
Ovid (43 v. Chr. – 17 n. Chr.) wurde 8 n. Chr. von Augustus nach **Tomis** am Schwarzen Meer verbannt („carmen et error“).`],
  [T.ov, `Was kündigt das **Proömium** der Metamorphosen an?`, `„In nova fert animus mutatas dicere formas / corpora …“ – Ovid will von **in neue Körper verwandelten Gestalten** erzählen, bittet die Götter um Beistand und kündigt ein fortlaufendes Gedicht **vom Ursprung der Welt bis in seine Zeit** an.`],
  [T.ov, `Wie beschreibt Ovid die **Weltschöpfung**?`, `Am Anfang ist das **Chaos**, eine ungeordnete Masse, in der die Elemente miteinander streiten. Ein **Gott bzw. die bessere Natur** trennt Himmel, Erde, Wasser und Luft und ordnet die Welt.
Zuletzt entsteht der **Mensch** (von Prometheus aus Erde und Wasser geformt), der als einziges Wesen **aufrecht zum Himmel blickt**.`],
  [T.ov, `Was sind die **vier Weltalter**?`, `**Goldenes Zeitalter:** ohne Gesetze, Gerechtigkeit von selbst, ewiger Frühling.
**Silbernes:** Jahreszeiten, Häuser, Ackerbau.
**Ehernes:** wilder, kriegerisch, aber noch nicht frevelhaft.
**Eisernes:** alle Laster – Gier, Betrug, Krieg, Gewalt.
→ Verfallsmodell der Menschheitsgeschichte.`],
  [T.ov, `Erzähle **Apoll und Daphne**.`, `Apoll verspottet **Amor**; dieser trifft ihn mit dem **goldenen Pfeil** (Liebe) und die Nymphe **Daphne** mit dem **bleiernen** (Abwehr). Apoll verfolgt sie; Daphne fleht ihren Vater (Flussgott Peneus) an und wird in einen **Lorbeerbaum** verwandelt.
Apoll macht den Lorbeer zu seinem heiligen Baum – Schmuck für Triumphatoren und den **Palast des Augustus** (politische Anspielung).`],
  [T.ov, `Erzähle **Pyramus und Thisbe**.`, `Zwei Liebende in **Babylon**, deren Eltern die Ehe verbieten, sprechen durch einen **Riss in der Mauer**. Sie verabreden sich am Grab des Ninus unter einem **Maulbeerbaum**. Thisbe flieht vor einer **Löwin** und verliert ihren Schleier; Pyramus findet ihn blutig, glaubt sie tot und **ersticht sich**. Thisbe folgt ihm in den Tod.
Verwandlung: Die **Maulbeeren** werden seitdem dunkel.`],
  [T.ov, `Erzähle **Narcissus und Echo**.`, `Die Nymphe **Echo** kann – zur Strafe Junos – nur noch die letzten Worte anderer wiederholen; sie liebt Narcissus, wird abgewiesen und schwindet zu einer **Stimme**.
**Narcissus** verliebt sich in sein **Spiegelbild** im Wasser, erkennt sich („iste ego sum“), verzehrt sich vor Sehnsucht und wird zur **Narzisse**. Teiresias hatte prophezeit, er lebe lange, „wenn er sich nicht selbst erkennt“.`],
  [T.ov, `Erzähle **Daedalus und Icarus** – und die Deutung.`, `Daedalus will mit seinem Sohn von **Kreta** (König Minos) fliehen und baut **Flügel aus Federn und Wachs**. Er mahnt Icarus, den **Mittelweg** zu fliegen. Icarus wird übermütig, steigt zu hoch, die **Sonne schmilzt das Wachs**, er stürzt ins Meer.
Deutung: Hybris, Grenzüberschreitung, Vater-Sohn-Konflikt, Technik und ihre Gefahren; auch Künstlerschicksal.`],
  [T.ov, `Worum geht es in der Erzählung von **Arachne**?`, `Die Weberin **Arachne** fordert **Minerva** zum Wettstreit heraus. Minerva webt die Macht der Götter und Strafen für Hochmut, Arachne die **Liebesabenteuer und Vergehen der Götter** – technisch vollkommen. Minerva zerreißt das Werk; Arachne erhängt sich und wird in eine **Spinne** verwandelt.
Thema: Hybris, aber auch Kunst vs. Macht.`],
  [T.ov, `Was geschieht mit **Niobe**?`, `Die Königin von Theben prahlt mit ihren 14 Kindern und verlangt Verehrung statt der Göttin **Latona** (die nur zwei Kinder hat). **Apoll und Diana** töten alle Kinder; Niobe erstarrt vor Schmerz zu **Stein**, aus dem weiter Tränen fließen.
Thema: **Hybris** gegenüber den Göttern.`],
  [T.ov, `Erzähle **Orpheus und Eurydike**.`, `Eurydike stirbt an einem Schlangenbiss. Orpheus steigt in die **Unterwelt** und rührt mit seinem **Gesang** Pluto und Proserpina. Er darf sie mitnehmen, wenn er sich **nicht umsieht**, bevor sie die Oberwelt erreichen. Kurz vor dem Ziel blickt er sich um – Eurydike sinkt zurück.
Thema: Macht der Kunst/Liebe, aber auch ihre Grenzen.`],
  [T.ov, `Was erzählt Ovid über **Pygmalion**?`, `Der Bildhauer **Pygmalion** lehnt die Frauen ab und schafft eine **Elfenbeinstatue**, in die er sich verliebt. **Venus** erhört seine Bitte: Die Statue wird **lebendig**.
Thema: Kunst, die so vollkommen ist, dass sie die Natur nachahmt bzw. übertrifft (ars adeo latet arte sua).`],
  [T.ov, `Was ist die Botschaft von **Philemon und Baucis**?`, `Ein **armes, altes Ehepaar** nimmt die unerkannt wandernden Götter **Jupiter und Merkur** gastfreundlich auf, während alle Reichen sie abweisen. Die Götter strafen die Umgebung mit einer Flut, verwandeln die Hütte in einen **Tempel** und erfüllen den Wunsch der beiden, **gemeinsam zu sterben**: Sie werden zu **Eiche und Linde**.
Thema: **pietas**, Gastfreundschaft, Treue – Lohn der Frommen.`],
  [T.ov, `Was sagt Ovid im **Epilog** der Metamorphosen?`, `„Iamque opus exegi …“ – Er hat ein Werk vollendet, das weder Jupiters Zorn noch Feuer, Schwert oder Zeit zerstören können. Mit seinem besseren Teil werde er **über die Sterne getragen**; solange Roms Macht reicht, werde er gelesen: „**vivam**“ – ich werde leben.
→ Unsterblichkeit durch Dichtung, selbstbewusster Gegenpol zur Macht des Herrschers.`],
  [T.ov, `Wie lässt sich Ovids Verhältnis zu **Augustus** beschreiben?`, `**Ambivalent:** Einerseits Lob des Augustus und der Vergöttlichung Caesars am Ende des Werks, andererseits spielerischer, respektloser Umgang mit Göttern (Willkür, Liebesabenteuer) und Betonung individueller Gefühle statt Staatsmoral – oft als **subtile Kritik** an der augusteischen Ideologie gelesen.`],

  // ---------------------------------------------------------------- Seneca
  [T.sen, `Wer war **Seneca**?`, `Lucius Annaeus **Seneca** (ca. 1 v. Chr. – 65 n. Chr.), stoischer Philosoph, Dichter (Tragödien) und Politiker; **Erzieher und Berater Neros**. Nach dem Rückzug aus der Politik schrieb er die Briefe an Lucilius. 65 n. Chr. wurde er nach der **Pisonischen Verschwörung** von Nero zum Selbstmord gezwungen.`],
  [T.sen, `Was sind die **Epistulae morales ad Lucilium**?`, `**124 Briefe** (in 20 Büchern) an seinen Freund **Lucilius**, entstanden in Senecas letzten Lebensjahren (ca. 62–65 n. Chr.). Sie behandeln praktische **Lebensfragen aus stoischer Sicht** – Zeit, Freundschaft, Tod, Reichtum, Angst. Form: Kunstbrief mit Dialogcharakter, oft mit einem „Geschenk“ (Zitat, z. B. von Epikur) am Ende.`],
  [T.sen, `Worum geht es in **Brief 1**?`, `Um den richtigen **Umgang mit der Zeit**: „**Vindica te tibi**“ – nimm dich selbst in Besitz. Die Zeit werde uns entrissen, gestohlen oder entgleite. Alles andere gehört uns nicht, **nur die Zeit ist unser Eigentum** (omnia aliena sunt, tempus tantum nostrum est). Man solle jede Stunde nutzen, denn während man das Leben aufschiebt, eilt es vorüber.`],
  [T.sen, `Worum geht es in **Brief 7**?`, `Man soll die **Menschenmenge meiden**, weil sie lasterhaft macht. Seneca berichtet von einem Besuch der **Mittagsspiele in der Arena** (reines Morden): Er kehre „gieriger, grausamer und unmenschlicher“ zurück. Rat: Zieh dich in dich selbst zurück und umgib dich mit Menschen, die dich besser machen.`],
  [T.sen, `Welche Haltung zeigt Seneca in **Brief 47** zu den Sklaven?`, `„**Servi sunt. Immo homines.**“ – Sie sind Sklaven? Nein, Menschen! Sklaven sind **Mitmenschen und Mitsklaven** (des Schicksals) aus demselben Ursprung. Man solle sie freundlich behandeln, mit ihnen sprechen und essen; frei ist, wer seinen Leidenschaften nicht dient.
**Aber:** Seneca fordert **keine Abschaffung der Sklaverei** – es geht um die innere Haltung des Herrn.`],
  [T.sen, `Erkläre den stoischen Grundsatz **secundum naturam vivere**.`, `**Gemäß der Natur leben** heißt für die Stoa: gemäß der **Vernunft (ratio/logos)** leben, die den Menschen mit der göttlichen Weltvernunft verbindet. Wer vernunftgemäß lebt, ist tugendhaft und dadurch glücklich.`],
  [T.sen, `Was sind **Adiaphora**?`, `„Gleichgültige Dinge“ – alles, was **weder gut noch schlecht** ist, weil es nicht in unserer Macht liegt oder nicht zur Tugend beiträgt: Reichtum, Gesundheit, Ruhm, Armut, Krankheit, sogar der Tod. **Das einzige Gut ist die Tugend (virtus)**.`],
  [T.sen, `Wie geht die Stoa mit **Affekten** (Leidenschaften) um?`, `Affekte wie **Lust, Begierde, Furcht und Kummer** sind Fehlurteile der Vernunft und machen unfrei. Ziel ist die **apatheia** (Freiheit von Leidenschaften) bzw. Seelenruhe – erreicht durch Einsicht und Übung (meditatio, Selbstprüfung).`],
  [T.sen, `Wie steht Seneca zum **Tod**?`, `Der Tod ist kein Übel (Adiaphoron), sondern natürlich; man stirbt täglich ein Stück. Wer den Tod nicht fürchtet, ist frei. Seneca rät zur **meditatio mortis** (Einübung des Todes) und hält den **Freitod** als Weg in die Freiheit unter bestimmten Umständen für erlaubt.`],

  // ---------------------------------------------------------------- Vergil
  [T.verg, `Was ist die **Aeneis** (Form, Entstehung)?`, `Ein **Epos in 12 Büchern** im daktylischen **Hexameter** von **Vergil** (70–19 v. Chr.), entstanden unter **Augustus** im Umfeld des Maecenas, bei Vergils Tod unvollendet.
Inhalt: Flucht des Trojaners **Aeneas** nach Italien und Kampf um Latium – mythische Vorgeschichte Roms und des julischen Hauses.`],
  [T.verg, `Fasse **Aeneis Buch 4** zusammen.`, `- **Dido**, Königin von Karthago, verliebt sich in Aeneas; sie vertraut sich ihrer Schwester **Anna** an
- Bei einer **Jagd** suchen beide in einem Unwetter Schutz in einer **Höhle** (von Juno und Venus arrangiert) – Dido nennt es Ehe
- **Fama** verbreitet das Gerücht; **Iarbas** beklagt sich bei Jupiter
- Jupiter schickt **Merkur**: Aeneas soll nach Italien aufbrechen
- Aeneas bereitet heimlich die Abfahrt vor; **Streitgespräch** mit Dido
- Dido **verflucht** Aeneas und sein Volk und **tötet sich** auf dem Scheiterhaufen mit seinem Schwert`],
  [T.verg, `Was bedeutet **pietas** und warum heißt Aeneas „pius“?`, `**pietas** = pflichtbewusste Hingabe gegenüber den **Göttern, der Familie und dem Vaterland**. Aeneas ordnet seine persönlichen Wünsche (Liebe zu Dido) dem **göttlichen Auftrag (fatum)** unter, Rom zu gründen – deshalb „**pius Aeneas**“.`],
  [T.verg, `Wie rechtfertigt sich Aeneas gegenüber Dido?`, `Er habe nie eine Ehe versprochen; er folge nicht freiwillig nach Italien („**Italiam non sponte sequor**“), sondern auf Befehl der Götter (Merkur/Jupiter) und aus Verantwortung für seinen Sohn **Ascanius** und dessen künftiges Reich.`],
  [T.verg, `Was ist der **politische Gehalt von Didos Fluch**?`, `Dido wünscht **ewige Feindschaft zwischen Karthago und den Nachkommen des Aeneas** und ruft einen **Rächer** aus ihren Gebeinen herbei (exoriare aliquis nostris ex ossibus ultor) – eine Anspielung auf **Hannibal**. So wird der **Mythos zur Begründung der Punischen Kriege**.`],
  [T.verg, `Wie wird **Fama** in Aeneis 4 dargestellt?`, `Als **Ungeheuer** mit vielen Augen, Zungen, Mündern und Ohren, das klein beginnt und rasch bis in den Himmel wächst; es verbreitet Wahres und Falsches zugleich – **Personifikation des Gerüchts**.`],
  [T.verg, `Inwiefern ist die Aeneis **augusteische Propaganda**?`, `- Aeneas' Sohn **Ascanius/Iulus** gilt als Ahnherr der **gens Iulia** → Caesar und Augustus stammen von Venus ab
- Roms Herrschaft erscheint als **göttlich gewollter Auftrag (fatum)**
- pietas, Pflicht und Opferbereitschaft als römische Kernwerte
- **Dido** erinnert an **Kleopatra**, die orientalische Königin, die einen römischen Feldherrn (Antonius) von seiner Pflicht abhält
Aber: Die tragische Darstellung Didos zeigt auch die **Kosten** der römischen Mission → Ambivalenz.`],
  [T.verg, `Welche Rolle spielen **Juno und Venus** in Buch 4?`, `**Juno** (Schutzgöttin Karthagos) will Aeneas in Karthago halten, um Roms Gründung zu verhindern; **Venus** stimmt scheinbar zu, weiß aber, dass das fatum Italien bestimmt. Gemeinsam arrangieren sie die **Höhlenszene**. Götter erscheinen als Lenker des Geschehens.`],
  [T.verg, `Wie lässt sich **Dido** als Figur deuten?`, `- tragische Heldin: Königin und Stadtgründerin, die ihren Treueschwur gegenüber dem toten **Sychaeus** bricht (culpa)
- Opfer göttlicher Pläne und ihrer Leidenschaft (**furor, amor** als Wunde/Feuer)
- Gegenbild zum pflichtbewussten Aeneas: Gefühl vs. Pflicht
- politisch: Verkörperung Karthagos, Erzfeind Roms`],

  // ---------------------------------------------------------------- Inhaltsfelder
  [T.staat, `Was ist der **cursus honorum**?`, `Die festgelegte **Ämterlaufbahn** der Republik mit Mindestaltern und Wartefristen:
**Quaestor → (Ädil) → Prätor → Konsul** (2 pro Jahr); dazu Zensor. Prinzipien: **Annuität** (1 Jahr), **Kollegialität** (mind. 2 Amtsträger), keine sofortige Wiederwahl.`],
  [T.staat, `Nenne zentrale **römische Werte** des mos maiorum.`, `- **virtus:** Tüchtigkeit, Tapferkeit, Leistung für die res publica
- **fides:** Treue, Verlässlichkeit
- **pietas:** Pflichtgefühl gegenüber Göttern, Familie, Staat
- **gravitas / constantia:** Ernst, Würde, Standhaftigkeit
- **dignitas / auctoritas:** Ansehen und Einfluss durch Leistung
- **clementia:** Milde (v. a. in der Kaiserzeit betont)`],
  [T.staat, `Was ist das **Klientelwesen**?`, `Ein Treueverhältnis zwischen einem **patronus** (einflussreicher Bürger) und seinen **clientes**: Der Patron gewährt Schutz, Rechtsbeistand und materielle Hilfe; die Klienten leisten Unterstützung (z. B. bei Wahlen, Morgenbesuch – salutatio). Grundlage ist die **fides**.`],
  [T.staat, `Was sind **Volkstribune**?`, `Amtsträger der **Plebs** (seit den Ständekämpfen): **sacrosanct** (unverletzlich) und mit **Vetorecht (intercessio)** gegen Maßnahmen der Magistrate und Senatsbeschlüsse ausgestattet – Schutz der Plebejer.`],
  [T.gesch, `Wie begründete **Augustus** den Prinzipat?`, `Nach dem Sieg bei Actium (31 v. Chr.) gab er 27 v. Chr. formal die Macht an Senat und Volk zurück (**res publica restituta**) und erhielt den Namen **Augustus**. Als **princeps** („erster Bürger“) vereinte er Ämterbefugnisse (tribunicia potestas, imperium) und **auctoritas** – faktisch eine Monarchie mit republikanischer Fassade. Ideal: **Pax Augusta**.`],
  [T.gesch, `Was meint **Romidee**? Nenne ein Beispiel.`, `Die Vorstellung von Roms **göttlich bestimmter Sendung**, die Welt zu beherrschen und Frieden und Ordnung zu bringen.
Vergil, Aeneis 6: „tu regere imperio populos, Romane, memento … parcere subiectis et debellare superbos“ – herrsche über die Völker, schone die Unterworfenen, bezwinge die Hochmütigen.`],
  [T.gesch, `Was ist ein Beispiel für **Romkritik**?`, `Die Rede des Britanniers **Calgacus** bei Tacitus (Agricola): Die Römer seien „Räuber der Welt“; „**ubi solitudinem faciunt, pacem appellant**“ – wo sie eine Wüste schaffen, nennen sie es Frieden.
Auch Didos Fluch und Ovids Ironie können als Brechung der Romidee gelesen werden.`],
  [T.gesch, `Welche **Aufgabe der Geschichtsschreibung** sahen die Römer?`, `Geschichte als **magistra vitae**: Bewahrung des Ruhms der Vorfahren, **moralische Belehrung durch exempla**, Stärkung der römischen Identität und Werte; dazu literarische Kunst (Reden, Dramatik). Objektivität im modernen Sinn war nicht das Ziel.`],
  [T.rede, `Was ist Ciceros Ideal des **orator perfectus**?`, `Der vollkommene Redner verbindet **Beredsamkeit (eloquentia) mit umfassender Bildung und Philosophie (sapientia)** sowie moralischer Integrität. Nach Cato: „orator est **vir bonus dicendi peritus**“ – ein guter Mann, der reden kann. Rhetorik soll dem Gemeinwohl dienen.`],
  [T.rede, `Was sind die **officia oratoris**?`, `Die drei Aufgaben des Redners:
- **docere** (belehren, informieren)
- **delectare** (erfreuen, unterhalten)
- **movere** (bewegen, Gefühle wecken)`],
  [T.rede, `Nenne die **Teile einer Rede** und die **Arbeitsschritte** des Redners.`, `**Redeteile:** exordium (Einleitung) – narratio (Sachverhalt) – argumentatio (probatio/refutatio: Beweis/Widerlegung) – peroratio (Schluss, Appell).
**Arbeitsschritte:** inventio (Stoffsammlung) – dispositio (Gliederung) – elocutio (sprachliche Gestaltung) – memoria (Einprägen) – actio/pronuntiatio (Vortrag).`],
  [T.rede, `Welche **Redegattungen** unterscheidet die antike Rhetorik?`, `- **genus iudiciale:** Gerichtsrede (Anklage/Verteidigung)
- **genus deliberativum:** politische Beratungsrede (Senat, Volksversammlung)
- **genus demonstrativum:** Lob- oder Tadelrede (Festrede)`],
  [T.welt, `Was bedeuten **otium** und **negotium**?`, `**negotium:** Tätigkeit im öffentlichen Leben, Politik, Geschäfte – für Römer die eigentliche Pflicht.
**otium:** Muße, Rückzug, Zeit für Bildung und Philosophie. Für Cicero sinnvoll nur als **otium cum dignitate**; für Seneca Raum für Selbstfindung (Brief 1 und 7).`],
  [T.philo, `Was lehrt **Epikur**?`, `- höchstes Gut ist die **Lust (voluptas/hedone)** – verstanden als **Freisein von körperlichem Schmerz (aponia)** und **Seelenruhe (ataraxia)**, nicht als Ausschweifung
- Leben im Verborgenen (**lathe biosas**), Freundschaft, einfache Bedürfnisse
- Atomistisches Weltbild; Götter kümmern sich nicht um Menschen
- „Der Tod geht uns nichts an“: Solange wir sind, ist er nicht da; wenn er da ist, sind wir nicht mehr.`],
  [T.philo, `Vergleiche **Stoa und Epikureismus** in Kernpunkten.`, `- **Höchstes Gut:** Stoa – Tugend (virtus); Epikur – Lust als Schmerzfreiheit und Seelenruhe
- **Politik:** Stoa – Pflicht zur Teilnahme am Gemeinwesen; Epikur – Rückzug („lebe im Verborgenen“)
- **Welt:** Stoa – von göttlicher Vernunft/Vorsehung gelenkt; Epikur – zufällige Atombewegung
- **Gemeinsam:** Ziel ist innere Ruhe und Unabhängigkeit, Furcht vor dem Tod überwinden`],
  [T.philo, `Wer gründete die **Stoa** und woher hat sie ihren Namen?`, `**Zenon von Kition** um 300 v. Chr. in Athen; benannt nach der **Stoa poikile** (bemalte Säulenhalle), in der er lehrte. Römische Stoiker: Seneca, Epiktet, Mark Aurel.`],
  [T.myth, `Was bedeutet **do ut des** in der römischen Religion?`, `„Ich gebe, damit du gibst“ – Grundprinzip des römischen Kultes: Opfer und Rituale werden den Göttern dargebracht, um ihre Gunst zu erhalten. Ziel ist die **pax deorum** (Frieden mit den Göttern) als Voraussetzung für das Wohl des Staates.`],
  [T.myth, `Welche Funktionen erfüllt der **Mythos**?`, `- **Welterklärung** (Entstehung der Welt, Naturphänomene)
- **Legitimation** von Herrschaft und Staat (Abstammung der Julier von Venus)
- **Identitätsstiftung** (Gründungsmythen)
- **moralische Orientierung** (Hybris wird bestraft, pietas belohnt)
- Unterhaltung und künstlerische Gestaltung`],
  [T.myth, `Wie entwickelte sich das Verhältnis von **Christentum und römischem Staat**?`, `- zunächst **Verfolgungen** (z. B. unter Nero, Decius, Diokletian), weil Christen den Kaiserkult verweigerten
- Trajan an Plinius (ca. 112 n. Chr.): Christen nicht aufspüren, aber bestrafen, wenn angezeigt und uneinsichtig
- **313 n. Chr.** Mailänder Vereinbarung (Konstantin): Religionsfreiheit
- **380 n. Chr.** unter Theodosius: Christentum wird **Staatsreligion**`],

  // ---------------------------------------------------------------- Grammatik
  [T.gram, `Wie erkennst und übersetzt du den **AcI**?`, `**Akkusativ + Infinitiv** nach Verben des Sagens, Meinens, Wahrnehmens, Wissens (dicere, putare, videre, scire) und unpersönlichen Ausdrücken (constat, apparet).
Übersetzung mit „**dass**“: Akkusativ → Subjekt, Infinitiv → Prädikat.
Zeitverhältnis: Inf. Präsens = **gleichzeitig**, Inf. Perfekt = **vorzeitig**, Inf. Futur = **nachzeitig**.
Bsp.: Scio te venisse. – Ich weiß, dass du gekommen bist.`],
  [T.gram, `Was ist der **NcI**?`, `**Nominativ + Infinitiv** bei passiven Verben des Sagens/Meinens (dicitur, videtur, putatur, iubetur).
Bsp.: Homerus caecus fuisse dicitur. – Homer **soll** blind gewesen sein / Man sagt, dass Homer blind war.
videtur = „scheint“.`],
  [T.gram, `Was ist ein **Participium coniunctum (PC)** und wie übersetzt man es?`, `Ein Partizip, das **in KNG mit einem Satzglied übereinstimmt** und mit diesem verbunden ist.
Übersetzungsmöglichkeiten: wörtlich, **Relativsatz**, **adverbialer Gliedsatz** (temporal: als/nachdem; kausal: weil; konzessiv: obwohl; modal), **Beiordnung** (und), Präpositionalausdruck.
PPA = gleichzeitig, PPP = vorzeitig (passiv), PFA = nachzeitig.`],
  [T.gram, `Was ist ein **Ablativus absolutus**?`, `Eine **satzwertige Konstruktion** aus **Nomen + Partizip im Ablativ**, die grammatisch **nicht mit dem Rest des Satzes verbunden** ist (Nomen ist kein Satzglied des Hauptsatzes).
- PPA → gleichzeitig: Caesare veniente – während Caesar kommt
- PPP → vorzeitig: urbe capta – nachdem die Stadt erobert worden war
- **nominaler Abl. abs.:** Cicerone consule – unter dem Konsulat Ciceros
Sinnrichtung (temporal, kausal, konzessiv) aus dem Kontext.`],
  [T.gram, `Unterschied **Gerundium** und **Gerundivum**?`, `**Gerundium:** substantivierter Infinitiv (aktiv), nur Gen., Dat., Akk. (mit Präp.), Abl.: ars **scribendi** – die Kunst des Schreibens.
**Gerundivum:** Verbaladjektiv (passiv), richtet sich in KNG nach einem Nomen:
- attributiv: in libris **legendis** – beim Lesen der Bücher
- prädikativ mit esse = **Notwendigkeit**: Carthago **delenda est** – K. muss zerstört werden (Person im Dativus auctoris: mihi)
- ad + Gerundiv = Zweck: ad urbem **defendendam** – um die Stadt zu verteidigen`],
  [T.gram, `Welche Bedeutungen hat **cum**?`, `**cum + Indikativ:** temporal „als, wenn“; iterativ „(jedes Mal) wenn“; inversum „als plötzlich“; Präposition „mit“ (+ Abl.).
**cum + Konjunktiv:**
- narrativum „als, nachdem“
- causale „weil, da“
- concessivum „obwohl“ (oft mit tamen)
- adversativum „während (dagegen)“`],
  [T.gram, `Welche Funktionen hat **ut**?`, `**ut + Indikativ:** „wie“ (Vergleich), „sobald“ (ut primum).
**ut + Konjunktiv:**
- **final:** „damit, um zu“ (Verneinung: ne)
- **konsekutiv:** „(so)dass“ (oft nach ita, tam, tantus; Verneinung: ut non)
- **Begehrssatz:** „dass“ nach Verben des Bittens, Forderns (Verneinung: ne)`],
  [T.gram, `Welche Arten des **Konjunktivs im Hauptsatz** gibt es?`, `- **Hortativ** (1. Pers. Pl.): Gaudeamus! – Lasst uns fröhlich sein!
- **Iussiv** (3. Pers.): Veniat. – Er soll kommen.
- **Optativ** (Wunsch, oft mit utinam): Utinam adesset! – Wäre er doch da!
- **Potentialis:** Dixerit aliquis … – Es könnte jemand sagen …
- **Irrealis:** Konj. Impf. (Gegenwart), Konj. Plusqpf. (Vergangenheit)
- **Deliberativ** (Frage): Quid faciam? – Was soll ich tun?
- **Prohibitiv:** ne + Konj. Perf.: Ne dubitaveris! – Zweifle nicht!`],
  [T.gram, `Wie funktioniert ein **irrealer Konditionalsatz**?`, `**Gegenwart:** si + Konj. **Imperfekt**, HS Konj. Imperfekt: Si tacerem, nihil diceres. – Wenn ich schwiege, würdest du nichts sagen.
**Vergangenheit:** si + Konj. **Plusquamperfekt**, HS Konj. Plusquamperfekt: Si tacuisses, philosophus mansisses. – Hättest du geschwiegen, wärst du ein Philosoph geblieben.`],
  [T.gram, `Was ist die **oratio obliqua**?`, `Die **indirekte Rede**: Aussagesätze stehen im **AcI**, Gliedsätze, Befehle und Fragen im **Konjunktiv**. Das **Reflexivpronomen (se, sibi, suus)** bezieht sich auf den **Sprecher**. Übersetzung im deutschen Konjunktiv I („er sagte, er sei …“).`],
  [T.gram, `Was regelt die **consecutio temporum**?`, `Die Zeitenfolge in konjunktivischen Gliedsätzen:
- HS **Gegenwart/Futur** (Haupttempus): Konj. Präsens (gleichzeitig), Konj. Perfekt (vorzeitig)
- HS **Vergangenheit** (Nebentempus): Konj. Imperfekt (gleichzeitig), Konj. Plusquamperfekt (vorzeitig)
- nachzeitig: -urus sim / -urus essem`],

  // ---------------------------------------------------------------- Stilmittel
  [T.stil, `Was ist ein **Chiasmus**? (mit Beispiel)`, `Die **überkreuzte Stellung** einander entsprechender Satzglieder (Schema **AB–BA**).
Bsp.: **satis** eloquentiae, sapientiae **parum** (Sallust) – oder deutsch: „Die Kunst ist lang, und kurz ist unser Leben.“
Funktion: Betonung von Gegensätzen oder Zusammengehörigkeit.`],
  [T.stil, `Was ist ein **Hyperbaton**?`, `Die **Sperrung**: Zusammengehörige Wörter (z. B. Adjektiv und Nomen) werden durch andere Wörter **getrennt**.
Bsp.: **magna** cum **laude**; in Dichtung häufig zur Hervorhebung oder Bildwirkung (Wortstellung bildet Inhalt ab).`],
  [T.stil, `Unterschied **Asyndeton** und **Polysyndeton**?`, `**Asyndeton:** Aufzählung **ohne Konjunktionen** – Veni, vidi, vici. Wirkung: Tempo, Nachdruck.
**Polysyndeton:** Aufzählung **mit vielen Konjunktionen** – et … et … et. Wirkung: Fülle, Eindringlichkeit, Verlangsamung.`],
  [T.stil, `Was sind **Anapher**, **Alliteration** und **Trikolon**?`, `**Anapher:** Wiederholung desselben Wortes am **Anfang** aufeinanderfolgender Sätze/Satzteile (Quo usque … quam diu … quem ad finem …).
**Alliteration:** gleicher **Anlaut** benachbarter Wörter (veni, vidi, vici).
**Trikolon:** **Dreigliedrigkeit**, oft mit Steigerung.`],
  [T.stil, `Was sind **Litotes**, **Klimax** und **Antithese**?`, `**Litotes:** Hervorhebung durch **Verneinung des Gegenteils** – non ignoro = ich weiß sehr genau.
**Klimax:** **Steigerung** in mehreren Stufen.
**Antithese:** **Gegenüberstellung** gegensätzlicher Begriffe oder Gedanken.`],
  [T.stil, `Was sind **Apostrophe**, **Personifikation** und **rhetorische Frage**?`, `**Apostrophe:** direkte **Anrede** abwesender Personen, Götter oder Dinge (O fortuna!).
**Personifikation:** Abstraktes/Dinge handeln wie Personen (Fama in der Aeneis).
**Rhetorische Frage:** Scheinfrage, deren Antwort feststeht – Mittel der Lenkung und Emotionalisierung.`],
  [T.stil, `Wie gehst du bei einer **Stilmittelanalyse** in der Klausur vor?`, `Immer: **Stilmittel benennen + lateinischen Beleg (mit Vers/Zeile) + Funktion/Wirkung im Kontext** erklären.
Nur ein Name ohne Funktion bringt kaum Punkte. Beispiel: „Das Hyperbaton (V. 5) bildet die Trennung der Liebenden auch in der Wortstellung ab.“`],
  [T.stil, `Was ist ein **Enjambement** und eine **Ellipse**?`, `**Enjambement:** Der Satz läuft **über das Versende** hinaus in den nächsten Vers – Hervorhebung des Wortes am Versanfang, Spannung.
**Ellipse:** **Auslassung** eines leicht ergänzbaren Satzteils (oft esse).`],

  // ---------------------------------------------------------------- Metrik
  [T.metr, `Wie ist der **daktylische Hexameter** aufgebaut?`, `**Sechs Versfüße (Metren)**:
- Füße 1–4: **Daktylus** (— ∪ ∪) oder **Spondeus** (— —)
- 5. Fuß: meist **Daktylus**
- 6. Fuß: **Spondeus oder Trochäus** (letzte Silbe anceps)
Versmaß von Epos (Aeneis, Metamorphosen) und Lehrdichtung.`],
  [T.metr, `Wann ist eine Silbe **lang**?`, `**Naturlänge:** langer Vokal oder **Diphthong** (ae, au, oe, ei, eu).
**Positionslänge:** kurzer Vokal, auf den **zwei (oder mehr) Konsonanten** folgen – auch über die Wortgrenze; x und z zählen doppelt.
Ausnahme: **muta cum liquida** (b, p, d, t, g, c + l, r) kann kurz bleiben.`],
  [T.metr, `Was ist eine **Elision**?`, `Wenn ein Wort auf **Vokal oder Vokal + m** endet und das nächste mit **Vokal oder h** beginnt, wird die Endsilbe beim Lesen **verschliffen** (fällt weg).
Bsp.: conticuere omnes → conticuer(e) omnes.`],
  [T.metr, `Was ist die **Penthemimeres**?`, `Die häufigste **Zäsur** im Hexameter: ein Wortende **nach dem 5. Halbfuß**, also nach der ersten Länge des **3. Versfußes**. Weitere Zäsuren: Trithemimeres (nach 3. Halbfuß), Hephthemimeres (nach 7. Halbfuß), bukolische Dihärese (nach dem 4. Fuß).`],
  [T.metr, `Wozu dient die metrische Analyse in der Interpretation?`, `Metrik kann den **Inhalt unterstreichen**: viele **Spondeen** wirken schwer, langsam, feierlich oder traurig; viele **Daktylen** schnell, leicht, bewegt. Zäsuren und Versende heben Wörter hervor.`],

  // ---------------------------------------------------------------- Methode
  [T.meth, `Wie gehst du bei einem schwierigen lateinischen Satz vor?`, `1. **Prädikat(e)** suchen (finite Verben) → Zahl der Sätze
2. **Gliedsatzeinleitungen** markieren (cum, ut, quod, si, qui …)
3. Subjekt und Objekte bestimmen (KNG-Kongruenz)
4. **satzwertige Konstruktionen** erkennen (AcI, Abl. abs., PC, nd-Formen)
5. Satzbild erstellen (Einrück- oder Kästchenmethode), dann übersetzen und **stilistisch glätten**`],
  [T.meth, `Was gehört zur **Vorerschließung** eines Textes?`, `- Überschrift, Einleitung und Hilfen genau lesen
- **Sachfelder/Wortfelder** sammeln (z. B. Krieg, Liebe, Tugend)
- **Eigennamen**, Personen, Orte
- **Konnektoren** (sed, autem, enim, igitur, nam) → Gedankengang
- **Tempusrelief** (Vordergrund Perfekt, Hintergrund Imperfekt), Personenwechsel, direkte Rede
→ Hypothese zum Inhalt bilden.`],
  [T.meth, `Wie ist eine **Interpretationsaufgabe** typischerweise aufgebaut?`, `- Textinhalt **gliedern/zusammenfassen** (AFB I)
- **sprachlich-stilistische Analyse** mit Belegen und Funktion (AFB II)
- **Einordnung** in Werk, Autor, Zeit (z. B. augusteische Zeit, Stoa)
- **Vergleich** mit einem Zusatztext oder Rezeptionsdokument (Bild, moderner Text)
- **Stellungnahme/Bewertung** (AFB III)`],
  [T.meth, `Welche typischen **Übersetzungsfehler** solltest du vermeiden?`, `- Kasusfunktionen verwechseln (Ablativ!)
- satzwertige Konstruktionen übersehen
- Zeitverhältnisse ignorieren (vorzeitig/gleichzeitig)
- falsche Wortbedeutung trotz Wörterbuch → **Kontext** prüfen, nicht nur die erste Bedeutung nehmen
- Bezüge von Pronomen (is, ille, se) falsch zuordnen`],
]

const quiz: QuizTuple[] = [
  [T.cic, `Wem widmete Cicero De officiis?`, [`Atticus`, `seinem Sohn Marcus`, `Caesar`, `Brutus`], 1],
  [T.cic, `Welches Thema behandelt Buch III von De officiis?`, [`Die Kardinaltugenden`, `Das Nützliche allein`, `Den scheinbaren Konflikt zwischen honestum und utile`, `Die Redekunst`], 2],
  [T.cic, `Was ist nach Cicero die Grundlage der Gerechtigkeit?`, [`virtus`, `fides`, `clementia`, `gloria`], 1],
  [T.cic, `Was zeigt das Regulus-Exemplum?`, [`Dass Nutzen wichtiger ist als Eidtreue`, `Dass das honestum (Eidtreue) über dem scheinbaren Nutzen steht`, `Dass Krieg immer ungerecht ist`, `Dass Karthago gerecht war`], 1],
  [T.cic, `Welcher Stoiker ist Ciceros Hauptquelle für De officiis?`, [`Zenon`, `Epikur`, `Panaitios`, `Platon`], 2],
  [T.liv, `Was soll Geschichte laut Livius' Praefatio vor allem bieten?`, [`Exakte Jahreszahlen`, `Vorbilder zum Nachahmen und Meiden (exempla)`, `Unterhaltung durch Mythen`, `Lob des Augustus`], 1],
  [T.liv, `Welches Ereignis führt bei Livius zum Ende der Königszeit?`, [`Der Raub der Sabinerinnen`, `Die Schändung der Lucretia`, `Der Galliersturm`, `Der Tod des Remus`], 1],
  [T.liv, `Wer gilt bei Livius als „zweiter Gründer Roms“?`, [`Mucius Scaevola`, `Camillus`, `Brutus`, `Horatius`], 1],
  [T.liv, `Wodurch entscheidet sich der Streit zwischen Romulus und Remus zunächst?`, [`Durch einen Zweikampf`, `Durch die Vogelschau (Auspizien)`, `Durch das Los`, `Durch Abstimmung des Volkes`], 1],
  [T.ov, `In welchem Versmaß sind die Metamorphosen geschrieben?`, [`Elegisches Distichon`, `Daktylischer Hexameter`, `Jambischer Trimeter`, `Sapphische Strophe`], 1],
  [T.ov, `In was wird Daphne verwandelt?`, [`Eine Narzisse`, `Einen Lorbeerbaum`, `Eine Spinne`, `Eine Eiche`], 1],
  [T.ov, `Was verfärbt sich nach dem Tod von Pyramus und Thisbe?`, [`Die Lorbeerblätter`, `Die Maulbeeren`, `Das Wasser des Flusses`, `Der Schleier`], 1],
  [T.ov, `Welches Ehepaar wird zu Eiche und Linde?`, [`Orpheus und Eurydike`, `Pyramus und Thisbe`, `Philemon und Baucis`, `Deucalion und Pyrrha`], 2],
  [T.ov, `Womit endet Ovids Epilog?`, [`„vivam“ – ich werde leben`, `„Carthago delenda est“`, `„arma virumque cano“`, `„vae victis“`], 0],
  [T.ov, `Wohin wurde Ovid verbannt?`, [`Athen`, `Tomis am Schwarzen Meer`, `Karthago`, `Korsika`], 1],
  [T.sen, `„Vindica te tibi“ stammt aus Senecas Brief über …`, [`die Sklaven`, `den Umgang mit der Zeit`, `die Gladiatorenspiele`, `den Reichtum`], 1],
  [T.sen, `Was fordert Seneca in Brief 47?`, [`Die Abschaffung der Sklaverei`, `Einen menschlichen Umgang mit Sklaven`, `Härtere Strafen für Sklaven`, `Den Verkauf aller Sklaven`], 1],
  [T.sen, `Was ist für Stoiker das einzige Gut?`, [`Gesundheit`, `Reichtum`, `Die Tugend (virtus)`, `Die Lust`], 2],
  [T.sen, `Was sind Adiaphora?`, [`Die vier Kardinaltugenden`, `Gleichgültige Dinge, weder gut noch schlecht`, `Göttliche Strafen`, `Briefe an Lucilius`], 1],
  [T.philo, `Was verstand Epikur unter Lust als höchstem Gut?`, [`Ausschweifenden Genuss`, `Freiheit von Schmerz und Seelenruhe`, `Politischen Ruhm`, `Reichtum`], 1],
  [T.verg, `Wer schickt Merkur zu Aeneas?`, [`Juno`, `Venus`, `Jupiter`, `Neptun`], 2],
  [T.verg, `Auf wen spielt Didos Ruf nach einem Rächer an?`, [`Augustus`, `Hannibal`, `Caesar`, `Kleopatra`], 1],
  [T.verg, `„Italiam non sponte sequor“ bedeutet …`, [`Ich folge Italien freiwillig`, `Nicht aus freiem Willen suche ich Italien`, `Italien folgt mir nicht`, `Ich verlasse Italien`], 1],
  [T.verg, `Welcher Wert kennzeichnet Aeneas vor allem?`, [`furor`, `pietas`, `luxuria`, `superbia`], 1],
  [T.verg, `Welche historische Figur wird oft mit Dido verbunden?`, [`Kleopatra`, `Lucretia`, `Livia`, `Agrippina`], 0],
  [T.staat, `In welcher Reihenfolge verläuft der cursus honorum?`, [`Konsul – Prätor – Quästor`, `Quästor – Prätor – Konsul`, `Prätor – Quästor – Konsul`, `Ädil – Konsul – Prätor`], 1],
  [T.rede, `Welche drei Aufgaben hat der Redner (officia oratoris)?`, [`inventio, dispositio, elocutio`, `docere, delectare, movere`, `exordium, narratio, peroratio`, `iudiciale, deliberativum, demonstrativum`], 1],
  [T.gesch, `„ubi solitudinem faciunt, pacem appellant“ ist ein Beispiel für …`, [`Romidee`, `Romkritik`, `stoische Ethik`, `epikureische Lehre`], 1],
  [T.myth, `Was bedeutet „do ut des“?`, [`Ich gebe, damit du gibst`, `Gott ist gütig`, `Ich gebe alles`, `Gib und vergiss`], 0],
  [T.gram, `Wie übersetzt man „urbe capta“ am besten?`, [`während die Stadt erobert wird`, `nachdem die Stadt erobert worden war`, `um die Stadt zu erobern`, `die Stadt muss erobert werden`], 1, `Abl. abs. mit PPP → vorzeitig, passiv.`],
  [T.gram, `„Carthago delenda est“ drückt aus …`, [`eine Vergangenheit`, `eine Notwendigkeit (Gerundivum + esse)`, `einen Wunsch`, `eine Möglichkeit`], 1],
  [T.gram, `Welche Funktion hat cum mit Konjunktiv und „tamen“ im Hauptsatz meist?`, [`temporal`, `kausal`, `konzessiv („obwohl“)`, `final`], 2],
  [T.gram, `„Homerus caecus fuisse dicitur“ ist ein Beispiel für …`, [`AcI`, `NcI`, `Abl. abs.`, `PC`], 1],
  [T.gram, `Irrealis der Vergangenheit steht im …`, [`Konjunktiv Präsens`, `Konjunktiv Imperfekt`, `Konjunktiv Plusquamperfekt`, `Indikativ Perfekt`], 2],
  [T.stil, `„Veni, vidi, vici“ enthält welche Stilmittel?`, [`Chiasmus und Litotes`, `Asyndeton, Alliteration, Trikolon`, `Hyperbaton und Ellipse`, `Polysyndeton und Anapher`], 1],
  [T.stil, `Das Schema AB–BA heißt …`, [`Parallelismus`, `Chiasmus`, `Anapher`, `Klimax`], 1],
  [T.metr, `Welcher Versfuß steht im 6. Metrum des Hexameters?`, [`Daktylus`, `Spondeus oder Trochäus`, `Jambus`, `Anapäst`], 1],
  [T.metr, `Wann liegt Positionslänge vor?`, [`Bei einem Diphthong`, `Wenn auf einen kurzen Vokal zwei Konsonanten folgen`, `Am Versende`, `Bei jedem langen Vokal`], 1],
]

export const latCards = buildCards('lat', cards)
export const latQuiz = buildQuiz('lat', quiz)
