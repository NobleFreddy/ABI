import type { SubjectContent } from './types'
import { maCards, maQuiz } from './mathematik.cards'

/** Mathematik GK (WTR) – Vorgaben Zentralabitur 2027 NRW. */
export const mathematik: SubjectContent = {
  subjectId: 'mathe',
  areas: [
    {
      id: 'ma-analysis',
      title: 'Funktionen und Analysis',
      topics: [
        {
          id: 'ma-funktionen',
          title: 'Funktionen und ihre Eigenschaften',
          focus: [
            'Eigenschaften von ganzrationalen Funktionen, Exponentialfunktionen, Sinus- und Kosinusfunktion, den Potenzfunktionen √x und 1/x sowie Transformationen dieser Funktionen',
          ],
          details: ['Definitions- und Wertebereich, Nullstellen', 'Symmetrie, Verhalten für x → ±∞', 'Verschieben, Strecken, Spiegeln'],
        },
        {
          id: 'ma-diff',
          title: 'Differentialrechnung: Ableitungsregeln und Kurvendiskussion',
          focus: [
            'Hilfsmittelfrei: Ableitungen von ganzrationalen Funktionen, eˣ, sin, cos, √x und 1/x, Produktregel',
            'Kettenregel bei Verknüpfung von eˣ mit linearen Funktionen',
          ],
          details: ['Monotonie, Extrempunkte, Wendepunkte', 'Tangentengleichung', 'Untersuchung von e-Funktionen und zusammengesetzten Funktionen'],
        },
        {
          id: 'ma-extrem',
          title: 'Extremwertprobleme, Steckbriefaufgaben und Parameter',
          focus: [
            'Untersuchung von ganzrationalen Funktionen, der natürlichen Exponentialfunktion und daraus zusammengesetzten Funktionen',
            'Interpretation und Bestimmung von Parametern',
          ],
          details: ['Zielfunktion und Nebenbedingung', 'Rekonstruktion von Funktionstermen', 'Bedeutung von Parametern im Sachkontext'],
        },
        {
          id: 'ma-integral',
          title: 'Integralrechnung',
          details: [
            'Produktsumme, orientierte Fläche',
            'Bestandsfunktion, Integralfunktion, Stammfunktion',
            'Hauptsatz der Differential- und Integralrechnung',
            'Flächen zwischen Graphen, Mittelwerte',
          ],
        },
      ],
    },
    {
      id: 'ma-geometrie',
      title: 'Analytische Geometrie und Lineare Algebra',
      topics: [
        { id: 'ma-vektoren', title: 'Vektoren und Skalarprodukt', details: ['Betrag (Länge), Mittelpunkt', 'Orthogonalität', 'Winkel zwischen Vektoren'] },
        {
          id: 'ma-ebenen',
          title: 'Geraden und Ebenen',
          details: ['Parameterform von Gerade und Ebene', 'Koordinatenform, Normalenvektor', 'Umwandlung zwischen den Formen'],
        },
        {
          id: 'ma-lage',
          title: 'Lagebeziehungen, Schnittpunkte und Schnittwinkel',
          focus: ['Schnittpunkte von Geraden', 'Lagebeziehungen von Geraden', 'Schnittpunkte von Geraden mit Ebenen'],
          details: ['Schnittwinkel Gerade–Gerade, Gerade–Ebene, Ebene–Ebene'],
        },
        { id: 'ma-lgs', title: 'Lineare Gleichungssysteme', details: ['Gauß-Verfahren', 'Lösungsmengen: eine, keine oder unendlich viele Lösungen'] },
      ],
    },
    {
      id: 'ma-stochastik',
      title: 'Stochastik',
      topics: [
        {
          id: 'ma-mehrstufig',
          title: 'Mehrstufige Zufallsexperimente und bedingte Wahrscheinlichkeiten',
          details: ['Urnenmodelle, Baumdiagramme, Pfadregeln', 'Vierfeldertafel', 'Bedingte Wahrscheinlichkeit, stochastische Unabhängigkeit'],
        },
        {
          id: 'ma-zufallsgroessen',
          title: 'Diskrete Zufallsgrößen und Kenngrößen',
          details: ['Wahrscheinlichkeitsverteilung', 'Erwartungswert, Varianz, Standardabweichung', 'Faires Spiel'],
        },
        {
          id: 'ma-binomial',
          title: 'Binomialverteilung',
          details: ['Bernoulli-Kette', 'Formel von Bernoulli, kumulierte Wahrscheinlichkeiten', 'Kenngrößen μ = n·p und σ', 'Histogramme interpretieren'],
        },
      ],
    },
    {
      id: 'ma-format',
      title: 'Prüfungsformat',
      topics: [
        {
          id: 'ma-hmf',
          title: 'Hilfsmittelfreier Teil – Training',
          details: [
            'Ableiten und Integrieren ohne Taschenrechner',
            'Gleichungen lösen (Ausklammern, Substitution, Satz vom Nullprodukt)',
            'Vektorrechnung ohne Taschenrechner',
            'Baumdiagramme und Vierfeldertafeln',
          ],
        },
      ],
    },
  ],
  cards: maCards,
  quiz: maQuiz,
}
