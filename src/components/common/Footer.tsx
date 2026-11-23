import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Shield, Smartphone, CheckCircle2 } from 'lucide-react'

const CURRENT_YEAR = 2026

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Resume<span className="text-indigo-600 dark:text-indigo-400">Fit</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Job-specific ATS resume builder for students, freshers, and job seekers. Create your profile once, paste target job descriptions, and generate honest, ATS-friendly tailored resumes based strictly on your genuine qualifications.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Zero Hallucinations
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Android & Web Sync
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                100% Free Tier
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/matcher" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  JD Matcher
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ATS Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ATS Score Checker
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Master Profile Vault
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How Matching Works
                </a>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Transparency & Ethics
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Never invents fake skills</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Transparent scoring algorithm</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>No paid AI tokens needed</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Local & Cloud sync security</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-850">
          <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Honest ATS Disclaimer:
            </p>
            <p>
              ResumeFit helps you organize, surface, and format your real qualifications to align with job descriptions and applicant tracking systems. We never fabricate degrees, work experience, or technical competencies. An estimated ATS score is an internal diagnostic benchmark and does not guarantee job interviews or hiring decisions by third-party employers.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {CURRENT_YEAR} ResumeFit. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with precision for career growth.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
