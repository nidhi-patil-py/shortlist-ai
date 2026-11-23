import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles } from 'lucide-react'

export const PricingSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Built For Job Seekers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent, Honest Pricing. No Paywalls.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We believe job hunting should not cost you a fortune. Create, tailor, and download resumes without hidden subscription traps.
          </p>
        </div>

        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Community Tier */}
          <div className="bg-[#F8FAFC] rounded-2xl p-8 border-2 border-indigo-600 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-xs">
              Always Free For Seekers
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Career Starter</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Students, freshers, & job seekers</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">$0</div>
                  <div className="text-xs text-slate-500 font-medium">Free forever</div>
                </div>
              </div>

              <div className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-700">
                {[
                  'Unlimited Master Profile editing',
                  'Unlimited Job Description matching',
                  'Algorithmic ATS keyword extraction',
                  '3 Recruiter-tested ATS templates',
                  'Unlimited clean PDF downloads',
                  'Sync across Web & Android App',
                  'Zero credit card required',
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                Get Started Free Now
              </Link>
            </div>
          </div>

          {/* Supporter / Open-Source Tier */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Open Supporter</h3>
                  <p className="text-xs text-slate-500 mt-0.5">For career coaches & power users</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">$0 <span className="text-xs font-normal text-slate-400">/opt</span></div>
                  <div className="text-xs text-slate-500 font-medium">Community supported</div>
                </div>
              </div>

              <div className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-600">
                {[
                  'All features in Career Starter tier',
                  'Local Demo Mode (zero cloud storage needed)',
                  'Custom export presets for Android',
                  'Priority bug reports & feature requests',
                  'Early access to future ATS templates',
                  'Direct offline PDF generation',
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Join As Supporter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
