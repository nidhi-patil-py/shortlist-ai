import React, { useState } from 'react'
import type { ProjectItem } from '../../types/resume'
import { FolderGit2, Plus, Trash2, Edit2, Check, X, ExternalLink, Calendar } from 'lucide-react'

interface Props {
  items: ProjectItem[]
  onChange: (updated: ProjectItem[]) => void
}

export const ProjectsSection: React.FC<Props> = ({ items, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<ProjectItem>>({})
  const [techInput, setTechInput] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleStartAdd = () => {
    setEditingId('new')
    setForm({
      name: '',
      description: '',
      technologies: [],
      projectLink: '',
      startDate: '',
      endDate: '',
    })
    setTechInput('')
    setErrorMsg(null)
  }

  const handleStartEdit = (item: ProjectItem) => {
    setEditingId(item.id)
    setForm({ ...item })
    setTechInput('')
    setErrorMsg(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({})
    setErrorMsg(null)
  }

  const handleAddTech = () => {
    const trimmed = techInput.trim()
    if (!trimmed) return
    const current = form.technologies || []
    if (!current.includes(trimmed)) {
      setForm({
        ...form,
        technologies: [...current, trimmed],
      })
    }
    setTechInput('')
  }

  const handleRemoveTech = (tech: string) => {
    setForm({
      ...form,
      technologies: (form.technologies || []).filter((t) => t !== tech),
    })
  }

  const handleSave = () => {
    if (!form.name?.trim() || !form.description?.trim()) {
      setErrorMsg('Please enter both Project Name and Description.')
      return
    }

    if (editingId === 'new') {
      const newItem: ProjectItem = {
        id: `prj-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        technologies: form.technologies || [],
        projectLink: form.projectLink?.trim() || '',
        startDate: form.startDate?.trim() || '',
        endDate: form.endDate?.trim() || '',
      }
      onChange([...items, newItem])
    } else {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name?.trim() || '',
                description: form.description?.trim() || '',
                technologies: form.technologies || [],
                projectLink: form.projectLink?.trim() || '',
                startDate: form.startDate?.trim() || '',
                endDate: form.endDate?.trim() || '',
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
            <FolderGit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Technical Projects & Portfolio</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showcase your best personal, open-source, or academic projects. Crucial for students and freshers!
          </p>
        </div>
        {editingId !== 'new' && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {/* Inline Form */}
      {editingId && (
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/80 border-2 border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              {editingId === 'new' ? 'Add New Project' : 'Edit Project'}
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
                Project Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. E-Commerce Web App"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Project Link / GitHub URL
              </label>
              <input
                type="url"
                value={form.projectLink || ''}
                onChange={(e) => setForm({ ...form, projectLink: e.target.value })}
                placeholder="https://github.com/you/repo"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Start Date (Optional)
              </label>
              <input
                type="text"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="e.g. Jan 2024"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                End Date (Optional)
              </label>
              <input
                type="text"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="e.g. Apr 2024"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Technologies */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Technologies Used (ATS Stack Keywords)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTech()
                    }
                  }}
                  placeholder="e.g. React, TypeScript, Tailwind, REST API (Press Enter)"
                  className="flex-grow px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                >
                  + Add Tech
                </button>
              </div>

              {form.technologies && form.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800/80"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="text-indigo-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Project Description & Impact <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What problem did this project solve? What was your architecture and measurable outcome?"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
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
              <span>Save Project</span>
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      {items.length === 0 && !editingId ? (
        <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
          <FolderGit2 className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No projects added yet.</p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            + Add your first project
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
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  {item.projectLink && (
                    <a
                      href={item.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {(item.startDate || item.endDate) && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.startDate} — {item.endDate || 'Present'}
                  </p>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>

                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
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

export default ProjectsSection
