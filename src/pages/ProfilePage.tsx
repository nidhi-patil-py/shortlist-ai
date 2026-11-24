import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoModeBanner } from '../components/common/DemoModeBanner'
import { useAuth } from '../context/useAuth'
import { storageService, DEFAULT_SAMPLE_PROFILE, createEmptyProfile } from '../services/storageService'
import type { UserProfile } from '../types/resume'
import type { ExtractedProfileData } from '../services/profileImporter'
import { ProfileCompletionBar } from '../components/profile/ProfileCompletionBar'
import { PersonalSection } from '../components/profile/PersonalSection'
import { EducationSection } from '../components/profile/EducationSection'
import { SkillsSection } from '../components/profile/SkillsSection'
import { ExperienceSection } from '../components/profile/ExperienceSection'
import { ProjectsSection } from '../components/profile/ProjectsSection'
import { CertificationsSection } from '../components/profile/CertificationsSection'
import { SocialLinksSection } from '../components/profile/SocialLinksSection'
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  User,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderGit2,
  Award,
  Globe,
  FileUp,
  X,
  Check,
} from 'lucide-react'

type SectionTab = 'all' | 'personal' | 'education' | 'skills' | 'experience' | 'projects' | 'certifications' | 'links'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<SectionTab>('all')
  const [confirmModal, setConfirmModal] = useState<'sample' | 'clear' | null>(null)

  // PDF Importer states
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedProfileData | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  // Load profile on mount
  useEffect(() => {
    let isMounted = true

    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const data = await storageService.getUserProfile(user.id)
        if (isMounted) {
          setProfile(data)
        }
      } catch (err) {
        console.warn('Failed to load profile:', err)
        if (isMounted) {
          setErrorMessage('Could not load profile. Using local defaults.')
          setProfile(createEmptyProfile(user.id, user.email))
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [user])

  // Save profile to storageService
  const handleSave = async () => {
    if (!user || !profile) return

    setIsSaving(true)
    setErrorMessage(null)
    setSaveSuccess(false)

    try {
      await storageService.saveUserProfile(user.id, profile)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile changes.'
      setErrorMessage(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Load Sample Data
  const handleLoadSample = () => {
    if (!user) return
    const sample = {
      ...DEFAULT_SAMPLE_PROFILE,
      userId: user.id,
      personal: {
        ...DEFAULT_SAMPLE_PROFILE.personal,
        email: user.email || DEFAULT_SAMPLE_PROFILE.personal.email,
        fullName: user.fullName || DEFAULT_SAMPLE_PROFILE.personal.fullName,
      },
    }
    setProfile(sample)
    setConfirmModal(null)
    setSaveSuccess(false)
  }

  // Handle Clear Profile
  const handleClearProfile = () => {
    if (!user) return
    setProfile(createEmptyProfile(user.id, user.email))
    setConfirmModal(null)
    setSaveSuccess(false)
  }

  // Handle PDF / Resume / LinkedIn Profile Import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsExtracting(true)
    setErrorMessage(null)

    try {
      // Dynamic import ensures initial bundle remains lean (< 150 kB)
      const { extractProfileFromFile } = await import('../services/profileImporter')
      const extracted = await extractProfileFromFile(file)
      setExtractedData(extracted)
      setIsVerified(false)
      setShowImportModal(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to extract text from file.'
      setErrorMessage(msg)
    } finally {
      setIsExtracting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Confirm and apply verified extracted profile data
  const handleConfirmImport = async () => {
    if (!user || !profile || !extractedData || !isVerified) return

    const updatedProfile: UserProfile = {
      ...profile,
      personal: {
        ...profile.personal,
        fullName: extractedData.fullName || profile.personal.fullName,
        email: extractedData.email || profile.personal.email,
        phone: extractedData.phone || profile.personal.phone,
        location: extractedData.location || profile.personal.location,
        professionalTitle: extractedData.professionalTitle || profile.personal.professionalTitle,
        professionalSummary: extractedData.professionalSummary || profile.personal.professionalSummary,
        linkedinUrl: extractedData.linkedinUrl || profile.personal.linkedinUrl,
        githubUrl: extractedData.githubUrl || profile.personal.githubUrl,
      },
      skills: [
        ...profile.skills,
        ...extractedData.skills.filter(
          (newS) => !profile.skills.some((s) => s.name.toLowerCase() === newS.name.toLowerCase())
        ),
      ],
      experience: extractedData.experience.length > 0 ? [...extractedData.experience, ...profile.experience] : profile.experience,
      education: extractedData.education.length > 0 ? [...extractedData.education, ...profile.education] : profile.education,
      updatedAt: new Date().toISOString(),
    }

    try {
      await storageService.saveUserProfile(user.id, updatedProfile)
      setProfile(updatedProfile)
      setShowImportModal(false)
      setExtractedData(null)
      setIsVerified(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    } catch (err) {
      console.error('Failed to persist imported profile:', err)
      setProfile(updatedProfile)
      setShowImportModal(false)
      setExtractedData(null)
      setIsVerified(false)
    }
  }

  const tabs = [
    { id: 'all' as SectionTab, label: 'All Sections', icon: User },
    { id: 'personal' as SectionTab, label: 'Personal', icon: User },
    { id: 'education' as SectionTab, label: 'Education', icon: GraduationCap },
    { id: 'skills' as SectionTab, label: 'Skills', icon: Wrench },
    { id: 'experience' as SectionTab, label: 'Experience', icon: Briefcase },
    { id: 'projects' as SectionTab, label: 'Projects', icon: FolderGit2 },
    { id: 'certifications' as SectionTab, label: 'Certifications', icon: Award },
    { id: 'links' as SectionTab, label: 'Links', icon: Globe },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      <DemoModeBanner />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-6">
        {/* Sticky Action Bar */}
        <div className="sticky top-20 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Master Candidate Profile
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create once, use everywhere for customized ATS resumes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Smart Import Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs disabled:opacity-50"
              title="Import LinkedIn Profile PDF or Current Resume PDF"
            >
              {isExtracting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Reading PDF...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Import LinkedIn / Resume PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setConfirmModal('sample')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Load Sample Profile</span>
              <span className="sm:hidden">Sample</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmModal('clear')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !profile}
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
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Profile saved successfully! Your updates are persisted for instant ATS matching.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs sm:text-sm text-rose-800 dark:text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading || !profile ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading your profile data...</p>
          </div>
        ) : (
          <>
            {/* Dynamic Completion Score */}
            <ProfileCompletionBar profile={profile} />

            {/* Navigation Tabs / Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {tabs.map((t) => {
                const Icon = t.icon
                const isActive = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Profile Sections */}
            <div className="space-y-8">
              {(activeTab === 'all' || activeTab === 'personal') && (
                <PersonalSection
                  data={profile.personal}
                  onChange={(personal) => setProfile({ ...profile, personal })}
                />
              )}

              {(activeTab === 'all' || activeTab === 'education') && (
                <EducationSection
                  items={profile.education}
                  onChange={(education) => setProfile({ ...profile, education })}
                />
              )}

              {(activeTab === 'all' || activeTab === 'skills') && (
                <SkillsSection
                  skills={profile.skills}
                  onChange={(skills) => setProfile({ ...profile, skills })}
                />
              )}

              {(activeTab === 'all' || activeTab === 'experience') && (
                <ExperienceSection
                  items={profile.experience}
                  onChange={(experience) => setProfile({ ...profile, experience })}
                />
              )}

              {(activeTab === 'all' || activeTab === 'projects') && (
                <ProjectsSection
                  items={profile.projects}
                  onChange={(projects) => setProfile({ ...profile, projects })}
                />
              )}

              {(activeTab === 'all' || activeTab === 'certifications') && (
                <CertificationsSection
                  items={profile.certifications}
                  onChange={(certifications) => setProfile({ ...profile, certifications })}
                />
              )}

              {(activeTab === 'all' || activeTab === 'links') && (
                <SocialLinksSection
                  data={profile.personal}
                  onChange={(personal) => setProfile({ ...profile, personal })}
                />
              )}
            </div>

            {/* Bottom Save Reminder */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Finished editing your details?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Save your profile so the job description matcher can prioritize these qualifications.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Now</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Confirmation Modals */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {confirmModal === 'sample' ? 'Load Realistic Sample Profile?' : 'Reset Profile Data?'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {confirmModal === 'sample'
                ? 'This will populate your profile with sample education, skills, projects, and work history (ideal for testing ATS matching immediately). You can edit or clear them at any time.'
                : 'This will reset all education, skills, experience, and project entries back to blank. Are you sure you want to proceed?'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal === 'sample' ? handleLoadSample : handleClearProfile}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors ${
                  confirmModal === 'sample' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {confirmModal === 'sample' ? 'Load Sample Data' : 'Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review & Verify Extracted Info Modal */}
      {showImportModal && extractedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Review & Verify Extracted Info
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verify extracted fields before applying to your Master Profile (Zero Hallucination)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-grow text-xs sm:text-sm">
              {/* Contact / Header Preview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  1. Candidate & Contact Info
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Full Name</label>
                    <input
                      type="text"
                      value={extractedData.fullName}
                      onChange={(e) => setExtractedData({ ...extractedData, fullName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      placeholder="Candidate Name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Professional Title</label>
                    <input
                      type="text"
                      value={extractedData.professionalTitle}
                      onChange={(e) => setExtractedData({ ...extractedData, professionalTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Email</label>
                    <input
                      type="email"
                      value={extractedData.email}
                      onChange={(e) => setExtractedData({ ...extractedData, email: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Phone / Location</label>
                    <input
                      type="text"
                      value={extractedData.phone || extractedData.location}
                      onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              {extractedData.professionalSummary && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    2. Professional Summary
                  </span>
                  <textarea
                    rows={3}
                    value={extractedData.professionalSummary}
                    onChange={(e) => setExtractedData({ ...extractedData, professionalSummary: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed"
                  />
                </div>
              )}

              {/* Skills */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    3. Detected Verified Skills ({extractedData.skills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {extractedData.skills.map((skill, sIdx) => (
                    <span
                      key={skill.id || sIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = extractedData.skills.filter((_, i) => i !== sIdx)
                          setExtractedData({ ...extractedData, skills: updated })
                        }}
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {extractedData.skills.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No direct skill keywords detected in text.</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              {extractedData.experience.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    4. Detected Work Experience ({extractedData.experience.length} roles)
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {extractedData.experience.map((exp, eIdx) => (
                      <div key={exp.id || eIdx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{exp.jobTitle} - {exp.company}</span>
                          <span className="text-[10px] font-normal text-slate-500">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        {exp.responsibilities.length > 0 && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            • {exp.responsibilities[0]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {extractedData.education.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    5. Detected Education ({extractedData.education.length} entries)
                  </span>
                  <div className="space-y-2">
                    {extractedData.education.map((edu, edIdx) => (
                      <div key={edu.id || edIdx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">{edu.degree}</div>
                        <div className="text-slate-600 dark:text-slate-400">{edu.institution} ({edu.startDate} — {edu.endDate})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explicit Mandatory Verification Checkbox */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      I confirm these qualifications and dates are accurate
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Strict zero-hallucination verification: confirming your imported details reflect your authentic career history.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={!isVerified}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
              >
                <Check className="w-4 h-4" />
                <span>Save to Master Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ProfilePage
