import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { FileText, ShieldCheck } from 'lucide-react'

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Welcome back to ResumeFit
            </h2>
            <p className="text-sm text-slate-600">
              Sign in to manage your resumes and profile
            </p>
          </div>

          <div className="rounded-xl p-4 bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Authentication Phase Notice:</span> Full Supabase and Local Demo Auth will be enabled in Phase 2.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email address
              </label>
              <input
                type="email"
                disabled
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <button
              disabled
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-400 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Sign In (Ready in Phase 2)</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LoginPage
