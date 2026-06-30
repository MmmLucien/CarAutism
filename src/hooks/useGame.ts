import { useState, useCallback, useRef } from 'react'
import type { Question, GameLevel, QuestionResult, GameSession, GameConfig } from '@/types'
import { checkAnswer, calcXp, calcTrophies, shuffle } from '@/lib/gameUtils'
import { QUESTIONS_PER_GAME } from '@/lib/constants'

type GamePhase = 'idle' | 'playing' | 'result_overlay' | 'finished'

interface UseGameReturn {
  phase: GamePhase
  session: GameSession | null
  currentQuestion: Question | null
  currentIndex: number
  currentResult: QuestionResult | null
  score: number
  streak: number
  timeLeft: number
  hintUsed: boolean
  startGame: (questions: Question[], config: GameConfig) => void
  submitAnswer: (answer: string) => void
  useHint: () => string | null
  nextQuestion: () => void
  resetGame: () => void
}

export function useGame(): UseGameReturn {
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [session, setSession] = useState<GameSession | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [currentResult, setCurrentResult] = useState<QuestionResult | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [hintUsed, setHintUsed] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback((onTimeout: () => void) => {
    stopTimer()
    setTimeLeft(60)
    setQuestionStartTime(Date.now())
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer()
          onTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [stopTimer])

  const currentQuestion = session?.questions[currentIndex] ?? null

  const submitAnswer = useCallback((answer: string) => {
    if (!currentQuestion || !session || phase !== 'playing') return

    stopTimer()
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    const isCorrect = checkAnswer(answer, currentQuestion, session.config.level)
    const xpEarned = isCorrect ? calcXp(currentQuestion, hintUsed) : 0

    const result: QuestionResult = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      xpEarned,
      hintUsed,
    }

    const newStreak = isCorrect ? streak + 1 : 0
    const newBestStreak = Math.max(bestStreak, newStreak)
    const newScore = score + xpEarned

    setStreak(newStreak)
    setBestStreak(newBestStreak)
    setScore(newScore)
    setResults(prev => [...prev, result])
    setCurrentResult(result)
    setPhase('result_overlay')
  }, [currentQuestion, session, phase, streak, bestStreak, score, hintUsed, questionStartTime, stopTimer])

  const useHint = useCallback((): string | null => {
    if (hintUsed || !currentQuestion || phase !== 'playing') return null
    setHintUsed(true)
    return currentQuestion.hint
  }, [hintUsed, currentQuestion, phase])

  const nextQuestion = useCallback(() => {
    if (!session) return
    const nextIdx = currentIndex + 1

    if (nextIdx >= session.questions.length) {
      // Game over — build final session
      const allResults = results
      const totalTime = allResults.reduce((acc, r) => acc + r.timeSpent, 0)
      const avgTime = Math.round(totalTime / allResults.length)
      const trophies = calcTrophies(allResults, score, bestStreak, avgTime, session.config.level)

      setSession(prev => prev ? {
        ...prev,
        results: allResults,
        totalScore: score,
        bestStreak,
      } : null)
      setPhase('finished')
      return
    }

    setCurrentIndex(nextIdx)
    setHintUsed(false)
    setCurrentResult(null)
    setPhase('playing')
    startTimer(() => submitAnswer('__timeout__'))
  }, [session, currentIndex, results, score, bestStreak, startTimer, submitAnswer])

  const startGame = useCallback((questions: Question[], config: GameConfig) => {
    const picked = shuffle(questions).slice(0, QUESTIONS_PER_GAME)
    const newSession: GameSession = {
      config,
      questions: picked,
      results: [],
      totalScore: 0,
      bestStreak: 0,
      startedAt: new Date(),
    }

    setSession(newSession)
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setResults([])
    setCurrentResult(null)
    setHintUsed(false)
    setPhase('playing')
    startTimer(() => submitAnswer('__timeout__'))
  }, [startTimer, submitAnswer])

  const resetGame = useCallback(() => {
    stopTimer()
    setPhase('idle')
    setSession(null)
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setResults([])
    setCurrentResult(null)
    setHintUsed(false)
  }, [stopTimer])

  return {
    phase,
    session,
    currentQuestion,
    currentIndex,
    currentResult,
    score,
    streak,
    timeLeft,
    hintUsed,
    startGame,
    submitAnswer,
    useHint,
    nextQuestion,
    resetGame,
  }
}
