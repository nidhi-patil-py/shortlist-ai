import React from 'react'
import { useAuth } from '../../context/useAuth'
import { LogOut } from 'lucide-react'

export const DemoModeBanner: React.FC = () => {
  const { isDemoMode, user, exitDemoMode } = useAuth()

  if (!isDemoMode || !user) return null

  return (
    <div className="bg-amber-500 text-slate-900 border-b border-amber-600 px-4 py-2 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="px-2 py-0.5 rounded bg-black/10 font-bold uppercase tracking-wider text-[10px]">
            Local Demo Mode
          </span>
          <span className="text-slate-950 font-semibold">
            Operating offline in your browser. All profile and resume data is stored privately in localStorage.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-900/80 text-[11px] hidden md:inline">
            Logged in as: <strong>{user.email}</strong>
          </span>
          <button
            onClick={exitDemoMode}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <LogOut className="w-3 h-3" />
            <span>Exit Demo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DemoModeBanner
