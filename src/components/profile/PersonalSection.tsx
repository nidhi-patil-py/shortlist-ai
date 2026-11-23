import React from 'react'
import type { PersonalDetails } from '../../types/resume'
import { User, Mail, Phone, MapPin, Briefcase, FileText } from 'lucide-react'

interface Props {
  data: PersonalDetails
  onChange: (updated: PersonalDetails) => void
}

export const PersonalSection: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Personal & Contact Details</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Recruiters and ATS parsers need clean, standard contact fields to reach you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Professional Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Professional Title
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.professionalTitle || ''}
              onChange={(e) => handleChange('professionalTitle', e.target.value)}
              placeholder="e.g. Frontend Engineer / CS Student"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="alex.morgan@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 345-6789"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Location (City, State / Country)
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="San Francisco, CA, USA"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Professional Summary
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {data.professionalSummary.length} characters (recommended 150-400)
            </span>
          </div>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              rows={4}
              value={data.professionalSummary}
              onChange={(e) => handleChange('professionalSummary', e.target.value)}
              placeholder="Brief summary of your background, core technical capabilities, and career goals..."
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalSection
