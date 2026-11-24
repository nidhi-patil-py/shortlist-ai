import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { ThemeContext, THEME_STORAGE_KEY, type Theme } from './useTheme'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = (localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('resumefit_theme')) as Theme | null
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch {
      // Fallback in environments where localStorage or matchMedia is restricted
    }
    return 'light'
  })

  // Synchronize class on <html> and localStorage
  useEffect(() => {
    try {
      const root = document.documentElement
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Safe fallback
    }
  }, [theme])

  // Listen to OS prefers-color-scheme changes when user hasn't manually set a theme
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const manualSetting = localStorage.getItem(THEME_STORAGE_KEY)
      if (!manualSetting) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const isDark = theme === 'dark'

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      isDark,
    }),
    [theme, toggleTheme, setTheme, isDark]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
