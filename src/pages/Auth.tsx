import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

type Mode = 'login' | 'signup'

export function Auth() {
  const { signIn, signUp, isUsernameAvailable } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUsernameChange(val: string) {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(cleaned)
    if (cleaned.length < 3) { setUsernameStatus('idle'); return }
    setUsernameStatus('checking')
    const available = await isUsernameAvailable(cleaned)
    setUsernameStatus(available ? 'available' : 'taken')
  }

  async function handleSubmit() {
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error)
      else navigate('/')
    } else {
      if (username.length < 3) { setError('Pseudo trop court (3 caractères min)'); setLoading(false); return }
      if (usernameStatus === 'taken') { setError('Ce pseudo est déjà pris'); setLoading(false); return }
      const { error } = await signUp(email, password, username)
      if (error) setError(error)
      else navigate('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center p-6 gap-6">
      {/* Logo */}
      <div className="text-center">
        <div className="text-5xl mb-3">🏎️</div>
        <h1 className="text-3xl font-black">Car<span className="text-brand-red">Autism</span></h1>
        <p className="text-brand-muted text-xs mt-1 tracking-widest">QUIZ AUTOMOBILE ULTIME</p>
      </div>

      {/* Toggle */}
      <div className="flex bg-brand-card rounded-xl p-1">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
            ${mode === 'login' ? 'bg-brand-red text-white' : 'text-brand-muted'}`}
        >
          Connexion
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
            ${mode === 'signup' ? 'bg-brand-red text-white' : 'text-brand-muted'}`}
        >
          Inscription
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3">
        {mode === 'signup' && (
          <div>
            <input
              type="text"
              placeholder="Pseudo (unique)"
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              maxLength={20}
              className="input-field"
            />
            {username.length >= 3 && (
              <p className={`text-xs mt-1 ml-1 ${
                usernameStatus === 'available' ? 'text-brand-green' :
                usernameStatus === 'taken' ? 'text-brand-red' : 'text-brand-muted'
              }`}>
                {usernameStatus === 'checking' ? '⏳ Vérification…' :
                 usernameStatus === 'available' ? '✓ Disponible' :
                 usernameStatus === 'taken' ? '✗ Déjà pris' : ''}
              </p>
            )}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field"
        />

        {error && (
          <p className="text-brand-red text-sm text-center bg-[#3A1A1A] rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? '⏳ Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </div>

      {/* Guest */}
      <button
        onClick={() => navigate('/')}
        className="text-brand-muted text-sm text-center underline"
      >
        Continuer sans compte
      </button>
    </div>
  )
}
