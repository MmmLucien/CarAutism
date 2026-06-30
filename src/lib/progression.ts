import {
  PROGRESS_LEVELS,
  CATEGORY_SUJETS,
  type SubjectProgress,
  type CategoryProgress,
  type ProgressCategory,
  type UserQuest,
  type QuestCondition,
} from '@/types/progression'
import type { Sujet } from '@/types'
import type { QuestionResult, GameSession } from '@/types'
import { ALL_QUESTS } from '@/data/quests'

// ── Calcul du niveau à partir des XP ─────────────────
export function getLevelFromXp(xp: number): {
  level: number
  name: string
  icon: string
  xpToNextLevel: number
  progressPct: number
} {
  let current = PROGRESS_LEVELS[0]
  let next = PROGRESS_LEVELS[1]

  for (let i = PROGRESS_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= PROGRESS_LEVELS[i].xpRequired) {
      current = PROGRESS_LEVELS[i]
      next = PROGRESS_LEVELS[i + 1] ?? null
      break
    }
  }

  if (!next) {
    return { level: current.level, name: current.name, icon: current.icon, xpToNextLevel: 0, progressPct: 100 }
  }

  const xpInLevel = xp - current.xpRequired
  const xpForNextLevel = next.xpRequired - current.xpRequired
  const progressPct = Math.round((xpInLevel / xpForNextLevel) * 100)

  return {
    level: current.level,
    name: current.name,
    icon: current.icon,
    xpToNextLevel: next.xpRequired - xp,
    progressPct,
  }
}

// ── XP par sujet depuis les scores Supabase ──────────
export interface RawSubjectStat {
  sujet: string
  xp: number
  correct: number
  total: number
}

export function calcSubjectProgress(stats: RawSubjectStat[]): Record<Sujet, SubjectProgress> {
  const result: Record<string, SubjectProgress> = {}

  for (const stat of stats) {
    const lvl = getLevelFromXp(stat.xp)
    result[stat.sujet] = {
      sujet: stat.sujet as Sujet,
      xp: stat.xp,
      correctAnswers: stat.correct,
      totalAnswers: stat.total,
      currentLevel: lvl.level,
      xpToNextLevel: lvl.xpToNextLevel,
      progressPct: lvl.progressPct,
    }
  }

  return result as Record<Sujet, SubjectProgress>
}

export function calcCategoryProgress(
  subjectProgress: Record<Sujet, SubjectProgress>,
  category: ProgressCategory
): CategoryProgress {
  const sujets = CATEGORY_SUJETS[category]
  let totalXp = 0
  let totalCorrect = 0

  for (const sujet of sujets) {
    const sp = subjectProgress[sujet]
    if (sp) {
      totalXp += sp.xp
      totalCorrect += sp.correctAnswers
    }
  }

  const lvl = getLevelFromXp(totalXp)

  return {
    category,
    xp: totalXp,
    correctAnswers: totalCorrect,
    currentLevel: lvl.level,
    xpToNextLevel: lvl.xpToNextLevel,
    progressPct: lvl.progressPct,
  }
}

// ── Évaluer une condition de quête ───────────────────
export function evaluateQuestCondition(
  condition: QuestCondition,
  subjectProgress: Record<Sujet, SubjectProgress>,
  categoryProgress: Record<ProgressCategory, CategoryProgress>,
  sessionResults?: QuestionResult[],
  currentStreak?: number
): number {
  switch (condition.kind) {
    case 'correct_in_sujet': {
      return subjectProgress[condition.sujet]?.correctAnswers ?? 0
    }

    case 'correct_in_category': {
      return categoryProgress[condition.category]?.correctAnswers ?? 0
    }

    case 'reach_level_sujet': {
      return subjectProgress[condition.sujet]?.currentLevel ?? 0
    }

    case 'reach_level_category': {
      return categoryProgress[condition.category]?.currentLevel ?? 0
    }

    case 'streak': {
      return currentStreak ?? 0
    }

    case 'play_sessions': {
      // Handled server-side via scores count
      return 0
    }

    case 'perfect_session': {
      if (!sessionResults) return 0
      const allCorrect = sessionResults.every(r => r.isCorrect)
      if (!allCorrect) return 0
      if (condition.sujet) {
        const allInSujet = sessionResults.every(r => r.question.sujet === condition.sujet)
        return allInSujet ? 1 : 0
      }
      return 1
    }

    case 'correct_sound': {
      const soundXp = (subjectProgress['sons_route']?.correctAnswers ?? 0) +
                      (subjectProgress['sons_sport']?.correctAnswers ?? 0)
      return soundXp
    }

    case 'reach_level_all_sujets': {
      const allLevels = Object.values(subjectProgress).map(sp => sp.currentLevel)
      if (allLevels.length === 0) return 0
      return Math.min(...allLevels)
    }
  }
}

// ── Mettre à jour les quêtes après une session ────────
export function updateQuestsAfterSession(
  session: GameSession,
  userQuests: UserQuest[],
  subjectProgress: Record<Sujet, SubjectProgress>,
  categoryProgress: Record<ProgressCategory, CategoryProgress>,
  currentStreak: number
): { updated: UserQuest[]; newlyCompleted: string[] } {
  const updated: UserQuest[] = []
  const newlyCompleted: string[] = []

  for (const userQuest of userQuests) {
    if (userQuest.status === 'completed' || userQuest.status === 'claimed') {
      updated.push(userQuest)
      continue
    }

    const quest = ALL_QUESTS.find(q => q.id === userQuest.questId)
    if (!quest) { updated.push(userQuest); continue }

    const currentProgress = evaluateQuestCondition(
      quest.condition,
      subjectProgress,
      categoryProgress,
      session.results,
      currentStreak
    )

    const target = getQuestTarget(quest.condition)
    const isCompleted = currentProgress >= target

    updated.push({
      ...userQuest,
      progress: currentProgress,
      status: isCompleted ? 'completed' as const : userQuest.status,
      completedAt: isCompleted && !userQuest.completedAt ? new Date().toISOString() : userQuest.completedAt,
    })

    if (isCompleted && userQuest.status === 'active') {
      newlyCompleted.push(quest.id)
    }
  }

  return { updated, newlyCompleted }
}

export function getQuestTarget(condition: QuestCondition): number {
  switch (condition.kind) {
    case 'correct_in_sujet':
    case 'correct_in_category':
    case 'correct_sound':
    case 'play_sessions':       return condition.count
    case 'streak':              return condition.count
    case 'reach_level_sujet':
    case 'reach_level_category':
    case 'reach_level_all_sujets': return condition.level
    case 'perfect_session':     return 1
  }
}

// ── Initialiser les quêtes journalières ───────────────
export function getActiveDailyQuests(): UserQuest[] {
  const { DAILY_QUESTS } = require('@/data/quests') as { DAILY_QUESTS: any[] }
  const tomorrow = new Date()
  tomorrow.setHours(24, 0, 0, 0)

  // Pick 3 random daily quests each day (seeded by date)
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const shuffled = [...DAILY_QUESTS].sort((a, b) =>
    ((seed * a.id.length) % 7) - ((seed * b.id.length) % 7)
  )

  return shuffled.slice(0, 3).map(q => ({
    questId: q.id,
    status: 'active' as const,
    progress: 0,
    expiresAt: tomorrow.toISOString(),
  }))
}
