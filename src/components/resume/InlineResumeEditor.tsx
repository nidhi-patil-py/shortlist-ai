import React, { useState } from 'react'
import type { ResumeData } from '../../types/resume'
import { Edit3, User, Briefcase, FolderGit2, Wrench, GraduationCap, RefreshCw } from 'lucide-react'

interface Props {
  resume: ResumeData
  onChange: (updated: ResumeData) => void
  onResyncFromProfile: () => void
}

type EditorTab = 'meta' | 'summary' | 'experience' | 'projects' | 'skills' | 'education'

export const InlineResumeEditor: React.FC<Props> = ({ resume, onChange, onResyncFromProfile }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('meta')

  const handleUpdatePersonal = (field: string, value: string) => {
    onChange({
      ...resume,
      personal: {
        ...resume.personal,
        [field]: value,
      },
    })
  }

  const handleUpdateTitle = (title: string) => {
    onChange({ ...resume, title })
  }

  const handleUpdateTargetJob = (targetJobTitle: string) => {
    onChange({ ...resume, targetJobTitle })
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header with Resync Option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Customize This Resume
          </h3>
        </div>
        <button
          type="button"
          onClick={onResyncFromProfile}
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold self-start sm:self-auto hover:underline"
          title="Pull fresh data from your Master Profile"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-sync from Master Profile</span>
        </button>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800">
        {[
          { id: 'meta' as EditorTab, label: 'Resume Info', icon: Edit3 },
          { id: 'summary' as EditorTab, label: 'Summary', icon: User },
          { id: 'experience' as EditorTab, label: 'Experience', icon: Briefcase },
          { id: 'projects' as EditorTab, label: 'Projects', icon: FolderGit2 },
          { id: 'skills' as EditorTab, label: 'Skills', icon: Wrench },
          { id: 'education' as EditorTab, label: 'Education', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Meta Information */}
      {activeTab === 'meta' && (
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Resume Document Title (For Your Dashboard)
            </label>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => handleUpdateTitle(e.target.value)}
              placeholder="e.g. React Engineer - Google"
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Position / Job Title
            </label>
            <input
              type="text"
              value={resume.targetJobTitle || ''}
              onChange={(e) => handleUpdateTargetJob(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Job Description Snippet (Optional reference)
            </label>
            <textarea
              rows={2}
              value={resume.jobDescription || ''}
              onChange={(e) => onChange({ ...resume, jobDescription: e.target.value })}
              placeholder="Paste job posting snippet or responsibilities to keep context handy..."
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Professional Summary & Contact */}
      {activeTab === 'summary' && (
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Professional Title Override
            </label>
            <input
              type="text"
              value={resume.personal.professionalTitle || ''}
              onChange={(e) => handleUpdatePersonal('professionalTitle', e.target.value)}
              placeholder="e.g. Full Stack React & Node Developer"
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Tailored Professional Summary
            </label>
            <textarea
              rows={4}
              value={resume.personal.professionalSummary || ''}
              onChange={(e) => handleUpdatePersonal('professionalSummary', e.target.value)}
              placeholder="Tailor your summary specifically towards the target company requirements..."
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Experience items */}
      {activeTab === 'experience' && (
        <div className="space-y-3 pt-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailor responsibilities or bullet order specifically for this application:
          </p>
          {resume.experience.map((exp, idx) => (
            <div key={exp.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {exp.jobTitle} - {exp.company}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="space-y-1">
                {exp.responsibilities.map((bullet, bIdx) => (
                  <input
                    key={bIdx}
                    type="text"
                    value={bullet}
                    onChange={(e) => {
                      const updated = [...resume.experience]
                      updated[idx].responsibilities[bIdx] = e.target.value
                      onChange({ ...resume, experience: updated })
                    }}
                    className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-3 pt-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit descriptions or technology keywords for your projects on this resume:
          </p>
          {resume.projects.map((proj, idx) => (
            <div key={proj.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{proj.name}</span>
              <textarea
                rows={2}
                value={proj.description}
                onChange={(e) => {
                  const updated = [...resume.projects]
                  updated[idx].description = e.target.value
                  onChange({ ...resume, projects: updated })
                }}
                className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg leading-relaxed text-slate-900 dark:text-slate-100"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-2 pt-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Skills included on this resume ({resume.skills.length} skills):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {resume.skills.map((s, idx) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <span>{s.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    const filtered = resume.skills.filter((_, i) => i !== idx)
                    onChange({ ...resume, skills: filtered })
                  }}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Education */}
      {activeTab === 'education' && (
        <div className="space-y-2 pt-1">
          {resume.education.map((edu) => (
            <div key={edu.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100">{edu.degree}</div>
              <div className="text-slate-600 dark:text-slate-400">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InlineResumeEditor
