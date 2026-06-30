import { useState, useRef, useEffect, useCallback } from 'react'

// ── Type étendu pour les questions sons ───────────────
// Le contexte est découpé en 4 niveaux de détail décroissant
export interface SoundQuestion {
  id: string
  sujet: 'sons_route' | 'sons_sport'
  soundUrl: string          // URL du fichier audio (Cloudflare R2 ou archive.org)
  car: string               // Réponse correcte
  xp: number

  // Indices par niveau — de plus en plus vagues
  context1: string          // Niveau 1 : contexte complet
  context2: string          // Niveau 2 : contexte partiel
  context3: string          // Niveau 3 : catégorie seulement
  context4: string          // Niveau 4 : rien (juste "?")

  hint: string              // Indice si utilisé (-50% XP)
  choices4: string[]
  choices6: string[]
  choices8: string[]
}

// ── Hook : gestion audio ──────────────────────────────
export interface UseAudioReturn {
  isPlaying: boolean
  duration: number
  currentTime: number
  playCount: number
  play: () => void
  pause: () => void
  replay: () => void
  progress: number          // 0-100
}

export function useAudio(url: string): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [playCount, setPlayCount] = useState(0)

  // Créer l'audio element
  useEffect(() => {
    const audio = new Audio(url)
    audio.preload = 'auto'
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [url])

  const play = useCallback(() => {
    if (!audioRef.current) return
    if (playCount === 0) setPlayCount(1)
    audioRef.current.play().catch(console.error)
  }, [playCount])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const replay = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setPlayCount(prev => prev + 1)
    audioRef.current.play().catch(console.error)
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return { isPlaying, duration, currentTime, playCount, play, pause, replay, progress }
}
