import React from 'react'
import type { ResumeSettings, ResumeSectionKey } from '../../types/resume'
import { ArrowUp, ArrowDown, Eye, EyeOff, Sliders, Type, Move } from 'lucide-react'

interface Props {
  settings: ResumeSettings
  onChange: (updated: ResumeSettings) => void
}

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: 'Professional Summary',
  skills: 'Technical & Soft Skills',
  experience: 'Work Experience',
  projects: 'Projects & Portfolio',
  education: 'Education',
  certifications: 'Certifications',
}

export const SectionManager: React.FC<Props> = ({ settings, onChange }) => {
  const { sectionOrder, sectionVisibility, fontFamily, fontSize, spacing } = settings

  const handleToggle = (key: ResumeSectionKey) => {
    onChange({
      ...settings,
      sectionVisibility: {
        ...sectionVisibility,
        [key]: !sectionVisibility[key],
      },
    })
  }

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return

    const newOrder = [...sectionOrder]
    const temp = newOrder[idx]
    newOrder[idx] = newOrder[targetIdx]
    newOrder[targetIdx] = temp

    onChange({
      ...settings,
      sectionOrder: newOrder,
    })
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Layout & Typography Controls
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Reorder & Hide Sections</span>
      </div>

      {/* Typography & Spacing Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        {/* Font Family */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
            <Type className="w-3 h-3 text-slate-400" />
            <span>Font Style</span>
          </label>
          <select
            value={fontFamily}
            onChange={(e) =>
              onChange({ ...settings, fontFamily: e.target.value as 'sans' | 'serif' | 'mono' })
            }
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-medium"
          >
            <option value="sans">Modern Sans (Clean)</option>
            <option value="serif">Classic Serif (Formal)</option>
            <option value="mono">Developer Mono (Tech)</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Font Scale
          </label>
          <select
            value={fontSize}
            onChange={(e) =>
              onChange({ ...settings, fontSize: e.target.value as 'small' | 'normal' | 'large' })
            }
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-medium"
          >
            <option value="small">Compact (Fit more content)</option>
            <option value="normal">Standard (Balanced)</option>
            <option value="large">Spacious (High readability)</option>
          </select>
        </div>

        {/* Section Spacing */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Line Spacing
          </label>
          <select
            value={spacing}
            onChange={(e) =>
              onChange({ ...settings, spacing: e.target.value as 'compact' | 'normal' | 'relaxed' })
            }
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-medium"
          >
            <option value="compact">Tight (Single Page)</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
      </div>

      {/* Section Reorder & Visibility List */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
          <Move className="w-3 h-3 text-slate-400" />
          <span>Section Order on Output Resume</span>
        </span>

        <div className="space-y-1.5">
          {sectionOrder.map((key, idx) => {
            const isVisible = sectionVisibility[key]
            const isFirst = idx === 0
            const isLast = idx === sectionOrder.length - 1

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                  isVisible
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 w-4">
                    {idx + 1}.
                  </span>
                  <span className={`text-xs font-semibold ${isVisible ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                    {SECTION_LABELS[key]}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Visibility Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className={`p-1 rounded-md text-xs transition-colors ${
                      isVisible
                        ? 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                    }`}
                    title={isVisible ? 'Hide this section' : 'Show this section'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5 text-indigo-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SectionManager
