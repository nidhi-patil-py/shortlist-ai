import React from 'react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Target } from 'lucide-react'

export const MatcherPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Job Description Matcher</h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Deterministic keyword matching and tailored resume generation will be implemented in Phase 5.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MatcherPage
