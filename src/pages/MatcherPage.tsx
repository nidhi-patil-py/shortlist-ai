import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoModeBanner } from '../components/common/DemoModeBanner'
import { useAuth } from '../context/useAuth'
import { storageService } from '../services/storageService'
import type { UserProfile } from '../types/resume'
import {
  matchJobDescription,
  buildTailoredResume,
  type JDAnalysisResult,
} from '../services/jdMatcher'
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  FolderGit2,
  FileText,
  Building,
} from 'lucide-react'

// Sample Job Descriptions for instant 1-click evaluation
const SAMPLE_JDS = [
  {
    title: 'Frontend Engineer',
    company: 'Fintech Corp',
    text: `We are looking for a skilled Frontend Engineer to join our core web product team.
Responsibilities:
- Build responsive, accessible, and high-performance user interfaces using React, TypeScript, and Tailwind CSS.
- Integrate REST APIs and manage client-side state efficiently.
- Write unit tests using Jest/React Testing Library and participate in code reviews.
- Work closely with UI/UX designers using Figma and collaborate across an Agile/Scrum team.
Qualifications:
- 2+ years experience with modern JavaScript (ES6+), React, and TypeScript.
- Strong knowledge of HTML5, CSS3, and Responsive Web Design.
- Hands-on experience with Git & GitHub version control.
- Experience with Next.js or GraphQL is a plus.`,
  },
  {
    title: 'Full Stack Engineer',
    company: 'CloudScale Inc',
    text: `CloudScale is seeking a Full Stack Engineer to design and maintain distributed web applications.
Requirements:
- Strong proficiency in Node.js, Express, and PostgreSQL.
- Experience designing and consuming scalable REST APIs.
- Familiarity with Docker containerization and CI/CD pipelines (GitHub Actions).
- Comfortable working with cloud services (AWS or Google Cloud).
- Experience with Redis caching and SQL optimization.
- Solid understanding of Git, unit testing, and agile engineering practices.`,
  },
  {
    title: 'Python Web Developer',
    company: 'DataFlow Systems',
    text: `Seeking a Python Web Developer to build scalable data endpoints and internal tooling.
Requirements:
- Hands-on experience with Python, SQL, and database modeling with PostgreSQL.
- Experience building RESTful web services and integrating third-party APIs.
- Familiarity with Linux server environments and Docker containers.
- Strong problem solving skills and experience with Git version control.
- Basic familiarity with JavaScript/React for frontend dashboards is preferred.`,
  },
]

export const MatcherPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [targetJobTitle, setTargetJobTitle] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Load master profile on mount
  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (!user) return
      setLoading(true)
      try {
        const p = await storageService.getUserProfile(user.id)
        if (isMounted) {
          setProfile(p)
          if (p.personal.professionalTitle) {
            setTargetJobTitle(p.personal.professionalTitle)
          }
        }
      } catch (err) {
        console.warn('Failed to load profile for matcher:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user])

  // Derive analysis during render via useMemo for instant, synchronous responsiveness
  const analysis: JDAnalysisResult | null = useMemo(() => {
    if (!profile || !jobDescription.trim()) return null
    return matchJobDescription(jobDescription, profile, targetJobTitle)
  }, [jobDescription, profile, targetJobTitle])

  // Load sample JD
  const handleLoadSample = (sample: typeof SAMPLE_JDS[0]) => {
    setTargetJobTitle(sample.title)
    setTargetCompany(sample.company)
    setJobDescription(sample.text)
  }

  // Generate tailored resume and navigate to builder
  const handleGenerateResume = async () => {
    if (!profile || !user) return
    setIsGenerating(true)

    try {
      const result = analysis || matchJobDescription(jobDescription, profile, targetJobTitle)
      const newResume = buildTailoredResume(
        profile,
        result,
        targetJobTitle,
        targetCompany,
        jobDescription
      )

      const saved = await storageService.saveResume(user.id, newResume)
      navigate(`/builder?id=${saved.id}`)
    } catch (err) {
      console.error('Failed to generate tailored resume:', err)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <DemoModeBanner />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Job Description Matcher
              </h1>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Match job requirements against your Master Profile without hallucinating false credentials
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Edit Master Profile
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading your profile for matching...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Job Description Input & Quick Samples */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Paste Target Job Listing</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Step 1 of 2</span>
                </div>

                {/* Target Role Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Role / Title</span>
                    </label>
                    <input
                      type="text"
                      value={targetJobTitle}
                      onChange={(e) => setTargetJobTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Company</span>
                    </label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="e.g. Stripe, Google, Spotify"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Quick Sample Buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Quick Fill with Sample Job Description:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_JDS.map((sample) => (
                      <button
                        key={sample.title}
                        type="button"
                        onClick={() => handleLoadSample(sample)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-colors"
                      >
                        + {sample.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Job Description Text
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {jobDescription.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Copy and paste the responsibilities, tech stack, and qualifications from the job posting..."
                    className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  />
                </div>

                {/* Ethical Guarantee Pill */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong>Zero Hallucination Rule:</strong> ResumeFit will match your genuine skills and prioritize existing relevant projects. We will <em>never</em> inject fake credentials or fake employment history.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Match Breakdown & Tailored Generation */}
            <div className="lg:col-span-6 space-y-6">
              {!analysis ? (
                <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center space-y-3">
                  <Target className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    Awaiting Job Description
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Paste a job description on the left (or click one of our sample jobs) to see real-time keyword matching, gap analysis, and tailored resume generation.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Match Score Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Estimated ATS Fit Score
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span
                            className={`text-3xl sm:text-4xl font-black ${
                              analysis.matchPercentage >= 75
                                ? 'text-emerald-600'
                                : analysis.matchPercentage >= 50
                                ? 'text-indigo-600'
                                : 'text-amber-500'
                            }`}
                          >
                            {analysis.matchPercentage}%
                          </span>
                          <span className="text-xs font-bold text-slate-400">/ 100</span>
                          <span className="text-xs text-slate-600 font-medium ml-1">
                            {analysis.matchPercentage >= 75
                              ? 'Strong qualification overlap'
                              : analysis.matchPercentage >= 50
                              ? 'Moderate fit'
                              : 'Substantial skill gaps detected'}
                          </span>
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Target className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          analysis.matchPercentage >= 75
                            ? 'bg-emerald-500'
                            : analysis.matchPercentage >= 50
                            ? 'bg-indigo-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${analysis.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Matched Keywords (Green) */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Matched Skills in Your Profile
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {analysis.matchedSkills.length} Verified Matches
                      </span>
                    </div>

                    {analysis.matchedSkills.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No explicit keywords from the job description matched your current skills list.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {analysis.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
                          >
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 pt-1">
                      These verified skills will be prioritized at the top of your tailored resume.
                    </p>
                  </div>

                  {/* Missing Skills / Gaps (Amber) */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Identified Skill Gaps
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {analysis.missingSkills.length} Gaps
                      </span>
                    </div>

                    {analysis.missingSkills.length === 0 ? (
                      <p className="text-xs text-emerald-700 font-medium">
                        ✓ Excellent! Your profile covers every primary skill mentioned in this posting.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {analysis.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                          >
                            <span className="text-amber-600 font-bold">!</span>
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 pt-1">
                      *Note: If you have experience in any of these skills, add them to your Master Profile. ResumeFit will <strong>never invent or add them automatically</strong>.
                    </p>
                  </div>

                  {/* Prioritized Projects Preview */}
                  {analysis.prioritizedProjects.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Prioritized Projects (Most Relevant First)
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {analysis.prioritizedProjects.slice(0, 2).map((p, i) => (
                          <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                #{i + 1} {p.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {(p.technologies || []).join(', ')}
                              </span>
                            </div>
                            <p className="text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                              {p.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary CTA Button */}
                  <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h3 className="text-base font-bold">Ready to generate your tailored resume?</h3>
                      <p className="text-xs text-indigo-100">
                        Combines your genuine qualifications with optimal keyword placement.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateResume}
                      disabled={isGenerating}
                      className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-indigo-900 bg-white hover:bg-indigo-50 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Tailored Resume</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default MatcherPage
