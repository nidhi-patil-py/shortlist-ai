import React from 'react'
import type { ResumeTemplateId } from '../../types/resume'
import { Check, Sparkles, FileText, AlignLeft, Layout } from 'lucide-react'

interface Props {
  selectedId: ResumeTemplateId
  onSelect: (id: ResumeTemplateId) => void
}

interface TemplateOption {
  id: ResumeTemplateId
  name: string
  subtitle: string
  description: string
  icon: React.ElementType
  badge?: string
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'ats-modern',
    name: 'Modern Minimal',
    subtitle: 'Sans-Serif • Clean Dividers',
    description: 'Recruiter-tested layout with balanced whitespace and clear hierarchy. Recommended for tech & product.',
    icon: Sparkles,
    badge: 'Popular',
  },
  {
    id: 'ats-classic',
    name: 'Classic Standard',
    subtitle: 'Serif Headings • Traditional',
    description: 'Universal standard with centered headers and formal dividers. Best for traditional corporate & finance.',
    icon: FileText,
  },
  {
    id: 'ats-compact',
    name: 'Technical Compact',
    subtitle: 'High Density • Developer Stack',
    description: 'Maximizes content per page with bracketed inline tech tags. Ideal for software engineers and data roles.',
    icon: AlignLeft,
  },
]

export const TemplatePicker: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            ATS-Safe Template
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          Single-Column Certified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {TEMPLATES.map((tpl) => {
          const isSelected = selectedId === tpl.id
          const Icon = tpl.icon

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
              }`}
            >
              {tpl.badge && (
                <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                  {tpl.badge}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{tpl.name}</span>
                </div>
                <p className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">{tpl.subtitle}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{tpl.description}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">100% Parser Safe</span>
                {isSelected && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TemplatePicker
