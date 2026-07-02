import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScoreCounter, AnimatedTrophy } from '@/components/Animations'
import { calcTrophies } from '@/lib/gameUtils'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { GameSession, GameLevel } from '@/types'

interface EndScreenProps {
  session: GameSession
  level: GameLevel
  onReplay: () => void
}

export function EndScreen({ session, level, onReplay }: EndScreenProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showStats, setShowStats] = useState(false)
  const [showTrophies, setShowTrophies] = useState(false)

  const results = session.results
  const correct = results.filter(r => r.isCorrect).length
  const total = results.length
  const pct = Math.round((correct / total) * 100)
  const avgTime = Math.round(results.reduce((a, r) => a + r.timeSpent, 0) / total)
  const trophies = calcTrophies(results, session.totalScore, session.bestStreak, avgTime, level)
  const trophyIcon = pct === 100 ? '💎' : pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : pct >= 40 ? '🥉' : '💪'
  const trophyMsg  = pct === 100 ? 'Parfait !' : pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : pct >= 40 ? 'Pas mal !' : 'Continue !'

  // Cascade d'apparition
  useEffect(() => {
    const t1 = setTimeout(() => setShowStats(true), 800)
    const t2 = setTimeout(() => setShowTrophies(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Sauvegarde du score dans Supabase
  useEffect(() => {
    if (!user) return

    const sessionKey = `score_saved_${session.startedAt instanceof Date ? session.startedAt.getTime() : session.startedAt}`
    if (sessionStorage.getItem(sessionKey)) return

    async function saveScore() {
      const sujetsPlayed = Array.from(new Set(results.map(r => r.question.sujet)))
      const { error } = await supabase.from('scores').insert({
        user_id: user!.id,
        score: session.totalScore,
        correct,
        total,
        level,
        sujets: sujetsPlayed,
      })
      if (!error) {
        sessionStorage.setItem(sessionKey, '1')
        try {
          const prevBest = parseInt(localStorage.getItem('carautism_best_streak') ?? '0', 10)
          if (session.bestStreak > prevBest) {
            localStorage.setItem('carautism_best_streak', String(session.bestStreak))
          }
        } catch {}
      }
    }

    saveScore()
  }, []) // eslint-disable-line

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center overflow-y-auto
                    px-5 pb-10 pt-8 gap-6 page-enter">

      {/* Trophée principal */}
      <div className="text-6xl" style={{ animation: 'trophy-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}>
        {trophyIcon}
      </div>
      <p className="text-brand-muted text-sm -mt-4">{trophyMsg}</p>

      {/* Score tachymètre */}
      <ScoreCounter target={session.totalScore} duration={1600} />

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 gap-3 w-full page-enter">
          {[
            { val: `${correct}/${total}`, label: 'Bonnes réponses', color: 'text-brand-green' },
            { val: `${pct}%`,            label: 'Réussite',         color: pct >= 60 ? 'text-brand-green' : 'text-brand-red' },
            { val: `×${session.bestStreak}`, label: 'Meilleure série', color: 'text-brand-gold' },
            { val: `${avgTime}s`,        label: 'Temps moyen',      color: avgTime < 15 ? 'text-brand-green' : 'text-white' },
          ].map(({ val, label, color }) => (
            <div key={label} className="card text-center">
              <div className={`text-2xl font-black ${color}`}>{val}</div>
              <div className="text-[10px] text-brand-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Trophées débloqués */}
      {showTrophies && trophies.length > 0 && (
        <div className="w-full">
          <p className="text-[10px] text-brand-muted tracking-[2px] font-bold mb-3">TROPHÉES</p>
          <div className="flex gap-2 flex-wrap">
            {trophies.map((t, i) => (
              <AnimatedTrophy
                key={t.key}
                icon={t.icon}
                name={t.name}
                delay={i * 150}
              />
            ))}
          </div>
        </div>
      )}

      {/* Boutons */}
      {showStats && (
        <div className="flex flex-col gap-3 w-full page-enter">
          <button onClick={onReplay} className="btn-primary">
            ↩ Rejouer
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Accueil
          </button>
        </div>
      )}
    </div>
  )
}
