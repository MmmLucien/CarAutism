import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  CATEGORY_CONFIG,
  CATEGORY_SUJETS,
  PROGRESS_LEVELS,
  type ProgressCategory,
  type SubjectProgress,
  type CategoryProgress,
} from '@/types/progression'
import { getLevelFromXp } from '@/lib/progression'
import { CATEGORIES } from '@/lib/constants'
import type { Sujet } from '@/types'

// Mock data — sera remplacé par fetch Supabase
const MOCK_SUBJECT_PROGRESS: Partial<Record<Sujet, SubjectProgress>> = {
  marques:    { sujet: 'marques',    xp: 820,  correctAnswers: 41,  totalAnswers: 55,  currentLevel: 2, xpToNextLevel: 680,  progressPct: 54 },
  modeles:    { sujet: 'modeles',    xp: 320,  correctAnswers: 16,  totalAnswers: 22,  currentLevel: 1, xpToNextLevel: 180,  progressPct: 64 },
  design:     { sujet: 'design',     xp: 150,  correctAnswers: 7,   totalAnswers: 12,  currentLevel: 1, xpToNextLevel: 350,  progressPct: 30 },
  anecdotes:  { sujet: 'anecdotes',  xp: 450,  correctAnswers: 22,  totalAnswers: 30,  currentLevel: 1, xpToNextLevel: 50,   progressPct: 90 },
  f1:         { sujet: 'f1',         xp: 1800, correctAnswers: 90,  totalAnswers: 110, currentLevel: 3, xpToNextLevel: 1700, progressPct: 15 },
  endurance:  { sujet: 'endurance',  xp: 600,  correctAnswers: 30,  totalAnswers: 40,  currentLevel: 2, xpToNextLevel: 400,  progressPct: 60 },
  rallye:     { sujet: 'rallye',     xp: 280,  correctAnswers: 14,  totalAnswers: 20,  currentLevel: 1, xpToNextLevel: 220,  progressPct: 56 },
  circuits:   { sujet: 'circuits',   xp: 400,  correctAnswers: 20,  totalAnswers: 28,  currentLevel: 1, xpToNextLevel: 100,  progressPct: 80 },
  moteurs:    { sujet: 'moteurs',    xp: 750,  correctAnswers: 37,  totalAnswers: 50,  currentLevel: 2, xpToNextLevel: 750,  progressPct: 50 },
  transmissions: { sujet: 'transmissions', xp: 200, correctAnswers: 10, totalAnswers: 15, currentLevel: 1, xpToNextLevel: 300, progressPct: 40 },
  stats:      { sujet: 'stats',      xp: 900,  correctAnswers: 45,  totalAnswers: 58,  currentLevel: 2, xpToNextLevel: 600,  progressPct: 60 },
  films:      { sujet: 'films',      xp: 350,  correctAnswers: 17,  totalAnswers: 25,  currentLevel: 1, xpToNextLevel: 150,  progressPct: 70 },
  pop:        { sujet: 'pop',        xp: 180,  correctAnswers: 9,   totalAnswers: 15,  currentLevel: 1, xpToNextLevel: 320,  progressPct: 36 },
  sons_route: { sujet: 'sons_route', xp: 600,  correctAnswers: 8,   totalAnswers: 12,  currentLevel: 2, xpToNextLevel: 400,  progressPct: 60 },
  sons_sport: { sujet: 'sons_sport', xp: 300,  correctAnswers: 4,   totalAnswers: 8,   currentLevel: 1, xpToNextLevel: 200,  progressPct: 60 },
}

function calcCatProgress(cat: ProgressCategory): CategoryProgress {
  const sujets = CATEGORY_SUJETS[cat]
  let totalXp = 0
  let totalCorrect = 0
  for (const s of sujets) {
    const sp = MOCK_SUBJECT_PROGRESS[s]
    if (sp) { totalXp += sp.xp; totalCorrect += sp.correctAnswers }
  }
  const lvl = getLevelFromXp(totalXp)
  return { category: cat, xp: totalXp, correctAnswers: totalCorrect, currentLevel: lvl.level, ...lvl }
}

export function Progression() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expandedCat, setExpandedCat] = useState<string | null>('route')

  const categoryIds = Object.keys(CATEGORY_CONFIG) as ProgressCategory[]

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={() => navigate('/')} className="text-brand-muted text-xl">←</button>
        <h2 className="text-xl font-black flex-1">📈 Progression</h2>
      </div>

      {/* XP global */}
      {user && (
        <div className="mx-5 mb-4 bg-brand-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{user.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black">@{user.username}</span>
                {(() => {
                  const lvl = getLevelFromXp(user.totalXp)
                  return (
                    <span className="text-xs bg-brand-line rounded-full px-2 py-0.5 font-bold">
                      {lvl.icon} Niv.{lvl.level} {lvl.name}
                    </span>
                  )
                })()}
              </div>
              <div className="text-brand-gold font-bold text-sm mt-0.5">
                {user.totalXp.toLocaleString()} XP total
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-col gap-3 px-5 pb-8 overflow-y-auto">
        {categoryIds.map(catId => {
          const cfg = CATEGORY_CONFIG[catId]
          const catProgress = calcCatProgress(catId)
          const nextLevelInfo = PROGRESS_LEVELS[catProgress.currentLevel] ?? null
          const isExpanded = expandedCat === catId
          const sujets = CATEGORY_SUJETS[catId]

          return (
            <div key={catId} className="bg-brand-card rounded-2xl overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => setExpandedCat(isExpanded ? null : catId)}
                className="w-full px-4 py-4 flex items-center gap-3 text-left"
              >
                <span className="text-2xl">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm">{cfg.label}</span>
                    <LevelBadge level={catProgress.currentLevel} name={getLevelFromXp(catProgress.xp).name} />
                  </div>
                  {/* Category progress bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-brand-muted mb-1">
                      <span>{catProgress.xp.toLocaleString()} XP</span>
                      {catProgress.xpToNextLevel > 0 && (
                        <span>+{catProgress.xpToNextLevel} → Niv.{catProgress.currentLevel + 1}</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-brand-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-red rounded-full transition-all"
                        style={{ width: `${catProgress.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className={`text-brand-muted text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Subject breakdown */}
              {isExpanded && (
                <div className="border-t border-brand-line">
                  {sujets.map(sujet => {
                    const sp = MOCK_SUBJECT_PROGRESS[sujet]
                    if (!sp) return null
                    const sujetCfg = CATEGORIES
                      .flatMap(c => c.sujets)
                      .find(s => s.id === sujet)

                    return (
                      <div key={sujet} className="px-4 py-3 border-b border-brand-line last:border-b-0">
                        <div className="flex items-center gap-3">
                          <span className="text-base w-6 text-center">{sujetCfg?.icon ?? '📌'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{sujetCfg?.name ?? sujet}</span>
                              <LevelBadge level={sp.currentLevel} name={getLevelFromXp(sp.xp).name} small />
                            </div>
                            <div className="mt-1.5">
                              <div className="h-1 bg-brand-line rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-brand-red rounded-full"
                                  style={{ width: `${sp.progressPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-brand-gold">{sp.xp.toLocaleString()}</div>
                            <div className="text-[10px] text-brand-muted">{sp.correctAnswers} ✓</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Levels legend */}
        <div className="bg-brand-card rounded-2xl p-4">
          <p className="text-[10px] text-brand-muted font-bold tracking-widest mb-3">ÉCHELLE DE NIVEAUX</p>
          <div className="flex flex-col gap-2">
            {PROGRESS_LEVELS.map(lvl => (
              <div key={lvl.level} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{lvl.icon}</span>
                <span className="text-xs font-bold w-24">Niv.{lvl.level} — {lvl.name}</span>
                <div className="flex-1 h-0.5 bg-brand-line rounded" />
                <span className="text-[10px] text-brand-muted">
                  {lvl.xpRequired === 0 ? 'Départ' : `${lvl.xpRequired.toLocaleString()} XP`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LevelBadge({ level, name, small = false }: { level: number; name: string; small?: boolean }) {
  const colors = [
    '', // level 0
    'bg-brand-line text-brand-muted',           // 1
    'bg-blue-900 text-blue-300',                 // 2
    'bg-green-900 text-green-300',               // 3
    'bg-yellow-900 text-yellow-300',             // 4
    'bg-orange-900 text-orange-300',             // 5
    'bg-red-900 text-red-300',                   // 6
    'bg-purple-900 text-purple-300',             // 7
    'bg-[#1a1400] text-brand-gold border border-brand-gold/50', // 8
  ]

  return (
    <span className={`rounded-full font-bold ${small ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'} ${colors[level] ?? colors[1]}`}>
      {PROGRESS_LEVELS[level - 1]?.icon} {name}
    </span>
  )
}
