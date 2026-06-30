import type { Sujet } from './index'

// ── Niveaux de progression ────────────────────────────
export interface ProgressLevel {
  level: number
  name: string
  xpRequired: number      // XP cumulés pour atteindre ce niveau
  icon: string
}

export const PROGRESS_LEVELS: ProgressLevel[] = [
  { level: 1, name: 'Observateur',  xpRequired: 0,      icon: '👁️' },
  { level: 2, name: 'Passionné',    xpRequired: 500,    icon: '🔥' },
  { level: 3, name: 'Connaisseur',  xpRequired: 1500,   icon: '📚' },
  { level: 4, name: 'Expert',       xpRequired: 3500,   icon: '🎯' },
  { level: 5, name: 'Pilote',       xpRequired: 7000,   icon: '🏎️' },
  { level: 6, name: 'Ingénieur',    xpRequired: 12000,  icon: '⚙️' },
  { level: 7, name: 'Champion',     xpRequired: 20000,  icon: '🏆' },
  { level: 8, name: 'Légende',      xpRequired: 35000,  icon: '💎' },
]

// ── Catégories de progression ─────────────────────────
export type ProgressCategory =
  | 'route'       // Voitures de route (marques + modeles + design + anecdotes + sons_route)
  | 'motorsport'  // Sport auto (f1 + endurance + rallye + circuits + sons_sport)
  | 'tech'        // Technique (moteurs + transmissions + stats)
  | 'culture'     // Culture (films + pop)

export const CATEGORY_SUJETS: Record<ProgressCategory, Sujet[]> = {
  route:      ['marques', 'modeles', 'design', 'anecdotes', 'sons_route'],
  motorsport: ['f1', 'endurance', 'rallye', 'circuits', 'sons_sport'],
  tech:       ['moteurs', 'transmissions', 'stats'],
  culture:    ['films', 'pop'],
}

export const CATEGORY_CONFIG: Record<ProgressCategory, { label: string; icon: string }> = {
  route:      { label: 'Voitures de route', icon: '🚗' },
  motorsport: { label: 'Motorsport',        icon: '🏁' },
  tech:       { label: 'Technique',         icon: '🔧' },
  culture:    { label: 'Culture',           icon: '🎬' },
}

// ── Progression par sujet et catégorie ───────────────
export interface SubjectProgress {
  sujet: Sujet
  xp: number
  correctAnswers: number
  totalAnswers: number
  currentLevel: number
  xpToNextLevel: number
  progressPct: number     // 0-100 vers le niveau suivant
}

export interface CategoryProgress {
  category: ProgressCategory
  xp: number              // Somme XP de tous les sujets
  correctAnswers: number
  currentLevel: number
  xpToNextLevel: number
  progressPct: number
}

// ── Quêtes ────────────────────────────────────────────
export type QuestType = 'daily' | 'progression' | 'mastery'
export type QuestStatus = 'locked' | 'active' | 'completed' | 'claimed'

export interface Quest {
  id: string
  type: QuestType
  title: string
  description: string
  icon: string
  xpReward: number
  badgeReward?: string      // Nom du badge débloqué si applicable
  titleReward?: string      // Titre débloqué si applicable

  // Condition de completion
  condition: QuestCondition
}

export type QuestCondition =
  | { kind: 'correct_in_sujet';    sujet: Sujet;              count: number }
  | { kind: 'correct_in_category'; category: ProgressCategory; count: number }
  | { kind: 'reach_level_sujet';   sujet: Sujet;              level: number }
  | { kind: 'reach_level_category';category: ProgressCategory; level: number }
  | { kind: 'streak';              count: number }
  | { kind: 'play_sessions';       count: number;   minLevel?: number }
  | { kind: 'perfect_session';     sujet?: Sujet }
  | { kind: 'correct_sound';       count: number }
  | { kind: 'reach_level_all_sujets'; level: number }

export interface UserQuest {
  questId: string
  status: QuestStatus
  progress: number          // Valeur actuelle
  completedAt?: string
  claimedAt?: string
  expiresAt?: string        // Pour les quêtes journalières
}
