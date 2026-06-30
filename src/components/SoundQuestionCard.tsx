import { AudioPlayer } from './AudioPlayer'
import { getSoundContext } from '@/data/soundQuestions'
import type { SoundQuestion } from '@/hooks/useAudio'
import type { GameLevel } from '@/types'
import { getChoices, getSujetLabel } from '@/lib/gameUtils'
import { shuffle } from '@/lib/gameUtils'

interface SoundQuestionCardProps {
  question: SoundQuestion
  level: GameLevel
  answered: boolean
  userAnswer: string
  hintText: string | null
  hintUsed: boolean
  onAnswer: (choice: string) => void
  onHint: () => void
  // Level 4 props
  textAnswer: string
  onTextChange: (v: string) => void
  onSubmit: () => void
  onSkip: () => void
}

export function SoundQuestionCard({
  question, level, answered, userAnswer, hintText, hintUsed,
  onAnswer, onHint, textAnswer, onTextChange, onSubmit, onSkip
}: SoundQuestionCardProps) {
  const context = getSoundContext(question, level as 1 | 2 | 3 | 4)
  const choices = level !== 4 ? shuffle(
    level === 1 ? question.choices4 :
    level === 2 ? question.choices6 :
    question.choices8
  ) : []

  return (
    <div className="flex flex-col">
      {/* Sujet label */}
      <div className="px-4 pt-3">
        <div className="text-[10px] text-brand-red tracking-[2px] font-bold mb-1">
          {getSujetLabel(question.sujet)}
        </div>
        {/* Context (varies by level) */}
        {context !== '?' ? (
          <div className="text-sm text-brand-muted font-medium">{context}</div>
        ) : (
          <div className="text-lg font-black text-brand-muted">🎵 Identifiez cette voiture au son</div>
        )}
      </div>

      {/* Audio player */}
      <AudioPlayer url={question.soundUrl} answered={answered} />

      {/* Question */}
      <div className="px-4 pb-2">
        <div className="text-[18px] font-black leading-tight">
          {level === 4 ? 'Quelle voiture entendez-vous ?' : 'Quelle est cette voiture ?'}
        </div>
      </div>

      {/* Hint */}
      {!answered && (
        <button
          onClick={onHint}
          className={`mx-4 mb-2 text-left bg-brand-card rounded-xl px-4 py-2 text-xs border border-brand-line
            ${hintText ? 'text-yellow-400' : 'text-brand-muted'}`}
        >
          {hintText ? `💡 ${hintText}` : hintUsed ? '💡 Indice utilisé' : '💡 Indice (−50% XP)'}
        </button>
      )}

      {/* Choices — Level 1-3 */}
      {level !== 4 && (
        <div className="grid grid-cols-1 gap-2 px-4 pb-24">
          {choices.map(c => {
            let cls = 'answer-btn text-left px-4'
            if (answered) {
              if (c === question.car) cls += ' answer-btn-correct'
              else if (c === userAnswer && c !== question.car) cls += ' answer-btn-wrong'
              else cls += ' answer-btn-dim'
            }
            return (
              <button
                key={c}
                onClick={() => !answered && onAnswer(c)}
                className={cls}
              >
                {c}
              </button>
            )
          })}
        </div>
      )}

      {/* Level 4 — texte libre */}
      {level === 4 && !answered && (
        <div className="px-4 pb-24 flex flex-col gap-2">
          <input
            type="text"
            value={textAnswer}
            onChange={e => onTextChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && textAnswer.trim() && onSubmit()}
            placeholder="Ex: Ferrari F40, Porsche 911 GT3…"
            className="input-field"
            autoComplete="off"
            autoCorrect="off"
          />
          <button
            onClick={onSubmit}
            disabled={!textAnswer.trim()}
            className="btn-primary disabled:opacity-50"
          >
            Valider →
          </button>
          <button
            onClick={onSkip}
            className="text-brand-muted text-sm text-center py-2 border border-brand-line rounded-xl"
          >
            ⏭ Passer (0 XP)
          </button>
        </div>
      )}
    </div>
  )
}
