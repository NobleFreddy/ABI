import { buildCards, buildQuiz, type CardTuple, type QuizTuple } from './build'

// String.raw: Backslashes für LaTeX müssen nicht verdoppelt werden.
const r = String.raw

const T = {
  fkt: 'ma-funktionen',
  diff: 'ma-diff',
  ext: 'ma-extrem',
  int: 'ma-integral',
  vek: 'ma-vektoren',
  ebe: 'ma-ebenen',
  lage: 'ma-lage',
  lgs: 'ma-lgs',
  mehr: 'ma-mehrstufig',
  zg: 'ma-zufallsgroessen',
  bin: 'ma-binomial',
  hmf: 'ma-hmf',
}

const cards: CardTuple[] = [
  // ---------------------------------------------------------------- Funktionen
  [T.fkt, r`Wie bestimmst du das **Verhalten einer ganzrationalen Funktion für** $x \to \pm\infty$?`, r`Entscheidend ist nur der Summand mit dem **höchsten Exponenten** $a_n x^n$:
- $n$ gerade, $a_n > 0$: $f(x) \to +\infty$ für $x \to \pm\infty$
- $n$ gerade, $a_n < 0$: $f(x) \to -\infty$ für $x \to \pm\infty$
- $n$ ungerade, $a_n > 0$: von $-\infty$ nach $+\infty$
- $n$ ungerade, $a_n < 0$: von $+\infty$ nach $-\infty$`],
  [T.fkt, r`Wann ist eine ganzrationale Funktion **achsensymmetrisch zur y-Achse**, wann **punktsymmetrisch zum Ursprung**?`, r`**Achsensymmetrisch:** nur **gerade** Exponenten (Konstante zählt als $x^0$) bzw. allgemein $f(-x) = f(x)$.
**Punktsymmetrisch:** nur **ungerade** Exponenten bzw. $f(-x) = -f(x)$.`],
  [T.fkt, r`Wie viele **Nullstellen, Extrem- und Wendestellen** hat eine ganzrationale Funktion vom Grad $n$ höchstens?`, r`Höchstens $n$ Nullstellen, $n-1$ Extremstellen und $n-2$ Wendestellen.`],
  [T.fkt, r`Nenne Verfahren, um **Nullstellen** zu berechnen.`, r`- **Ausklammern** + **Satz vom Nullprodukt**: $x^3 - 4x = x(x^2-4) = 0$
- **pq-Formel** / abc-Formel für quadratische Gleichungen: $x_{1,2} = -\frac{p}{2} \pm \sqrt{\left(\frac{p}{2}\right)^2 - q}$
- **Substitution** bei biquadratischen Gleichungen ($z = x^2$)
- bei e-Funktionen: $e^x$ wird nie null → nur den Faktor davor untersuchen`],
  [T.fkt, r`Eigenschaften der **natürlichen Exponentialfunktion** $f(x) = e^x$?`, r`- $D = \mathbb{R}$, $W = (0; \infty)$ → **keine Nullstelle**
- streng monoton steigend, linksgekrümmt
- Schnittpunkt mit der y-Achse $(0|1)$
- $f'(x) = e^x$
- waagerechte Asymptote $y = 0$ für $x \to -\infty$
- $e \approx 2{,}718$`],
  [T.fkt, r`Was bewirken die Parameter in $f(x) = a \cdot e^{kx}$?`, r`- $a$: **Anfangswert** $f(0) = a$ (Streckung in y-Richtung; $a<0$ spiegelt an der x-Achse)
- $k > 0$: **exponentielles Wachstum**, $k < 0$: **exponentielle Abnahme**
- Verdopplungszeit $T_D = \frac{\ln 2}{k}$, Halbwertszeit $T_H = \frac{\ln 2}{|k|}$`],
  [T.fkt, r`Wie löst man $e^{x} = 5$ oder $3 \cdot e^{2x} = 12$?`, r`Mit dem **natürlichen Logarithmus** (Umkehrfunktion von $e^x$):
- $e^x = 5 \Rightarrow x = \ln 5$
- $3e^{2x} = 12 \Rightarrow e^{2x} = 4 \Rightarrow 2x = \ln 4 \Rightarrow x = \frac{\ln 4}{2} = \ln 2$`],
  [T.fkt, r`Eigenschaften von $\sin(x)$ und $\cos(x)$?`, r`- Periode $2\pi$, Wertebereich $[-1; 1]$
- $\sin$: punktsymmetrisch, Nullstellen bei $k\pi$
- $\cos$: achsensymmetrisch, Nullstellen bei $\frac{\pi}{2} + k\pi$
- $\sin'(x) = \cos(x)$, $\cos'(x) = -\sin(x)$`],
  [T.fkt, r`Eigenschaften von $f(x) = \sqrt{x}$ und $g(x) = \frac{1}{x}$?`, r`$\sqrt{x}$: $D = [0; \infty)$, streng steigend, $f'(x) = \frac{1}{2\sqrt{x}}$.
$\frac{1}{x}$: $D = \mathbb{R}\setminus\{0\}$, punktsymmetrisch zum Ursprung, Asymptoten $x=0$ und $y=0$, $g'(x) = -\frac{1}{x^2}$.`],
  [T.fkt, r`Welche **Transformationen** bewirken $f(x)+d$, $f(x-c)$, $a\cdot f(x)$ und $f(b\cdot x)$?`, r`- $f(x) + d$: Verschiebung um $d$ **nach oben**
- $f(x - c)$: Verschiebung um $c$ **nach rechts**
- $a \cdot f(x)$: **Streckung** in y-Richtung (Faktor $a$), für $a<0$ zusätzlich Spiegelung an der x-Achse
- $f(b \cdot x)$: **Stauchung** in x-Richtung mit Faktor $\frac{1}{b}$; $f(-x)$ spiegelt an der y-Achse`],

  // ---------------------------------------------------------------- Differentialrechnung
  [T.diff, r`Nenne die **Grundregeln des Ableitens**.`, r`- Potenzregel: $(x^n)' = n x^{n-1}$
- Faktorregel: $(c \cdot f)' = c \cdot f'$
- Summenregel: $(f + g)' = f' + g'$
- $(e^x)' = e^x$, $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$
- $(\sqrt{x})' = \frac{1}{2\sqrt{x}}$, $\left(\frac{1}{x}\right)' = -\frac{1}{x^2}$`],
  [T.diff, r`Wie lautet die **Produktregel**?`, r`$$(u \cdot v)' = u' \cdot v + u \cdot v'$$
Beispiel: $f(x) = x^2 \cdot e^x \Rightarrow f'(x) = 2x \cdot e^x + x^2 \cdot e^x = (x^2 + 2x)e^x$`],
  [T.diff, r`Wie leitest du $e^{ax+b}$ ab (**Kettenregel**)?`, r`Äußere Ableitung mal innere Ableitung:
$$\left(e^{ax+b}\right)' = a \cdot e^{ax+b}$$
Beispiele: $(e^{-x})' = -e^{-x}$, $(e^{2x})' = 2e^{2x}$, $(5e^{0{,}5x - 1})' = 2{,}5\,e^{0{,}5x-1}$`],
  [T.diff, r`Leite ab: $f(x) = (2x+1)\cdot e^{-x}$`, r`Produkt- und Kettenregel:
$f'(x) = 2\cdot e^{-x} + (2x+1)\cdot(-e^{-x}) = (2 - 2x - 1)e^{-x} = (1 - 2x)\,e^{-x}$`],
  [T.diff, r`Was bedeutet $f'(x_0)$ geometrisch und im Sachzusammenhang?`, r`- **Steigung der Tangente** an den Graphen im Punkt $(x_0 | f(x_0))$
- **momentane (lokale) Änderungsrate** der Größe $f$ an der Stelle $x_0$ (z. B. Geschwindigkeit, Wachstumsrate)
Zum Vergleich: **durchschnittliche Änderungsrate** $\frac{f(b) - f(a)}{b - a}$ (Sekantensteigung).`],
  [T.diff, r`Wie lautet die **Tangentengleichung** an $f$ in $x_0$?`, r`$$t(x) = f'(x_0)\cdot(x - x_0) + f(x_0)$$`],
  [T.diff, r`Wie bestimmst du **Extrempunkte**?`, r`1. **Notwendige Bedingung:** $f'(x) = 0$ lösen
2. **Hinreichende Bedingung:** $f''(x_E) < 0$ → **Hochpunkt**, $f''(x_E) > 0$ → **Tiefpunkt**
(alternativ: **Vorzeichenwechsel** von $f'$: $+/-$ Hochpunkt, $-/+$ Tiefpunkt)
3. y-Wert $f(x_E)$ berechnen`],
  [T.diff, r`Wie bestimmst du **Wendepunkte** und was bedeuten sie?`, r`Notwendig: $f''(x) = 0$; hinreichend: $f'''(x_W) \neq 0$ (oder Vorzeichenwechsel von $f''$).
Bedeutung: Änderung der **Krümmung**; Stelle **stärkster Zu- oder Abnahme** (Extremum von $f'$). Wendepunkt mit waagerechter Tangente = **Sattelpunkt**.`],
  [T.diff, r`Zusammenhang **Monotonie/Krümmung** und Ableitungen?`, r`- $f'(x) > 0$ → $f$ streng monoton **steigend**; $f'(x) < 0$ → **fallend**
- $f''(x) > 0$ → **linksgekrümmt** (konvex); $f''(x) < 0$ → **rechtsgekrümmt**
- Extremstelle von $f$ ↔ **Nullstelle mit Vorzeichenwechsel** von $f'$
- Wendestelle von $f$ ↔ **Extremstelle** von $f'$`],
  [T.diff, r`Wie erkennst du am **Graphen von $f'$** Eigenschaften von $f$?`, r`- $f'$ oberhalb der x-Achse → $f$ steigt
- Nullstelle von $f'$ mit VZW → Extremstelle von $f$ (von + nach −: Hochpunkt)
- Hoch-/Tiefpunkt von $f'$ → Wendestelle von $f$
- $f'$ berührt die x-Achse (ohne VZW) → Sattelpunkt von $f$`],
  [T.diff, r`Untersuche $f(x) = x \cdot e^{-x}$ auf Extrempunkte.`, r`$f'(x) = e^{-x} - x e^{-x} = (1 - x)e^{-x}$
$f'(x) = 0 \Rightarrow x = 1$ (da $e^{-x} > 0$)
$f''(x) = (x - 2)e^{-x}$, $f''(1) = -e^{-1} < 0$ → **Hochpunkt** $H(1 | e^{-1}) \approx (1 | 0{,}37)$`],

  // ---------------------------------------------------------------- Extremwert & Steckbrief
  [T.ext, r`Wie löst du ein **Extremwertproblem**?`, r`1. **Zielfunktion** aufstellen (was soll maximal/minimal werden?)
2. **Nebenbedingung** aufstellen und nach einer Variablen umstellen
3. In die Zielfunktion einsetzen → Funktion mit **einer** Variablen
4. **Definitionsbereich** festlegen (sinnvolle Werte)
5. Extremum berechnen ($f' = 0$, hinreichende Bedingung)
6. **Randwerte** prüfen und Ergebnis im Sachkontext angeben`],
  [T.ext, r`Wie gehst du bei einer **Steckbriefaufgabe** (Rekonstruktion) vor?`, r`1. **Allgemeinen Ansatz** wählen, z. B. Grad 3: $f(x) = ax^3 + bx^2 + cx + d$ (4 Unbekannte → 4 Bedingungen)
2. Text in **Bedingungen** übersetzen
3. **LGS** aufstellen und lösen
4. Funktionsterm angeben und ggf. **prüfen** (hinreichende Bedingungen)`],
  [T.ext, r`Übersetze in Bedingungen: „Der Graph hat in $P(2|3)$ einen Hochpunkt“ und „Wendepunkt bei $x = 1$“.`, r`- Punkt auf dem Graphen: $f(2) = 3$
- waagerechte Tangente: $f'(2) = 0$
- Wendepunkt: $f''(1) = 0$
Weitere: „berührt die x-Achse in $x_0$“ → $f(x_0) = 0$ und $f'(x_0)=0$; „Symmetrie zur y-Achse“ → nur gerade Exponenten.`],
  [T.ext, r`Was kann ein Parameter in einem **Sachkontext** bedeuten, z. B. in $f(t) = 50 \cdot e^{-0{,}2t}$?`, r`- $50$: **Anfangsbestand** zum Zeitpunkt $t = 0$
- $-0{,}2$: **Abnahmerate** (je größer $|k|$, desto schneller die Abnahme)
- Halbwertszeit: $\frac{\ln 2}{0{,}2} \approx 3{,}47$ Zeiteinheiten
Parameter bestimmst du aus gegebenen Punkten oder Bedingungen (z. B. $f(2) = 30$).`],
  [T.ext, r`Typischer Aufbau einer **e-Funktions-Analysisaufgabe** im Abi?`, r`- Funktion im Sachkontext (z. B. Medikamentenkonzentration $f(t) = a\,t\,e^{-kt}$)
- Werte berechnen und deuten, Maximum (Zeitpunkt höchster Konzentration)
- Wendepunkt = stärkste Zu-/Abnahme
- Integral = Gesamtmenge / Mittelwert
- Langfristiges Verhalten ($t \to \infty$: $e^{-kt} \to 0$)`],

  // ---------------------------------------------------------------- Integral
  [T.int, r`Was ist eine **Stammfunktion**?`, r`$F$ ist Stammfunktion von $f$, wenn $F'(x) = f(x)$. Stammfunktionen unterscheiden sich nur um eine **Konstante** $C$.`],
  [T.int, r`Nenne wichtige **Stammfunktionen**.`, r`- $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ $(n \neq -1)$
- $\int e^x\,dx = e^x + C$
- $\int e^{ax+b}\,dx = \frac{1}{a}e^{ax+b} + C$
- $\int \sin x\,dx = -\cos x + C$, $\int \cos x\,dx = \sin x + C$`],
  [T.int, r`Wie lautet der **Hauptsatz der Differential- und Integralrechnung**?`, r`Ist $F$ eine Stammfunktion von $f$, dann gilt:
$$\int_a^b f(x)\,dx = F(b) - F(a)$$`],
  [T.int, r`Was bedeutet das Integral als **orientierter Flächeninhalt**?`, r`Flächen **oberhalb** der x-Achse zählen **positiv**, Flächen **unterhalb negativ**. Das Integral ist die Bilanz.
Für den **tatsächlichen Flächeninhalt**: Nullstellen bestimmen, abschnittsweise integrieren und **Beträge addieren**.`],
  [T.int, r`Wie berechnest du die **Fläche zwischen zwei Graphen**?`, r`1. **Schnittstellen** berechnen: $f(x) = g(x)$
2. $A = \int_{x_1}^{x_2} |f(x) - g(x)|\,dx$ – bei mehreren Schnittstellen abschnittsweise
(Oberer Graph minus unterer Graph → positiver Wert.)`],
  [T.int, r`Was ist eine **Integralfunktion**?`, r`$I_a(x) = \int_a^x f(t)\,dt$ – sie gibt den orientierten Flächeninhalt ab der unteren Grenze $a$ an. Es gilt $I_a(a) = 0$ und $I_a'(x) = f(x)$.`],
  [T.int, r`Wie rekonstruierst du einen **Bestand aus einer Änderungsrate**?`, r`Ist $f$ die Änderungsrate (z. B. Zuflussrate in l/min), dann gilt:
$$B(t) = B(0) + \int_0^t f(x)\,dx$$
Das Integral über die Rate liefert die **Gesamtänderung** im Zeitraum.`],
  [T.int, r`Wie berechnest du den **Mittelwert** einer Funktion auf $[a; b]$?`, r`$$\bar{m} = \frac{1}{b-a}\int_a^b f(x)\,dx$$
Beispiel: durchschnittliche Temperatur oder Geschwindigkeit in einem Zeitraum.`],
  [T.int, r`Was ist eine **Produktsumme** (Ober-/Untersumme)?`, r`Näherung der Fläche durch **Rechtecke**: Breite $\Delta x$ mal Funktionswert, aufsummiert. Bei immer feineren Zerlegungen nähern sich Ober- und Untersumme dem Integral an.`],

  // ---------------------------------------------------------------- Vektoren
  [T.vek, r`Wie berechnest du den **Verbindungsvektor**, den **Betrag** und den **Mittelpunkt**?`, r`- $\vec{AB} = \vec{b} - \vec{a}$ („Spitze minus Fuß“)
- $|\vec{v}| = \sqrt{v_1^2 + v_2^2 + v_3^2}$ (Länge/Abstand zweier Punkte)
- Mittelpunkt $\vec{m} = \frac{1}{2}(\vec{a} + \vec{b})$`],
  [T.vek, r`Wie berechnest du das **Skalarprodukt** und wofür brauchst du es?`, r`$$\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 + a_3 b_3$$
- **Orthogonalität:** $\vec{a} \perp \vec{b} \iff \vec{a}\cdot\vec{b} = 0$
- **Winkel:** $\cos\alpha = \frac{\vec{a}\cdot\vec{b}}{|\vec{a}|\cdot|\vec{b}|}$`],
  [T.vek, r`Sind $\vec{a} = \begin{pmatrix} 1 \\ 2 \\ -1 \end{pmatrix}$ und $\vec{b} = \begin{pmatrix} 3 \\ -1 \\ 1 \end{pmatrix}$ orthogonal?`, r`$\vec{a}\cdot\vec{b} = 3 - 2 - 1 = 0$ → **ja, orthogonal**.`],
  [T.vek, r`Wann sind zwei Vektoren **kollinear** (linear abhängig)?`, r`Wenn einer ein Vielfaches des anderen ist: $\vec{a} = k\cdot\vec{b}$. Dann sind sie parallel (gleiche oder entgegengesetzte Richtung).`],
  [T.vek, r`Wie prüfst du, ob ein Viereck ein **Parallelogramm/Rechteck** ist?`, r`- Parallelogramm: $\vec{AB} = \vec{DC}$ (und damit $\vec{AD} = \vec{BC}$)
- Rechteck: zusätzlich $\vec{AB}\cdot\vec{AD} = 0$
- Quadrat: zusätzlich $|\vec{AB}| = |\vec{AD}|$`],

  // ---------------------------------------------------------------- Geraden & Ebenen
  [T.ebe, r`Wie lautet die **Parameterform einer Geraden**?`, r`$$g: \vec{x} = \vec{p} + r\cdot\vec{u}, \quad r \in \mathbb{R}$$
$\vec{p}$: **Stützvektor** (Ortsvektor eines Punktes), $\vec{u}$: **Richtungsvektor**. Gerade durch $A$ und $B$: $\vec{x} = \vec{a} + r\cdot\vec{AB}$.`],
  [T.ebe, r`Wie lautet die **Parameterform einer Ebene**?`, r`$$E: \vec{x} = \vec{p} + r\cdot\vec{u} + s\cdot\vec{v}$$
mit zwei **nicht kollinearen Spannvektoren** $\vec{u}$, $\vec{v}$. Ebene durch $A, B, C$: $\vec{x} = \vec{a} + r\cdot\vec{AB} + s\cdot\vec{AC}$.`],
  [T.ebe, r`Was ist die **Koordinatenform** einer Ebene und was ist ein **Normalenvektor**?`, r`$$E: n_1 x_1 + n_2 x_2 + n_3 x_3 = d$$
$\vec{n} = \begin{pmatrix} n_1 \\ n_2 \\ n_3 \end{pmatrix}$ ist ein **Normalenvektor**: Er steht **senkrecht auf der Ebene** (orthogonal zu beiden Spannvektoren). $d$ erhältst du durch Einsetzen eines Ebenenpunktes: $d = \vec{n}\cdot\vec{p}$.`],
  [T.ebe, r`Wie wandelst du die **Parameterform in die Koordinatenform** um?`, r`1. **Normalenvektor** bestimmen: $\vec{n}\cdot\vec{u} = 0$ und $\vec{n}\cdot\vec{v} = 0$ (LGS, eine Koordinate frei wählen – oder Vektorprodukt)
2. Ansatz $n_1x_1 + n_2x_2 + n_3x_3 = d$
3. Stützpunkt einsetzen → $d$`],
  [T.ebe, r`Wie prüfst du, ob ein Punkt auf einer Geraden oder Ebene liegt (**Punktprobe**)?`, r`- **Koordinatenform:** Punkt einsetzen – Gleichung erfüllt?
- **Parameterform:** Punkt gleichsetzen und LGS lösen – gibt es (für alle Zeilen) passende Parameter?`],
  [T.ebe, r`Was sind **Spurpunkte** einer Ebene $E: 2x_1 + 3x_2 + 6x_3 = 12$?`, r`Schnittpunkte mit den Koordinatenachsen (jeweils zwei Koordinaten null setzen):
$S_1(6|0|0)$, $S_2(0|4|0)$, $S_3(0|0|2)$ – hilfreich zum Zeichnen der Ebene.`],

  // ---------------------------------------------------------------- Lagebeziehungen
  [T.lage, r`Welche **Lagebeziehungen zweier Geraden** gibt es und wie prüfst du sie?`, r`1. Sind die **Richtungsvektoren kollinear**?
- ja → **identisch** (Punktprobe erfolgreich) oder **echt parallel**
- nein → Gleichsetzen und LGS lösen: Lösung → **schneiden sich** (Schnittpunkt), keine Lösung → **windschief**`],
  [T.lage, r`Wie berechnest du den **Schnittpunkt zweier Geraden**?`, r`Geradengleichungen **gleichsetzen**: $\vec{p} + r\vec{u} = \vec{q} + s\vec{v}$ → LGS mit 3 Gleichungen und 2 Unbekannten. Mit zwei Zeilen $r$ und $s$ bestimmen, die **dritte Zeile prüfen**. Dann $r$ (oder $s$) einsetzen → Schnittpunkt.`],
  [T.lage, r`Wie bestimmst du die Lage einer **Geraden zu einer Ebene** (Koordinatenform)?`, r`Koordinaten der Geraden ($x_i$ in Abhängigkeit von $r$) **in die Ebenengleichung einsetzen**:
- **eine Lösung** für $r$ → Schnittpunkt (einsetzen in $g$)
- **keine Lösung** (Widerspruch) → $g$ ist **parallel** zu $E$
- **unendlich viele** (wahre Aussage) → $g$ **liegt in** $E$
Schnelltest: $\vec{u}\cdot\vec{n} = 0$ → parallel oder in der Ebene.`],
  [T.lage, r`Formeln für **Schnittwinkel**?`, r`- Gerade–Gerade: $\cos\alpha = \frac{|\vec{u}\cdot\vec{v}|}{|\vec{u}|\cdot|\vec{v}|}$
- Gerade–Ebene: $\sin\alpha = \frac{|\vec{u}\cdot\vec{n}|}{|\vec{u}|\cdot|\vec{n}|}$ (Sinus, weil der Normalenvektor senkrecht steht!)
- Ebene–Ebene: $\cos\alpha = \frac{|\vec{n_1}\cdot\vec{n_2}|}{|\vec{n_1}|\cdot|\vec{n_2}|}$`],
  [T.lage, r`Typische **Sachkontexte** für Geraden und Ebenen im Abi?`, r`- **Flugbahnen** (Flugzeug/Drohne als Gerade, Zeitparameter $t$): Kollision? Abstand? Wann über einem Punkt?
- **Dachflächen, Pyramiden, Zelte** als Ebenen: Neigungswinkel, Schattenpunkt (Lichtstrahl als Gerade schneidet Boden-Ebene)
- **Lichtstrahl/Laser** trifft auf Fläche → Schnittpunkt Gerade–Ebene`],

  // ---------------------------------------------------------------- LGS
  [T.lgs, r`Wie funktioniert das **Gauß-Verfahren**?`, r`LGS durch **Äquivalenzumformungen** (Zeilen vertauschen, mit Zahl ≠ 0 multiplizieren, Vielfache addieren) in **Stufenform** bringen. Dann von unten nach oben die Variablen bestimmen (Rückwärtseinsetzen).`],
  [T.lgs, r`Wie erkennst du die **Lösbarkeit** eines LGS in Stufenform?`, r`- Zeile $0 = c$ mit $c \neq 0$ → **keine Lösung**
- Nullzeile $0 = 0$ (weniger Gleichungen als Unbekannte) → **unendlich viele Lösungen** (Parameter)
- sonst → **genau eine Lösung**`],

  // ---------------------------------------------------------------- Stochastik
  [T.mehr, r`Was besagen die **Pfadregeln**?`, r`- **Produktregel:** Wahrscheinlichkeit eines Pfades = **Produkt** der Wahrscheinlichkeiten entlang des Pfades
- **Summenregel:** Wahrscheinlichkeit eines Ereignisses = **Summe** der Wahrscheinlichkeiten aller zugehörigen Pfade`],
  [T.mehr, r`Unterschied **Ziehen mit und ohne Zurücklegen**?`, r`**Mit Zurücklegen:** Wahrscheinlichkeiten bleiben auf jeder Stufe gleich (unabhängig).
**Ohne Zurücklegen:** Anzahl der Kugeln ändert sich → Wahrscheinlichkeiten ändern sich von Stufe zu Stufe.`],
  [T.mehr, r`Wie ist eine **Vierfeldertafel** aufgebaut?`, r`Spalten: $B$, $\bar{B}$, Summe
- Zeile $A$: $P(A\cap B)$, $P(A\cap\bar{B})$, $P(A)$
- Zeile $\bar{A}$: $P(\bar{A}\cap B)$, $P(\bar{A}\cap\bar{B})$, $P(\bar{A})$
- Summe: $P(B)$, $P(\bar{B})$, $1$
Innere Felder addieren sich zu den Randwerten.`],
  [T.mehr, r`Wie berechnest du eine **bedingte Wahrscheinlichkeit**?`, r`$$P_B(A) = \frac{P(A\cap B)}{P(B)}$$
„Wahrscheinlichkeit von $A$ **unter der Bedingung**, dass $B$ eingetreten ist.“ Im Baumdiagramm: Wahrscheinlichkeiten auf der **2. Stufe** sind bedingte Wahrscheinlichkeiten.`],
  [T.mehr, r`Wann sind zwei Ereignisse **stochastisch unabhängig**?`, r`Wenn $P(A\cap B) = P(A)\cdot P(B)$ gilt – gleichbedeutend mit $P_B(A) = P(A)$: Das Eintreten von $B$ ändert die Wahrscheinlichkeit von $A$ nicht.`],
  [T.mehr, r`Typische Falle: Ein Test erkennt Kranke mit 95 %, die Krankheit ist selten (1 %). Wie wahrscheinlich ist man bei positivem Test wirklich krank?`, r`**Umgekehrter Baum / Vierfeldertafel** nutzen (Satz von Bayes). Bei seltener Krankheit ist $P_{\text{positiv}}(\text{krank})$ oft **überraschend klein**, weil die vielen Gesunden auch bei kleiner Fehlerquote viele falsch-positive Ergebnisse liefern.`],
  [T.zg, r`Wie berechnest du **Erwartungswert, Varianz und Standardabweichung** einer Zufallsgröße $X$?`, r`- $E(X) = \mu = \sum x_i \cdot P(X = x_i)$
- $V(X) = \sum (x_i - \mu)^2 \cdot P(X = x_i)$
- $\sigma = \sqrt{V(X)}$
$\mu$: langfristiger Durchschnittswert; $\sigma$: typische Streuung um $\mu$.`],
  [T.zg, r`Wann ist ein Spiel **fair**?`, r`Wenn der **Erwartungswert des Gewinns** (Auszahlung minus Einsatz) **0** ist. $E > 0$: günstig für den Spieler, $E < 0$: günstig für den Anbieter.`],
  [T.bin, r`Was ist eine **Bernoulli-Kette**?`, r`Ein Zufallsexperiment mit **genau zwei Ausgängen** (Treffer/Niete), das **$n$-mal unabhängig** mit **gleicher Trefferwahrscheinlichkeit $p$** wiederholt wird. $X$ = Anzahl der Treffer ist dann binomialverteilt.`],
  [T.bin, r`Wie lautet die **Formel von Bernoulli**?`, r`$$P(X = k) = \binom{n}{k}\cdot p^k \cdot (1-p)^{n-k}$$
$\binom{n}{k}$ = Anzahl der Pfade mit genau $k$ Treffern.`],
  [T.bin, r`Was gibt der **Binomialkoeffizient** $\binom{n}{k}$ an?`, r`Die Anzahl der Möglichkeiten, $k$ Treffer auf $n$ Stufen zu verteilen (= Anzahl der passenden Pfade).
$\binom{n}{k} = \frac{n!}{k!\,(n-k)!}$, z. B. $\binom{5}{2} = 10$.`],
  [T.bin, r`Wie rechnest du mit **kumulierten Wahrscheinlichkeiten**?`, r`- $P(X \le k)$: direkt (Tabelle/WTR „binomcdf“)
- $P(X \ge k) = 1 - P(X \le k-1)$
- $P(X > k) = 1 - P(X \le k)$
- $P(a \le X \le b) = P(X \le b) - P(X \le a-1)$
Tipp: „mindestens“ → Gegenereignis!`],
  [T.bin, r`Erwartungswert und Standardabweichung der **Binomialverteilung**?`, r`$$\mu = n\cdot p, \qquad \sigma = \sqrt{n\cdot p\cdot(1-p)}$$`],
  [T.bin, r`Wie sieht das **Histogramm** einer Binomialverteilung aus?`, r`- höchste Säule(n) **bei oder nahe** $\mu = n\cdot p$
- **symmetrisch** für $p = 0{,}5$; für $p < 0{,}5$ linkssteil (nach rechts auslaufend)
- größeres $n$ → breiter und flacher; größeres $\sigma$ → stärkere Streuung
- Summe aller Säulenhöhen = 1`],
  [T.bin, r`„Wie oft muss man mindestens werfen, um mit mindestens 90 % Wahrscheinlichkeit mindestens eine Sechs zu haben?“`, r`$P(X \ge 1) = 1 - \left(\frac{5}{6}\right)^n \ge 0{,}9 \Rightarrow \left(\frac{5}{6}\right)^n \le 0{,}1$
$n \ge \frac{\ln 0{,}1}{\ln(5/6)} \approx 12{,}6$ → **mindestens 13 Würfe**.
(Achtung: Beim Teilen durch den negativen Logarithmus dreht sich das Ungleichheitszeichen.)`],

  // ---------------------------------------------------------------- Hilfsmittelfrei
  [T.hmf, r`Leite ab: $f(x) = 3x^4 - 2x^2 + 5x - 7$`, r`$f'(x) = 12x^3 - 4x + 5$`],
  [T.hmf, r`Leite ab: $f(x) = 4\sqrt{x} + \frac{2}{x}$`, r`$f'(x) = \frac{2}{\sqrt{x}} - \frac{2}{x^2}$`],
  [T.hmf, r`Leite ab: $f(x) = x^3 \cdot e^{2x}$`, r`$f'(x) = 3x^2 e^{2x} + 2x^3 e^{2x} = x^2(3 + 2x)\,e^{2x}$`],
  [T.hmf, r`Gib eine Stammfunktion an: $f(x) = 6x^2 - 4x + e^{2x}$`, r`$F(x) = 2x^3 - 2x^2 + \frac{1}{2}e^{2x}$`],
  [T.hmf, r`Berechne $\int_0^2 (3x^2 - 2)\,dx$.`, r`$\left[x^3 - 2x\right]_0^2 = (8 - 4) - 0 = 4$`],
  [T.hmf, r`Löse $x^3 - 4x = 0$.`, r`$x(x^2 - 4) = 0 \Rightarrow x = 0$ oder $x^2 = 4 \Rightarrow x = \pm 2$ → $\mathbb{L} = \{-2; 0; 2\}$`],
  [T.hmf, r`Löse $x^4 - 5x^2 + 4 = 0$.`, r`Substitution $z = x^2$: $z^2 - 5z + 4 = 0 \Rightarrow z = 1$ oder $z = 4$
→ $x = \pm 1$ oder $x = \pm 2$`],
  [T.hmf, r`Löse $e^{2x} - 3e^{x} = 0$.`, r`$e^x(e^x - 3) = 0$; $e^x \neq 0$, also $e^x = 3 \Rightarrow x = \ln 3$`],
  [T.hmf, r`Löse $(x - 2)\cdot e^{x} = 0$.`, r`Satz vom Nullprodukt: $e^x$ ist nie 0, also $x - 2 = 0 \Rightarrow x = 2$`],
  [T.hmf, r`Bestimme die Tangente an $f(x) = x^2$ in $x_0 = 3$.`, r`$f(3) = 9$, $f'(x) = 2x$, $f'(3) = 6$
$t(x) = 6(x - 3) + 9 = 6x - 9$`],
  [T.hmf, r`Berechne den Abstand der Punkte $A(1|2|3)$ und $B(3|4|4)$.`, r`$\vec{AB} = \begin{pmatrix} 2 \\ 2 \\ 1 \end{pmatrix}$, $|\vec{AB}| = \sqrt{4 + 4 + 1} = 3$`],
  [T.hmf, r`Zwei Münzwürfe: Wie groß ist $P(\text{mindestens einmal Kopf})$?`, r`Gegenereignis „nie Kopf“: $\frac{1}{2}\cdot\frac{1}{2} = \frac{1}{4}$ → $P = 1 - \frac{1}{4} = \frac{3}{4}$`],
  [T.hmf, r`Eine Urne enthält 3 rote und 2 blaue Kugeln. Zwei werden **ohne Zurücklegen** gezogen. $P(\text{beide rot})$?`, r`$\frac{3}{5}\cdot\frac{2}{4} = \frac{6}{20} = \frac{3}{10}$`],
  [T.hmf, r`Bestimme einen Normalenvektor der Ebene durch $\vec{u} = \begin{pmatrix} 1 \\ 0 \\ 2 \end{pmatrix}$ und $\vec{v} = \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}$.`, r`$\vec{n}\cdot\vec{u} = n_1 + 2n_3 = 0$, $\vec{n}\cdot\vec{v} = n_2 + n_3 = 0$
Wähle $n_3 = -1$: $n_1 = 2$, $n_2 = 1$ → $\vec{n} = \begin{pmatrix} 2 \\ 1 \\ -1 \end{pmatrix}$ (Probe: beide Skalarprodukte 0)`],
  [T.hmf, r`Welche Strategie hilft im **hilfsmittelfreien Teil**?`, r`- Erst alle Aufgaben lesen, die Wahlaufgaben nach eigenen Stärken auswählen (Festlegung auf ein Sachgebiet ist erlaubt)
- Rechenwege **sauber und knapp** aufschreiben, Zwischenschritte zeigen
- typische Werte kennen: $e^0 = 1$, $\ln 1 = 0$, $\ln e = 1$, $\sin 0 = 0$, $\cos 0 = 1$
- Ergebnisse durch Probe absichern`],
]

const quiz: QuizTuple[] = [
  [T.fkt, r`Wie verhält sich $f(x) = -2x^3 + x$ für $x \to +\infty$?`, [r`$f(x) \to +\infty$`, r`$f(x) \to -\infty$`, r`$f(x) \to 0$`, r`$f(x) \to -2$`], 1, r`Der Summand mit dem höchsten Exponenten ($-2x^3$) entscheidet.`],
  [T.fkt, r`Welche Funktion ist achsensymmetrisch zur y-Achse?`, [r`$x^3 + x$`, r`$x^4 - 3x^2 + 1$`, r`$x^2 + x$`, r`$e^x$`], 1],
  [T.fkt, r`Welchen Wertebereich hat $f(x) = e^x$?`, [r`$\mathbb{R}$`, r`$[0; \infty)$`, r`$(0; \infty)$`, r`$[1; \infty)$`], 2],
  [T.fkt, r`Der Graph von $f(x-2)+1$ entsteht aus dem von $f$ durch Verschiebung um …`, [r`2 nach links, 1 nach oben`, r`2 nach rechts, 1 nach oben`, r`2 nach rechts, 1 nach unten`, r`1 nach rechts, 2 nach oben`], 1],
  [T.fkt, r`Was ist die Lösung von $e^x = 7$?`, [r`$x = 7e$`, r`$x = \ln 7$`, r`$x = \frac{7}{e}$`, r`$x = e^7$`], 1],
  [T.diff, r`Was ist die Ableitung von $f(x) = x^2 e^x$?`, [r`$2x e^x$`, r`$(x^2 + 2x)e^x$`, r`$x^2 e^x$`, r`$2x e^{x-1}$`], 1],
  [T.diff, r`Was ist die Ableitung von $e^{-3x}$?`, [r`$e^{-3x}$`, r`$-3e^{-3x}$`, r`$-3x e^{-3x-1}$`, r`$3e^{-3x}$`], 1],
  [T.diff, r`Was ist die Ableitung von $\cos(x)$?`, [r`$\sin(x)$`, r`$-\sin(x)$`, r`$-\cos(x)$`, r`$\tan(x)$`], 1],
  [T.diff, r`Was ist die Ableitung von $\sqrt{x}$?`, [r`$\frac{1}{\sqrt{x}}$`, r`$\frac{1}{2\sqrt{x}}$`, r`$2\sqrt{x}$`, r`$\frac{\sqrt{x}}{2}$`], 1],
  [T.diff, r`$f'(x_0) = 0$ und $f''(x_0) < 0$ bedeutet …`, [r`Tiefpunkt`, r`Hochpunkt`, r`Wendepunkt`, r`Nullstelle`], 1],
  [T.diff, r`Eine Wendestelle von $f$ ist immer …`, [r`eine Nullstelle von $f$`, r`eine Extremstelle von $f'$`, r`eine Nullstelle von $f'$`, r`ein Hochpunkt von $f''$`], 1],
  [T.diff, r`Die Steigung der Tangente an $f(x) = x^3$ in $x_0 = 2$ ist …`, [r`8`, r`12`, r`6`, r`4`], 1],
  [T.ext, r`Wie viele Bedingungen brauchst du, um eine ganzrationale Funktion 3. Grades eindeutig zu bestimmen?`, [r`2`, r`3`, r`4`, r`5`], 2],
  [T.ext, r`„Der Graph berührt die x-Achse bei $x = 1$“ liefert die Bedingungen …`, [r`$f(1) = 0$`, r`$f(1) = 0$ und $f'(1) = 0$`, r`$f'(1) = 0$ und $f''(1) = 0$`, r`$f''(1) = 0$`], 1],
  [T.int, r`Eine Stammfunktion von $f(x) = e^{2x}$ ist …`, [r`$2e^{2x}$`, r`$\frac{1}{2}e^{2x}$`, r`$e^{2x}$`, r`$\frac{1}{2x}e^{2x}$`], 1],
  [T.int, r`$\int_0^1 2x\,dx$ ergibt …`, [r`2`, r`1`, r`0{,}5`, r`0`], 1],
  [T.int, r`Liegt die Fläche unterhalb der x-Achse, ist das Integral …`, [r`positiv`, r`negativ`, r`null`, r`nicht definiert`], 1],
  [T.int, r`Wofür steht $\int_a^b f(x)\,dx$, wenn $f$ eine Zuflussrate ist?`, [r`die Rate zum Zeitpunkt $b$`, r`die Gesamtänderung des Bestands von $a$ bis $b$`, r`den maximalen Zufluss`, r`den Bestand zum Zeitpunkt $a$`], 1],
  [T.vek, r`Zwei Vektoren sind orthogonal, wenn …`, [r`ihr Skalarprodukt 1 ist`, r`ihr Skalarprodukt 0 ist`, r`sie gleich lang sind`, r`sie kollinear sind`], 1],
  [T.vek, r`Wie lang ist $\vec{v} = \begin{pmatrix} 2 \\ 3 \\ 6 \end{pmatrix}$?`, [r`11`, r`7`, r`49`, r`$\sqrt{11}$`], 1],
  [T.ebe, r`Der Normalenvektor der Ebene $E: 2x_1 - x_2 + 4x_3 = 5$ ist …`, [r`$\begin{pmatrix} 2 \\ -1 \\ 4 \end{pmatrix}$`, r`$\begin{pmatrix} 5 \\ 0 \\ 0 \end{pmatrix}$`, r`$\begin{pmatrix} 2 \\ 1 \\ 4 \end{pmatrix}$`, r`$\begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$`], 0],
  [T.lage, r`Zwei Geraden mit nicht kollinearen Richtungsvektoren, deren Gleichsetzen keine Lösung liefert, sind …`, [r`parallel`, r`identisch`, r`windschief`, r`orthogonal`], 2],
  [T.lage, r`Beim Einsetzen einer Geraden in eine Ebene ergibt sich $0 = 5$. Die Gerade …`, [r`schneidet die Ebene`, r`liegt in der Ebene`, r`ist echt parallel zur Ebene`, r`ist windschief`], 2],
  [T.lage, r`Für den Winkel zwischen Gerade und Ebene verwendet man …`, [r`$\cos$ mit $\vec{u}$ und $\vec{n}$`, r`$\sin$ mit $\vec{u}$ und $\vec{n}$`, r`$\tan$`, r`nur den Betrag von $\vec{n}$`], 1],
  [T.mehr, r`Was ist $P_B(A)$?`, [r`$P(A)\cdot P(B)$`, r`$\frac{P(A\cap B)}{P(B)}$`, r`$\frac{P(A\cap B)}{P(A)}$`, r`$P(A) + P(B)$`], 1],
  [T.mehr, r`$A$ und $B$ sind unabhängig, wenn …`, [r`$P(A\cap B) = 0$`, r`$P(A\cap B) = P(A)\cdot P(B)$`, r`$P(A) = P(B)$`, r`$P(A) + P(B) = 1$`], 1],
  [T.zg, r`Ein Spiel ist fair, wenn der Erwartungswert des Gewinns …`, [r`positiv ist`, r`0 ist`, r`1 ist`, r`gleich dem Einsatz ist`], 1],
  [T.bin, r`Für $n = 50$, $p = 0{,}2$ ist der Erwartungswert …`, [r`5`, r`10`, r`20`, r`2{,}5`], 1],
  [T.bin, r`$P(X \ge 3)$ berechnest du am besten als …`, [r`$P(X \le 3)$`, r`$1 - P(X \le 2)$`, r`$1 - P(X \le 3)$`, r`$P(X = 3)$`], 1],
  [T.bin, r`Wann ist das Histogramm einer Binomialverteilung symmetrisch?`, [r`für $p = 0{,}5$`, r`für $n = 10$`, r`für $p = 0{,}1$`, r`immer`], 0],
  [T.bin, r`Welche Voraussetzung gehört NICHT zu einer Bernoulli-Kette?`, [r`zwei Ausgänge pro Stufe`, r`gleiche Trefferwahrscheinlichkeit`, r`Unabhängigkeit der Stufen`, r`Ziehen ohne Zurücklegen aus kleiner Urne`], 3],
]

export const maCards = buildCards('ma', cards)
export const maQuiz = buildQuiz('ma', quiz)
