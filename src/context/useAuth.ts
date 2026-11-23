import { createContext, useContext } from 'react'
import type { AuthState } from '../types/auth'

export interface AuthContextType extends AuthState {
  isSupabaseConfigured: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null; successMessage: string | null }>
  signInAsDemoUser: (demoEmail?: string, demoName?: string) => void
  exitDemoMode: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
