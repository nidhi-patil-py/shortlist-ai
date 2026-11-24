import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import type { User } from '../types/auth'
import { AuthContext } from './useAuth'

const LOCAL_DEMO_USER_KEY = 'shortlistai_local_demo_user'
const LEGACY_LOCAL_DEMO_USER_KEY = 'resumefit_local_demo_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      // 1. Check if user was previously in Local Demo Mode
      const savedDemoUser = localStorage.getItem(LOCAL_DEMO_USER_KEY) || localStorage.getItem(LEGACY_LOCAL_DEMO_USER_KEY)
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser)
          if (isMounted) {
            setUser(parsed)
            setIsDemoMode(true)
            setIsLoading(false)
          }
          return
        } catch {
          localStorage.removeItem(LOCAL_DEMO_USER_KEY)
          localStorage.removeItem(LEGACY_LOCAL_DEMO_USER_KEY)
        }
      }

      // 2. If Supabase is configured, check for live active session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && isMounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'User',
              createdAt: session.user.created_at,
            })
            setIsDemoMode(false)
          }
        } catch (err) {
          console.warn('Supabase getSession error:', err)
        }
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    initAuth()

    // 3. Subscribe to Supabase auth events if active
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'User',
            createdAt: session.user.created_at,
          })
          setIsDemoMode(false)
          localStorage.removeItem(LOCAL_DEMO_USER_KEY)
          localStorage.removeItem(LEGACY_LOCAL_DEMO_USER_KEY)
        } else if (!localStorage.getItem(LOCAL_DEMO_USER_KEY) && !localStorage.getItem(LEGACY_LOCAL_DEMO_USER_KEY)) {
          setUser(null)
        }
        setIsLoading(false)
      })

      return () => {
        isMounted = false
        subscription.unsubscribe()
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  // Sign up
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // If Supabase not connected, create local demo account
      const newDemoUser: User = {
        id: `demo-user-${Date.now()}`,
        email,
        fullName,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify(newDemoUser))
      setUser(newDemoUser)
      setIsDemoMode(true)
      return { error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName || email.split('@')[0],
          createdAt: data.user.created_at,
        })
      }

      return { error: null }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed. Please try again.'
      return { error: msg }
    }
  }, [])

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // If Supabase not connected, sign into local demo
      const demoUser: User = {
        id: `demo-user-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
        fullName: email.split('@')[0],
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      setIsDemoMode(true)
      return { error: null }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          fullName: (data.user.user_metadata?.full_name as string) || email.split('@')[0],
          createdAt: data.user.created_at,
        })
        setIsDemoMode(false)
        localStorage.removeItem(LOCAL_DEMO_USER_KEY)
      }

      return { error: null }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed. Please try again.'
      return { error: msg }
    }
  }, [])

  // Sign out
  const signOut = useCallback(async () => {
    if (isDemoMode) {
      localStorage.removeItem(LOCAL_DEMO_USER_KEY)
      localStorage.removeItem(LEGACY_LOCAL_DEMO_USER_KEY)
      setUser(null)
      setIsDemoMode(false)
      return
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.warn('Sign out warning:', err)
      }
    }

    localStorage.removeItem(LOCAL_DEMO_USER_KEY)
    localStorage.removeItem(LEGACY_LOCAL_DEMO_USER_KEY)
    setUser(null)
  }, [isDemoMode])

  // Password reset
  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error: null,
        successMessage: 'Local Demo Mode active. In production with Supabase connected, a password reset link is sent to your email.',
      }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      })

      if (error) {
        return { error: error.message, successMessage: null }
      }

      return {
        error: null,
        successMessage: `Password reset link sent to ${email}. Please check your inbox.`,
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset link.'
      return { error: msg, successMessage: null }
    }
  }, [])

  // Switch to demo mode
  const signInAsDemoUser = useCallback((demoEmail = 'demo.candidate@shortlist.ai', demoName = 'Demo Job Seeker') => {
    const demoUser: User = {
      id: 'demo-user-master',
      email: demoEmail,
      fullName: demoName,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
    setIsDemoMode(true)
  }, [])

  // Exit demo mode
  const exitDemoMode = useCallback(() => {
    localStorage.removeItem(LOCAL_DEMO_USER_KEY)
    localStorage.removeItem(LEGACY_LOCAL_DEMO_USER_KEY)
    setUser(null)
    setIsDemoMode(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isDemoMode,
      isSupabaseConfigured,
      signUp,
      signIn,
      signOut,
      resetPassword,
      signInAsDemoUser,
      exitDemoMode,
    }),
    [user, isLoading, isDemoMode, signUp, signIn, signOut, resetPassword, signInAsDemoUser, exitDemoMode]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
