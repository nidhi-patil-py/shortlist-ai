import React, { useState } from 'react'
import type { EducationItem } from '../../types/resume'
import { GraduationCap, Plus, Trash2, Edit2, Check, X, Calendar, Award } from 'lucide-react'

interface Props {
  items: EducationItem[]
  onChange: (updated: EducationItem[]) => void
}

export const EducationSection: React.FC<Props> = ({ items, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<EducationItem>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleStartAdd = () => {
    setEditingId('new')
    setForm({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    })
    setErrorMsg(null)
  }

  const handleStartEdit = (item: EducationItem) => {
    setEditingId(item.id)
    setForm({ ...item })
    setErrorMsg(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({})
    setErrorMsg(null)
  }

  const handleSave = () => {
    if (!form.degree?.trim() || !form.institution?.trim()) {
      setErrorMsg('Please enter both Degree and Institution.')
      return
    }

    if (editingId === 'new') {
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        fieldOfStudy: form.fieldOfStudy?.trim() || '',
        startDate: form.startDate?.trim() || '',
        endDate: form.endDate?.trim() || '',
        grade: form.grade?.trim() || '',
        description: form.description?.trim() || '',
      }
      onChange([...items, newItem])
    } else {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                degree: form.degree?.trim() || '',
                institution: form.institution?.trim() || '',
                fieldOfStudy: form.fieldOfStudy?.trim() || '',
                startDate: form.startDate?.trim() || '',
                endDate: form.endDate?.trim() || '',
                grade: form.grade?.trim() || '',
                description: form.description?.trim() || '',
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
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Education History</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Degrees, colleges, universities, and relevant academic highlights.
          </p>
        </div>
        {editingId !== 'new' && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        )}
      </div>

      {/* Inline Form */}
      {editingId && (
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/80 border-2 border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              {editingId === 'new' ? 'Add New Education Entry' : 'Edit Education Entry'}
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
                Degree <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.degree || ''}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Institution / University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.institution || ''}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="e.g. UC Berkeley / Stanford"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Field of Study / Major
              </label>
              <input
                type="text"
                value={form.fieldOfStudy || ''}
                onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                placeholder="e.g. Software Engineering"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Grade / CGPA (Optional)
              </label>
              <input
                type="text"
                value={form.grade || ''}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="e.g. 3.8 / 4.0 or 8.5 CGPA"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Start Year / Date
              </label>
              <input
                type="text"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="e.g. 2020 or Aug 2020"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                End Year / Expected Date
              </label>
              <input
                type="text"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="e.g. 2024 or May 2024"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Description / Notable Coursework
              </label>
              <textarea
                rows={2}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Relevant coursework, honors, or leadership activities..."
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              <span>Save Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      {items.length === 0 && !editingId ? (
        <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
          <GraduationCap className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            + Add your degree or high school
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.degree}</h3>
                  {item.grade && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {item.grade}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {item.institution} {item.fieldOfStudy ? `• ${item.fieldOfStudy}` : ''}
                </p>
                {(item.startDate || item.endDate) && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.startDate} — {item.endDate || 'Present'}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">{item.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
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

export default EducationSection
