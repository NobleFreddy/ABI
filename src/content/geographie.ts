import type { SubjectContent } from './types'
import { geoCards, geoQuiz } from './geographie.cards'

/** Geographie LK – Vorgaben Zentralabitur 2027 NRW (Inhaltsfelder 3–7). */
export const geographie: SubjectContent = {
  subjectId: 'geo',
  areas: [
    {
      id: 'geo-if3',
      title: 'IF 3 · Landwirtschaftliche Strukturen in verschiedenen Klima- und Vegetationszonen',
      topics: [
        {
          id: 'geo-lw-tropen',
          title: 'Landwirtschaftliche Produktion in den Tropen vor dem Hintergrund weltwirtschaftlicher Prozesse',
          details: [
            'Plantagenwirtschaft, Cash Crops vs. Subsistenz',
            'Shifting Cultivation, Agroforstwirtschaft',
            'Nährstoffkreislauf des tropischen Regenwalds',
            'Entwaldung durch Soja, Palmöl, Rinderhaltung',
            'Weltmarktpreise, Terms of Trade, Fairer Handel, Land Grabbing',
          ],
        },
        {
          id: 'geo-lw-intensiv',
          title: 'Intensivierung der landwirtschaftlichen Produktion in der gemäßigten Zone und in den Subtropen',
          details: [
            'Agrobusiness, vertikale und horizontale Integration',
            'Veredelungswirtschaft, Massentierhaltung',
            'Bewässerungsfeldbau (z. B. Almería, Kalifornien)',
            'Versalzung, Grundwasserabsenkung',
            'Spezialisierung, Mechanisierung, Flurbereinigung',
          ],
        },
        {
          id: 'geo-lw-nachhaltig',
          title: 'Landwirtschaft im Spannungsfeld zwischen Ressourcengefährdung und Nachhaltigkeit',
          focus: ['Landwirtschaftliche Produktion im Kontext des Klimawandels'],
          details: [
            'Bodenerosion, Desertifikation, Bodendegradation',
            'Ökologischer Landbau, Precision Farming',
            'Klimaanpassung: Dürre, Starkregen, Verschiebung von Anbaugrenzen',
            'Treibhausgase aus der Landwirtschaft (Methan, Lachgas)',
            'Virtuelles Wasser, Wasserfußabdruck',
          ],
        },
      ],
    },
    {
      id: 'geo-if4',
      title: 'IF 4 · Bedeutungswandel von Standortfaktoren',
      topics: [
        {
          id: 'geo-sw-strukturwandel',
          title: 'Strukturwandel industriell geprägter Räume',
          details: [
            'Harte und weiche Standortfaktoren',
            'Ruhrgebiet: Montanindustrie, Kohle- und Stahlkrise',
            'Deindustrialisierung, Tertiärisierung',
            'Revitalisierung von Industriebrachen (z. B. IBA Emscher Park)',
            'Lebenszyklus von Industrieregionen',
          ],
        },
        {
          id: 'geo-sw-wachstum',
          title: 'Herausbildung von Wachstumsregionen',
          focus: [
            'Veränderung von Raumstrukturen im Kontext von Digitalisierung (Standortfaktor digitale Infrastruktur, Onlinehandel, Verlagerung von Arbeitsplätzen, digital vernetzte Güter- und Personenverkehre, Veränderung von Pendlerströmen)',
          ],
          details: [
            'Cluster und Agglomerationsvorteile',
            'High-Tech-Regionen (z. B. Silicon Valley, Raum München)',
            'Kondratieff-Zyklen, Wissensökonomie',
            'Homeoffice, Breitband, Logistikzentren',
          ],
        },
      ],
    },
    {
      id: 'geo-if5',
      title: 'IF 5 · Stadtentwicklung und Stadtstrukturen',
      topics: [
        {
          id: 'geo-st-merkmale',
          title: 'Merkmale, innere Differenzierung und Wandel von Städten',
          focus: [
            'Entwicklung urbaner Räume im Kontext des Klimawandels',
            'Veränderung von Raumstrukturen im Kontext von Digitalisierung',
          ],
          details: [
            'Stadtstrukturmodelle (Burgess, Hoyt, Harris/Ullman)',
            'Segregation, Gentrifizierung',
            'Suburbanisierung, Reurbanisierung',
            'Stadtklima, urbane Hitzeinsel, Schwammstadt',
            'Smart City, Wandel der Innenstädte durch Onlinehandel',
          ],
        },
        {
          id: 'geo-st-metropol',
          title: 'Metropolisierung und Marginalisierung als Elemente eines weltweiten Verstädterungsprozesses',
          details: [
            'Verstädterung: Verstädterungsgrad vs. -rate',
            'Megastadt, Metropole, Global City, Primatstadt',
            'Land-Stadt-Wanderung (Push- und Pull-Faktoren)',
            'Marginalsiedlungen, informeller Sektor',
            'Fragmentierung, Gated Communities',
          ],
        },
        {
          id: 'geo-st-demografie',
          title: 'Demografischer und sozialer Wandel als Herausforderung für zukunftsorientierte Stadtentwicklung',
          details: [
            'Alterung, Schrumpfung, Stadtumbau',
            'Wohnungsmarkt, bezahlbarer Wohnraum',
            'Migration und Integration',
            'Leitbilder: kompakte Stadt, Stadt der kurzen Wege, nachhaltige Stadt',
          ],
        },
      ],
    },
    {
      id: 'geo-if6',
      title: 'IF 6 · Sozioökonomische Entwicklungsstände von Räumen',
      topics: [
        {
          id: 'geo-dis-merkmale',
          title: 'Merkmale und Ursachen räumlicher Disparitäten',
          details: [
            'Indikatoren: BIP/BNE pro Kopf, HDI, Gini-Koeffizient',
            'Entwicklungstheorien (Modernisierungs-, Dependenztheorie)',
            'Zentrum-Peripherie-Modell',
            'Regionale Disparitäten innerhalb von Staaten',
          ],
        },
        {
          id: 'geo-dis-demografie',
          title: 'Demografische Prozesse in ihrer Bedeutung für die Tragfähigkeit von Räumen',
          details: [
            'Modell des demografischen Übergangs',
            'Bevölkerungspyramiden',
            'Tragfähigkeit, Ernährungssicherung',
            'Fertilität, Migration, demografische Dividende',
          ],
        },
        {
          id: 'geo-dis-strategien',
          title: 'Strategien und Instrumente zur Reduzierung regionaler, nationaler und globaler Disparitäten',
          details: [
            'Agenda 2030 / Sustainable Development Goals',
            'Entwicklungszusammenarbeit, Hilfe zur Selbsthilfe',
            'Mikrokredite, Fairer Handel',
            'Sonderwirtschaftszonen, Wachstumspole, Regionalförderung',
          ],
        },
      ],
    },
    {
      id: 'geo-if7',
      title: 'IF 7 · Dienstleistungen in ihrer Bedeutung für Wirtschafts- und Beschäftigungsstrukturen',
      topics: [
        {
          id: 'geo-dl-tertiaer',
          title: 'Entwicklung von Wirtschafts- und Beschäftigungsstrukturen im Prozess der Tertiärisierung',
          details: [
            'Drei-Sektoren-Hypothese (Fourastié), quartärer Sektor',
            'Unternehmensnahe vs. haushaltsnahe Dienstleistungen',
            'Outsourcing, Offshoring',
            'Logistik, Onlinehandel, Plattformökonomie',
          ],
        },
        {
          id: 'geo-dl-tourismus',
          title: 'Wirtschaftsfaktor Tourismus in seiner Bedeutung für unterschiedlich entwickelte Räume',
          details: [
            'Lebenszyklusmodell nach Butler',
            'Massentourismus, Overtourism',
            'Nachhaltiger Tourismus, Ökotourismus',
            'Sickerrate (Leakage), Multiplikatoreffekt',
            'Tourismus in Ländern des Globalen Südens',
          ],
        },
      ],
    },
    {
      id: 'geo-meth',
      title: 'Methoden & Prüfungstechnik',
      topics: [
        {
          id: 'geo-methoden',
          title: 'Materialauswertung, Atlasarbeit und Operatoren',
          details: [
            'Klimadiagramme, Karten, Diagramme, Statistiken auswerten',
            'Atlasarbeit gezielt einsetzen',
            'Operatoren der Anforderungsbereiche I–III',
            'Aufbau einer Klausurantwort (Einleitung, Materialbezug, Fazit)',
          ],
        },
      ],
    },
  ],
  cards: geoCards,
  quiz: geoQuiz,
}
