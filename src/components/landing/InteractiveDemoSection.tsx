import React, { useState } from 'react'
import { Check, X, Sparkles, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DemoPreset {
  name: string
  role: string
  jobTitle: string
  jobDescriptionText: string
  skillsPool: string[]
  expectedMatched: string[]
  expectedMissing: string[]
  score: number
  projects: { name: string; tech: string; desc: string }[]
}

const PRESETS: DemoPreset[] = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    jobTitle: 'React & TypeScript UI Engineer',
    jobDescriptionText:
      'We are hiring a Frontend Engineer with hands-on experience in React, TypeScript, REST API integration, Tailwind CSS, and Git. Experience with GraphQL is a plus.',
    skillsPool: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Git', 'HTML5/CSS3', 'Figma'],
    expectedMatched: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git'],
    expectedMissing: ['GraphQL'],
    score: 89,
    projects: [
      {
        name: 'Analytics Dashboard',
        tech: 'React, TypeScript, Tailwind CSS',
        desc: 'Interactive financial monitoring tool with real-time charting, lazy loading, and sub-100ms UI interactions.',
      },
      {
        name: 'E-Commerce Checkout Flow',
        tech: 'React, REST APIs, Context API',
        desc: 'Streamlined multi-step checkout workflow with client-side form validation and instant receipt generation.',
      },
    ],
  },
  {
    name: 'David Patel',
    role: 'Full Stack Developer',
    jobTitle: 'Node.js & Python Web Developer',
    jobDescriptionText:
      'Looking for a Full Stack Engineer to build scalable microservices. Must know Node.js, PostgreSQL, Docker, Express, and Redis. Experience with AWS cloud deployments preferred.',
    skillsPool: ['Node.js', 'Express', 'PostgreSQL', 'JavaScript', 'Python', 'Git', 'REST APIs', 'Docker'],
    expectedMatched: ['Node.js', 'PostgreSQL', 'Express', 'Docker'],
    expectedMissing: ['Redis', 'AWS'],
    score: 82,
    projects: [
      {
        name: 'Distributed Task Queue',
        tech: 'Node.js, Express, PostgreSQL',
        desc: 'Built asynchronous background job worker handling 50,000+ jobs/day with failover retries and webhook alerts.',
      },
      {
        name: 'Inventory Sync Service',
        tech: 'Python, Docker, REST APIs',
        desc: 'Containerized multi-warehouse synchronization service cutting data latency by 45%.',
      },
    ],
  },
]

export const InteractiveDemoSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeTemplate, setActiveTemplate] = useState<'classic' | 'modern'>('modern')

  const current = PRESETS[selectedIdx]

  return (
    <section id="demo" className="py-20 lg:py-28 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See ResumeFit Match a Job in Real-Time
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Switch target jobs to see how our deterministic matching engine extracts keywords, filters relevant projects, and scores compatibility.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.role}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedIdx === idx
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Target: {preset.jobTitle}</span>
            </button>
          ))}
        </div>

        {/* Interactive Workspace Box */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Description & ATS Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Job Description Card */}
            <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  1. Target Job Requirements
                </h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Input Listing
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed font-mono">
                {current.jobDescriptionText}
              </p>
            </div>

            {/* Keyword Match Stats Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  2. ATS Keyword Match Analysis
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {current.score}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${current.score}%` }}
                />
              </div>

              {/* Matched Skills */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Matched In Candidate Profile
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{current.expectedMatched.length} found</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {current.expectedMatched.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Missing From Profile
                  </span>
                  <span className="text-slate-400 text-[11px]">Honest feedback</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {current.expectedMissing.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    >
                      <X className="w-3 h-3 text-rose-500" />
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  *Notice: ResumeFit flags missing skills so you know your gap, but <strong>never inserts false credentials</strong> into your resume.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tailored Resume Preview Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Live Generated ATS Resume
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                    ATS-PARSER COMPLIANT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTemplate('modern')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      activeTemplate === 'modern'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Modern
                  </button>
                  <button
                    onClick={() => setActiveTemplate('classic')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      activeTemplate === 'classic'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Classic
                  </button>
                </div>
              </div>

              {/* The Rendered Resume Document Mock (Stays strictly white paper for print preview) */}
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-300 shadow-sm text-slate-800 space-y-5 font-sans">
                {/* Personal Header */}
                <div className="text-center pb-3 border-b border-slate-300">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {current.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {current.role} • San Francisco, CA • (555) 234-5678 • candidate@example.com
                  </p>
                  <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                    linkedin.com/in/{current.name.toLowerCase().replace(' ', '')} • github.com/{current.name.toLowerCase().replace(' ', '')}
                  </p>
                </div>

                {/* Professional Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Results-driven {current.role} with proven track record designing scalable web applications. Strong background in {current.expectedMatched.slice(0, 3).join(', ')}, focused on high-performance user interfaces and responsive web standards.
                  </p>
                </div>

                {/* Tailored Skills Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
                    Relevant Technical Competencies
                  </h4>
                  <div className="text-xs text-slate-800 space-y-1">
                    <p>
                      <strong className="text-slate-900">Job-Matched Skills:</strong>{' '}
                      {current.expectedMatched.join(' • ')}
                    </p>
                    <p>
                      <strong className="text-slate-900">Additional Stack:</strong>{' '}
                      {current.skillsPool.filter((s) => !current.expectedMatched.includes(s)).join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Selected Relevant Projects */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
                    Prioritized Technical Projects
                  </h4>
                  <div className="space-y-3">
                    {current.projects.map((proj) => (
                      <div key={proj.name} className="text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{proj.name}</span>
                          <span className="text-[11px] text-slate-500 font-normal">{proj.tech}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          • {proj.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
                    Education
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-800 font-semibold">
                    <span>B.S. in Computer Science</span>
                    <span className="text-slate-500 font-normal">Graduated 2024</span>
                  </div>
                  <p className="text-[11px] text-slate-600">University of California, Berkeley</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  <span>Build Your Tailored Resume Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveDemoSection
