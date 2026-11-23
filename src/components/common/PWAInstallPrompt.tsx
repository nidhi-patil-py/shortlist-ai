import React, { useState } from 'react'
import { usePWAInstallPrompt } from '../../services/pwaService'
import { Smartphone, Download, X, Share, CheckCircle2 } from 'lucide-react'

interface Props {
  variant?: 'banner' | 'pill'
}

export const PWAInstallPrompt: React.FC<Props> = ({ variant = 'pill' }) => {
  const { isInstallable, isIOS, promptInstall, dismissPrompt } = usePWAInstallPrompt()
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [installedSuccess, setInstalledSuccess] = useState(false)

  if (!isInstallable && !isIOS) {
    return null
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }

    const success = await promptInstall()
    if (success) {
      setInstalledSuccess(true)
      setTimeout(() => setInstalledSuccess(false), 4000)
    }
  }

  if (installedSuccess) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>ResumeFit Installed!</span>
      </div>
    )
  }

  // Pill variant (ideal for Navbar)
  if (variant === 'pill') {
    return (
      <>
        <div className="no-print inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors shadow-2xs">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 hover:underline"
            title="Install ResumeFit as a standalone app"
          >
            {isIOS ? (
              <Share className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            )}
            <span>Install App</span>
          </button>

          <button
            type="button"
            onClick={dismissPrompt}
            className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 p-0.5 rounded-full hover:bg-indigo-200/50 dark:hover:bg-indigo-900/50"
            title="Dismiss install prompt"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* iOS Install Instructions Modal */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Install on iOS</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p>To install ResumeFit on your iPhone or iPad home screen:</p>
                <ol className="space-y-2 list-decimal list-inside font-medium text-slate-800 dark:text-slate-200">
                  <li className="leading-snug">
                    Tap the <strong className="text-indigo-600 dark:text-indigo-400">Share</strong> button in Safari's bottom toolbar.
                  </li>
                  <li className="leading-snug">
                    Scroll down and tap <strong className="text-indigo-600 dark:text-indigo-400">"Add to Home Screen"</strong>.
                  </li>
                  <li className="leading-snug">
                    Tap <strong className="text-indigo-600 dark:text-indigo-400">Add</strong> in the top right corner.
                  </li>
                </ol>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowIOSModal(false)
                  dismissPrompt()
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Banner variant (ideal for Dashboard)
  return (
    <>
      <div className="no-print p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-900/90 border border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Install ResumeFit for Instant Offline Access
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Fast standalone launch from your home screen or desktop with offline resume drafting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            type="button"
            onClick={dismissPrompt}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Install on iOS</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>To install ResumeFit on your iPhone or iPad home screen:</p>
              <ol className="space-y-2 list-decimal list-inside font-medium text-slate-800 dark:text-slate-200">
                <li className="leading-snug">
                  Tap the <strong className="text-indigo-600 dark:text-indigo-400">Share</strong> button in Safari's bottom toolbar.
                </li>
                <li className="leading-snug">
                  Scroll down and tap <strong className="text-indigo-600 dark:text-indigo-400">"Add to Home Screen"</strong>.
                </li>
                <li className="leading-snug">
                  Tap <strong className="text-indigo-600 dark:text-indigo-400">Add</strong> in the top right corner.
                </li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIOSModal(false)
                dismissPrompt()
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  )
}
