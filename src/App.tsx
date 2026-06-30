import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Home } from '@/pages/Home'
import { Game } from '@/pages/Game'
import { Auth } from '@/pages/Auth'
import { Profile } from '@/pages/Profile'
import { Leaderboard } from '@/pages/Leaderboard'
import { Quests } from '@/pages/Quests'
import { Progression } from '@/pages/Progression'
import { Event } from '@/pages/Event'
import { Propose } from '@/pages/Propose'
import { SplashScreen } from '@/components/SplashScreen'
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

  if (location.pathname === '/game') return null
  if (location.pathname === '/') return null

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
  const { session } = useAuth()
  const location = useLocation()
  const [splashDone, setSplashDone] = useState(false)

  if (!splashDone) {
    return (
      <SplashScreen
        minDuration={2400}
        onDone={() => setSplashDone(true)}
        preload={async () => {
          await Promise.all([
            import('@/data/questions'),
            import('@/data/lmcQuestions'),
            import('@/data/quests'),
          ])
        }}
      />
    )
  }

  return (
    <>
      <div className={location.pathname === '/' ? '' : 'pb-16'}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/game"        element={<Game />} />
          <Route path="/auth"        element={session ? <Navigate to="/" replace /> : <Auth />} />
          <Route path="/profile"     element={session ? <Profile /> : <Navigate to="/auth" replace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quests"      element={<Quests />} />
          <Route path="/progression" element={<Progression />} />
          <Route path="/event"       element={<Event />} />
          <Route path="/propose"     element={<Propose />} />
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
