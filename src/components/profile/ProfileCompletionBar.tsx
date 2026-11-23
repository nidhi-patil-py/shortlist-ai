import React from 'react'
import type { UserProfile } from '../../types/resume'
import { Check, Circle } from 'lucide-react'

interface Props {
  profile: UserProfile
}

export const ProfileCompletionBar: React.FC<Props> = ({ profile }) => {
  const sections = [
    {
      name: 'Personal Details',
      complete: Boolean(profile.personal.fullName && profile.personal.email && profile.personal.professionalSummary),
      weight: 20,
    },
    {
      name: 'Education',
      complete: profile.education.length > 0,
      weight: 15,
    },
    {
      name: 'Skills',
      complete: profile.skills.length >= 3,
      weight: 20,
    },
    {
      name: 'Experience',
      complete: profile.experience.length > 0,
      weight: 15,
    },
    {
      name: 'Projects',
      complete: profile.projects.length > 0,
      weight: 15,
    },
    {
      name: 'Certifications',
      complete: profile.certifications.length > 0,
      weight: 10,
    },
    {
      name: 'Social Links',
      complete: Boolean(profile.personal.linkedinUrl || profile.personal.githubUrl || profile.personal.portfolioUrl),
      weight: 5,
    },
  ]

  const totalScore = sections.reduce((acc, curr) => (curr.complete ? acc + curr.weight : acc), 0)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Profile Strength
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalScore}%</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {totalScore >= 80 ? 'Excellent for ATS matching' : 'Add remaining sections to improve ATS match score'}
            </span>
          </div>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-auto bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300">
          {sections.filter((s) => s.complete).length} of {sections.length} Sections Completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            totalScore >= 80 ? 'bg-emerald-500' : totalScore >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
          }`}
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Checklist Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {sections.map((sec) => (
          <span
            key={sec.name}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              sec.complete
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {sec.complete ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Circle className="w-3 h-3 text-slate-400" />}
            <span>{sec.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default ProfileCompletionBar
