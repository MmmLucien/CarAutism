// ── User ──────────────────────────────────────────────
export interface User {
  id: string
  email: string
  username: string
  avatar: string
  isPremium: boolean
  totalXp: number
  createdAt: string
}

// ── Questions ─────────────────────────────────────────
export type Sujet =
  | 'marques' | 'modeles' | 'design' | 'classiques' | 'curiosites'
  | 'f1' | 'pilotes' | 'endurance' | 'rallye' | 'circuits'
  | 'moteurs' | 'transmissions' | 'stats' | 'innovations'
  | 'histoire' | 'business'
  | 'films' | 'pop'
  | 'sons_route' | 'sons_sport'
  | 'event_lmc'
  | 'anecdotes' // legacy — remplacé par 'curiosites', gardé pour compat

export interface Question {
  id: string
  sujet: Sujet
  question: string
  context: string
  hint: string
  correctAnswer: string
  choices4: string[]
  choices6: string[]
  choices8: string[]
  xp: number
  photoUrl?: string
  isNumeric?: boolean
}

// ── Game ──────────────────────────────────────────────
export type GameLevel = 1 | 2 | 3 | 4

export interface GameConfig {
  level: GameLevel
  selectedSujets: Set<Sujet>
  questionsPerGame: number
}

export interface QuestionResult {
  question: Question
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
  xpEarned: number
  hintUsed: boolean
}

export interface GameSession {
  config: GameConfig
  questions: Question[]
  results: QuestionResult[]
  totalScore: number
  bestStreak: number
  startedAt: Date
}

// ── Leaderboard ───────────────────────────────────────
export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  score: number
  correct: number
  total: number
  level: GameLevel
  playedAt: string
}

// ── Trophy ────────────────────────────────────────────
export interface Trophy {
  key: string
  icon: string
  name: string
  description: string
}

// ── Category structure ────────────────────────────────
export interface SujetConfig {
  id: Sujet
  icon: string
  name: string
  description: string
}

export interface CategoryConfig {
  id: string
  label: string
  icon: string
  sujets: SujetConfig[]
}
