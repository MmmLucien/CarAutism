import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'
import type { Sujet } from '@/types'

type Step = 'sujet' | 'question' | 'confirm' | 'done'

interface ProposalForm {
  sujet: Sujet | ''
  question: string
  correctAnswer: string
  wrong1: string
  wrong2: string
  wrong3: string
  wrong4: string
  wrong5: string
  wrong6: string
  wrong7: string
  hint: string
  source: string
  pseudo: string
}

const EMPTY_FORM: ProposalForm = {
  sujet: '', question: '', correctAnswer: '',
  wrong1: '', wrong2: '', wrong3: '', wrong4: '',
  wrong5: '', wrong6: '', wrong7: '',
  hint: '', source: '', pseudo: '',
}

const SUJET_LABELS: Partial<Record<Sujet, string>> = {}
CATEGORIES.forEach(cat => {
  cat.sujets.forEach(s => {
    SUJET_LABELS[s.id as Sujet] = `${s.icon} ${s.name}`
  })
})

export function Propose() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('sujet')
  const [form, setForm] = useState<ProposalForm>({ ...EMPTY_FORM, pseudo: user?.username ?? '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof ProposalForm, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const wrongFields = ['wrong1','wrong2','wrong3','wrong4','wrong5','wrong6','wrong7'] as const
  const wrongs = wrongFields.map(f => form[f].trim()).filter(Boolean)

  function canProceedToConfirm() {
    return form.question.trim().length >= 10 &&
      form.correctAnswer.trim().length >= 1 &&
      wrongs.length >= 3 // minimum 3 mauvaises réponses (niveau facile = 4 choix)
  }

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.from('proposals').insert({
        sujet: form.sujet,
        question: form.question.trim(),
        answer: form.correctAnswer.trim(),
        wrong_answers: wrongs,
        hint: form.hint.trim() || null,
        source: form.source.trim() || null,
        pseudo: form.pseudo.trim() || 'Anonyme',
        status: 'pending',
      })
      if (err && err.code !== '42P01') {
        setError(err.message)
      } else {
        setStep('done')
      }
    } catch {
      setStep('done')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 gap-6 text-center">
        <div className="text-6xl">✅</div>
        <div>
          <h2 className="text-2xl font-black mb-2">Merci !</h2>
          <p className="text-brand-muted text-sm">Ta question a été soumise. Elle sera vérifiée avant d'être intégrée.</p>
        </div>
        <div className="bg-brand-card rounded-2xl p-4 w-full text-left">
          <div className="text-xs text-brand-muted mb-1">Sujet</div>
          <div className="font-bold text-sm mb-3">{SUJET_LABELS[form.sujet as Sujet]}</div>
          <div className="text-xs text-brand-muted mb-1">Question</div>
          <div className="text-sm mb-3">{form.question}</div>
          <div className="text-xs text-brand-muted mb-1">Bonne réponse</div>
          <div className="text-brand-green font-bold text-sm">✓ {form.correctAnswer}</div>
        </div>
        <button onClick={() => { setForm({ ...EMPTY_FORM, pseudo: user?.username ?? '' }); setStep('sujet') }} className="btn-secondary">
          Proposer une autre question
        </button>
        <button onClick={() => navigate('/')} className="text-brand-muted text-sm underline">Retour à l'accueil</button>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] bg-brand-dark flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-brand-line flex-shrink-0">
        <button
          onClick={() => {
            if (step === 'sujet') navigate('/')
            else if (step === 'question') setStep('sujet')
            else if (step === 'confirm') setStep('question')
          }}
          className="text-brand-muted text-xl"
        >←</button>
        <div className="flex-1">
          <h2 className="text-xl font-black">Proposer une question</h2>
          <p className="text-[10px] text-brand-muted tracking-widest">ENRICHIR LE QUIZ</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center px-5 py-3 gap-2 flex-shrink-0">
        {(['sujet', 'question', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black
              ${step === s ? 'bg-brand-red text-white' :
                (step === 'confirm' && i < 2) || (step === 'question' && i < 1)
                  ? 'bg-brand-green text-white' : 'bg-brand-card text-brand-muted'}`}>
              {(step === 'confirm' && i < 2) || (step === 'question' && i < 1) ? '✓' : i + 1}
            </div>
            {i < 2 && <div className={`flex-1 h-px ${i < (['sujet','question','confirm'].indexOf(step)) ? 'bg-brand-green' : 'bg-brand-line'}`} />}
          </div>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">

        {/* STEP 1 : Sujet */}
        {step === 'sujet' && (
          <>
            <p className="text-sm text-brand-muted mb-3">Choisis le sujet de ta question :</p>
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="mb-4">
                <div className="text-[10px] text-brand-muted tracking-[2px] font-bold mb-2">{cat.label}</div>
                <div className="grid grid-cols-2 gap-2">
                  {cat.sujets.map(s => (
                    <button key={s.id} onClick={() => set('sujet', s.id)}
                      className={`text-left rounded-xl px-4 py-3 border-2 transition-all text-sm
                        ${form.sujet === s.id ? 'border-brand-red bg-[#1a0000] text-white' : 'border-brand-line bg-brand-card text-brand-muted'}`}>
                      <div className="font-black">{s.icon} {s.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* STEP 2 : Question */}
        {step === 'question' && (
          <>
            <div className="bg-brand-card rounded-xl px-4 py-2 text-sm mb-4">
              <span className="text-brand-muted">Sujet : </span>
              <span className="font-bold">{SUJET_LABELS[form.sujet as Sujet]}</span>
            </div>

            <div className="mb-3">
              <label className="text-xs text-brand-muted font-bold block mb-1">QUESTION *</label>
              <textarea value={form.question} onChange={e => set('question', e.target.value)}
                placeholder="Ex: En quelle année la Ferrari F40 a-t-elle été présentée ?"
                className="input-field resize-none" rows={3} maxLength={300} />
              <div className="text-[10px] text-brand-muted text-right mt-1">{form.question.length}/300</div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-brand-muted font-bold block mb-1">BONNE RÉPONSE *</label>
              <input type="text" value={form.correctAnswer} onChange={e => set('correctAnswer', e.target.value)}
                placeholder="Ex: 1987" className="input-field" maxLength={100} />
            </div>

            <div className="mb-3">
              <label className="text-xs text-brand-muted font-bold block mb-1">
                MAUVAISES RÉPONSES * <span className="text-brand-muted font-normal">(3 min, 7 max — pour tous les niveaux)</span>
              </label>
              <div className="flex flex-col gap-2">
                {wrongFields.map((field, i) => (
                  <input key={field} type="text" value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    placeholder={`Mauvaise réponse ${i + 1}${i < 3 ? ' *' : ' (optionnel)'}`}
                    className="input-field" maxLength={100} />
                ))}
              </div>
              <div className="text-[10px] text-brand-muted mt-1">
                {wrongs.length}/7 — {wrongs.length < 3 ? `encore ${3 - wrongs.length} requise(s)` : '✓ suffisant'}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-brand-muted font-bold block mb-1">INDICE (optionnel)</label>
              <input type="text" value={form.hint} onChange={e => set('hint', e.target.value)}
                placeholder="Un indice pour aider le joueur…" className="input-field" maxLength={200} />
            </div>

            <div className="mb-3">
              <label className="text-xs text-brand-muted font-bold block mb-1">SOURCE (optionnel)</label>
              <input type="text" value={form.source} onChange={e => set('source', e.target.value)}
                placeholder="Wikipedia, livre, magazine…" className="input-field" maxLength={200} />
            </div>

            {!user && (
              <div className="mb-3">
                <label className="text-xs text-brand-muted font-bold block mb-1">TON PSEUDO (optionnel)</label>
                <input type="text" value={form.pseudo} onChange={e => set('pseudo', e.target.value)}
                  placeholder="Ton prénom ou pseudo" className="input-field" maxLength={30} />
              </div>
            )}
          </>
        )}

        {/* STEP 3 : Confirm */}
        {step === 'confirm' && (
          <>
            <p className="text-sm text-brand-muted mb-3">Vérifie ta proposition avant d'envoyer :</p>
            <div className="card flex flex-col gap-3 mb-4">
              <Row label="Sujet" val={SUJET_LABELS[form.sujet as Sujet] ?? form.sujet} />
              <Row label="Question" val={form.question} />
              <Row label="✓ Bonne réponse" val={form.correctAnswer} green />
              <Row label="✗ Mauvaises réponses" val={wrongs.join(' / ')} />
              {form.hint && <Row label="💡 Indice" val={form.hint} />}
              {form.source && <Row label="📖 Source" val={form.source} />}
              <Row label="Proposé par" val={form.pseudo || 'Anonyme'} />
            </div>
            {error && (
              <p className="text-brand-red text-sm text-center bg-[#3A1A1A] rounded-xl px-4 py-3 mb-3">{error}</p>
            )}
            <div className="bg-[#1a1a00] border border-brand-gold/30 rounded-xl px-4 py-3 text-xs text-brand-muted">
              💡 Ta question sera vérifiée par l'équipe avant d'être ajoutée au quiz.
            </div>
          </>
        )}
      </div>

      {/* Fixed bottom CTA — toujours visible */}
      <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-brand-dark border-t border-brand-line">
        {step === 'sujet' && (
          <button onClick={() => setStep('question')} disabled={!form.sujet}
            className="btn-primary disabled:opacity-40">
            Continuer →
          </button>
        )}
        {step === 'question' && (
          <button onClick={() => setStep('confirm')} disabled={!canProceedToConfirm()}
            className="btn-primary disabled:opacity-40">
            Vérifier ma question →
          </button>
        )}
        {step === 'confirm' && (
          <button onClick={submit} disabled={loading}
            className="btn-primary disabled:opacity-50">
            {loading ? '⏳ Envoi…' : '✅ Envoyer ma proposition'}
          </button>
        )}
      </div>

    </div>
  )
}

function Row({ label, val, green = false }: { label: string; val: string; green?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-brand-muted font-bold mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${green ? 'text-brand-green' : 'text-white'}`}>{val}</div>
    </div>
  )
}
