import type { SubjectContent } from './types'
import { bioCards, bioQuiz } from './biologie.cards'

/** Biologie GK – Vorgaben Zentralabitur 2027 NRW (Grundlage für die mündliche Prüfung). */
export const biologie: SubjectContent = {
  subjectId: 'bio',
  areas: [
    {
      id: 'bio-neuro',
      title: 'Neurobiologie',
      topics: [
        {
          id: 'bio-neuron',
          title: 'Bau und Funktion von Nervenzellen',
          details: ['Bau eines Neurons', 'Ruhepotenzial', 'Aktionspotenzial', 'Erregungsleitung: kontinuierlich und saltatorisch'],
        },
        {
          id: 'bio-synapse',
          title: 'Synapse',
          details: [
            'Funktion der erregenden chemischen Synapse',
            'Stoffeinwirkung an Synapsen (Gifte, Medikamente, Drogen)',
            'Neuromuskuläre Synapse',
          ],
        },
        { id: 'bio-neuro-verfahren', title: 'Fachliche Verfahren: Potenzialmessungen', focus: ['Ableitung von Membranpotenzialen'] },
      ],
    },
    {
      id: 'bio-stw',
      title: 'Stoffwechselphysiologie',
      topics: [
        {
          id: 'bio-stw-grundlagen',
          title: 'Grundlegende Zusammenhänge bei Stoffwechselwegen',
          details: [
            'Aufbauender und abbauender Stoffwechsel',
            'Stoffwechselregulation auf Enzymebene',
            'Stofftransport zwischen Kompartimenten',
            'Chemiosmotische ATP-Bildung',
            'Redoxreaktionen, Energieumwandlung, ATP-ADP-System',
          ],
        },
        {
          id: 'bio-fotosynthese',
          title: 'Aufbauender Stoffwechsel: Fotosynthese',
          details: [
            'Blattaufbau, Feinbau des Chloroplasten',
            'Absorptions- und Wirkungsspektrum',
            'Abhängigkeit der Fotosyntheserate von abiotischen Faktoren',
            'Calvin-Zyklus: Fixierung, Reduktion, Regeneration',
            'Zusammenhang von Primär- und Sekundärreaktionen',
          ],
        },
        {
          id: 'bio-zellatmung',
          title: 'Abbauender Stoffwechsel: Zellatmung',
          details: [
            'Feinbau des Mitochondriums',
            'Glykolyse, oxidative Decarboxylierung',
            'Tricarbonsäurezyklus (Citratzyklus)',
            'Atmungskette, Stoff- und Energiebilanz',
          ],
        },
        { id: 'bio-chromatografie', title: 'Fachliche Verfahren: Chromatografie', focus: ['Dünnschichtchromatografie von Blattfarbstoffen'] },
      ],
    },
    {
      id: 'bio-oeko',
      title: 'Ökologie',
      topics: [
        {
          id: 'bio-oeko-strukturen',
          title: 'Strukturen und Zusammenhänge in Ökosystemen',
          details: [
            'Biotop und Biozönose, abiotische und biotische Faktoren',
            'Toleranzkurven, ökologische Potenz',
            'Kohlenstoffkreislauf, Nahrungsnetz, Energiefluss',
            'Konkurrenz, Parasitismus, Symbiose, Räuber-Beute-Beziehungen',
            'Ökologische Nische',
          ],
        },
        {
          id: 'bio-oeko-mensch',
          title: 'Einfluss des Menschen auf Ökosysteme, Nachhaltigkeit, Biodiversität',
          focus: ['Alle Inhalte werden an selbst gewählten Beispielen erarbeitet'],
          details: [
            'Folgen des anthropogenen Treibhauseffekts',
            'Ökosystemmanagement: Ursache-Wirkungs-Zusammenhänge',
            'Erhaltungs- und Renaturierungsmaßnahmen, nachhaltige Nutzung',
            'Bedeutung und Erhalt der Biodiversität',
          ],
        },
        {
          id: 'bio-oeko-verfahren',
          title: 'Fachliche Verfahren: Freilandarbeit',
          focus: ['Anwendung eines dichotomen Bestimmungsschlüssels'],
          details: ['Erfassung ökologischer Faktoren', 'Qualitative Erfassung von Arten in einem Areal'],
        },
      ],
    },
    {
      id: 'bio-gen',
      title: 'Genetik und Evolution',
      topics: [
        {
          id: 'bio-molgen',
          title: 'Molekulargenetische Grundlagen des Lebens',
          details: [
            'Bau der DNA, semikonservative Replikation',
            'Transkription, Translation',
            'Genregulation bei Eukaryoten: Transkriptionsfaktoren, DNA-Methylierung',
            'Genmutationen und ihre Folgen',
          ],
        },
        {
          id: 'bio-humangenetik',
          title: 'Genetik menschlicher Erkrankungen',
          details: ['Familienstammbäume und Erbgänge', 'Gentest und genetische Beratung', 'Gentherapie'],
        },
        {
          id: 'bio-evolution',
          title: 'Synthetische Evolutionstheorie',
          details: [
            'Mutation, Rekombination, Selektion, Variation, Gendrift',
            'Adaptiver Wert von Verhalten, Kosten-Nutzen-Analyse',
            'Reproduktive Fitness, Koevolution',
            'Abgrenzung von nicht-naturwissenschaftlichen Vorstellungen',
          ],
        },
        {
          id: 'bio-stammbaum',
          title: 'Stammbäume und Verwandtschaft',
          details: [
            'Artbildung, Isolationsmechanismen',
            'Populationsgenetischer Artbegriff',
            'Homologie, Analogie, molekularbiologische Homologien',
            'Ursprüngliche und abgeleitete Merkmale',
          ],
        },
      ],
    },
  ],
  cards: bioCards,
  quiz: bioQuiz,
}
