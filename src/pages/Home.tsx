import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { CATEGORIES, ALL_SUJETS } from '@/lib/constants'
import { CategoryTiles } from '@/components/SubjectTile'
import { ALL_QUESTIONS } from '@/data/questions'
import { SOUND_QUESTIONS } from '@/data/soundQuestions'
import type { Sujet, GameLevel } from '@/types'

// Compte les questions par sujet
const ALL_Q = [...ALL_QUESTIONS, ...SOUND_QUESTIONS]
const QUESTION_COUNTS: Record<string, number> = {}
ALL_Q.forEach(q => {
  const s = 'sujet' in q ? q.sujet : (q as any).sujet
  QUESTION_COUNTS[s] = (QUESTION_COUNTS[s] ?? 0) + 1
})

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedSujets, setSelectedSujets] = useState<Set<Sujet>>(
    new Set(ALL_SUJETS as Sujet[])
  )
  const [level, setLevel] = useState<GameLevel>(1)
  const [openCats, setOpenCats] = useState<Set<string>>(
    new Set(['route', 'sport', 'tech', 'culture', 'sons'])
  )
  const [guestName, setGuestName] = useState('')

  function toggleSujet(id: Sujet) {
    setSelectedSujets(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size <= 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function selectAll() { setSelectedSujets(new Set(ALL_SUJETS as Sujet[])) }
  function clearAll()  { setSelectedSujets(new Set([ALL_SUJETS[0] as Sujet])) }

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function startGame() {
    navigate('/game', {
      state: {
        selectedSujets: Array.from(selectedSujets),
        level,
        playerName: user?.username ?? guestName ?? 'Pilote',
      }
    })
  }

  const totalSelected = Array.from(selectedSujets).reduce(
    (acc, s) => acc + (QUESTION_COUNTS[s] ?? 0), 0
  )

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col overflow-y-auto pb-20">
      <div className="flex flex-col gap-5 p-5 pt-6">

        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-brand-red rounded-xl flex items-center justify-center text-xl
                          shadow-[0_0_20px_#E8000D44] flex-shrink-0">
            🏎️
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-black tracking-tight leading-none">
              Car<span className="text-brand-red">Autism</span>
            </h1>
            <p className="text-[9px] text-brand-muted tracking-[3px] mt-0.5">
              QUIZ AUTOMOBILE ULTIME
            </p>
          </div>
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 bg-brand-card rounded-full flex items-center justify-center text-base
                         border border-brand-line"
            >
              {user.avatar}
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="text-[11px] text-brand-muted border border-brand-line rounded-lg px-3 py-1.5"
            >
              Connexion
            </button>
          )}
        </div>

        {/* ── Pseudo invité ── */}
        {!user && (
          <div className="flex items-center gap-3 bg-brand-card rounded-xl px-4 py-3">
            <span className="text-brand-muted">👤</span>
            <input
              type="text"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              placeholder="Ton prénom"
              maxLength={20}
              className="flex-1 bg-transparent border-none text-white text-sm outline-none
                         placeholder:text-brand-muted"
            />
          </div>
        )}

        {/* ── Sujets ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-brand-muted tracking-[2px] font-bold">SUJETS</span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-[10px] text-brand-muted border border-brand-line rounded-lg px-2 py-1"
              >
                ✓ Tout
              </button>
              <button
                onClick={clearAll}
                className="text-[10px] text-brand-muted border border-brand-line rounded-lg px-2 py-1"
              >
                ✕ Vider
              </button>
            </div>
          </div>

          {CATEGORIES.map(cat => (
            <CategoryTiles
              key={cat.id}
              category={cat}
              selectedSujets={selectedSujets}
              questionCounts={QUESTION_COUNTS}
              onToggle={toggleSujet}
              isOpen={openCats.has(cat.id)}
              onToggleOpen={() => toggleCat(cat.id)}
            />
          ))}
        </div>

        {/* ── Niveau ── */}
        <div>
          <span className="text-[10px] text-brand-muted tracking-[2px] font-bold block mb-2">
            NIVEAU
          </span>
          <div className="flex gap-2">
            {([1, 2, 3, 4] as GameLevel[]).map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-xl py-3 text-center border-2 transition-all
                  ${level === l
                    ? 'border-brand-gold bg-[#1a1400]'
                    : 'border-brand-line bg-brand-card'}`}
              >
                <div className="text-base font-black text-brand-gold">{l}</div>
                <div className="text-[9px] text-brand-muted mt-0.5">
                  {l === 1 ? '4 choix' : l === 2 ? '6 choix' : l === 3 ? '8 choix' : 'Texte'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Démarrer ── */}
        <button
          onClick={startGame}
          disabled={totalSelected === 0}
          className="btn-primary disabled:opacity-40"
        >
          🏁 DÉMARRER — {totalSelected} questions
        </button>

      </div>
    </div>
  )
}
