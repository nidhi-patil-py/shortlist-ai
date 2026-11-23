import React, { useState } from 'react'
import type { SkillItem } from '../../types/resume'
import { Wrench, Plus, X, Sparkles } from 'lucide-react'

interface Props {
  skills: SkillItem[]
  onChange: (updated: SkillItem[]) => void
}

const COMMON_SUGGESTIONS = [
  { name: 'JavaScript (ES6+)', category: 'technical' as const },
  { name: 'TypeScript', category: 'technical' as const },
  { name: 'React', category: 'technical' as const },
  { name: 'Python', category: 'technical' as const },
  { name: 'Tailwind CSS', category: 'technical' as const },
  { name: 'REST APIs', category: 'technical' as const },
  { name: 'Node.js', category: 'technical' as const },
  { name: 'SQL', category: 'technical' as const },
  { name: 'Git & GitHub', category: 'tools' as const },
  { name: 'Docker', category: 'tools' as const },
  { name: 'Agile & Scrum', category: 'soft' as const },
  { name: 'Cross-functional Communication', category: 'soft' as const },
]

export const SkillsSection: React.FC<Props> = ({ skills, onChange }) => {
  const [skillName, setSkillName] = useState('')
  const [category, setCategory] = useState<'technical' | 'soft' | 'tools'>('technical')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleAddSkill = (nameToAdd?: string, catToAdd?: 'technical' | 'soft' | 'tools') => {
    const targetName = (nameToAdd || skillName).trim()
    const targetCat = catToAdd || category

    if (!targetName) return

    // Check duplicate
    if (skills.some((s) => s.name.toLowerCase() === targetName.toLowerCase())) {
      setErrorMsg(`Skill "${targetName}" is already in your profile.`)
      return
    }

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: targetName,
      category: targetCat,
      level,
    }

    onChange([...skills, newSkill])
    setSkillName('')
    setErrorMsg(null)
  }

  const handleRemoveSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id))
  }

  const technicalSkills = skills.filter((s) => s.category === 'technical')
  const softSkills = skills.filter((s) => s.category === 'soft')
  const toolSkills = skills.filter((s) => s.category === 'tools')

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-indigo-600" />
          <span>Skills & Competencies</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Add your genuine technical skills, tools, and soft skills. ATS algorithms match job keywords directly against these.
        </p>
      </div>

      {/* Add Skill Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Add New Skill
          </span>
          <span className="text-[11px] text-slate-500">Total: {skills.length} skills listed</span>
        </div>

        {errorMsg && (
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              value={skillName}
              onChange={(e) => {
                setSkillName(e.target.value)
                setErrorMsg(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
              placeholder="e.g. React.js, Python, PostgreSQL..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'technical' | 'soft' | 'tools')}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
            >
              <option value="technical">Technical Skill</option>
              <option value="tools">Tool & Platform</option>
              <option value="soft">Soft Skill</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
            >
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="beginner">Beginner</option>
            </select>
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shrink-0 shadow-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="pt-2 border-t border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Popular Suggestions (Click to add if applicable):</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SUGGESTIONS.filter((s) => !skills.some((existing) => existing.name.toLowerCase() === s.name.toLowerCase())).map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleAddSkill(item.name, item.category)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-xs"
              >
                + {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categorized Displays */}
      <div className="space-y-5">
        {/* Technical */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
            <span>Technical Skills</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
              {technicalSkills.length}
            </span>
          </h3>
          {technicalSkills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No technical skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[10px] text-indigo-500">({s.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.id)}
                    className="text-indigo-400 hover:text-rose-600 transition-colors ml-0.5"
                    title={`Remove ${s.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tools */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
            <span>Tools, Frameworks & Platforms</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
              {toolSkills.length}
            </span>
          </h3>
          {toolSkills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No tools or platforms added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {toolSkills.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[10px] text-slate-500">({s.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
                    title={`Remove ${s.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
            <span>Soft Skills & Practices</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
              {softSkills.length}
            </span>
          </h3>
          {softSkills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No soft skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {softSkills.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs"
                >
                  <span className="font-semibold">{s.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.id)}
                    className="text-emerald-500 hover:text-rose-600 transition-colors ml-0.5"
                    title={`Remove ${s.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillsSection
