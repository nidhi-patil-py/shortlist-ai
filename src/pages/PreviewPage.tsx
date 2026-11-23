import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { storageService, DEFAULT_SAMPLE_PROFILE } from '../services/storageService'
import type { ResumeData, ResumeTemplateId } from '../types/resume'
import { ResumeDocument } from '../components/resume/ResumeDocument'
import {
  exportResumeViaPrint,
  shareOrDownloadPDF,
  type PaperSize,
} from '../services/pdfExportService'
import {
  ArrowLeft,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut,
  Edit3,
  Gauge,
  CheckCircle2,
  FileText,
} from 'lucide-react'

const STATIC_FALLBACK_TIME = '2026-01-01T00:00:00.000Z'

export const PreviewPage: React.FC = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [resumes, setResumes] = useState<ResumeData[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [paperSize, setPaperSize] = useState<PaperSize>('a4')
  const [templateIdOverride, setTemplateIdOverride] = useState<ResumeTemplateId | null>(null)
  const [zoom, setZoom] = useState<number>(100)
  const [loading, setLoading] = useState(true)
  const [isExportingDirect, setIsExportingDirect] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Load user resumes on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!user) return
      setLoading(true)
      try {
        const userResumes = await storageService.getResumes(user.id)
        if (isMounted) {
          setResumes(userResumes)

          const queryId = searchParams.get('id')
          if (queryId && userResumes.some((r) => r.id === queryId)) {
            setSelectedResumeId(queryId)
          } else if (userResumes.length > 0) {
            setSelectedResumeId(userResumes[0].id)
          }
        }
      } catch (err) {
        console.warn('Failed to load resumes for preview:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [user, searchParams])

  // Get active resume or fallback seed
  const activeResume: ResumeData = useMemo(() => {
    const found = resumes.find((r) => r.id === selectedResumeId)
    if (found) {
      return templateIdOverride ? { ...found, templateId: templateIdOverride } : found
    }

    // Fallback seed preview if no resume exists yet
    const fallback: ResumeData = {
      id: 'demo-sample-resume',
      title: 'Software Engineer Resume',
      targetJobTitle: 'Full Stack Engineer',
      templateId: templateIdOverride || 'ats-modern',
      personal: DEFAULT_SAMPLE_PROFILE.personal,
      education: DEFAULT_SAMPLE_PROFILE.education,
      skills: DEFAULT_SAMPLE_PROFILE.skills,
      experience: DEFAULT_SAMPLE_PROFILE.experience,
      projects: DEFAULT_SAMPLE_PROFILE.projects,
      certifications: DEFAULT_SAMPLE_PROFILE.certifications,
      atsScore: 94,
      matchedKeywords: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL'],
      createdAt: STATIC_FALLBACK_TIME,
      updatedAt: STATIC_FALLBACK_TIME,
    }
    return fallback
  }, [resumes, selectedResumeId, templateIdOverride])

  // Handle switching selected resume
  const handleSelectResume = (id: string) => {
    setSelectedResumeId(id)
    setSearchParams({ id })
    setTemplateIdOverride(null)
  }

  // Handle native vector print export (Primary ATS path)
  const handlePrintExport = () => {
    exportResumeViaPrint(activeResume, paperSize)
  }

  // Handle direct file download / mobile share (Programmatic jsPDF path)
  const handleDirectDownload = async () => {
    setIsExportingDirect(true)
    try {
      await shareOrDownloadPDF(activeResume, paperSize)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 4000)
    } catch (err) {
      console.error('Direct PDF export error:', err)
    } finally {
      setIsExportingDirect(false)
    }
  }

  // Zoom helpers
  const handleZoomIn = () => setZoom((prev) => Math.min(150, prev + 10))
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 10))
  const handleZoomReset = () => setZoom(100)

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Floating Control Toolbar (STRICTLY HIDDEN DURING PRINTING) */}
      <header className="no-print sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            {/* Left: Navigation & Resume Switcher */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {resumes.length > 1 && (
                <div className="relative">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => handleSelectResume(e.target.value)}
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs max-w-[180px] sm:max-w-[240px] truncate"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Center: Formatting & Zoom Controls */}
            <div className="flex items-center gap-2">
              {/* Template Switcher */}
              <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setTemplateIdOverride('ats-modern')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeResume.templateId === 'ats-modern'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Modern
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateIdOverride('ats-classic')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeResume.templateId === 'ats-classic'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Classic
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateIdOverride('ats-compact')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    activeResume.templateId === 'ats-compact'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Compact
                </button>
              </div>

              {/* Paper Size Selector (A4 vs Letter) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    paperSize === 'a4'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="A4 Paper (210 x 297 mm)"
                >
                  A4
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('letter')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    paperSize === 'letter'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="US Letter Paper (8.5 x 11 in)"
                >
                  Letter
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-40"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  className="px-1.5 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300"
                  title="Reset to 100%"
                >
                  {zoom}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 150}
                  className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-40"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Actions (ATS Check, Edit in Builder, Print/Download) */}
            <div className="flex items-center gap-2">
              <Link
                to={`/ats-checker?id=${activeResume.id}`}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
                title="Audit ATS Compatibility Score"
              >
                <Gauge className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Score: {activeResume.atsScore || 90}%</span>
              </Link>

              <Link
                to={`/builder?id=${activeResume.id}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
                title="Edit Resume Details in Builder"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Edit</span>
              </Link>

              {/* Direct File Download / Mobile Share */}
              <button
                type="button"
                onClick={handleDirectDownload}
                disabled={isExportingDirect}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors disabled:opacity-50"
                title="Direct PDF download or mobile device share"
              >
                {isExportingDirect ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span className="hidden sm:inline">Direct PDF</span>
                  </>
                )}
              </button>

              {/* Primary Native Print Vector PDF Export */}
              <button
                type="button"
                onClick={handlePrintExport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
                title="Download 100% Vector Text ATS-Compliant PDF"
              >
                <Printer className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {exportSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-t border-emerald-200 dark:border-emerald-800 px-4 py-2 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>PDF file generated and ready. Selectable vector text format applied!</span>
          </div>
        )}
      </header>

      {/* Main Preview Container */}
      <main className="flex-grow py-8 sm:py-12 px-2 sm:px-6 flex flex-col items-center justify-start overflow-auto">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 border border-slate-200 dark:border-slate-800 text-center space-y-3 mt-12 shadow-xs">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Preparing document preview...</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Context Badge (Hidden in print) */}
            <div className="no-print mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{activeResume.title}</span>
              </span>
              <span>•</span>
              <span className="font-mono uppercase bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 font-bold">
                {paperSize.toUpperCase()} FORMAT
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Selectable ATS Vector Text</span>
              </span>
            </div>

            {/* Document Scale Container */}
            <div
              className="w-full flex justify-center transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <div
                className={`w-full bg-white shadow-xl rounded-sm border border-slate-200 dark:border-slate-700 transition-all ${
                  paperSize === 'letter' ? 'max-w-[816px]' : 'max-w-[794px]'
                }`}
              >
                <ResumeDocument resume={activeResume} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PreviewPage
