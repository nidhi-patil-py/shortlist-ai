import React from 'react'
import { CheckCircle2, XCircle, HelpCircle, ShieldCheck } from 'lucide-react'

export const AtsExplanationSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>The Reality of ATS Systems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ATS Really Works & Why Most Resumes Get Rejected
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Over 75% of resumes are parsed by an Applicant Tracking System before human eyes ever see them. Understanding how parser algorithms function gives you the competitive advantage.
          </p>
        </div>

        {/* Comparison: Complex Graphic Resume vs Clean ATS Resume */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bad Practice */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/40 pb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  What Breaks ATS Parsers
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                High Failure Risk
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Multi-column layouts & tables:</strong> Parsers read horizontally, garbling text across columns into unreadable sentences.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Graphical skill bars & stars:</strong> A parser cannot interpret "4 out of 5 stars in JavaScript" as a verified keyword.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Text in images & icons:</strong> Phone numbers, email links, or dates placed inside image containers are completely invisible.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Non-standard section headers:</strong> Creative headers like "My Journey" cause parsers to ignore your entire work history.</span>
              </li>
            </ul>
          </div>

          {/* Good Practice (Shortlist AI Method) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  The Shortlist AI Clean Standard
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                100% Parser Safe
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Single-column linear hierarchy:</strong> Ensures deterministic, line-by-line parsing without text scrambling.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Verifiable plain text skills:</strong> Skills listed cleanly with exact industry terminology recognized by ranking algorithms.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Standard universal headers:</strong> Summary, Experience, Projects, Education, and Skills so parsers classify data correctly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong className="text-slate-800 dark:text-slate-200">Print-ready vector PDF:</strong> High-precision text rendering that preserves raw selectable unicode text.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transparent Scoring Formula */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Transparent Internal Scoring Benchmark</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              How Shortlist AI Calculates Your Estimated ATS Score
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our 0-100 score is an honest, rule-based diagnostic calculated transparently across 4 core dimensions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">40%</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Keyword Match</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Coverage of primary tools and tech stack requirements.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">25%</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Project Relevance</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Surfacing portfolio projects demonstrating required stack.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">20%</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Contact & Profile</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Complete phone, email, location, LinkedIn, and GitHub.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">15%</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">Layout Hygiene</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Single-column flow, proper standard headings and bullets.</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-2">
              Note: This score is an educational engineering benchmark. No algorithm can guarantee that an employer will extend an interview or hire you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AtsExplanationSection
