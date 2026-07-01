import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '@/hooks/useGame'
import { getChoices, getSujetLabel } from '@/lib/gameUtils'
import type { Sujet, GameLevel, Question } from '@/types'
import { QUESTIONS_PER_GAME } from '@/lib/constants'
import { EndScreen } from '@/pages/EndScreen'

// Temporary: import questions from local data
// Later: fetch from Supabase
import { ALL_QUESTIONS } from '@/data/questions'

export function Game() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    selectedSujets = [],
    level = 1,
    eventMode = false,
    eventQuestions = [],
    eventName = '',
  } = (location.state ?? {}) as {
    selectedSujets: Sujet[]
    level: GameLevel
    eventMode?: boolean
    eventQuestions?: Question[]
    eventName?: string
  }

  const {
    phase, session, currentQuestion, currentIndex,
    currentResult, score, streak, timeLeft, hintUsed,
    startGame, submitAnswer, useHint: triggerHint, nextQuestion, resetGame
  } = useGame()

  const [choices, setChoices] = useState<string[]>([])
  const [hintText, setHintText] = useState<string | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [textAnswer, setTextAnswer] = useState('')
  const [contestOpen, setContestOpen] = useState(false)
  const [contestReason, setContestReason] = useState('')
  const [zoomOpen, setZoomOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Start game on mount
  useEffect(() => {
    if (eventMode && eventQuestions.length > 0) {
      // Mode événement : on utilise les questions LMC passées directement
      startGame(eventQuestions, {
        level: level as GameLevel,
        selectedSujets: new Set(['event_lmc'] as Sujet[]),
        questionsPerGame: Math.min(15, eventQuestions.length),
      })
    } else {
      const pool = ALL_QUESTIONS.filter(q => selectedSujets.includes(q.sujet as Sujet))
      if (pool.length === 0) { navigate('/'); return }
      startGame(pool, {
        level: level as GameLevel,
        selectedSujets: new Set(selectedSujets),
        questionsPerGame: QUESTIONS_PER_GAME,
      })
    }
  }, []) // eslint-disable-line

  // Update choices when question changes
  useEffect(() => {
    if (currentQuestion && level !== 4) {
      setChoices(getChoices(currentQuestion, level as GameLevel))
    }
    setHintText(null)
    setImgLoaded(false)
    setImgError(false)
    setTextAnswer('')
  }, [currentQuestion, level])

  // Focus input on L4
  useEffect(() => {
    if (phase === 'playing' && level === 4) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [phase, level, currentIndex])

  if (phase === 'idle') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  if (phase === 'finished' && session) {
    return (
      <EndScreen
        session={session}
        level={level as GameLevel}
        onReplay={() => {
          resetGame()
          setTimeout(() => navigate('/'), 50)
        }}
      />
    )
  }

  if (!currentQuestion) return null

  const timerColor = timeLeft > 20 ? 'text-white' : timeLeft > 10 ? 'text-yellow-400' : 'text-brand-red'
  const isAnswered = phase === 'result_overlay'

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative">
      {/* Progress bar */}
      <div className="h-[3px] bg-brand-line">
        <div
          className="h-full bg-brand-red transition-all duration-300"
          style={{ width: `${(currentIndex / QUESTIONS_PER_GAME) * 100}%` }}
        />
      </div>

      {/* Status bar */}
      <div className="flex justify-between px-4 py-2 border-b border-brand-line text-[13px] text-brand-muted">
        <span>⏱ <b className={timerColor}>{timeLeft}s</b></span>
        <span>⭐ <b className="text-white">{score} XP</b></span>
        <span>📋 <b className="text-white">{currentIndex + 1}|{QUESTIONS_PER_GAME}</b></span>
      </div>

      {/* Image */}
      {currentQuestion.photoUrl && (
        <div
          className="w-full h-[200px] bg-[#111] relative overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => imgLoaded && setZoomOpen(true)}
        >
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted">
              ⏳ Chargement…
            </div>
          )}
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-muted">
              <span className="text-3xl">📷</span>
              <span className="text-xs">Photo indisponible</span>
            </div>
          )}
          <img
            src={currentQuestion.photoUrl}
            alt=""
            className={`w-full h-full object-cover transition-opacity ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          {imgLoaded && (
            <div className="absolute bottom-2 right-2 bg-black/60 rounded-md px-2 py-1 text-[10px] text-white">
              🔍 Tap pour zoomer
            </div>
          )}
        </div>
      )}

      {/* Question */}
      <div className="px-4 pt-3 pb-2">
        <div className="text-[10px] text-brand-red tracking-[2px] font-bold mb-1">
          {getSujetLabel(currentQuestion.sujet)}
        </div>
        <div className="text-[18px] font-black leading-tight mb-1">{currentQuestion.question}</div>
        <div className="text-[11px] text-brand-muted">{currentQuestion.context}</div>
      </div>

      {/* Hint */}
      {!isAnswered && (
        <button
          onClick={() => {
            const hint = triggerHint()
            if (hint) setHintText(hint)
          }}
          className={`mx-4 mb-2 text-left bg-brand-card rounded-xl px-4 py-2 text-xs border border-brand-line
            ${hintText ? 'text-yellow-400' : 'text-brand-muted'}`}
        >
          {hintText ? `💡 ${hintText}` : hintUsed ? '💡 Indice utilisé' : '💡 Indice (−50% XP)'}
        </button>
      )}

      {/* Answers — Level 1-3 */}
      {level !== 4 && (
        <div className="grid grid-cols-2 gap-2 px-4 pb-24">
          {choices.map(c => {
            let cls = 'answer-btn'
            if (isAnswered) {
              if (c === currentQuestion.correctAnswer) cls += ' answer-btn-correct'
              else if (c === currentResult?.userAnswer && !currentResult.isCorrect) cls += ' answer-btn-wrong'
              else cls += ' answer-btn-dim'
            }
            return (
              <button
                key={c}
                onClick={() => !isAnswered && submitAnswer(c)}
                className={cls}
              >
                {c}
              </button>
            )
          })}
        </div>
      )}

      {/* Answers — Level 4 (free text) */}
      {level === 4 && !isAnswered && (
        <div className="px-4 pb-24 flex flex-col gap-2">
          <input
            ref={inputRef}
            type="text"
            value={textAnswer}
            onChange={e => setTextAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && textAnswer.trim() && submitAnswer(textAnswer.trim())}
            placeholder="Tape ta réponse…"
            className="input-field"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <button
            onClick={() => textAnswer.trim() && submitAnswer(textAnswer.trim())}
            className="btn-primary"
          >
            Valider →
          </button>
          <button
            onClick={() => submitAnswer('__skip__')}
            className="text-brand-muted text-sm text-center py-2 border border-brand-line rounded-xl"
          >
            ⏭ Passer (0 XP)
          </button>
          {isAnswered && (
            <div className={`text-center py-2 font-bold text-sm ${currentResult?.isCorrect ? 'text-brand-green' : 'text-brand-red'}`}>
              {currentResult?.isCorrect ? '✅ Bonne réponse !' : `❌ La réponse était : ${currentQuestion.correctAnswer}`}
            </div>
          )}
        </div>
      )}

      {/* Result overlay */}
      {isAnswered && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#1a1a1c] rounded-t-[20px] px-4 pt-4 pb-8 z-50 shadow-[0_-8px_40px_#000c]">
          <div className={`rounded-xl px-4 py-3 mb-3 flex items-center gap-2 font-bold text-[15px]
            ${currentResult?.isCorrect ? 'bg-[#1A3A1A] text-brand-green' : 'bg-[#3A1A1A] text-brand-red'}`}
          >
            {currentResult?.isCorrect
              ? `✅ +${currentResult.xpEarned} XP !${streak > 1 ? ` 🔥×${streak}` : ''}`
              : '❌ Raté'
            }
          </div>

          {!currentResult?.isCorrect && (
            <p className="text-xs text-brand-muted mb-3">
              ✓ Bonne réponse : <span className="text-white font-bold">{currentQuestion.correctAnswer}</span>
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setContestOpen(true)}
              className="flex-1 bg-[#2a1500] border border-yellow-600 text-yellow-400 rounded-xl py-3 text-xs font-bold"
            >
              ⚑ Contester
            </button>
            <button
              onClick={() => { resetGame(); navigate('/') }}
              className="flex-1 bg-brand-line rounded-xl py-3 text-xs font-bold text-white"
            >
              ⏹ Quitter
            </button>
            <button
              onClick={nextQuestion}
              className="flex-[2] bg-brand-red rounded-xl py-3 text-sm font-bold text-white"
            >
              {currentIndex + 1 >= QUESTIONS_PER_GAME ? '🏁 Résultats' : 'Suite →'}
            </button>
          </div>
        </div>
      )}

      {/* Contest modal */}
      {contestOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-end">
          <div className="bg-[#1a1a1c] rounded-t-[20px] p-5 w-full max-h-[70vh] overflow-y-auto">
            <h3 className="text-base font-black mb-4">⚑ Contester cette question</h3>
            <div className="flex flex-col gap-2 mb-4">
              {['Réponse incorrecte', 'Photo ambiguë', 'Données obsolètes', 'Question mal formulée', 'Autre'].map(r => (
                <button
                  key={r}
                  onClick={() => setContestReason(r)}
                  className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-all
                    ${contestReason === r ? 'border-brand-red text-brand-red bg-[#3A1A1A]' : 'border-brand-line bg-brand-card text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Commentaire (optionnel)…"
              className="input-field resize-none mb-3"
              rows={3}
            />
            <div className="flex gap-2">
              <button onClick={() => setContestOpen(false)} className="flex-1 bg-brand-line rounded-xl py-3 text-sm font-bold text-white">
                Annuler
              </button>
              <button
                onClick={() => {
                  if (!contestReason) return
                  // TODO: save to Supabase
                  setContestOpen(false)
                  alert('✅ Contestation envoyée !')
                }}
                className="flex-1 bg-brand-red rounded-xl py-3 text-sm font-bold text-white"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom modal */}
      {zoomOpen && currentQuestion.photoUrl && (
        <div
          className="fixed inset-0 bg-black z-[200] flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          <button className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl">
            ✕
          </button>
          <img
            src={currentQuestion.photoUrl}
            alt=""
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  )
}
