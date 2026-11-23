import React from 'react'
import {
  CheckCheck,
  Target,
  FileSpreadsheet,
  Gauge,
  Lock,
  Smartphone,
  SlidersHorizontal,
  Code2,
} from 'lucide-react'

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Contextual Keyword Extraction',
      description:
        'Analyzes job listings using deterministic keyword matching. Extracts technical skills, frameworks, tools, and soft skill requirements instantly.',
    },
    {
      icon: Gauge,
      title: 'Transparent ATS Fit Metric',
      description:
        'Shows you clear breakdowns of your matched keywords, missing competencies, and formatting hygiene with clear scoring rationales.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Recruiter-Tested ATS Layouts',
      description:
        'Multi-column resumes often break automated parsers. ResumeFit enforces clean, parse-ready single-column structures that machines read smoothly.',
    },
    {
      icon: SlidersHorizontal,
      title: 'Project & Experience Prioritization',
      description:
        'Have 6 personal projects? ResumeFit automatically orders and highlights the 2-3 most relevant projects that match the target position.',
    },
    {
      icon: Code2,
      title: 'Zero Paid AI Reliance',
      description:
        'No OpenAI or Gemini API keys needed. No subscription limits or token fees. Runs fast, client-side, and deterministic.',
    },
    {
      icon: Lock,
      title: 'Privacy & Data Ownership',
      description:
        'Protected by Supabase Row-Level Security. We do not sell your personal resume data. Full offline local demo mode is always available.',
    },
    {
      icon: Smartphone,
      title: 'Lightweight Android App',
      description:
        'Install the lightweight Capacitor Android app (under 30 MB) to generate and share PDFs directly from your smartphone.',
    },
    {
      icon: CheckCheck,
      title: 'Instant PDF Generation',
      description:
        'One-click PDF download formatted with standard typography, bullet margins, and print-ready vector styles.',
    },
  ]

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Engineered For ATS & Humans
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need To Pass Screening Filters
          </p>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Modern hiring systems scan hundreds of applications in seconds. ResumeFit aligns your real story with what the software is programmed to find.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
