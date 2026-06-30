import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Home } from '@/pages/Home'
import { Game } from '@/pages/Game'
import { Auth } from '@/pages/Auth'
import { Profile } from '@/pages/Profile'
import { Leaderboard } from '@/pages/Leaderboard'
import { Quests } from '@/pages/Quests'
import { Progression } from '@/pages/Progression'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/',            icon: '🏠', label: 'Accueil' },
  { path: '/progression', icon: '📈', label: 'Niveaux' },
  { path: '/quests',      icon: '🎯', label: 'Quêtes' },
  { path: '/leaderboard', icon: '🏆', label: 'Classement' },
  { path: '/profile',     icon: '👤', label: 'Profil' },
]

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide during game
  if (location.pathname === '/game') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-40">
      <div className="bg-[#111] border-t border-brand-line flex safe-bottom">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors
                ${active ? 'text-brand-red' : 'text-brand-muted'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-line border-t-brand-red rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="pb-0"> {/* Home manages its own bottom spacing */}
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/game"        element={<Game />} />
          <Route path="/auth"        element={session ? <Navigate to="/" replace /> : <Auth />} />
          <Route path="/profile"     element={session ? <Profile /> : <Navigate to="/auth" replace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quests"      element={<Quests />} />
          <Route path="/progression" element={<Progression />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="max-w-[430px] mx-auto min-h-screen bg-brand-dark text-white font-sans overflow-x-hidden">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
