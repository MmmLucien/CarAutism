import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isUsernameAvailable: (username: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUser(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchUser(session.user.id)
      else { setUser(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchUser(id: string) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setUser({
        id: data.id,
        email: data.email,
        username: data.username,
        avatar: data.avatar,
        isPremium: data.is_premium,
        totalXp: data.total_xp,
        createdAt: data.created_at,
      })
    }
    setLoading(false)
  }

  async function isUsernameAvailable(username: string): Promise<boolean> {
    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('username', username.toLowerCase())
    return count === 0
  }

  async function signUp(email: string, password: string, username: string) {
    const available = await isUsernameAvailable(username)
    if (!available) return { error: 'Ce pseudo est déjà pris.' }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }

    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        username: username.toLowerCase(),
        avatar: '🏎️',
        is_premium: false,
        total_xp: 0,
      })
      if (profileError) return { error: profileError.message }
    }

    return { error: null }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, isUsernameAvailable }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
