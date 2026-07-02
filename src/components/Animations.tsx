import { useEffect, useState, useRef, useCallback } from 'react'

// ══════════════════════════════════════════════════════
// COMPTEUR TACHYMÈTRE — écran de fin
// Monte rapidement puis ralentit sur les derniers chiffres
// ══════════════════════════════════════════════════════

interface ScoreCounterProps {
  target: number
  duration?: number   // ms total de l'animation
  className?: string
}

export function ScoreCounter({ target, duration = 1800, className = '' }: ScoreCounterProps) {
  const [displayed, setDisplayed] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'counting' | 'done'>('idle')
  const rafRef = useRef<number>()
  const startRef = useRef<number>()

  useEffect(() => {
    if (target === 0) { setDisplayed(0); setPhase('done'); return }

    // Démarre après un petit délai pour laisser l'écran apparaître
    const timeout = setTimeout(() => {
      setPhase('counting')
      startRef.current = performance.now()

      function tick(now: number) {
        const elapsed = now - (startRef.current ?? now)
        const progress = Math.min(elapsed / duration, 1)

        // Courbe style tachymètre : monte vite, ralentit à la fin
        // easeOutExpo + légère oscillation finale
        const eased = progress === 1
          ? 1
          : 1 - Math.pow(2, -10 * progress)

        const current = Math.round(eased * target)
        setDisplayed(current)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplayed(target)
          setPhase('done')
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }, 300)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  // Pourcentage pour la barre style indicateur de vitesse
  // Max théorique ~3000 XP pour une partie parfaite niveau 4
  const MAX_XP = 3000
  const barPct = Math.min(target / MAX_XP, 1)
  const barDuration = `${(duration * 0.8) / 1000}s`

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Valeur numérique */}
      <div
        className={`score-counter ${phase === 'counting' ? 'score-counter-enter' : ''}`}
        aria-live="polite"
      >
        {displayed.toLocaleString('fr-FR')}
      </div>

      {/* Sous-texte XP */}
      <div className="text-brand-muted text-sm mt-1 font-semibold tracking-widest">
        XP GAGNÉS
      </div>

      {/* Barre tachymètre */}
      <div className="tacho-bar-wrap w-48 mt-3">
        {phase !== 'idle' && (
          <div
            className="tacho-bar-fill"
            style={{ '--duration': barDuration } as React.CSSProperties}
          />
        )}
      </div>


    </div>
  )
}

// ══════════════════════════════════════════════════════
// HOOK — XP flottant vers le compteur
// ══════════════════════════════════════════════════════

interface XpFloat {
  id: number
  x: number
  y: number
  value: number
}

export function useXpFloat() {
  const [floats, setFloats] = useState<XpFloat[]>([])
  const nextId = useRef(0)

  const spawnXpFloat = useCallback((xp: number, sourceEl?: HTMLElement) => {
    // Position : si on a l'élément source, depuis là ; sinon centre écran
    const x = sourceEl
      ? sourceEl.getBoundingClientRect().left + sourceEl.offsetWidth / 2
      : window.innerWidth / 2
    const y = sourceEl
      ? sourceEl.getBoundingClientRect().top
      : window.innerHeight * 0.6

    const id = nextId.current++
    setFloats(prev => [...prev, { id, x, y, value: xp }])

    // Retire après l'animation (900ms)
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== id))
    }, 950)
  }, [])

  const XpFloatRenderer = useCallback(() => (
    <>
      {floats.map(f => (
        <div
          key={f.id}
          className="xp-float"
          style={{ left: f.x - 20, top: f.y }}
        >
          +{f.value} XP
        </div>
      ))}
    </>
  ), [floats])

  return { spawnXpFloat, XpFloatRenderer }
}

// ══════════════════════════════════════════════════════
// TROPHÉE ANIMÉ — drop + rebond
// ══════════════════════════════════════════════════════

interface AnimatedTrophyProps {
  icon: string
  name: string
  delay?: number
}

export function AnimatedTrophy({ icon, name, delay = 0 }: AnimatedTrophyProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  if (!visible) return null

  return (
    <div className="trophy-drop bg-[#1a1400] rounded-xl px-3 py-2 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="text-[10px] text-brand-gold mt-1 font-bold">{name}</div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// STREAK BADGE ANIMÉ
// ══════════════════════════════════════════════════════

interface StreakBadgeProps {
  count: number
}

export function StreakBadge({ count }: StreakBadgeProps) {
  if (count < 2) return null

  return (
    <span className="streak-badge">
      <span className="streak-fire">🔥</span>
      ×{count}
    </span>
  )
}

// ══════════════════════════════════════════════════════
// SHIMMER — placeholder photo pendant chargement
// ══════════════════════════════════════════════════════

export function PhotoShimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`photo-shimmer ${className}`} />
  )
}
