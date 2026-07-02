import { NUMERIC_TOLERANCE_PCT } from './constants'
import type { Question, GameLevel, QuestionResult, Trophy } from '@/types'
import { TROPHY_DEFS } from './constants'

// ── Shuffle array ──────────────────────────────────────
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ── Get choices for a given level ─────────────────────
export function getChoices(question: Question, level: GameLevel): string[] {
  if (level === 1) return shuffle(question.choices4)
  if (level === 2) return shuffle(question.choices6 ?? question.choices4)
  if (level === 3) return shuffle(question.choices8 ?? question.choices6 ?? question.choices4)
  return [] // Level 4 = free text
}

// ── Normalize text answer ─────────────────────────────
function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s*(ch|cv|hp|bhp|nm|km\/h|kph|km|s|sec|secondes?|l|kg|g)\s*$/i, '')
    .replace(/[\s,]/g, '')
    .replace(',', '.')
    .trim()
}

// ── Extract first number from string ─────────────────
function extractNumber(s: string): number | null {
  const m = normalizeText(s).match(/[\d.]+/)
  return m ? parseFloat(m[0]) : null
}

// ── Check if numeric answer is close enough ──────────
function isNumericClose(userAnswer: string, correctAnswer: string): boolean {
  const u = extractNumber(userAnswer)
  const c = extractNumber(correctAnswer)
  if (u === null || c === null) return false
  if (c === 0) return u === 0
  return Math.abs(u - c) / c <= NUMERIC_TOLERANCE_PCT / 100
}

// ── Check if answer is correct ────────────────────────
export function checkAnswer(
  userAnswer: string,
  question: Question,
  level: GameLevel
): boolean {
  if (userAnswer === '__skip__' || userAnswer === '__timeout__') return false
  if (userAnswer === question.correctAnswer) return true

  if (level === 4) {
    // Exact normalized match
    if (normalizeText(userAnswer) === normalizeText(question.correctAnswer)) return true
    // Numeric tolerance for stats questions
    if (question.isNumeric) return isNumericClose(userAnswer, question.correctAnswer)
  }

  return false
}

// ── Calculate XP earned ──────────────────────────────
export function calcXp(question: Question, hintUsed: boolean): number {
  return hintUsed ? Math.floor(question.xp * 0.5) : question.xp
}

// ── Calculate trophies from session results ───────────
export function calcTrophies(
  results: QuestionResult[],
  totalScore: number,
  bestStreak: number,
  avgTime: number,
  level: GameLevel
): Trophy[] {
  const correct = results.filter(r => r.isCorrect).length
  const total = results.length
  const pct = Math.round((correct / total) * 100)

  const earned: Trophy[] = []

  for (const def of TROPHY_DEFS) {
    let qualifies = false
    switch (def.key) {
      case 'perfect':    qualifies = pct === 100; break
      case 'expert':     qualifies = pct >= 80; break
      case 'streak5':    qualifies = bestStreak >= 5; break
      case 'streak3':    qualifies = bestStreak >= 3; break
      case 'fast':       qualifies = avgTime < 15; break
      case 'xp_master':  qualifies = totalScore > 2000; break
      case 'no_fault':   qualifies = correct === total; break
      case 'level4':     qualifies = level === 4 && pct >= 60; break
    }
    if (qualifies) earned.push({ ...def, earned: true })
  }

  return earned
}

// ── Format time ───────────────────────────────────────
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m${s > 0 ? `${s}s` : ''}`
}

// ── Sujet label ───────────────────────────────────────
export function getSujetLabel(sujet: string): string {
  const map: Record<string, string> = {
    marques: '🎯 MARQUES',
    modeles: '🔍 MODÈLES',
    design: '👁️ DESIGN',
    classiques: '🕰️ CLASSIQUES',
    curiosites: '🤯 CURIOSITÉS',
    anecdotes: '🤯 CURIOSITÉS',
    f1: '🏎️ FORMULE 1',
    pilotes: '🧑\u200d🚀 PILOTES',
    endurance: '⏱️ ENDURANCE',
    rallye: '🌲 RALLYE',
    circuits: '🗺️ CIRCUITS',
    moteurs: '⚙️ MOTEURS',
    transmissions: '🔄 TRANSMISSIONS',
    stats: '📊 STATS & RECORDS',
    innovations: '💡 INNOVATIONS',
    histoire: '📜 HISTOIRE',
    business: '💼 BUSINESS',
    films: '🎥 FILMS & SÉRIES',
    pop: '🌟 POP CULTURE',
    sons_route: '🔊 SONS · ROUTE',
    sons_sport: '🎵 SONS · SPORT AUTO',
    event_lmc: '🏁 LE MANS CLASSIC',
  }
  return map[sujet] ?? sujet.toUpperCase()
}
