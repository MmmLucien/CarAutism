import { useAudio } from '@/hooks/useAudio'

interface AudioPlayerProps {
  url: string
  answered: boolean
}

export function AudioPlayer({ url, answered }: AudioPlayerProps) {
  const { isPlaying, duration, currentTime, playCount, play, pause, replay, progress } = useAudio(url)

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="mx-4 my-3 bg-[#111] rounded-2xl overflow-hidden border border-brand-line">
      {/* Waveform visual (static decoration) */}
      <div className="flex items-end justify-center gap-[2px] h-16 px-4 pt-4">
        {Array.from({ length: 40 }).map((_, i) => {
          const height = Math.sin(i * 0.5) * 0.4 + Math.sin(i * 0.3) * 0.3 + 0.3
          const isActive = (i / 40) * 100 <= progress
          return (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-colors ${isActive ? 'bg-brand-red' : 'bg-brand-line'}`}
              style={{ height: `${Math.max(4, height * 48)}px` }}
            />
          )
        })}
      </div>

      {/* Time */}
      <div className="flex justify-between px-4 py-1 text-[10px] text-brand-muted">
        <span>{formatTime(currentTime)}</span>
        <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 px-4 pb-4">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? pause : (playCount === 0 ? play : replay)}
          className="w-14 h-14 bg-brand-red rounded-full flex items-center justify-center text-2xl flex-shrink-0 active:scale-95 transition-transform shadow-[0_0_16px_#E8000D66]"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="flex-1">
          {/* Progress bar */}
          <div className="h-1 bg-brand-line rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-brand-red rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Replay button */}
          {playCount > 0 && (
            <button
              onClick={replay}
              className="text-[11px] text-brand-muted flex items-center gap-1"
            >
              <span>↺</span> Réécouter ({playCount}x)
            </button>
          )}

          {/* First time prompt */}
          {playCount === 0 && (
            <p className="text-[11px] text-brand-muted">Appuie sur ▶ pour écouter</p>
          )}
        </div>
      </div>

      {/* Hint: can replay unlimited times */}
      <div className="px-4 pb-3 text-[10px] text-brand-muted text-center border-t border-brand-line pt-2">
        🎵 Tu peux réécouter autant de fois que tu veux
      </div>
    </div>
  )
}
