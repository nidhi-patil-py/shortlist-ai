import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { FileText, ArrowRight, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetMessage, setResetMessage] = useState<string | null>(null)

  const { signIn, signInAsDemoUser, isSupabaseConfigured, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)
    const { error } = await signIn(email, password)
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error)
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleDemoSignIn = () => {
    signInAsDemoUser('demo.candidate@resumefit.app', 'Alex Morgan (Demo)')
    navigate(from, { replace: true })
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) return

    setIsSubmitting(true)
    const { error, successMessage } = await resetPassword(forgotEmail)
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error)
    } else {
      setResetMessage(successMessage)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In to ResumeFit
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Access your saved resumes and job matching tools
            </p>
          </div>

          {/* Cloud vs Local Indicator */}
          <div className={`rounded-xl p-3.5 text-xs flex items-start gap-2.5 border ${
            isSupabaseConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
          }`}>
            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isSupabaseConfigured ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
            <div>
              <span className="font-semibold">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local Demo Mode Active'}:
              </span>{' '}
              {isSupabaseConfigured
                ? 'Cloud authentication & Row Level Security are enabled.'
                : 'No cloud keys detected. Running privately in offline browser mode.'}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true)
                    setForgotEmail(email)
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs uppercase font-semibold text-slate-400 dark:text-slate-600">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Instant Demo Sign In Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Instant Access in Local Demo Mode</span>
          </button>

          <div className="text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Create an account free
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Password</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enter your email address and we'll send a link to reset your password.
            </p>

            {resetMessage ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{resetMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setForgotModalOpen(false)
                setResetMessage(null)
              }}
              className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 pt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default LoginPage
