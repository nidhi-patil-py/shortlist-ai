import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoModeBanner } from '../components/common/DemoModeBanner'
import { useAuth } from '../context/useAuth'
import { storageService, DEFAULT_SAMPLE_PROFILE } from '../services/storageService'
import type { ResumeData, UserProfile } from '../types/resume'
import {
  Plus,
  FileText,
  User,
  Target,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye,
  ShieldCheck,
  Sparkles,
  Gauge,
  Printer,
} from 'lucide-react'
import { exportResumeViaPrint } from '../services/pdfExportService'
import { PWAInstallPrompt } from '../components/common/PWAInstallPrompt'

export const DashboardPage: React.FC = () => {
  const { user, isDemoMode, isSupabaseConfigured } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [resumes, setResumes] = useState<ResumeData[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!user) return
      setLoading(true)

      try {
        const [prof, userResumes] = await Promise.all([
          storageService.getUserProfile(user.id),
          storageService.getResumes(user.id),
        ])

        if (isMounted) {
          setProfile(prof)
          setResumes(userResumes)
        }
      } catch (err) {
        console.warn('Error loading dashboard data:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [user])

  // Calculate profile completion percentage
  const calculateProfileCompletion = (p: UserProfile | null): number => {
    if (!p) return 0
    let points = 0
    if (p.personal.fullName && p.personal.email) points += 20
    if (p.personal.professionalSummary) points += 20
    if (p.skills && p.skills.length >= 3) points += 20
    if (p.education && p.education.length >= 1) points += 20
    if ((p.experience && p.experience.length >= 1) || (p.projects && p.projects.length >= 1)) points += 20
    return points
  }

  const completionPct = calculateProfileCompletion(profile)

  const handleDeleteResume = async (id: string) => {
    if (!user) return
    await storageService.deleteResume(user.id, id)
    setResumes((prev) => prev.filter((r) => r.id !== id))
    setDeleteConfirmId(null)
  }

  // Seed default sample resume if user has none
  const handleCreateSampleResume = async () => {
    if (!user) return
    const sampleResume: ResumeData = {
      id: `resume-${Date.now()}`,
      userId: user.id,
      title: 'Frontend React Engineer Resume',
      targetJobTitle: 'Frontend Engineer',
      jobDescription: 'Seeking React Developer with TypeScript, Tailwind CSS, and REST API experience.',
      templateId: 'ats-classic',
      personal: profile?.personal || DEFAULT_SAMPLE_PROFILE.personal,
      education: profile?.education || DEFAULT_SAMPLE_PROFILE.education,
      skills: profile?.skills || DEFAULT_SAMPLE_PROFILE.skills,
      experience: profile?.experience || DEFAULT_SAMPLE_PROFILE.experience,
      projects: profile?.projects || DEFAULT_SAMPLE_PROFILE.projects,
      certifications: profile?.certifications || DEFAULT_SAMPLE_PROFILE.certifications,
      atsScore: 92,
      matchedKeywords: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const saved = await storageService.saveResume(user.id, sampleResume)
    setResumes((prev) => [saved, ...prev])
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <DemoModeBanner />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.fullName || 'Job Seeker'}!
              </h1>
              {isDemoMode && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Demo
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Account: <span className="font-mono text-slate-800">{user?.email}</span> • Data isolation: active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Edit Master Profile</span>
            </Link>
            <Link
              to="/matcher"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </Link>
          </div>
        </div>

        {/* PWA Install Banner */}
        <PWAInstallPrompt variant="banner" />

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Completeness
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{completionPct}%</span>
                <span className="text-xs text-slate-500">
                  {completionPct === 100 ? 'Ready for matching' : 'Complete remaining fields'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/profile" className="text-indigo-600 font-semibold hover:underline">
                View Profile Details →
              </Link>
            </div>
          </div>

          {/* Resumes Count Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Tailored Resumes
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">{resumes.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                Customized for specific job openings
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/matcher" className="text-indigo-600 font-semibold hover:underline">
                Match New Job Description →
              </Link>
            </div>
          </div>

          {/* Storage Mode & Security Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Data Security
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {isSupabaseConfigured ? 'Supabase RLS Enabled' : 'Isolated Local Storage'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isSupabaseConfigured
                  ? 'All records isolated by user_id in PostgreSQL.'
                  : 'Operating in isolated sandbox on your local device.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Single Column ATS Safe</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        {/* Saved Resumes List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Tailored Resumes</h2>
              <p className="text-xs text-slate-600">
                Resumes generated from your master profile aligned with job requirements
              </p>
            </div>
            {resumes.length === 0 && (
              <button
                type="button"
                onClick={handleCreateSampleResume}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Match</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Resumes Yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Paste any job description to match your skills, prioritize relevant projects, and generate an ATS-optimized resume.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/matcher"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  Match Your First Job
                </Link>
                <button
                  type="button"
                  onClick={handleCreateSampleResume}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Create Demo Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {resume.templateId.replace('-', ' ').toUpperCase()}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                          {resume.title}
                        </h3>
                      </div>
                      {resume.atsScore !== undefined && (
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {resume.atsScore}
                            <span className="text-[10px] text-slate-400 font-normal">/100</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Target Job Title */}
                    <p className="text-xs text-slate-600 font-medium mb-3 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target: {resume.targetJobTitle || 'General Application'}</span>
                    </p>

                    {/* Matched Keywords Tags */}
                    {resume.matchedKeywords && resume.matchedKeywords.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Matched Keywords:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {resume.matchedKeywords.slice(0, 4).map((kw) => (
                            <span
                              key={kw}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                            >
                              {kw}
                            </span>
                          ))}
                          {resume.matchedKeywords.length > 4 && (
                            <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5">
                              +{resume.matchedKeywords.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/ats-checker?id=${resume.id}`}
                        title="Check ATS Compatibility"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Gauge className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/preview?id=${resume.id}`}
                        title="Preview & Full PDF Options"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => exportResumeViaPrint(resume)}
                        title="Instant Download ATS PDF"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/builder?id=${resume.id}`}
                        title="Edit Resume"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(resume.id)}
                        title="Delete Resume"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Workflow Navigation Card */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-indigo-950">
              Ready to target another position?
            </h3>
            <p className="text-xs text-indigo-800">
              Your master profile remains untouched while you generate tailored copies for every specific job opening.
            </p>
          </div>
          <Link
            to="/matcher"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Open Job Matcher
          </Link>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Delete Resume</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteResume(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default DashboardPage
