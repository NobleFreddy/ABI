import type { SubjectContent } from './types'
import { latCards, latQuiz } from './latein.cards'

/** Latein LK (fortgeführt) – Vorgaben Zentralabitur 2027 NRW. */
export const latein: SubjectContent = {
  subjectId: 'latein',
  areas: [
    {
      id: 'lat-lektuere',
      title: 'Lektüre-Schwerpunkte 2027',
      topics: [
        {
          id: 'lat-cicero',
          title: 'Cicero, De officiis – Grundlagen und Prinzipien politischen Denkens und Handelns in Rom',
          focus: ['Grundlagen und Prinzipien politischen Denkens und Handelns in Rom ausgehend von Cicero, De officiis (Auswahl)'],
          details: [
            'honestum und utile',
            'Die vier Kardinaltugenden',
            'iustitia und beneficentia, Pflichten auch gegenüber Feinden',
            'Exempla (z. B. Regulus)',
            'Stoische Grundlage (Panaitios)',
          ],
        },
        {
          id: 'lat-livius',
          title: 'Livius, Ab urbe condita (1. Dekade) – Geschichte und Geschehen in realistischer und mythologischer Deutung',
          focus: ['Geschichte und Geschehen in realistischer und mythologischer Deutung ausgehend von Livius, Ab urbe condita, 1. Dekade (Auswahl)'],
          details: [
            'Praefatio: exempla, Sittenverfall',
            'Gründungsmythos (Romulus und Remus)',
            'Raub der Sabinerinnen, Horatier und Curiatier',
            'Lucretia, Brutus und das Ende der Königszeit',
            'Mucius Scaevola, Verginia, Camillus',
          ],
        },
        {
          id: 'lat-ovid',
          title: 'Ovid, Metamorphosen – Mythologische Gestalten, Weltschöpfung und Wandlung',
          focus: ['Mythologische Gestalten, Weltschöpfung und Wandlung ausgehend von Ovid, Metamorphosen (Auswahl)'],
          details: [
            'Proömium, Weltschöpfung, Weltalter',
            'Apoll und Daphne, Pyramus und Thisbe, Narcissus und Echo',
            'Daedalus und Icarus, Arachne, Niobe',
            'Orpheus und Eurydike, Pygmalion, Philemon und Baucis',
            'Epilog (Unsterblichkeit des Dichters)',
          ],
        },
        {
          id: 'lat-seneca',
          title: 'Seneca, Epistulae morales ad Lucilium – Die philosophische Durchdringung des Alltags',
          focus: ['Die philosophische Durchdringung des Alltags ausgehend von Seneca, Epistulae morales ad Lucilium (Auswahl)'],
          details: [
            'Umgang mit der Zeit (ep. 1)',
            'Die Menge meiden (ep. 7)',
            'Umgang mit Sklaven (ep. 47)',
            'Stoische Begriffe: virtus, ratio, adiaphora, affectus',
            'Epikur-Zitate in den Briefen',
          ],
        },
        {
          id: 'lat-vergil',
          title: 'Vergil, Aeneis, 4. Buch – Dichtung, Politik und Propaganda',
          focus: ['Dichtung, Politik und Propaganda ausgehend von Vergil, Aeneis, 4. Buch'],
          details: [
            'Dido und Aeneas, Anna, die Höhlenszene',
            'Fama, Iarbas, Merkurs Auftrag',
            'Streitgespräch, Abschied, Didos Fluch',
            'pietas vs. amor, fatum',
            'Augusteische Propaganda, Punische Kriege',
          ],
        },
      ],
    },
    {
      id: 'lat-felder',
      title: 'Inhaltsfelder des Kernlehrplans (LK)',
      topics: [
        {
          id: 'lat-staat',
          title: 'Staat und Gesellschaft',
          details: [
            'Politische, soziale und ökonomische Strukturen des römischen Staates',
            'Staatstheorie und Staatswirklichkeit',
            'Römische Werte (mos maiorum)',
            'Politische Betätigung und individuelle Existenz',
          ],
        },
        {
          id: 'lat-geschichte',
          title: 'Römische Geschichte und Politik',
          details: [
            'Aufgabe der römischen Geschichtsschreibung',
            'Mythos und Wirklichkeit – Frühzeit, res publica, Prinzipat',
            'Romidee und Romkritik',
            'Rom in der Auseinandersetzung mit fremden Völkern',
          ],
        },
        {
          id: 'lat-rede',
          title: 'Rede und Rhetorik',
          details: ['Philosophische Grundlegung der Redekunst', 'Ideal des Redners (orator perfectus)', 'officia oratoris, Aufbau einer Rede'],
        },
        {
          id: 'lat-welt',
          title: 'Welterfahrung und menschliche Existenz',
          details: [
            'Politische und gesellschaftliche Wirklichkeit in individueller Wahrnehmung',
            'Möglichkeiten der Lebensführung in Staat und Gesellschaft',
          ],
        },
        {
          id: 'lat-philo',
          title: 'Römisches Philosophieren',
          details: ['Stoische und epikureische Philosophie', 'Ethische Normen und Lebenspraxis', 'Sinnfragen der menschlichen Existenz'],
        },
        {
          id: 'lat-mythos',
          title: 'Antike Mythologie, römische Religion und Christentum',
          details: [
            'Der Mythos und seine Funktion',
            'Göttervorstellungen und ihre Bedeutung für Staat, Herrscher und Imperium',
            'Christentum und römischer Staat',
          ],
        },
      ],
    },
    {
      id: 'lat-sprache',
      title: 'Sprache und Textarbeit',
      topics: [
        {
          id: 'lat-grammatik',
          title: 'Grammatik: satzwertige Konstruktionen und Syntax',
          details: [
            'AcI, NcI',
            'Participium coniunctum, Ablativus absolutus',
            'nd-Formen (Gerundium, Gerundivum)',
            'Gliedsätze (cum, ut, ne, quod), Konjunktiv im Hauptsatz',
            'Konditionalgefüge, oratio obliqua',
          ],
        },
        {
          id: 'lat-stil',
          title: 'Stilmittel und ihre Funktion',
          details: [
            'Alliteration, Anapher, Antithese, Asyndeton, Chiasmus, Hyperbaton',
            'Klimax, Litotes, Metapher, Parallelismus, Polysyndeton, Trikolon',
            'Rhetorische Frage, Apostrophe, Personifikation',
          ],
        },
        {
          id: 'lat-metrik',
          title: 'Metrik: daktylischer Hexameter',
          details: ['Aufbau des Hexameters', 'Silbenlänge (Natur- und Positionslänge)', 'Elision, Zäsuren (Penthemimeres)'],
        },
        {
          id: 'lat-methode',
          title: 'Übersetzung und Interpretation',
          details: [
            'Satzanalyse (Einrück- oder Kästchenmethode)',
            'Vorerschließung über Sachfelder und Konnektoren',
            'Operatoren und Aufbau der Interpretationsaufgaben',
          ],
        },
      ],
    },
  ],
  cards: latCards,
  quiz: latQuiz,
}
