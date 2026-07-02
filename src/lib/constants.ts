import type { CategoryConfig } from '@/types'

export const QUESTIONS_PER_GAME = 10
export const TIMER_SECONDS = 60
export const NUMERIC_TOLERANCE_PCT = 7
export const HINT_XP_PENALTY = 0.5

// ══════════════════════════════════════════════════════════════
// Catégories & sujets — chaque profil de passionné a sa place :
// design, industrie, mécano, commercial, people, culture,
// histoire, voitures de route et curiosités.
// ══════════════════════════════════════════════════════════════
export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'route',
    label: '🚗 Voitures de route',
    icon: '🚗',
    sujets: [
      { id: 'marques',     icon: '🎯', name: 'Marques',        description: 'Identifier la marque' },
      { id: 'modeles',     icon: '🔍', name: 'Modèles',        description: 'Identifier le modèle' },
      { id: 'design',      icon: '👁️', name: 'Design',         description: 'Style, lignes, designers' },
      { id: 'classiques',  icon: '🕰️', name: 'Classiques',     description: 'Youngtimers & légendes' },
      { id: 'curiosites',  icon: '🤯', name: 'Curiosités',     description: 'Anecdotes & records fous' },
    ]
  },
  {
    id: 'sport',
    label: '🏁 Sport Automobile',
    icon: '🏁',
    sujets: [
      { id: 'f1',         icon: '🏎️', name: 'Formule 1',   description: 'Écuries, GP, records' },
      { id: 'pilotes',    icon: '🧑‍🚀', name: 'Pilotes',     description: 'Les légendes du volant' },
      { id: 'endurance',  icon: '⏱️', name: 'Endurance',   description: 'Le Mans, WEC, 24h' },
      { id: 'rallye',     icon: '🌲', name: 'Rallye',      description: 'WRC, Dakar, Groupe B' },
      { id: 'circuits',   icon: '🗺️', name: 'Circuits',    description: 'Les tracés mythiques' },
    ]
  },
  {
    id: 'tech',
    label: '🔧 Technique',
    icon: '🔧',
    sujets: [
      { id: 'moteurs',       icon: '⚙️', name: 'Moteurs',         description: 'V8, V12, turbo, rotatif' },
      { id: 'transmissions', icon: '🔄', name: 'Transmissions',   description: 'Boîtes, ponts, 4x4' },
      { id: 'stats',         icon: '📊', name: 'Stats & Records', description: '0-100, V-max, puissance' },
      { id: 'innovations',   icon: '💡', name: 'Innovations',     description: 'Les premières mondiales' },
    ]
  },
  {
    id: 'industrie',
    label: '🏭 Industrie & Histoire',
    icon: '🏭',
    sujets: [
      { id: 'histoire', icon: '📜', name: 'Histoire',          description: 'Naissance des constructeurs' },
      { id: 'business', icon: '💼', name: 'Business',          description: 'Patrons, rachats, marché' },
    ]
  },
  {
    id: 'culture',
    label: '🎬 Culture',
    icon: '🎬',
    sujets: [
      { id: 'films', icon: '🎥', name: 'Films & Séries', description: 'Cinéma et télévision' },
      { id: 'pop',   icon: '🌟', name: 'Pop Culture',    description: 'Jeux vidéo, émissions, musique' },
    ]
  },
  {
    id: 'sons',
    label: '🎵 Sons',
    icon: '🎵',
    sujets: [
      { id: 'sons_route', icon: '🔊', name: 'Sons Route',  description: 'Devine la voiture au son' },
      { id: 'sons_sport', icon: '🏁', name: 'Sons Sport',  description: 'F1, rallye, endurance' },
    ]
  }
]

export const ALL_SUJETS = CATEGORIES.flatMap(c => c.sujets.map(s => s.id))

export const TROPHY_DEFS = [
  { key: 'perfect',     icon: '💎', name: 'Parfait',       description: '10/10 en une partie' },
  { key: 'expert',      icon: '🥇', name: 'Expert',        description: '80% ou plus' },
  { key: 'streak5',     icon: '🔥', name: 'En série x5',   description: '5 bonnes réponses de suite' },
  { key: 'streak3',     icon: '⚡', name: 'En série x3',   description: '3 bonnes réponses de suite' },
  { key: 'fast',        icon: '🚀', name: 'Ultra rapide',  description: 'Moins de 15s en moyenne' },
  { key: 'xp_master',  icon: '💰', name: 'XP Maître',     description: 'Plus de 2000 XP en une partie' },
  { key: 'no_fault',   icon: '🌟', name: 'Sans faute',    description: 'Aucune erreur' },
  { key: 'level4',     icon: '🎯', name: 'Niveau Expert', description: 'Terminer en niveau 4' },
]
