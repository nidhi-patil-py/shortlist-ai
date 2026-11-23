import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Global cached prompt event
let deferredPrompt: BeforeInstallPromptEvent | null = null
const promptListeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    promptListeners.forEach((listener) => listener())
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    promptListeners.forEach((listener) => listener())
  })
}

/**
 * Registers the lightweight custom service worker
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ ServiceWorker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.warn('ServiceWorker registration failed:', error)
      })
  })
}

export interface UsePWAInstallReturn {
  isInstallable: boolean
  isInstalled: boolean
  isIOS: boolean
  promptInstall: () => Promise<boolean>
  dismissPrompt: () => void
  isDismissed: boolean
}

/**
 * Hook to manage custom PWA install prompt across Navbar and Dashboard
 */
export function usePWAInstallPrompt(): UsePWAInstallReturn {
  // Check if app is already running in standalone display mode
  const isInstalled = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as unknown as { standalone?: boolean }).standalone)
  )

  // Detect iOS devices (iPhone, iPad, iPod)
  const isIOS = typeof window !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream &&
    !isInstalled
  )

  const [canInstall, setCanInstall] = useState(Boolean(deferredPrompt))
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('resumefit_pwa_dismissed') === 'true'
  })

  useEffect(() => {
    const update = () => {
      setCanInstall(Boolean(deferredPrompt))
    }

    promptListeners.add(update)

    return () => {
      promptListeners.delete(update)
    }
  }, [])

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        deferredPrompt = null
        setCanInstall(false)
        return true
      }
      return false
    } catch (err) {
      console.warn('PWA install prompt error:', err)
      return false
    }
  }, [])

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true)
    sessionStorage.setItem('resumefit_pwa_dismissed', 'true')
  }, [])

  return {
    isInstallable: canInstall && !isInstalled && !isDismissed,
    isInstalled,
    isIOS: isIOS && !isDismissed,
    promptInstall,
    dismissPrompt,
    isDismissed,
  }
}
