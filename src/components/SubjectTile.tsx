import type { SujetConfig } from '@/types'
import type { Sujet } from '@/types'

// Photos de fond par sujet — Unsplash vérifiées
const SUJET_PHOTOS: Partial<Record<Sujet, string>> = {
  marques:       'https://images.unsplash.com/photo-1654442595486-e1f0840df222?w=400&auto=format&fit=crop', // Ferrari rouge
  modeles:       'https://images.unsplash.com/photo-1631023099617-453c2e99b516?w=400&auto=format&fit=crop', // Lambo jaune
  design:        'https://images.unsplash.com/photo-1552176625-e47ff529b595?w=400&auto=format&fit=crop',   // Lambo gris détail
  anecdotes:     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop', // Porsche nuit
  f1:            'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=400&auto=format&fit=crop', // F1 circuit
  endurance:     'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&auto=format&fit=crop', // Course nuit
  rallye:        'https://images.unsplash.com/photo-1471479917193-f00955256257?w=400&auto=format&fit=crop', // Route forêt
  circuits:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',   // Circuit aérien
  moteurs:       'https://images.unsplash.com/photo-1629515166938-55b480e801ca?w=400&auto=format&fit=crop', // McLaren moteur
  transmissions: 'https://images.unsplash.com/photo-1596768020813-25f0c4ab49d8?w=400&auto=format&fit=crop', // Mécanique
  stats:         'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=400&auto=format&fit=crop', // Vitesse
  films:         'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&auto=format&fit=crop', // Classique cinéma
  pop:           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',   // Générique
  sons_route:    'https://images.unsplash.com/photo-1654442595486-e1f0840df222?w=400&auto=format&fit=crop', // Ferrari exhaust
  sons_sport:    'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=400&auto=format&fit=crop', // F1 échappement
}

interface SubjectTileProps {
  sujet: SujetConfig
  selected: boolean
  count: number
  onToggle: (id: Sujet) => void
}

export function SubjectTile({ sujet, selected, count, onToggle }: SubjectTileProps) {
  const photo = SUJET_PHOTOS[sujet.id as Sujet]

  return (
    <div
      className={`subject-tile ${selected ? 'selected' : ''}`}
      onClick={() => onToggle(sujet.id as Sujet)}
    >
      {/* Photo de fond */}
      {photo ? (
        <img
          src={photo}
          alt=""
          className="subject-tile-bg"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-card" />
      )}

      {/* Overlay dégradé */}
      <div className="subject-tile-overlay" />

      {/* Checkmark */}
      <div className="subject-tile-check">
        {selected && <span className="text-white text-xs">✓</span>}
      </div>

      {/* Contenu */}
      <div className="subject-tile-content">
        <div className="text-lg mb-0.5">{sujet.icon}</div>
        <div className="text-sm font-black leading-tight">{sujet.name}</div>
        <div className="text-[10px] text-white/60 mt-0.5">{count} questions</div>
      </div>
    </div>
  )
}

// ── Catégorie avec ses tuiles ─────────────────────────
import type { CategoryConfig } from '@/types'

interface CategoryTilesProps {
  category: CategoryConfig
  selectedSujets: Set<Sujet>
  questionCounts: Record<string, number>
  onToggle: (id: Sujet) => void
  isOpen: boolean
  onToggleOpen: () => void
}

export function CategoryTiles({
  category, selectedSujets, questionCounts, onToggle, isOpen, onToggleOpen
}: CategoryTilesProps) {
  const selCount = category.sujets.filter(s => selectedSujets.has(s.id as Sujet)).length

  return (
    <div className="mb-2">
      {/* Header catégorie */}
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between px-1 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-black">{category.label}</span>
          <span className="text-[10px] text-brand-muted bg-brand-card rounded-full px-2 py-0.5">
            {selCount}/{category.sujets.length}
          </span>
        </div>
        <span className={`text-brand-muted text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Grille de tuiles */}
      {isOpen && (
        <div className="grid grid-cols-2 gap-2">
          {category.sujets.map(s => (
            <SubjectTile
              key={s.id}
              sujet={s}
              selected={selectedSujets.has(s.id as Sujet)}
              count={questionCounts[s.id] ?? 0}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
