import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { LeaderboardEntry } from '@/types'

export function Leaderboard() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'all' | 'week'>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  async function fetchLeaderboard() {
    setLoading(true)
    let query = supabase
      .from('scores')
      .select('user_id, score, correct, total, level, played_at, users(username, avatar)')
      .order('score', { ascending: false })
      .limit(50)

    if (period === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      query = query.gte('played_at', weekAgo)
    }

    const { data } = await query

    if (data) {
      const entries = data.map((row: any, i: number) => ({
        rank: i + 1,
        userId: row.user_id,
        username: row.users?.username ?? 'Anonyme',
        avatar: row.users?.avatar ?? '🏎️',
        score: row.score,
        correct: row.correct,
        total: row.total,
        level: row.level,
        playedAt: row.played_at,
      }))
      setEntries(entries)
    }
    setLoading(false)
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col p-5 gap-4">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/')} className="text-brand-muted text-xl">←</button>
        <h2 className="text-xl font-black">🏆 Classement</h2>
      </div>

      {/* Period toggle */}
      <div className="flex bg-brand-card rounded-xl p-1">
        <button
          onClick={() => setPeriod('all')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
            ${period === 'all' ? 'bg-brand-red text-white' : 'text-brand-muted'}`}
        >
          Tous les temps
        </button>
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
            ${period === 'week' ? 'bg-brand-red text-white' : 'text-brand-muted'}`}
        >
          Cette semaine
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner" />
        </div>
      ) : entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-brand-muted">
          <span className="text-4xl">🏁</span>
          <p className="text-sm">Aucun score pour l'instant.<br />Sois le premier !</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map(e => (
            <div
              key={`${e.userId}-${e.playedAt}`}
              className={`flex items-center gap-3 rounded-xl px-4 py-3
                ${e.rank <= 3 ? 'bg-[#1a1400] border border-brand-gold/30' : 'bg-brand-card'}`}
            >
              <div className="w-8 text-center font-black text-sm">
                {e.rank <= 3 ? medals[e.rank - 1] : e.rank}
              </div>
              <div className="text-xl w-8 text-center">{e.avatar}</div>
              <div className="flex-1">
                <div className="text-sm font-bold">{e.username}</div>
                <div className="text-[10px] text-brand-muted">
                  {e.correct}/{e.total} • Niv.{e.level}
                </div>
              </div>
              <div className="text-brand-gold font-black text-sm">{e.score} XP</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
