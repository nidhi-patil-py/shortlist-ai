import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { useAuth } from '../context/useAuth'
import { storageService, DEFAULT_SAMPLE_PROFILE } from '../services/storageService'
import type { UserProfile, ResumeData } from '../types/resume'
import {
  User as UserIcon,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Database,
  Cloud,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const {
    user,
    isDemoMode,
    isSupabaseConfigured,
    signOut,
    resetPassword,
    signInAsDemoUser,
  } = useAuth()
  const navigate = useNavigate()

  // State management
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [dataMessage, setDataMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copiedId, setCopiedId] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  // Copy User ID
  const handleCopyUserId = async () => {
    if (!user?.id) return
    try {
      await navigator.clipboard.writeText(user.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch {
      // Fallback
    }
  }

  // Trigger Password Reset
  const handlePasswordReset = async () => {
    if (!user?.email) return
    setIsResettingPassword(true)
    setResetMessage(null)

    const result = await resetPassword(user.email)
    setIsResettingPassword(false)

    if (result.error) {
      setResetMessage({ type: 'error', text: result.error })
    } else {
      setResetMessage({
        type: 'success',
        text: result.successMessage || `Password reset instructions sent to ${user.email}.`,
      })
    }
  }

  // Export full JSON backup
  const handleExportBackup = async () => {
    if (!user) return
    setIsExporting(true)
    setDataMessage(null)

    try {
      const [profile, resumes] = await Promise.all([
        storageService.getUserProfile(user.id),
        storageService.getResumes(user.id),
      ])

      const backupData = {
        app: 'Shortlist AI',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        profile,
        resumes,
      }

      const jsonString = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const sanitizedName = (user.fullName || 'User').replace(/[^a-zA-Z0-9_-]/g, '_')
      a.href = url
      a.download = `shortlist_ai_backup_${sanitizedName}_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDataMessage({
        type: 'success',
        text: `Successfully exported master profile and ${resumes.length} saved resume(s) to JSON.`,
      })
    } catch (err) {
      console.error('Export failed:', err)
      setDataMessage({
        type: 'error',
        text: 'Failed to export backup. Please try again.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Import / Restore JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setDataMessage(null)
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)

        if (!parsed.profile) {
          throw new Error('Invalid backup file: missing profile object.')
        }

        // Restore Master Profile
        const restoredProfile: UserProfile = {
          ...parsed.profile,
          userId: user.id,
        }
        await storageService.saveUserProfile(user.id, restoredProfile)

        // Restore Resumes if present
        let restoredResumesCount = 0
        if (Array.isArray(parsed.resumes)) {
          for (const resume of parsed.resumes as ResumeData[]) {
            await storageService.saveResume(user.id, {
              ...resume,
              userId: user.id,
            })
            restoredResumesCount++
          }
        }

        setDataMessage({
          type: 'success',
          text: `Backup successfully restored! Restored master profile and ${restoredResumesCount} resume(s).`,
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON file format.'
        setDataMessage({
          type: 'error',
          text: `Failed to import backup: ${msg}`,
        })
      } finally {
        // Reset file input
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  // Restore Default Sample Data
  const handleRestoreSampleData = async () => {
    if (!user) return
    try {
      await storageService.saveUserProfile(user.id, {
        ...DEFAULT_SAMPLE_PROFILE,
        userId: user.id,
        personal: {
          ...DEFAULT_SAMPLE_PROFILE.personal,
          fullName: user.fullName || DEFAULT_SAMPLE_PROFILE.personal.fullName,
          email: user.email || DEFAULT_SAMPLE_PROFILE.personal.email,
        },
      })
      setDataMessage({
        type: 'success',
        text: 'Master profile re-seeded with realistic sample qualifications (Frontend Developer).',
      })
    } catch {
      setDataMessage({
        type: 'error',
        text: 'Failed to restore sample profile.',
      })
    }
  }

  // Clear Local Data
  const handleClearLocalData = () => {
    if (!user) return
    localStorage.removeItem(`shortlistai_user_${user.id}_profile`)
    localStorage.removeItem(`shortlistai_user_${user.id}_resumes`)
    localStorage.removeItem(`resumefit_user_${user.id}_profile`)
    localStorage.removeItem(`resumefit_user_${user.id}_resumes`)
    setConfirmClearOpen(false)
    setDataMessage({
      type: 'success',
      text: 'Local device cache cleared for this account.',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account & Data Settings
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your credentials, active session mode, and export or backup your personal data.
          </p>
        </div>

        {/* Global Feedback Alert */}
        {dataMessage && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              dataMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {dataMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm font-medium">{dataMessage.text}</div>
          </div>
        )}

        {/* 1. Account Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {user?.fullName || 'Active User'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'No email associated'}</p>
              </div>
            </div>

            {/* Mode Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center border shadow-2xs">
              {isDemoMode ? (
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                  <HardDrive className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Local Demo Mode (Offline)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-850 px-2 py-0.5 rounded-full">
                  <Cloud className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Supabase Cloud Account
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                User Identifier (UUID)
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-xs text-slate-700 dark:text-slate-300 break-all">
                <span>{user?.id || 'demo-user'}</span>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="ml-2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
                  title="Copy User ID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Database & Storage Layer
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>
                  {isSupabaseConfigured
                    ? 'Connected to Supabase PostgreSQL (RLS Active)'
                    : 'Isolated Browser LocalStorage'}
                </span>
              </div>
            </div>
          </div>

          {/* Demo Mode Conversion Prompt */}
          {isDemoMode && (
            <div className="bg-gradient-to-r from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                  Want to sync your resumes across all devices?
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">
                  Create a permanent Supabase account to sync profiles and resumes securely in the cloud.
                </p>
              </div>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition inline-flex items-center justify-center whitespace-nowrap"
              >
                Create Cloud Account
              </Link>
            </div>
          )}
        </div>

        {/* 2. Security & Credentials Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Authentication</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your credentials and password recovery.
              </p>
            </div>
          </div>

          {resetMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                resetMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {resetMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              )}
              <span>{resetMessage.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Password Reset
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                {isDemoMode
                  ? 'In Local Demo Mode, authentication is local and passwordless. You can test the password reset workflow below.'
                  : `Send a secure password recovery link to your registered email address (${user?.email}).`}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isResettingPassword}
              className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition disabled:opacity-50 whitespace-nowrap self-start sm:self-center"
            >
              {isResettingPassword ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </div>
        </div>

        {/* 3. Data Portability & Backup Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Portability & Backup</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You own your data. Export your full profile and resumes to JSON, or restore a backup anytime.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export JSON */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-300 dark:hover:border-indigo-600 transition flex flex-col justify-between space-y-3">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Export Data (JSON)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Download a complete JSON backup containing your Master Profile and all saved resumes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportBackup}
                disabled={isExporting}
                className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? 'Exporting...' : 'Export JSON Backup'}
              </button>
            </div>

            {/* Import JSON */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-300 dark:hover:border-indigo-600 transition flex flex-col justify-between space-y-3">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Restore Backup (JSON)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload a previously exported Shortlist AI JSON file to restore your qualifications.
                </p>
              </div>

              <label className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800 transition flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Backup File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Secondary Data Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleRestoreSampleData}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset Master Profile to Sample Qualifications
            </button>

            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1.5 font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Clear Local Data Cache
            </button>
          </div>
        </div>

        {/* 4. Session Controls Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center font-bold">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Session & Sign Out</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safely end your current session or switch operating modes.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isDemoMode ? (
                <span>
                  Currently in Local Demo Mode. Signing out will return you to the public landing page.
                </span>
              ) : (
                <span>
                  Signed in as <strong className="text-slate-800 dark:text-slate-200">{user?.email}</strong>.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isDemoMode && (
                <button
                  type="button"
                  onClick={() => signInAsDemoUser()}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg transition"
                >
                  Switch to Demo Mode
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  await signOut()
                  navigate('/')
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Clearing Cache */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Clear Local Device Cache?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                This will clear locally stored profile and resume cache for user{' '}
                <span className="font-mono font-medium">{user?.id}</span>. If you are in Local Demo Mode without a cloud account or JSON backup, unsaved changes will be lost.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearLocalData}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
              >
                Yes, Clear Local Data
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default SettingsPage
