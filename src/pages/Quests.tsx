import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ALL_QUESTS, DAILY_QUESTS, PROGRESSION_QUESTS, MASTERY_QUESTS } from '@/data/quests'
import { getQuestTarget } from '@/lib/progression'
import type { UserQuest, QuestType } from '@/types/progression'

const TAB_LABELS: { key: QuestType | 'all'; label: string; icon: string }[] = [
  { key: 'daily',       label: 'Journalières', icon: '📅' },
  { key: 'progression', label: 'Progression',  icon: '📈' },
  { key: 'mastery',     label: 'Maîtrise',     icon: '💎' },
]

export function Quests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<QuestType>('daily')
  const [userQuests, setUserQuests] = useState<UserQuest[]>([])

  // TODO: charger depuis Supabase
  // Pour l'instant on affiche toutes les quêtes en mode "aperçu"
  const questsToShow = tab === 'daily' ? DAILY_QUESTS
    : tab === 'progression' ? PROGRESSION_QUESTS
    : MASTERY_QUESTS

  function getUserQuest(questId: string): UserQuest | undefined {
    return userQuests.find(uq => uq.questId === questId)
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate('/')} className="text-brand-muted text-xl">←</button>
        <h2 className="text-xl font-black flex-1">🎯 Quêtes</h2>
        {user && (
          <div className="text-xs text-brand-muted">
            {user.totalXp.toLocaleString()} XP total
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {TAB_LABELS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as QuestType)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border
              ${tab === t.key
                ? 'bg-brand-red border-brand-red text-white'
                : 'bg-brand-card border-brand-line text-brand-muted'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Daily note */}
      {tab === 'daily' && (
        <div className="mx-5 mb-3 bg-[#1a1400] border border-brand-gold/30 rounded-xl px-4 py-3">
          <p className="text-[11px] text-brand-gold font-bold">📅 3 quêtes par jour</p>
          <p className="text-[10px] text-brand-muted mt-1">Elles se renouvellent chaque jour à minuit. Connecte-toi pour les sauvegarder.</p>
        </div>
      )}

      {/* Quest list */}
      <div className="flex flex-col gap-3 px-5 pb-8 overflow-y-auto">
        {questsToShow.map(quest => {
          const uq = getUserQuest(quest.id)
          const target = getQuestTarget(quest.condition)
          const progress = uq?.progress ?? 0
          const status = uq?.status ?? 'active'
          const pct = Math.min(100, Math.round((progress / target) * 100))
          const isCompleted = status === 'completed' || status === 'claimed'
          const isClaimed = status === 'claimed'

          return (
            <div
              key={quest.id}
              className={`rounded-2xl p-4 border transition-all
                ${isClaimed
                  ? 'bg-[#0a1a0a] border-brand-green/30 opacity-60'
                  : isCompleted
                  ? 'bg-[#1A3A1A] border-brand-green'
                  : 'bg-brand-card border-brand-line'}`}
            >
              {/* Top row */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl flex-shrink-0 mt-0.5">{quest.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black">{quest.title}</span>
                    {isCompleted && !isClaimed && (
                      <span className="text-[10px] bg-brand-green text-black font-bold rounded-full px-2 py-0.5">
                        ✓ Terminée !
                      </span>
                    )}
                    {isClaimed && (
                      <span className="text-[10px] bg-brand-line text-brand-muted font-bold rounded-full px-2 py-0.5">
                        Réclamée
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-muted mt-0.5 leading-tight">{quest.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-brand-gold">+{quest.xpReward}</div>
                  <div className="text-[10px] text-brand-muted">XP</div>
                </div>
              </div>

              {/* Rewards */}
              {(quest.badgeReward || quest.titleReward) && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {quest.badgeReward && (
                    <div className="flex items-center gap-1 bg-[#1a1400] rounded-lg px-2 py-1">
                      <span className="text-[10px]">🏅</span>
                      <span className="text-[10px] text-brand-gold font-bold">{quest.badgeReward}</span>
                    </div>
                  )}
                  {quest.titleReward && (
                    <div className="flex items-center gap-1 bg-[#0a1a2a] rounded-lg px-2 py-1">
                      <span className="text-[10px]">👑</span>
                      <span className="text-[10px] text-blue-400 font-bold">{quest.titleReward}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress bar */}
              {!isClaimed && (
                <div>
                  <div className="flex justify-between text-[10px] text-brand-muted mb-1">
                    <span>{progress} / {target}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-line rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isCompleted ? 'bg-brand-green' : 'bg-brand-red'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Claim button */}
              {isCompleted && !isClaimed && (
                <button
                  onClick={() => {
                    // TODO: save to Supabase + award XP
                    setUserQuests(prev => prev.map(uq =>
                      uq.questId === quest.id
                        ? { ...uq, status: 'claimed', claimedAt: new Date().toISOString() }
                        : uq
                    ))
                  }}
                  className="w-full mt-3 bg-brand-green text-black font-black rounded-xl py-3 text-sm"
                >
                  🎁 Réclamer +{quest.xpReward} XP
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
