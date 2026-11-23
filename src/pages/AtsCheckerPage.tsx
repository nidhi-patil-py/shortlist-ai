import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoModeBanner } from '../components/common/DemoModeBanner'
import { useAuth } from '../context/useAuth'
import { storageService } from '../services/storageService'
import type { UserProfile, ResumeData } from '../types/resume.ts'
import {
  checkResumeATS,
  ATS_DISCLAIMER,
  type ATSCheckResult,
  type ATSCheckableDocument,
} from '../services/atsChecker.ts'
import {
  Gauge,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react'

// Sample JDs for quick 1-click evaluation
const SAMPLE_JDS = [
  {
    title: 'Frontend Engineer',
    text: `We are looking for a skilled Frontend Engineer.
Responsibilities:
- Build responsive user interfaces with React, TypeScript, and Tailwind CSS.
- Integrate REST APIs and optimize web performance.
- Write unit tests and participate in code reviews.
- Collaborate with designers using Figma and work in an Agile environment.
Qualifications:
- 2+ years experience with modern JavaScript (ES6+), React, and TypeScript.
- Strong knowledge of HTML5, CSS3, and Responsive Web Design.
- Hands-on experience with Git & GitHub version control.`,
  },
  {
    title: 'Full Stack Engineer',
    text: `CloudScale is seeking a Full Stack Engineer.
Requirements:
- Strong proficiency in Node.js, Express, and PostgreSQL.
- Experience designing and consuming scalable REST APIs.
- Familiarity with Docker containerization and CI/CD pipelines (GitHub Actions).
- Comfortable working with cloud services (AWS or Google Cloud).
- Experience with Redis caching and SQL database optimization.`,
  },
]

export const AtsCheckerPage: React.FC = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [resumes, setResumes] = useState<ResumeData[]>([])
  const [selectedDocId, setSelectedDocId] = useState<string>('master')
  const [jobDescription, setJobDescription] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'suggestions' | 'breakdown' | 'keywords' | 'passed'>('suggestions')

  // Load user profile and resumes on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!user) return
      setLoading(true)
      try {
        const [userProfile, userResumes] = await Promise.all([
          storageService.getUserProfile(user.id),
          storageService.getResumes(user.id),
        ])

        if (isMounted) {
          setProfile(userProfile)
          setResumes(userResumes)

          // If URL param `id` is specified and matches a resume, pre-select it
          const queryId = searchParams.get('id')
          if (queryId && userResumes.some((r: ResumeData) => r.id === queryId)) {
            setSelectedDocId(queryId)
            const matchedResume = userResumes.find((r: ResumeData) => r.id === queryId)
            if (matchedResume?.jobDescription) {
              setJobDescription(matchedResume.jobDescription)
            }
          } else if (userResumes.length > 0 && queryId !== 'master') {
            setSelectedDocId(userResumes[0].id)
            if (userResumes[0].jobDescription) {
              setJobDescription(userResumes[0].jobDescription)
            }
          } else {
            setSelectedDocId('master')
          }
        }
      } catch (err) {
        console.warn('Failed to load data for ATS checker:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [user, searchParams])

  // Select target document to evaluate
  const activeDocument: ATSCheckableDocument | null = useMemo(() => {
    if (selectedDocId === 'master') {
      return profile
    }
    const foundResume = resumes.find((r) => r.id === selectedDocId)
    return foundResume || profile
  }, [selectedDocId, profile, resumes])

  // Run deterministic ATS engine
  const result: ATSCheckResult | null = useMemo(() => {
    if (!activeDocument) return null
    return checkResumeATS(activeDocument, jobDescription)
  }, [activeDocument, jobDescription])

  // Handle switching document selector
  const handleSelectDocument = (docId: string) => {
    setSelectedDocId(docId)
    setSearchParams(docId === 'master' ? {} : { id: docId })
    if (docId !== 'master') {
      const selectedResume = resumes.find((r) => r.id === docId)
      if (selectedResume?.jobDescription) {
        setJobDescription(selectedResume.jobDescription)
      }
    }
  }

  // Load sample JD
  const handleLoadSample = (sampleText: string) => {
    setJobDescription(sampleText)
  }

  // Determine active resume ID for direct "Fix in Builder" button
  const currentResumeId = selectedDocId !== 'master' ? selectedDocId : resumes[0]?.id

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      <DemoModeBanner />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ATS Compatibility Checker
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Transparent, rule-based audit of resume structure, keyword alignment, quantified metrics, and ATS readability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/matcher"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Job Matcher</span>
            </Link>
            {currentResumeId ? (
              <Link
                to={`/builder?id=${currentResumeId}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <span>Edit in Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Running ATS compatibility audit...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Control Bar: Document Selector + Optional Target JD */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Document Selector Dropdown */}
                <div className="lg:col-span-5 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Select Resume to Audit</span>
                  </label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => handleSelectDocument(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  >
                    <option value="master">👤 Master Candidate Profile (Baseline)</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        📄 {r.title} ({r.templateId})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedDocId === 'master'
                      ? 'Checking qualifications directly from your master profile.'
                      : 'Checking customized resume instance.'}
                  </p>
                </div>

                {/* Optional Target Job Description Input */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Target Job Description (Optional)</span>
                    </label>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {jobDescription.trim().length > 0 ? (
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">Keyword-Weighted Mode</span>
                      ) : (
                        <span>General ATS Health Mode</span>
                      )}
                    </span>
                  </div>

                  {/* Sample JD Quick Fills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      Quick fill:
                    </span>
                    {SAMPLE_JDS.map((s) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => handleLoadSample(s.text)}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        + {s.title}
                      </button>
                    ))}
                    {jobDescription && (
                      <button
                        type="button"
                        onClick={() => setJobDescription('')}
                        className="text-[10px] text-rose-500 hover:underline ml-auto"
                      >
                        Clear JD
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste a target job posting to evaluate specific keyword match ratio, or leave empty for a general ATS structure audit..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Score Overview & Category Badges */}
            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Overall Score Ring & Category Bars */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Hero Score Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Overall ATS Health Score
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          result.overallScore >= 85
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                            : result.overallScore >= 70
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80'
                            : result.overallScore >= 50
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        {result.rating}
                      </span>
                    </div>

                    {/* Circular Score Gauge */}
                    <div className="flex flex-col items-center justify-center py-2 text-center">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-36 h-36 transform -rotate-90">
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-slate-200 dark:text-slate-800"
                          />
                          <circle
                            cx="72"
                            cy="72"
                            r="60"
                            stroke={
                              result.overallScore >= 85
                                ? '#10B981'
                                : result.overallScore >= 70
                                ? '#4F46E5'
                                : result.overallScore >= 50
                                ? '#F59E0B'
                                : '#EF4444'
                            }
                            strokeWidth="10"
                            strokeDasharray={377}
                            strokeDashoffset={377 - (377 * result.overallScore) / 100}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {result.overallScore}
                          </span>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">/ 100</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 max-w-xs leading-relaxed">
                        {result.overallScore >= 85
                          ? 'Outstanding ATS readiness. Your resume follows single-column formatting, quantified impact metrics, and high keyword relevancy.'
                          : result.overallScore >= 70
                          ? 'Strong foundation with minor optimization opportunities in keyword alignment or action verbs.'
                          : 'Key ATS structural elements or measurable metrics are missing. Review the suggestions below to gain points.'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      {selectedDocId !== 'master' ? (
                        <Link
                          to={`/builder?id=${selectedDocId}`}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <span>Fix in Resume Builder</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <span>Update Master Profile</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Category Breakdown Progress Bars */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Category Breakdown</span>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">100 Points Max</span>
                    </h2>

                    <div className="space-y-4 pt-1">
                      {/* 1. Contact & Header (15 pts) */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300">Contact & Header Completeness</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {result.categories.contact.score} / {result.categories.contact.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${result.categories.contact.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. Section Structure (20 pts) */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300">Section Structure & Headings</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {result.categories.structure.score} / {result.categories.structure.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${result.categories.structure.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. Keyword Alignment (35 pts) */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300">
                            {result.isJobSpecific ? 'Job Description Alignment' : 'Industry Keyword Density'}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {result.categories.keywords.score} / {result.categories.keywords.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${result.categories.keywords.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* 4. Action Verbs & Impact (20 pts) */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300">Action Verbs & Measurable Metrics</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {result.categories.impact.score} / {result.categories.impact.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${result.categories.impact.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* 5. Readability & Length (10 pts) */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300">Readability & Bullet Length</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {result.categories.readability.score} / {result.categories.readability.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${result.categories.readability.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Diagnostic Tabs */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl px-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('suggestions')}
                      className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'suggestions'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Improvements ({result.actionableSuggestions.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('keywords')}
                      className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'keywords'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      <span>Keywords & Verbs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('breakdown')}
                      className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'breakdown'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Category Audits</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('passed')}
                      className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                        activeTab === 'passed'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Passed ({result.passedChecks.length})</span>
                    </button>
                  </div>

                  {/* Tab 1: Actionable Suggestions */}
                  {activeTab === 'suggestions' && (
                    <div className="bg-white dark:bg-slate-900 rounded-b-2xl -mt-6 p-6 border border-t-0 border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Prioritized Fixes to Increase Score
                        </h2>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {result.actionableSuggestions.length} items to address
                        </span>
                      </div>

                      {result.actionableSuggestions.length === 0 ? (
                        <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Zero Critical Issues Found!</h3>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-sm mx-auto">
                            Your resume meets all top-tier ATS criteria including standard formatting, quantified metrics, and keywords.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {result.actionableSuggestions.map((item) => (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                                item.priority === 'high'
                                  ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                                  : item.priority === 'medium'
                                  ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                      item.priority === 'high'
                                        ? 'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200'
                                        : item.priority === 'medium'
                                        ? 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {item.priority} priority
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    {item.category}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                                  {item.text}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-400 shadow-2xs">
                                  +{item.pointsToGain} pts
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Keywords & Action Verbs */}
                  {activeTab === 'keywords' && (
                    <div className="bg-white dark:bg-slate-900 rounded-b-2xl -mt-6 p-6 border border-t-0 border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                      {/* Matched Keywords */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Matched Keywords ({result.matchedKeywords.length})</span>
                          </h2>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-800/60">
                            Verified in Profile
                          </span>
                        </div>

                        {result.matchedKeywords.length === 0 ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            No direct keywords matched from the target job description. Paste a target JD to see explicit matches.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {result.matchedKeywords.map((kw) => (
                              <span
                                key={kw}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60"
                              >
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                                <span>{kw}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Missing Keywords / Gaps */}
                      {result.isJobSpecific && (
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>Missing Keywords in Posting ({result.missingKeywords.length})</span>
                            </h2>
                            <span className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-bold border border-amber-200 dark:border-amber-800/60">
                              Skills Gap
                            </span>
                          </div>

                          {result.missingKeywords.length === 0 ? (
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                              ✓ Your resume covers every canonical keyword extracted from the job posting!
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {result.missingKeywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60"
                                >
                                  <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                                  <span>{kw}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            *Note: If you have genuine background in these skills, add them in the builder. ResumeFit will <strong>never invent them</strong>.
                          </p>
                        </div>
                      )}

                      {/* Strong Action Verbs Found */}
                      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Action Verbs Found in Bullets ({result.actionVerbsFound.length})</span>
                          </h2>
                          <span className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded font-bold border border-indigo-200 dark:border-indigo-800/80">
                            Impact Drivers
                          </span>
                        </div>

                        {result.actionVerbsFound.length === 0 ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            No recognized power action verbs detected at start of bullets.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {result.actionVerbsFound.map((verb) => (
                              <span
                                key={verb}
                                className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                              >
                                {verb}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Measurable Metrics Count */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Bullets with Quantifiable Metrics (%, $, numbers):
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                          {result.metricsCount} bullets detected
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Category Audits Detail */}
                  {activeTab === 'breakdown' && (
                    <div className="bg-white dark:bg-slate-900 rounded-b-2xl -mt-6 p-6 border border-t-0 border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                      {Object.values(result.categories).map((cat) => (
                        <div key={cat.category} className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                              {cat.label}
                            </h2>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {cat.score} / {cat.maxScore} pts ({cat.percentage}%)
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {cat.passedItems.map((item) => (
                              <div key={item} className="flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                                <span>{item}</span>
                              </div>
                            ))}
                            {cat.failedItems.map((item) => (
                              <div key={item} className="flex items-start gap-2 text-xs text-rose-700 dark:text-rose-400">
                                <span className="text-rose-500 font-bold shrink-0">✗</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: All Passed Checks */}
                  {activeTab === 'passed' && (
                    <div className="bg-white dark:bg-slate-900 rounded-b-2xl -mt-6 p-6 border border-t-0 border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Verified Best Practices
                        </h2>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {result.passedChecks.length} Passed
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {result.passedChecks.map((item) => (
                          <div
                            key={item}
                            className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-2 text-xs text-emerald-900 dark:text-emerald-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="font-medium leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transparent Disclaimer Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>Transparent ATS Compatibility Policy</span>
                  <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </span>
                <p className="leading-relaxed">
                  {ATS_DISCLAIMER}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default AtsCheckerPage
