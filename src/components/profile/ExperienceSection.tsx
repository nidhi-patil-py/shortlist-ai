import React, { useState } from 'react'
import type { ExperienceItem } from '../../types/resume'
import { Briefcase, Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react'

interface Props {
  items: ExperienceItem[]
  onChange: (updated: ExperienceItem[]) => void
}

export const ExperienceSection: React.FC<Props> = ({ items, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<ExperienceItem>>({})
  const [newResp, setNewResp] = useState('')
  const [newAchieve, setNewAchieve] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleStartAdd = () => {
    setEditingId('new')
    setForm({
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      duration: '',
      responsibilities: [],
      achievements: [],
    })
    setNewResp('')
    setNewAchieve('')
    setErrorMsg(null)
  }

  const handleStartEdit = (item: ExperienceItem) => {
    setEditingId(item.id)
    setForm({ ...item })
    setNewResp('')
    setNewAchieve('')
    setErrorMsg(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({})
    setErrorMsg(null)
  }

  const handleAddResponsibility = () => {
    if (!newResp.trim()) return
    setForm({
      ...form,
      responsibilities: [...(form.responsibilities || []), newResp.trim()],
    })
    setNewResp('')
  }

  const handleRemoveResponsibility = (idx: number) => {
    setForm({
      ...form,
      responsibilities: (form.responsibilities || []).filter((_, i) => i !== idx),
    })
  }

  const handleAddAchievement = () => {
    if (!newAchieve.trim()) return
    setForm({
      ...form,
      achievements: [...(form.achievements || []), newAchieve.trim()],
    })
    setNewAchieve('')
  }

  const handleRemoveAchievement = (idx: number) => {
    setForm({
      ...form,
      achievements: (form.achievements || []).filter((_, i) => i !== idx),
    })
  }

  const handleSave = () => {
    if (!form.company?.trim() || !form.jobTitle?.trim()) {
      setErrorMsg('Please enter both Company name and Job Title.')
      return
    }

    if (editingId === 'new') {
      const newItem: ExperienceItem = {
        id: `exp-${Date.now()}`,
        company: form.company.trim(),
        jobTitle: form.jobTitle.trim(),
        startDate: form.startDate?.trim() || '',
        endDate: form.endDate?.trim() || '',
        duration: form.duration?.trim() || '',
        responsibilities: form.responsibilities || [],
        achievements: form.achievements || [],
      }
      onChange([...items, newItem])
    } else {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                company: form.company?.trim() || '',
                jobTitle: form.jobTitle?.trim() || '',
                startDate: form.startDate?.trim() || '',
                endDate: form.endDate?.trim() || '',
                duration: form.duration?.trim() || '',
                responsibilities: form.responsibilities || [],
                achievements: form.achievements || [],
              }
            : item
        )
      )
    }

    setEditingId(null)
    setForm({})
    setErrorMsg(null)
  }

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm({})
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Work Experience</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Past internships, co-ops, freelance work, or full-time roles with actionable bullets.
          </p>
        </div>
        {editingId !== 'new' && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {/* Inline Form */}
      {editingId && (
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/80 border-2 border-indigo-200 dark:border-indigo-800 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              {editingId === 'new' ? 'Add New Experience Entry' : 'Edit Experience Entry'}
            </h3>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Company / Organization <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.company || ''}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Acme Tech Labs"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.jobTitle || ''}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="e.g. Frontend Developer Intern"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="e.g. Jun 2023"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                End Date (or 'Present')
              </label>
              <input
                type="text"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="e.g. Present or Aug 2024"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Bullet Points: Responsibilities */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Key Responsibilities (ATS Action Bullets)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newResp}
                onChange={(e) => setNewResp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddResponsibility()
                  }
                }}
                placeholder="e.g. Built 15+ responsive React components reducing loading latency by 20%..."
                className="flex-grow px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shrink-0"
              >
                + Add Bullet
              </button>
            </div>

            {form.responsibilities && form.responsibilities.length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {form.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex-grow">• {resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(idx)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bullet Points: Achievements */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Key Achievements & Awards (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAchieve}
                onChange={(e) => setNewAchieve(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddAchievement()
                  }
                }}
                placeholder="e.g. Awarded Best Team Contributor during Q3 Sprint..."
                className="flex-grow px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shrink-0"
              >
                + Add
              </button>
            </div>

            {form.achievements && form.achievements.length > 0 && (
              <ul className="space-y-1.5 pt-2">
                {form.achievements.map((ach, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex-grow">★ {ach}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(idx)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Experience</span>
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      {items.length === 0 && !editingId ? (
        <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
          <Briefcase className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No work experience added yet.</p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            + Add internship, freelance, or full-time role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-grow">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.jobTitle}</h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{item.company}</p>
                  {(item.startDate || item.endDate) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {item.startDate} — {item.endDate || 'Present'}
                    </p>
                  )}
                </div>

                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {item.responsibilities.map((r, i) => (
                      <li key={i} className="leading-relaxed">
                        • {r}
                      </li>
                    ))}
                  </ul>
                )}

                {item.achievements && item.achievements.length > 0 && (
                  <ul className="text-xs text-amber-900 dark:text-amber-400 space-y-1 pt-1">
                    {item.achievements.map((a, i) => (
                      <li key={i} className="leading-relaxed font-medium">
                        ★ {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit entry"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceSection
