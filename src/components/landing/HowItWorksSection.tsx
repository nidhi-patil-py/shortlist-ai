import React from 'react'
import { UserCheck, FileText, Cpu, Download, ShieldAlert } from 'lucide-react'

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Build Master Profile Once',
      description: 'Add your genuine skills, education, past roles, and projects into your secure profile vault. No need to rewrite them ever again.',
      icon: UserCheck,
      highlight: 'Single source of truth',
    },
    {
      step: '02',
      title: 'Paste Target Job Description',
      description: 'Copy and paste the responsibilities and tech stack requirements directly from LinkedIn, Indeed, or company career boards.',
      icon: FileText,
      highlight: 'Works with any job listing',
    },
    {
      step: '03',
      title: 'Intelligent Keyword Matching',
      description: 'Our rule-based engine extracts requirements and matches your existing skills and relevant projects without hallucinating or falsifying data.',
      icon: Cpu,
      highlight: 'Zero fake skills added',
    },
    {
      step: '04',
      title: 'Download Clean ATS PDF',
      description: 'Export an ATS-optimized, single-column resume formatted specifically for recruiter parsers and screening systems.',
      icon: Download,
      highlight: 'Standard recruiter formats',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            How ResumeFit Works
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Generic Profile to Job-Tailored Resume in 4 Simple Steps
          </p>
          <p className="text-base sm:text-lg text-slate-600">
            Stop sending the exact same generic resume to 50 different jobs. Tailor your real qualifications to what recruiters and automated filters actually look for.
          </p>
        </div>

        {/* 4 Step Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => {
            const IconComponent = item.icon
            return (
              <div
                key={item.step}
                className="relative bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-indigo-300 transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-600/40 font-mono group-hover:text-indigo-600 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  <span>{item.highlight}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ethical Rule Notice */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">Our Ethical Engineering Promise:</span> ResumeFit will{' '}
            <strong>never</strong> invent skills, fake company titles, or forge college credentials you do not possess. If a job description asks for Docker and you do not know Docker, ResumeFit highlights it as a missing skill so you can learn it—never lie about it.
          </div>
        </div>
      </div>
    </section>
  )
}
