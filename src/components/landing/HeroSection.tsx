import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Shield, Sparkles, FileCheck, Layers, Smartphone } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
      {/* Background subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/50 dark:from-indigo-950/40 via-slate-100/30 dark:via-slate-900/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>Job-Specific ATS Resume Generation</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-normal">No Paid AI APIs Required</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Build a Resume That <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-300">
              Matches Your Dream Job.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Create your master profile once. Paste any target job description, and ResumeFit extracts the required keywords, highlights your matching skills & projects, and creates a tailored, ATS-ready resume based strictly on your genuine qualifications.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-300/60 dark:shadow-none hover:shadow-indigo-400 transition-all active:scale-[0.98]"
            >
              <span>Start Building Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs transition-all"
            >
              <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Interactive ATS Demo</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero Hallucinations</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>100% Honest Profile</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Single Column ATS Safe</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Android APK Ready</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Mockup */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Header bar mock */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 font-mono text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">resumefit.app/generator</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Target: Frontend Engineer (React/TypeScript)
                </span>
              </div>
            </div>

            {/* Split view mock */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
              {/* Job Description input mock */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Pasted Job Requirements</span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">8 Keywords Found</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2 font-mono">
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">Senior Frontend Developer</p>
                  <p>Looking for 2+ years experience in <mark className="bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 px-1 rounded">React</mark>, <mark className="bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 px-1 rounded">TypeScript</mark>, and <mark className="bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 px-1 rounded">Tailwind CSS</mark>. Experience with <mark className="bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 px-1 rounded">REST APIs</mark> and responsive web design required.</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Keyword Match Score</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">92% Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[92%]" />
                  </div>
                </div>
              </div>

              {/* Matched Tailored Resume Preview Mock */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Alex Morgan</h2>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Frontend Developer • San Francisco, CA • alex@example.com</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                    ATS Format ✓
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800 pb-0.5">
                    Matched Relevant Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Vite', 'Git', 'Responsive Design'].map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium text-[11px]">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-800 pb-0.5">
                    Prioritized Relevant Projects
                  </h3>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white">E-Commerce Web Application <span className="text-slate-400 dark:text-slate-500 font-normal">| React, TypeScript, Tailwind</span></p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                      Built a responsive storefront with dynamic search, caching, and REST API integration, cutting page load time by 38%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
