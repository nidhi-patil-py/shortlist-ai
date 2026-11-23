import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export const PricingSection: React.FC = () => {
  const { user } = useAuth()
  const ctaLink = user ? '/dashboard' : '/signup'

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Honest, Student-Friendly Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Pricing in Indian Rupees (₹)
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            No expensive USD conversions, no recurring paywall traps. Tailor ATS resumes with 100% confidence.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="mt-14 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Starter */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl p-7 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Students & first-time applicants</p>
                </div>
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹0</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Free community access, no card required.</p>

              <div className="mt-7 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {[
                  '1 Master Profile',
                  'Up to 2 saved tailored resumes',
                  '3 JD matches/month',
                  'Classic Standard template',
                  'Basic ATS score overview',
                  'PDF export with subtle ResumeFit watermark',
                ].map((perk) => (
                  <div key={perk} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <Link
                to={ctaLink}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-2xs transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Tier 2: Job Seeker Pro (Highlighted / Most Popular) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 lg:p-8 border-2 border-indigo-600 shadow-xl shadow-indigo-100/70 dark:shadow-indigo-950/30 ring-4 ring-indigo-50 dark:ring-indigo-950/40 flex flex-col justify-between relative transform md:-translate-y-2">
            {/* Pill Banner */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-indigo-600 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Job Seeker Pro</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">Active applicants & internship seekers</p>
                </div>
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">₹29</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Less than the price of a cup of chai.</p>

              <div className="mt-7 space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                {[
                  'Unlimited tailored resumes',
                  'Unlimited JD keyword matches',
                  'All 3 ATS templates (Classic, Modern, Technical)',
                  'Full ATS diagnostic breakdown & missing keyword insights',
                  'Clean watermark-free PDF downloads',
                  'Cloud sync across Web & Android',
                ].map((perk) => (
                  <div key={perk} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span className="font-medium">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to={ctaLink}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-300 dark:shadow-none hover:shadow-indigo-400 transition-all active:scale-[0.98]"
              >
                Upgrade to Pro — ₹29/mo
              </Link>
            </div>
          </div>

          {/* Tier 3: Career Pass */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl p-7 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all relative">
            {/* Discount Badge */}
            <div className="absolute -top-3 right-6 px-3 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-300 dark:border-emerald-700">
              Save ₹99 • ~₹20/mo
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Career Pass</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Placement & job-switch season</p>
                </div>
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹249</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ year</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full 12-month coverage for university placement season.</p>

              <div className="mt-7 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {[
                  'Everything in Job Seeker Pro',
                  'Priority access to new templates',
                  'Full JSON profile backup & restore',
                  'Best for placement & job-switch season',
                  'Offline PWA & direct Android APK access',
                ].map((perk) => (
                  <div key={perk} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <Link
                to={ctaLink}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-2xs transition-all"
              >
                Get Career Pass — ₹249/yr
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            No hidden subscription traps
          </span>
          <span>•</span>
          <span>Secure Indian UPI, NetBanking & Cards</span>
          <span>•</span>
          <span>Instant PDF access</span>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
