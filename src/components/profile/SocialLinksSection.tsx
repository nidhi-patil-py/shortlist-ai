import React from 'react'
import type { PersonalDetails } from '../../types/resume'
import { Globe, Link2, ExternalLink } from 'lucide-react'

interface Props {
  data: PersonalDetails
  onChange: (updated: PersonalDetails) => void
}

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
)

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

export const SocialLinksSection: React.FC<Props> = ({ data, onChange }) => {
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
          <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Professional Social Links</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Links to your GitHub profile, LinkedIn network, personal portfolio, or code repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* LinkedIn */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              LinkedIn Profile URL
            </label>
            {data.linkedinUrl && (
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500">
              <LinkedInIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="url"
              value={data.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              GitHub Profile URL
            </label>
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500">
              <GitHubIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="url"
              value={data.githubUrl || ''}
              onChange={(e) => handleChange('githubUrl', e.target.value)}
              placeholder="https://github.com/username"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Portfolio Website URL
            </label>
            {data.portfolioUrl && (
              <a
                href={data.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="url"
              value={data.portfolioUrl || ''}
              onChange={(e) => handleChange('portfolioUrl', e.target.value)}
              placeholder="https://yourname.dev"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Other / LeetCode / Kaggle / Tech Blog */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Other Link (Blog, LeetCode, Twitter)
            </label>
            {data.otherUrl && (
              <a
                href={data.otherUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="relative">
            <Link2 className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="url"
              value={data.otherUrl || ''}
              onChange={(e) => handleChange('otherUrl', e.target.value)}
              placeholder="https://leetcode.com/u/username or blog"
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialLinksSection
