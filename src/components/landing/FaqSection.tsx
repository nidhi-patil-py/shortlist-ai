import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'How does job-specific resume generation work in ResumeFit?',
    answer:
      'You create your master profile once with your authentic skills, work history, projects, and education. When you paste any job description, our deterministic keyword engine scans the requirements and aligns your existing profile by prioritizing matching technical keywords and relevant projects at the top of your resume.',
  },
  {
    question: 'Does ResumeFit require paid AI API keys like OpenAI, Gemini, or Claude?',
    answer:
      'No! ResumeFit uses custom, lightweight TypeScript/JavaScript logic for fast, transparent, client-side keyword matching. It does not require any paid AI APIs, keeps latency virtually instant, and protects your privacy without sharing your data with external model training pipelines.',
  },
  {
    question: 'Can ResumeFit invent skills or qualifications I do not possess?',
    answer:
      'Never. ResumeFit strictly adheres to an ethical engineering standard. We only match against your verified user profile. If a job listing requires a competency you do not have, our ATS checker lists it in your "Missing Skills" report so you can learn it, but never fabricates it on your resume.',
  },
  {
    question: 'Does a high ATS score guarantee a job interview or offer?',
    answer:
      'No. We explicitly do not claim any score guarantees job selection. The ResumeFit ATS score is an internal diagnostic benchmark showing keyword overlap, structural formatting compliance, and completeness to help you pass initial automated filtering and reach human recruiters.',
  },
  {
    question: 'Is there an Android app available?',
    answer:
      'Yes! ResumeFit includes an Android application built with Capacitor. It has a tiny download footprint (under 30 MB), supports native PDF downloads and sharing, and synchronizes seamlessly with your web account.',
  },
  {
    question: 'How is my private data stored?',
    answer:
      'Your profile and resumes are saved in a PostgreSQL database secured by Supabase Row Level Security (RLS), meaning only you can read or edit your own records. If Supabase credentials are not configured, you can use our built-in Local Demo Mode stored privately on your device.',
  },
]

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Clear, upfront answers about our technology, ATS compatibility, and ethical guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={item.question}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
