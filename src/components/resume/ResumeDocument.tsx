import React from 'react'
import type { ResumeData, ResumeSectionKey } from '../../types/resume'

interface Props {
  resume: ResumeData
}

export const ResumeDocument: React.FC<Props> = ({ resume }) => {
  const {
    templateId = 'ats-modern',
    personal,
    education = [],
    skills = [],
    experience = [],
    projects = [],
    certifications = [],
    settings = {
      sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
      sectionVisibility: {
        summary: true,
        skills: true,
        experience: true,
        projects: true,
        education: true,
        certifications: true,
      },
      fontFamily: 'sans',
      fontSize: 'normal',
      spacing: 'normal',
    },
  } = resume

  // Font family styles
  const fontClass =
    settings.fontFamily === 'serif'
      ? 'font-serif'
      : settings.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans'

  // Font sizing styles
  const sizeClasses =
    settings.fontSize === 'small'
      ? {
          name: 'text-xl sm:text-2xl',
          heading: 'text-xs',
          body: 'text-[11px] leading-snug',
          meta: 'text-[10px]',
        }
      : settings.fontSize === 'large'
      ? {
          name: 'text-2xl sm:text-3xl',
          heading: 'text-sm',
          body: 'text-xs sm:text-[13px] leading-relaxed',
          meta: 'text-xs',
        }
      : {
          name: 'text-2xl sm:text-2xl',
          heading: 'text-xs sm:text-sm',
          body: 'text-xs leading-normal',
          meta: 'text-[11px]',
        }

  // Spacing styles
  const spacingClass =
    settings.spacing === 'compact'
      ? 'space-y-3'
      : settings.spacing === 'relaxed'
      ? 'space-y-6'
      : 'space-y-4'

  // Contact items for header
  const contactParts: string[] = []
  if (personal.phone) contactParts.push(personal.phone)
  if (personal.email) contactParts.push(personal.email)
  if (personal.location) contactParts.push(personal.location)
  if (personal.linkedinUrl) {
    const clean = personal.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')
    contactParts.push(clean)
  }
  if (personal.githubUrl) {
    const clean = personal.githubUrl.replace(/^https?:\/\/(www\.)?/, '')
    contactParts.push(clean)
  }
  if (personal.portfolioUrl) {
    const clean = personal.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')
    contactParts.push(clean)
  }

  // Group skills by category for compact presentation
  const techSkills = skills.filter((s) => s.category === 'technical')
  const toolSkills = skills.filter((s) => s.category === 'tools')
  const softSkills = skills.filter((s) => s.category === 'soft')

  // Render individual sections
  const renderSection = (key: ResumeSectionKey) => {
    if (!settings.sectionVisibility[key]) return null

    switch (key) {
      case 'summary':
        if (!personal.professionalSummary?.trim()) return null
        return (
          <section key="summary" className="resume-item-block">
            <h2 className={getHeaderStyle(templateId, sizeClasses.heading)}>
              Professional Summary
            </h2>
            <p className={`${sizeClasses.body} text-slate-800 leading-relaxed text-justify mt-1.5`}>
              {personal.professionalSummary}
            </p>
          </section>
        )

      case 'skills':
        if (skills.length === 0) return null
        return (
          <section key="skills" className="resume-item-block">
            <h2 className={getHeaderStyle(templateId, sizeClasses.heading)}>
              Technical Skills & Competencies
            </h2>
            <div className={`${sizeClasses.body} text-slate-800 space-y-1 mt-1.5`}>
              {techSkills.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Technical Skills: </strong>
                  {techSkills.map((s) => s.name).join(' • ')}
                </p>
              )}
              {toolSkills.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Tools & Technologies: </strong>
                  {toolSkills.map((s) => s.name).join(' • ')}
                </p>
              )}
              {softSkills.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Soft Skills: </strong>
                  {softSkills.map((s) => s.name).join(' • ')}
                </p>
              )}
            </div>
          </section>
        )

      case 'experience':
        if (experience.length === 0) return null
        return (
          <section key="experience" className="resume-item-block">
            <h2 className={getHeaderStyle(templateId, sizeClasses.heading)}>
              Work Experience
            </h2>
            <div className="space-y-3 mt-2">
              {experience.map((item) => (
                <div key={item.id} className="resume-item-block space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.jobTitle}{' '}
                      <span className="font-normal text-slate-700">| {item.company}</span>
                    </span>
                    {(item.startDate || item.endDate) && (
                      <span className={`${sizeClasses.meta} text-slate-600 font-medium shrink-0`}>
                        {item.startDate} — {item.endDate || 'Present'}
                      </span>
                    )}
                  </div>

                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <ul className={`list-disc list-outside ml-4 ${sizeClasses.body} text-slate-800 space-y-0.5 pt-0.5`}>
                      {item.responsibilities.map((resp, i) => (
                        <li key={i} className="pl-0.5">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.achievements && item.achievements.length > 0 && (
                    <ul className={`list-disc list-outside ml-4 ${sizeClasses.body} text-slate-800 space-y-0.5`}>
                      {item.achievements.map((ach, i) => (
                        <li key={i} className="pl-0.5">
                          <strong>Key Achievement:</strong> {ach}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )

      case 'projects':
        if (projects.length === 0) return null
        return (
          <section key="projects" className="resume-item-block">
            <h2 className={getHeaderStyle(templateId, sizeClasses.heading)}>
              Projects & Engineering Work
            </h2>
            <div className="space-y-3 mt-2">
              {projects.map((proj) => (
                <div key={proj.id} className="resume-item-block space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {proj.name}
                      </span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className={`${sizeClasses.meta} text-slate-600 font-medium`}>
                          [{proj.technologies.join(', ')}]
                        </span>
                      )}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span className={`${sizeClasses.meta} text-slate-600 shrink-0`}>
                        {proj.startDate} — {proj.endDate || 'Completed'}
                      </span>
                    )}
                  </div>

                  <p className={`${sizeClasses.body} text-slate-800 leading-relaxed text-justify`}>
                    • {proj.description}
                  </p>

                  {proj.projectLink && (
                    <p className={`${sizeClasses.meta} text-slate-600`}>
                      Link: {proj.projectLink}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )

      case 'education':
        if (education.length === 0) return null
        return (
          <section key="education" className="resume-item-block">
            <h2 className={getHeaderStyle(templateId, sizeClasses.heading)}>
              Education
            </h2>
            <div className="space-y-2 mt-2">
              {education.map((edu) => (
                <div key={edu.id} className="resume-item-block space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </span>
                    {(edu.startDate || edu.endDate) && (
                      <span className={`${sizeClasses.meta} text-slate-600 shrink-0`}>
                        {edu.startDate} — {edu.endDate || 'Graduated'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${sizeClasses.body} text-slate-700 font-medium`}>
                      {edu.institution}
                    </span>
                    {edu.grade && (
                      <span className={`${sizeClasses.meta} text-slate-600 font-semibold`}>
                        GPA: {edu.grade}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <p className={`${sizeClasses.meta} text-slate-600 pt-0.5`}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )

      case 'certifications':
        if (certifications.length === 0) return null
        return (
          <section key="certifications" className="resume-item-block">
            <h2 className={getHeaderStyle(templateId, sizeClasses.heading)}>
              Certifications & Credentials
            </h2>
            <div className="space-y-1.5 mt-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="resume-item-block flex items-baseline justify-between">
                  <span className={`${sizeClasses.body} text-slate-900 font-semibold`}>
                    • {cert.name}{' '}
                    {cert.issuingOrg && <span className="font-normal text-slate-600">({cert.issuingOrg})</span>}
                  </span>
                  {cert.issueDate && (
                    <span className={`${sizeClasses.meta} text-slate-600 shrink-0`}>
                      {cert.issueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <article
      className={`resume-paper w-full bg-white text-slate-900 p-8 sm:p-12 shadow-md rounded-xl sm:rounded-2xl border border-slate-200 transition-all ${fontClass} ${spacingClass}`}
      style={{
        maxWidth: '850px',
        minHeight: '1050px',
        boxSizing: 'border-box',
      }}
    >
      {/* Resume Header */}
      <header className={`resume-item-block pb-3 border-b ${getHeaderBorder(templateId)}`}>
        <div className={getHeaderAlignment(templateId)}>
          <h1 className={`${sizeClasses.name} font-black tracking-tight text-slate-900 uppercase`}>
            {personal.fullName || 'Your Full Name'}
          </h1>
          {personal.professionalTitle && (
            <p className="text-xs sm:text-sm font-semibold text-slate-700 tracking-wide mt-0.5">
              {personal.professionalTitle}
            </p>
          )}
          {contactParts.length > 0 && (
            <p className={`${sizeClasses.meta} text-slate-600 mt-1 leading-relaxed`}>
              {contactParts.join('  •  ')}
            </p>
          )}
        </div>
      </header>

      {/* Dynamic Sections in User-Specified Order */}
      {settings.sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </article>
  )
}

// Helper: Header styling per template
function getHeaderStyle(templateId: string, sizeClass: string): string {
  switch (templateId) {
    case 'ats-classic':
      return `${sizeClass} font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-900 font-serif`
    case 'ats-compact':
      return `${sizeClass} font-bold text-slate-900 uppercase tracking-widest pb-0.5 border-b border-slate-400 font-mono`
    case 'ats-modern':
    default:
      return `${sizeClass} font-extrabold text-indigo-900 uppercase tracking-wide pb-1 border-b border-indigo-200`
  }
}

function getHeaderBorder(templateId: string): string {
  switch (templateId) {
    case 'ats-classic':
      return 'border-slate-800 text-center'
    case 'ats-compact':
      return 'border-slate-400'
    case 'ats-modern':
    default:
      return 'border-slate-200'
  }
}

function getHeaderAlignment(templateId: string): string {
  switch (templateId) {
    case 'ats-classic':
      return 'text-center space-y-1'
    case 'ats-compact':
      return 'text-left space-y-0.5'
    case 'ats-modern':
    default:
      return 'text-center space-y-1'
  }
}

export default ResumeDocument
