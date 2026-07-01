import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { CATEGORIES, ALL_SUJETS } from '@/lib/constants'
import { CategoryTiles } from '@/components/SubjectTile'
import { ALL_QUESTIONS } from '@/data/questions'
import { SOUND_QUESTIONS } from '@/data/soundQuestions'
import type { Sujet, GameLevel } from '@/types'

const ALL_Q = [...ALL_QUESTIONS, ...SOUND_QUESTIONS]
const QUESTION_COUNTS: Record<string, number> = {}
ALL_Q.forEach(q => {
  const s = (q as any).sujet
  QUESTION_COUNTS[s] = (QUESTION_COUNTS[s] ?? 0) + 1
})

export function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedSujets, setSelectedSujets] = useState<Set<Sujet>>(
    new Set(ALL_SUJETS as Sujet[])
  )
  const [level, setLevel] = useState<GameLevel>(1)
  // Toutes les sections rétractées par défaut
  const [openCats, setOpenCats] = useState<Set<string>>(new Set())
  const [guestName, setGuestName] = useState('')

  function toggleSujet(id: Sujet) {
    setSelectedSujets(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  // Toggle toute une catégorie (sélectionne ou désélectionne tous ses sujets)
  function toggleCategory(catId: string) {
    const cat = CATEGORIES.find(c => c.id === catId)
    if (!cat) return
    const catSujetIds = cat.sujets.map(s => s.id as Sujet)
    const allSelected = catSujetIds.every(id => selectedSujets.has(id))
    setSelectedSujets(prev => {
      const next = new Set(prev)
      if (allSelected) {
        catSujetIds.forEach(id => next.delete(id))
      } else {
        catSujetIds.forEach(id => next.add(id))
      }
      return next
    })
  }

  function selectAll() { setSelectedSujets(new Set(ALL_SUJETS as Sujet[])) }
  function clearAll()  { setSelectedSujets(new Set()) }

  function toggleCatOpen(id: string) {
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
    <div className="h-[100dvh] bg-brand-dark flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-3 flex-shrink-0">
        <div className="w-11 h-11 bg-brand-red rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_#E8000D44] flex-shrink-0">
          🏎️
        </div>
        <div className="flex-1">
          <h1 className="text-[28px] font-black tracking-tight leading-none">
            Car<span className="text-brand-red">Autism</span>
          </h1>
          <p className="text-[9px] text-brand-muted tracking-[3px] mt-0.5">QUIZ AUTOMOBILE ULTIME</p>
        </div>
        {user ? (
          <button onClick={() => navigate('/profile')} className="w-9 h-9 bg-brand-card rounded-full flex items-center justify-center text-base border border-brand-line">
            {user.avatar}
          </button>
        ) : (
          <button onClick={() => navigate('/auth')} className="text-[11px] text-brand-muted border border-brand-line rounded-lg px-3 py-1.5">
            Connexion
          </button>
        )}
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-2 gap-2 px-5 pb-3 flex-shrink-0">
        <button onClick={() => navigate('/event')} className="bg-[#1a1200] border border-[#C0A020]/40 rounded-xl py-2.5 px-3 text-left active:scale-[0.97] flex items-center gap-2">
          <span className="text-lg">🏁</span>
          <div className="min-w-0">
            <div className="text-xs font-black leading-tight">Événements</div>
            <div className="text-[9px] text-brand-muted leading-tight truncate">Le Mans Classic</div>
          </div>
        </button>
        <button onClick={() => navigate('/propose')} className="bg-brand-card border border-brand-line rounded-xl py-2.5 px-3 text-left active:scale-[0.97] flex items-center gap-2">
          <span className="text-lg">✏️</span>
          <div className="min-w-0">
            <div className="text-xs font-black leading-tight">Proposer</div>
            <div className="text-[9px] text-brand-muted leading-tight truncate">Une question</div>
          </div>
        </button>
      </div>

      {/* Zone scrollable */}
      <div className="flex-1 overflow-y-auto px-5">
        {!user && (
          <div className="flex items-center gap-3 bg-brand-card rounded-xl px-4 py-3 mb-4">
            <span className="text-brand-muted">👤</span>
            <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
              placeholder="Ton prénom" maxLength={20}
              className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-brand-muted" />
          </div>
        )}

        <div className="flex items-center justify-between mb-2 sticky top-0 bg-brand-dark py-1 z-10">
          <span className="text-[10px] text-brand-muted tracking-[2px] font-bold">SUJETS · {totalSelected} questions</span>
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-[10px] text-brand-muted border border-brand-line rounded-lg px-2 py-1">✓ Tout</button>
            <button onClick={clearAll} className="text-[10px] text-brand-muted border border-brand-line rounded-lg px-2 py-1">✕ Vider</button>
          </div>
        </div>

        {CATEGORIES.map(cat => {
          const catSujetIds = cat.sujets.map(s => s.id as Sujet)
          const allSelected = catSujetIds.every(id => selectedSujets.has(id))
          const someSelected = catSujetIds.some(id => selectedSujets.has(id))
          const isOpen = openCats.has(cat.id)
          const catQuestions = catSujetIds.reduce((acc, id) => acc + (QUESTION_COUNTS[id] ?? 0), 0)

          return (
            <div key={cat.id} className="mb-3">
              {/* Category header row */}
              <div className="flex items-center gap-2 mb-2">
                {/* Toggle sélection catégorie entière */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${allSelected ? 'bg-brand-red border-brand-red' : someSelected ? 'bg-brand-red/40 border-brand-red' : 'bg-transparent border-brand-line'}`}
                >
                  {allSelected && <span className="text-white text-xs">✓</span>}
                  {someSelected && !allSelected && <span className="text-white text-xs">–</span>}
                </button>

                {/* Titre catégorie + collapse */}
                <button
                  onClick={() => toggleCatOpen(cat.id)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <span className="text-base">{cat.label.split(' ')[0]}</span>
                  <span className="font-black text-sm">{cat.label}</span>
                  <span className="text-[10px] text-brand-muted bg-brand-card rounded-full px-2 py-0.5">
                    {catSujetIds.filter(id => selectedSujets.has(id)).length}/{cat.sujets.length}
                  </span>
                  <span className="text-[10px] text-brand-muted ml-auto">{catQuestions}q</span>
                  <span className="text-brand-muted text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
                </button>
              </div>

              {/* Tuiles sujets — visibles uniquement si expanded */}
              {isOpen && (
                <CategoryTiles
                  category={cat}
                  selectedSujets={selectedSujets}
                  questionCounts={QUESTION_COUNTS}
                  onToggle={toggleSujet}
                  isOpen={true}
                  onToggleOpen={() => {}}
                />
              )}
            </div>
          )
        })}

        <div className="h-4" />
      </div>

      {/* Barre fixe bas */}
      <div className="flex-shrink-0 px-5 pt-3 pb-20 bg-brand-dark border-t border-brand-line flex flex-col gap-3">
        <div className="flex gap-2">
          {([1, 2, 3, 4] as GameLevel[]).map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`flex-1 rounded-xl py-2 text-center border-2 transition-all
                ${level === l ? 'border-brand-gold bg-[#1a1400]' : 'border-brand-line bg-brand-card'}`}>
              <div className="text-base font-black text-brand-gold leading-none">{l}</div>
              <div className="text-[9px] text-brand-muted mt-0.5">
                {l === 1 ? '4 choix' : l === 2 ? '6 choix' : l === 3 ? '8 choix' : 'Texte'}
              </div>
            </button>
          ))}
        </div>
        <button onClick={startGame} disabled={totalSelected === 0} className="btn-primary disabled:opacity-40">
          🏁 DÉMARRER — {totalSelected} questions
        </button>
      </div>

    </div>
  )
}
