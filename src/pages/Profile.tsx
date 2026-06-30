import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col p-5 gap-5">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/')} className="text-brand-muted text-xl">←</button>
        <h2 className="text-xl font-black">Profil</h2>
      </div>

      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center text-3xl border-2 border-brand-red">
          {user.avatar}
        </div>
        <div>
          <div className="text-lg font-black">@{user.username}</div>
          <div className="text-brand-muted text-sm">{user.email}</div>
          {user.isPremium && (
            <div className="text-brand-gold text-xs font-bold mt-1">⭐ Premium</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="text-2xl font-black text-brand-red">{user.totalXp.toLocaleString()}</div>
          <div className="text-[10px] text-brand-muted mt-1">XP total</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-black">—</div>
          <div className="text-[10px] text-brand-muted mt-1">Parties jouées</div>
        </div>
      </div>

      {!user.isPremium && (
        <div className="bg-[#1a1400] border border-brand-gold rounded-2xl p-4">
          <div className="text-brand-gold font-black mb-1">⭐ Passer à Premium</div>
          <div className="text-brand-muted text-xs mb-3">
            Supprime les publicités pour toujours — paiement unique
          </div>
          <button className="w-full bg-brand-gold text-black font-black rounded-xl py-3 text-sm">
            1,99€ — À vie
          </button>
        </div>
      )}

      <button
        onClick={async () => { await signOut(); navigate('/') }}
        className="btn-secondary text-brand-red border-brand-red"
      >
        Se déconnecter
      </button>
    </div>
  )
}
