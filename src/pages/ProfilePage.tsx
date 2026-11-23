import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoModeBanner } from '../components/common/DemoModeBanner'
import { useAuth } from '../context/useAuth'
import { storageService, DEFAULT_SAMPLE_PROFILE, createEmptyProfile } from '../services/storageService'
import type { UserProfile } from '../types/resume'
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

      <Footer />
    </div>
  )
}

export default ProfilePage
