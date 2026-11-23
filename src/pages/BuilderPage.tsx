import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoModeBanner } from '../components/common/DemoModeBanner'
import { useAuth } from '../context/useAuth'
import { storageService, DEFAULT_SAMPLE_PROFILE } from '../services/storageService'
import type { ResumeData, ResumeTemplateId, UserProfile } from '../types/resume'
import { ResumeDocument } from '../components/resume/ResumeDocument'
import { TemplatePicker } from '../components/resume/TemplatePicker'
import { SectionManager } from '../components/resume/SectionManager'
import { InlineResumeEditor } from '../components/resume/InlineResumeEditor'
import { exportResumeViaPrint } from '../services/pdfExportService'
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Printer,
  ZoomIn,
  ZoomOut,
  Gauge,
} from 'lucide-react'

export const BuilderPage: React.FC = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const resumeId = searchParams.get('id')

  const [resume, setResume] = useState<ResumeData | null>(null)
  const [masterProfile, setMasterProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Mobile toggle between Editor and Live Preview
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  // Zoom scale for desktop preview
  const [zoomScale, setZoomScale] = useState<number>(100)

  // Load existing resume or create one from master profile
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!user) return
      setLoading(true)

      try {
        const prof = await storageService.getUserProfile(user.id)
        if (isMounted) setMasterProfile(prof)

        if (resumeId) {
          const existing = await storageService.getResumeById(user.id, resumeId)
          if (existing && isMounted) {
            setResume(existing)
            setLoading(false)
            return
          }
        }

        // Check if there are any existing resumes, or create a new one
        const resumes = await storageService.getResumes(user.id)
        if (!resumeId && resumes.length > 0 && isMounted) {
          setResume(resumes[0])
          setLoading(false)
          return
        }

        // Create new resume initialized with master profile
        if (isMounted) {
          const newResume: ResumeData = {
            id: `resume-${Date.now()}`,
            userId: user.id,
            title: `${prof.personal.fullName || 'Candidate'} - ATS Resume`,
            targetJobTitle: prof.personal.professionalTitle || 'Software Engineer',
            templateId: 'ats-modern',
            settings: {
              sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
              sectionVisibility: {
                summary: true,
                skills: true,
                experience: true,
                projects: true,
                education: true,
                certifications: true,
              },
              fontFamily: 'sans',
              fontSize: 'normal',
              spacing: 'normal',
            },
            personal: prof.personal || DEFAULT_SAMPLE_PROFILE.personal,
            education: prof.education || DEFAULT_SAMPLE_PROFILE.education,
            skills: prof.skills || DEFAULT_SAMPLE_PROFILE.skills,
            experience: prof.experience || DEFAULT_SAMPLE_PROFILE.experience,
            projects: prof.projects || DEFAULT_SAMPLE_PROFILE.projects,
            certifications: prof.certifications || DEFAULT_SAMPLE_PROFILE.certifications,
            atsScore: 88,
            matchedKeywords: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setResume(newResume)
        }
      } catch (err) {
        console.warn('Error loading resume builder data:', err)
        if (isMounted) setErrorMessage('Could not load resume data.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [user, resumeId])

  // Save resume
  const handleSave = async () => {
    if (!user || !resume) return
    setIsSaving(true)
    setErrorMessage(null)
    setSaveSuccess(false)

    try {
      const saved = await storageService.saveResume(user.id, resume)
      setResume(saved)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save resume.'
      setErrorMessage(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // Re-sync this resume with master profile
  const handleResyncFromProfile = () => {
    if (!masterProfile || !resume) return
    const updated: ResumeData = {
      ...resume,
      personal: { ...masterProfile.personal },
      education: [...masterProfile.education],
      skills: [...masterProfile.skills],
      experience: [...masterProfile.experience],
      projects: [...masterProfile.projects],
      certifications: [...masterProfile.certifications],
      updatedAt: new Date().toISOString(),
    }
    setResume(updated)
    setSaveSuccess(false)
  }

  // Handle template switch
  const handleTemplateChange = (templateId: ResumeTemplateId) => {
    if (!resume) return
    setResume({
      ...resume,
      templateId,
    })
  }

  // Print document using formatted PDF exporter
  const handlePrint = () => {
    if (resume) {
      exportResumeViaPrint(resume)
    } else {
      window.print()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950">
      <div className="no-print">
        <DemoModeBanner />
        <Navbar />
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        {/* Top Control Bar */}
        <div className="no-print bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {resume?.title || 'Resume Builder'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ATS Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single-column recruiter-compliant builder with real-time preview
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
            {/* ATS Score Check */}
            <Link
              to={resume ? `/ats-checker?id=${resume.id}` : '/ats-checker'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>ATS Score</span>
            </Link>

            {/* Full Preview */}
            <Link
              to={resume ? `/preview?id=${resume.id}` : '/preview'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              title="Full Screen Preview & PDF Downloads"
            >
              <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Preview</span>
            </Link>

            {/* Direct Print Preview */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Download ATS Vector PDF"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Print PDF</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !resume}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm shadow-indigo-200 dark:shadow-none active:scale-[0.98]"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="no-print p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Resume saved successfully! It is now stored and ready for ATS export.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="no-print p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm text-rose-800 dark:text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mobile View Switcher (Visible only on < lg screens) */}
        <div className="no-print lg:hidden flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'editor'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Editor & Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live ATS Preview</span>
          </button>
        </div>

        {loading || !resume ? (
          <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-16 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Preparing ATS template & resume data...</p>
          </div>
        ) : (
          /* Split Layout: Left Editor, Right Live Preview */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Editor & Controls */}
            <div
              className={`lg:col-span-5 space-y-6 ${
                mobileTab === 'editor' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* 1. Template Picker */}
              <TemplatePicker
                selectedId={resume.templateId}
                onSelect={handleTemplateChange}
              />

              {/* 2. Section Manager (Reorder & Visibility & Typography) */}
              {resume.settings && (
                <SectionManager
                  settings={resume.settings}
                  onChange={(settings) => setResume({ ...resume, settings })}
                />
              )}

              {/* 3. Inline Resume Editor */}
              <InlineResumeEditor
                resume={resume}
                onChange={(updated) => setResume(updated)}
                onResyncFromProfile={handleResyncFromProfile}
              />
            </div>

            {/* Right Column: Live A4 Resume Preview */}
            <div
              className={`lg:col-span-7 flex flex-col items-center ${
                mobileTab === 'preview' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Preview Bar with Zoom and Info */}
              <div className="no-print w-full flex items-center justify-between pb-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
                    Live Document Preview
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    A4 • ATS Pass Guarantee
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomScale(Math.max(80, zoomScale - 10))}
                    className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-10 text-center">
                    {zoomScale}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomScale(Math.min(120, zoomScale + 10))}
                    className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scalable Container */}
              <div
                className="w-full overflow-x-auto flex justify-center py-2 transition-transform duration-200 origin-top"
                style={{
                  transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined,
                }}
              >
                <ResumeDocument resume={resume} />
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}

export default BuilderPage
