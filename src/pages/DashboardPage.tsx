import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { LayoutDashboard, Plus } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Manage your profiles, matched resumes, and ATS scores</p>
          </div>
          <Link
            to="/matcher"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Phase 1 Initialized</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Full database connectivity, auth sessions, and resume collections are queued for Phase 2.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardPage
