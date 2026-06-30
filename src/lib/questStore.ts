import type { UserQuest } from '@/types/progression'
import { getActiveDailyQuests } from '@/lib/progression'
import { PROGRESSION_QUESTS, MASTERY_QUESTS } from '@/data/quests'

const STORAGE_KEY = 'carautism_user_quests'
const DAILY_DATE_KEY = 'carautism_daily_quests_date'

// ── Lire l'état complet des quêtes utilisateur ────────────────────
export function loadUserQuests(): UserQuest[] {
  try {
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem(DAILY_DATE_KEY)
    const raw = localStorage.getItem(STORAGE_KEY)
    let quests: UserQuest[] = raw ? JSON.parse(raw) : []

    // Reset des quêtes journalières si on a changé de jour
    if (savedDate !== today) {
      const newDaily = getActiveDailyQuests()
      const nonDaily = quests.filter(q => !q.questId.startsWith('daily-'))
      quests = [...nonDaily, ...newDaily]
      localStorage.setItem(DAILY_DATE_KEY, today)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quests))
    }

    // S'assurer que toutes les quêtes progression/mastery existent (init à 'active')
    const existingIds = new Set(quests.map(q => q.questId))
    const missingProgression = PROGRESSION_QUESTS
      .filter(q => !existingIds.has(q.id))
      .map(q => ({ questId: q.id, status: 'active' as const, progress: 0 }))
    const missingMastery = MASTERY_QUESTS
      .filter(q => !existingIds.has(q.id))
      .map(q => ({ questId: q.id, status: 'active' as const, progress: 0 }))

    if (missingProgression.length > 0 || missingMastery.length > 0) {
      quests = [...quests, ...missingProgression, ...missingMastery]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quests))
    }

    // Si aucune quête journalière n'existe encore (première visite)
    if (!quests.some(q => q.questId.startsWith('daily-'))) {
      const newDaily = getActiveDailyQuests()
      quests = [...quests, ...newDaily]
      localStorage.setItem(DAILY_DATE_KEY, today)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quests))
    }

    return quests
  } catch {
    return []
  }
}

// ── Sauvegarder l'état complet des quêtes ─────────────────────────
export function saveUserQuests(quests: UserQuest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests))
  } catch {
    // Stockage indisponible — on ignore silencieusement
  }
}

// ── Fusionner et persister une mise à jour partielle ──────────────
export function mergeAndSaveQuests(updated: UserQuest[]): UserQuest[] {
  const current = loadUserQuests()
  const merged = current.map(cq => {
    const match = updated.find(u => u.questId === cq.questId)
    return match ?? cq
  })
  saveUserQuests(merged)
  return merged
}
