import React, { useState } from 'react'
import type { CertificationItem } from '../../types/resume'
import { Award, Plus, Trash2, Edit2, Check, X, ExternalLink, Calendar } from 'lucide-react'

interface Props {
  items: CertificationItem[]
  onChange: (updated: CertificationItem[]) => void
}

export const CertificationsSection: React.FC<Props> = ({ items, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<CertificationItem>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleStartAdd = () => {
    setEditingId('new')
    setForm({
      name: '',
      issuingOrg: '',
      issueDate: '',
      credentialUrl: '',
    })
    setErrorMsg(null)
  }

  const handleStartEdit = (item: CertificationItem) => {
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
    if (!form.name?.trim()) {
      setErrorMsg('Please enter the Certification name.')
      return
    }

    if (editingId === 'new') {
      const newItem: CertificationItem = {
        id: `cert-${Date.now()}`,
        name: form.name.trim(),
        issuingOrg: form.issuingOrg?.trim() || '',
        issueDate: form.issueDate?.trim() || '',
        credentialUrl: form.credentialUrl?.trim() || '',
      }
      onChange([...items, newItem])
    } else {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name?.trim() || '',
                issuingOrg: form.issuingOrg?.trim() || '',
                issueDate: form.issueDate?.trim() || '',
                credentialUrl: form.credentialUrl?.trim() || '',
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
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Certifications & Licenses</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Industry credentials, professional courses, and verified certificates.
          </p>
        </div>
        {editingId !== 'new' && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
        )}
      </div>

      {/* Inline Form */}
      {editingId && (
        <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950/80 border-2 border-indigo-200 dark:border-indigo-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              {editingId === 'new' ? 'Add New Certificate' : 'Edit Certificate'}
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
                Certificate Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Meta Front-End Developer Certificate"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                value={form.issuingOrg || ''}
                onChange={(e) => setForm({ ...form, issuingOrg: e.target.value })}
                placeholder="e.g. AWS, Google, Coursera, Meta"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Issue Date / Year
              </label>
              <input
                type="text"
                value={form.issueDate || ''}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                placeholder="e.g. 2024 or Oct 2023"
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Credential Verification URL
              </label>
              <input
                type="url"
                value={form.credentialUrl || ''}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                placeholder="https://www.coursera.org/verify/..."
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <span>Save Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      {items.length === 0 && !editingId ? (
        <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
          <Award className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No certifications added yet.</p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            + Add certificate
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {item.issuingOrg && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.issuingOrg}</p>
                )}
                {item.issueDate && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Issued {item.issueDate}
                  </p>
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

export default CertificationsSection
