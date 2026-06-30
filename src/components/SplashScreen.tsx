import { useEffect, useRef, useState, useCallback } from 'react'

interface SplashScreenProps {
  /** Appelé quand le chargement + délai minimum sont écoulés */
  onDone: () => void
  /** Durée minimum d'affichage en ms (évite un flash si tout charge trop vite) */
  minDuration?: number
  /** Tâches de préchargement à exécuter pendant l'écran de chargement */
  preload?: () => Promise<void>
}

// Quelques messages de chargement qui tournent — gardent l'écran vivant
// sans surcharger : un seul à la fois, discret, sous la voiture.
const LOADING_MESSAGES = [
  'Mise en grille…',
  'Vérification des pneus…',
  'Chauffe moteur…',
  'Calage de la stratégie…',
  'Ouverture des stands…',
]

export function SplashScreen({ onDone, minDuration = 2200, preload }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)
  const [message, setMessage] = useState(LOADING_MESSAGES[0])
  const [notification, setNotification] = useState<string | null>(null)

  // Rotation cible (auto + drag combinés). On part d'une position aléatoire
  // à chaque montage pour que l'effet "cinématique" ne soit jamais identique.
  const rotation = useRef({
    x: -20 + Math.random() * 40,   // tangage initial aléatoire
    y: Math.random() * 360,        // lacet initial aléatoire
  })
  const velocity = useRef({ x: 0, y: 0.045 }) // vitesse de rotation auto (lente, cinématique)
  const dragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const carEl = useRef<HTMLDivElement>(null)
  const rafId = useRef<number>(0)

  // ── Boucle d'animation : rotation continue, ralentie au drag ──────
  useEffect(() => {
    function tick() {
      if (!dragging.current) {
        rotation.current.y += velocity.current.y
        rotation.current.x += velocity.current.x
        // Amortissement doux du tangage pour revenir vers une orbite stable
        velocity.current.x *= 0.96
      }
      if (carEl.current) {
        carEl.current.style.transform =
          `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  // ── Interaction drag (souris + tactile) ────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    rotation.current.y += dx * 0.5
    rotation.current.x = Math.max(-60, Math.min(60, rotation.current.x - dy * 0.5))
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    // Reprise douce de la rotation cinématique après relâchement
    velocity.current.y = 0.045
  }, [])

  // ── Cycle des messages de chargement ───────────────────────────────
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setMessage(LOADING_MESSAGES[i])
    }, 850)
    return () => clearInterval(id)
  }, [])

  // ── Préchargement + durée minimum, puis sortie ─────────────────────
  useEffect(() => {
    const start = Date.now()

    async function run() {
      try {
        if (preload) await preload()
      } catch {
        // Le préchargement ne doit jamais bloquer l'entrée dans l'app
      }
      const elapsed = Date.now() - start
      const remaining = Math.max(0, minDuration - elapsed)
      setTimeout(() => {
        setExiting(true)
        setTimeout(onDone, 420) // laisse le temps au fondu de sortie
      }, remaining)
    }

    run()

    // Exemple de contenu préchargé pendant l'écran de chargement :
    // une notification d'événement, prête à s'afficher juste après l'entrée.
    const notifTimer = setTimeout(() => {
      setNotification('🏁 Le Mans Classic 2026 — 120 questions ajoutées')
    }, 600)

    return () => clearTimeout(notifTimer)
  }, [minDuration, onDone, preload])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center select-none
        transition-opacity duration-[420ms] ease-out
        ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ touchAction: 'none' }}
    >
      {/* Halo radial discret derrière la voiture — profondeur, pas décoration gratuite */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(232,0,13,0.10) 0%, rgba(10,10,10,0) 55%)',
        }}
      />

      {/* Scène 3D */}
      <div
        className="cursor-grab active:cursor-grabbing"
        style={{ perspective: '900px', touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={carEl}
          style={{
            transformStyle: 'preserve-3d',
            fontSize: '92px',
            lineHeight: 1,
            filter: 'drop-shadow(0 18px 28px rgba(232,0,13,0.28))',
            willChange: 'transform',
          }}
        >
          🏎️
        </div>
      </div>

      {/* Texte de marque + message de chargement, sous la voiture */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="text-xl font-black tracking-tight">
          Car<span className="text-brand-red">Autism</span>
        </div>
        <div className="text-brand-muted text-xs tracking-[3px] uppercase">
          {message}
        </div>
        {/* Barre de progression indéterminée, discrète */}
        <div className="w-32 h-[2px] bg-brand-line rounded-full overflow-hidden mt-1">
          <div className="h-full bg-brand-red rounded-full animate-[splash-bar_1.1s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Notification préchargée, glissée en bas une fois prête */}
      {notification && !exiting && (
        <div className="absolute bottom-8 left-5 right-5 animate-[splash-notif-in_0.4s_ease-out]">
          <div className="bg-brand-card border border-brand-line rounded-xl px-4 py-3 text-xs text-white/90 text-center">
            {notification}
          </div>
        </div>
      )}

      <style>{`
        @keyframes splash-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes splash-notif-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cursor-grab > div { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
