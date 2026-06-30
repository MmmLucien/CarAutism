import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar: string
          is_premium: boolean
          total_xp: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      scores: {
        Row: {
          id: string
          user_id: string
          score: number
          correct: number
          total: number
          level: number
          sujets: string[]
          played_at: string
        }
        Insert: Omit<Database['public']['Tables']['scores']['Row'], 'id' | 'played_at'>
        Update: never
      }
      contestations: {
        Row: {
          id: string
          user_id: string | null
          question_id: string
          reason: string
          comment: string | null
          status: 'pending' | 'reviewed' | 'fixed'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['contestations']['Row'], 'id' | 'created_at' | 'status'>
        Update: Pick<Database['public']['Tables']['contestations']['Row'], 'status'>
      }
    }
  }
}
