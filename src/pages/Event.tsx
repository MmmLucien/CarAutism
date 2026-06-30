import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LMC_2025_QUESTIONS, ALL_LMC_2026_QUESTIONS } from '@/data/lmcQuestions'

interface EventConfig {
  id: string
  name: string
  subtitle: string
  icon: string
  color: string
  bgGradient: string
  year: number
  description: string
  questionCount: number
  level: number
  badge: string
  details: { label: string; val: string }[]
}

const EVENTS: EventConfig[] = [
  {
    id: 'lmc2025',
    name: 'Le Mans Classic',
    subtitle: 'Édition 2025',
    icon: '🏁',
    color: '#C0A020',
    bgGradient: 'linear-gradient(135deg, #1a1200 0%, #2a1e00 50%, #1a1200 100%)',
    year: 2025,
    description: '3-6 juillet 2025 · Circuit de la Sarthe. Circuit, Plateaux, pilotes et voitures légendaires.',
    questionCount: LMC_2025_QUESTIONS.length,
    level: 2,
    badge: '🏅 Participant LMC 2025',
    details: [
      { label: 'Questions', val: `${LMC_2025_QUESTIONS.length}` },
      { label: 'Niveau', val: '2 / 4' },
      { label: 'Badge', val: '🏅' },
    ],
  },
  {
    id: 'lmc2026',
    name: 'Le Mans Classic',
    subtitle: 'Édition 2026',
    icon: '🏆',
    color: '#E8000D',
    bgGradient: 'linear-gradient(135deg, #1a0000 0%, #2a0000 50%, #1a0000 100%)',
    year: 2026,
    description: '100 questions · Grilles 6-10, Hommage Gordon Murray, Circuit du Mans, Palmarès et records.',
    questionCount: ALL_LMC_2026_QUESTIONS.length,
    level: 3,
    badge: '🎖️ Participant LMC 2026',
    details: [
      { label: 'Questions', val: `${ALL_LMC_2026_QUESTIONS.length}` },
      { label: 'Niveau', val: '3 / 4' },
      { label: 'Badge', val: '🎖️' },
    ],
  },
]

export function Event() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [level, setLevel] = useState(2)

  function startEvent(ev: EventConfig) {
    const questions = ev.year === 2025 ? LMC_2025_QUESTIONS : ALL_LMC_2026_QUESTIONS
    navigate('/game', {
      state: {
        eventMode: true,
        eventId: ev.id,
        eventName: `${ev.name} ${ev.year}`,
        eventQuestions: questions,
        level,
      }
    })
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-brand-line">
        <button onClick={() => navigate('/')} className="text-brand-muted text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-xl font-black">Événements</h2>
          <p className="text-[10px] text-brand-muted tracking-widest">QUIZ SPÉCIAUX</p>
        </div>
        <span className="text-2xl">🏁</span>
      </div>

      <div className="flex flex-col gap-4 p-5 pb-24">

        <p className="text-brand-muted text-sm leading-relaxed">
          Des quiz thématiques autour des grands événements automobiles.
          Questions exclusives, badges uniques.
        </p>

        {/* Sélecteur de niveau */}
        <div className="card">
          <p className="text-xs text-brand-muted font-bold mb-3">NIVEAU DE DIFFICULTÉ</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { lvl: 1, label: 'Facile', sub: '4 choix' },
              { lvl: 2, label: 'Moyen', sub: '6 choix' },
              { lvl: 3, label: 'Difficile', sub: '8 choix' },
              { lvl: 4, label: 'Expert', sub: 'Texte libre' },
            ].map(({ lvl, label, sub }) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`rounded-xl py-2 px-1 text-center border-2 transition-all
                  ${level === lvl ? 'border-brand-red bg-[#1a0000]' : 'border-brand-line bg-brand-card'}`}
              >
                <div className="font-black text-sm">{label}</div>
                <div className="text-[9px] text-brand-muted mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Event cards */}
        {EVENTS.map(ev => (
          <div
            key={ev.id}
            className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 active:scale-[0.98]
              ${selected === ev.id ? 'border-[#C0A020]' : 'border-brand-line'}`}
            style={{ background: ev.bgGradient }}
            onClick={() => setSelected(selected === ev.id ? null : ev.id)}
          >
            {/* Header card */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{ev.icon}</div>
                <div className="flex-1">
                  <div className="text-xs font-black tracking-[3px] mb-0.5" style={{ color: ev.color }}>
                    {ev.subtitle.toUpperCase()}
                  </div>
                  <div className="text-lg font-black leading-tight">{ev.name}</div>
                  <div className="text-brand-muted text-xs mt-1">{ev.description}</div>
                </div>
              </div>
            </div>

            {/* Expand */}
            {selected === ev.id && (
              <div className="px-4 pb-4 border-t border-white/10 pt-3">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {ev.details.map(({ label, val }) => (
                    <div key={label} className="bg-black/30 rounded-xl p-2 text-center">
                      <div className="text-base font-black">{val}</div>
                      <div className="text-[9px] text-brand-muted mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-black/20 rounded-xl px-3 py-2 mb-4">
                  <div className="text-[10px] text-brand-muted mb-1">BADGE À DÉBLOQUER</div>
                  <div className="text-sm font-bold">{ev.badge}</div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); startEvent(ev) }}
                  className="w-full rounded-xl py-4 font-black text-sm tracking-wide transition-all active:scale-[0.97]"
                  style={{ background: ev.color, color: '#000' }}
                >
                  🏁 Lancer le quiz {ev.year}
                </button>
              </div>
            )}

            {selected !== ev.id && (
              <div className="absolute bottom-4 right-4 text-brand-muted text-xs">
                ▼ Voir détails
              </div>
            )}
          </div>
        ))}

        {/* Prochain événement */}
        <div className="card opacity-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <div className="text-sm font-black">Prochain événement</div>
              <div className="text-xs text-brand-muted">Bientôt disponible…</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
