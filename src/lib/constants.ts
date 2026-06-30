import type { CategoryConfig } from '@/types'

export const QUESTIONS_PER_GAME = 10
export const TIMER_SECONDS = 60
export const NUMERIC_TOLERANCE_PCT = 7
export const HINT_XP_PENALTY = 0.5

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'route',
    label: '🚗 Voitures de route',
    sujets: [
      { id: 'marques',    icon: '🎯', name: 'Marques',    description: 'Identifier la marque' },
      { id: 'modeles',    icon: '🔍', name: 'Modèles',    description: 'Identifier le modèle' },
      { id: 'design',     icon: '👁️', name: 'Design',     description: 'Reconnaître depuis une photo' },
      { id: 'anecdotes',  icon: '💡', name: 'Anecdotes',  description: 'Culture & histoires' },
    ]
  },
  {
    id: 'sport',
    label: '🏁 Sport Automobile',
    sujets: [
      { id: 'f1',         icon: '🏎️', name: 'Formule 1',   description: 'Pilotes, écuries, records' },
      { id: 'endurance',  icon: '⏱️', name: 'Endurance',   description: 'Le Mans, WEC, 24h' },
      { id: 'rallye',     icon: '🌲', name: 'Rallye',      description: 'WRC, Dakar' },
      { id: 'circuits',   icon: '🗺️', name: 'Circuits',   description: 'Grands circuits du monde' },
    ]
  },
  {
    id: 'tech',
    label: '🔧 Technique',
    sujets: [
      { id: 'moteurs',       icon: '⚙️', name: 'Moteurs',        description: 'V8, V12, turbo, Wankel' },
      { id: 'transmissions', icon: '🔄', name: 'Transmissions',  description: 'RWD, AWD, boîtes' },
      { id: 'stats',         icon: '📊', name: 'Stats & Records', description: '0-100, vitesse, puissance' },
    ]
  },
  {
    id: 'culture',
    label: '🎬 Culture',
    sujets: [
      { id: 'films', icon: '🎥', name: 'Films & Séries', description: 'Cinéma et télévision' },
      { id: 'pop',   icon: '🌟', name: 'Pop Culture',   description: 'Jeux, émissions, tendances' },
    ]
  },
  {
    id: 'sons',
    label: '🎵 Sons',
    sujets: [
      { id: 'sons_route', icon: '🔊', name: 'Sons Route',  description: 'Devinez la voiture au son' },
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
