import type { PersonalDetails, EducationItem, SkillItem, ExperienceItem, ProjectItem, CertificationItem } from '../types/resume.ts'
import { SKILL_ONTOLOGY, extractCanonicalKeywords, isSkillMatch } from './jdMatcher.ts'

export interface ATSCheckableDocument {
  personal: PersonalDetails
  education: EducationItem[]
  skills: SkillItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  certifications?: CertificationItem[]
}

export interface ATSCategoryScore {
  category: 'contact' | 'structure' | 'keywords' | 'impact' | 'readability'
  label: string
  score: number
  maxScore: number
  percentage: number
  passedItems: string[]
  failedItems: string[]
}

export interface ATSActionableSuggestion {
  id: string
  priority: 'high' | 'medium' | 'low'
  category: string
  text: string
  pointsToGain: number
}

export interface ATSCheckResult {
  overallScore: number // 0 - 100
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Issues'
  categories: {
    contact: ATSCategoryScore
    structure: ATSCategoryScore
    keywords: ATSCategoryScore
    impact: ATSCategoryScore
    readability: ATSCategoryScore
  }
  passedChecks: string[]
  actionableSuggestions: ATSActionableSuggestion[]
  matchedKeywords: string[]
  missingKeywords: string[]
  actionVerbsFound: string[]
  metricsCount: number
  isJobSpecific: boolean
  disclaimer: string
}

export const ACTION_VERBS = [
  'built', 'developed', 'engineered', 'architected', 'designed', 'implemented',
  'deployed', 'optimized', 'spearheaded', 'automated', 'scaled', 'streamlined',
  'launched', 'delivered', 'created', 'refactored', 'reduced', 'increased',
  'accelerated', 'orchestrated', 'integrated', 'authored', 'executed', 'led',
  'managed', 'enhanced', 'resolved', 'formulated', 'pioneered', 'established',
  'configured', 'maintained', 'transformed', 'mentored', 'initiated', 'collaborated',
  'published', 'audited', 'migrated', 'tested', 'debugged'
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /[\d+()\-.\s]{7,}/
const METRIC_REGEX = /(\b\d+([.,]\d+)?\s*(%|percent|k|m|x|users|clients|requests|ms|s|sec|seconds|days|weeks|hours|pts)?\b|[$€£₹]\s*\d+)/i

export const ATS_DISCLAIMER =
  "Shortlist AI's ATS Score is an internal, transparent educational diagnostic based on standard Applicant Tracking System parsing guidelines (clean single-column layout, keyword alignment, quantified achievements, and standard headings). It does not guarantee employment or predict any specific company's proprietary hiring algorithm."

/**
 * Deterministic ATS Scoring Engine
 */
export function checkResumeATS(
  doc: ATSCheckableDocument,
  jobDescription?: string
): ATSCheckResult {
  const suggestions: ATSActionableSuggestion[] = []
  const allPassedChecks: string[] = []

  // -------------------------------------------------------------
  // 1. Contact & Header Completeness (15 Points Max)
  // -------------------------------------------------------------
  let contactScore = 0
  const contactPassed: string[] = []
  const contactFailed: string[] = []

  // Full Name
  if (doc.personal.fullName && doc.personal.fullName.trim().length >= 2) {
    contactScore += 3
    contactPassed.push('Candidate name clearly present')
    allPassedChecks.push('Full candidate name detected')
  } else {
    contactFailed.push('Missing candidate name')
    suggestions.push({
      id: 'contact-name',
      priority: 'high',
      category: 'Contact Info',
      text: 'Add your full name to the header.',
      pointsToGain: 3,
    })
  }

  // Email
  if (doc.personal.email && EMAIL_REGEX.test(doc.personal.email.trim())) {
    contactScore += 3
    contactPassed.push('Valid email address provided')
    allPassedChecks.push('Standard email address format valid')
  } else {
    contactFailed.push('Missing or invalid email address')
    suggestions.push({
      id: 'contact-email',
      priority: 'high',
      category: 'Contact Info',
      text: 'Provide a valid, professional email address.',
      pointsToGain: 3,
    })
  }

  // Phone
  if (doc.personal.phone && doc.personal.phone.trim().length >= 7 && PHONE_REGEX.test(doc.personal.phone)) {
    contactScore += 3
    contactPassed.push('Valid phone number provided')
    allPassedChecks.push('Direct contact phone number included')
  } else {
    contactFailed.push('Missing contact phone number')
    suggestions.push({
      id: 'contact-phone',
      priority: 'high',
      category: 'Contact Info',
      text: 'Add a valid contact phone number with country/area code.',
      pointsToGain: 3,
    })
  }

  // Location
  if (doc.personal.location && doc.personal.location.trim().length >= 3) {
    contactScore += 3
    contactPassed.push('Geographic location provided')
    allPassedChecks.push('Location (City, State/Country) present')
  } else {
    contactFailed.push('Missing location (City, State/Country)')
    suggestions.push({
      id: 'contact-location',
      priority: 'medium',
      category: 'Contact Info',
      text: 'Add your location (City, State or Country) to satisfy location-based ATS filters.',
      pointsToGain: 3,
    })
  }

  // Professional Links
  const hasLink = Boolean(
    (doc.personal.linkedinUrl && doc.personal.linkedinUrl.trim()) ||
    (doc.personal.githubUrl && doc.personal.githubUrl.trim()) ||
    (doc.personal.portfolioUrl && doc.personal.portfolioUrl.trim()) ||
    (doc.personal.otherUrl && doc.personal.otherUrl.trim())
  )
  if (hasLink) {
    contactScore += 3
    contactPassed.push('Professional portfolio / LinkedIn link included')
    allPassedChecks.push('Professional online profile link verified')
  } else {
    contactFailed.push('Missing professional links (LinkedIn, GitHub, or Portfolio)')
    suggestions.push({
      id: 'contact-links',
      priority: 'medium',
      category: 'Contact Info',
      text: 'Add a LinkedIn, GitHub, or Portfolio link to boost credibility.',
      pointsToGain: 3,
    })
  }

  const contactCategory: ATSCategoryScore = {
    category: 'contact',
    label: 'Contact & Header',
    score: contactScore,
    maxScore: 15,
    percentage: Math.round((contactScore / 15) * 100),
    passedItems: contactPassed,
    failedItems: contactFailed,
  }

  // -------------------------------------------------------------
  // 2. Section Structure & Standard Headings (20 Points Max)
  // -------------------------------------------------------------
  let structureScore = 0
  const structurePassed: string[] = []
  const structureFailed: string[] = []

  // Professional Summary
  if (doc.personal.professionalSummary && doc.personal.professionalSummary.trim().length >= 20) {
    structureScore += 4
    structurePassed.push('Professional summary section present')
    allPassedChecks.push('Standard professional summary section included')
  } else {
    structureFailed.push('Missing professional summary')
    suggestions.push({
      id: 'struct-summary',
      priority: 'medium',
      category: 'Section Structure',
      text: 'Add a professional summary introducing your domain focus and background.',
      pointsToGain: 4,
    })
  }

  // Skills Section
  if (doc.skills && doc.skills.length >= 3) {
    structureScore += 5
    structurePassed.push(`Skills section well-populated (${doc.skills.length} skills listed)`)
    allPassedChecks.push(`Dedicated Skills section with ${doc.skills.length} competencies`)
  } else if (doc.skills && doc.skills.length > 0) {
    structureScore += 2
    structureFailed.push('Skills section has fewer than 3 skills')
    suggestions.push({
      id: 'struct-skills-few',
      priority: 'high',
      category: 'Section Structure',
      text: 'List at least 4 to 6 core technical skills.',
      pointsToGain: 3,
    })
  } else {
    structureFailed.push('Skills section completely missing')
    suggestions.push({
      id: 'struct-skills-none',
      priority: 'high',
      category: 'Section Structure',
      text: 'Add a dedicated Skills section to your resume.',
      pointsToGain: 5,
    })
  }

  // Experience or Projects
  const hasExperience = doc.experience && doc.experience.length > 0
  const hasProjects = doc.projects && doc.projects.length > 0

  if (hasExperience && hasProjects) {
    structureScore += 6
    structurePassed.push('Both Work Experience and Projects sections populated')
    allPassedChecks.push('Comprehensive Work Experience & Projects sections')
  } else if (hasExperience || hasProjects) {
    structureScore += 6
    structurePassed.push(hasExperience ? 'Work Experience section present' : 'Projects section present')
    allPassedChecks.push('Practical work or project demonstrations included')
  } else {
    structureFailed.push('Missing both Experience and Projects')
    suggestions.push({
      id: 'struct-work',
      priority: 'high',
      category: 'Section Structure',
      text: 'Add at least one Project or Work Experience entry with bullet points.',
      pointsToGain: 6,
    })
  }

  // Education Section
  if (doc.education && doc.education.length > 0) {
    structureScore += 5
    structurePassed.push('Education section present with accredited degree')
    allPassedChecks.push('Formal Education section verified')
  } else {
    structureFailed.push('Missing Education section')
    suggestions.push({
      id: 'struct-edu',
      priority: 'medium',
      category: 'Section Structure',
      text: 'Include your education history (degree, institution, graduation year).',
      pointsToGain: 5,
    })
  }

  const structureCategory: ATSCategoryScore = {
    category: 'structure',
    label: 'Section Structure',
    score: structureScore,
    maxScore: 20,
    percentage: Math.round((structureScore / 20) * 100),
    passedItems: structurePassed,
    failedItems: structureFailed,
  }

  // -------------------------------------------------------------
  // 3. Keyword & Skill Alignment (35 Points Max)
  // -------------------------------------------------------------
  let keywordScore = 0
  const keywordPassed: string[] = []
  const keywordFailed: string[] = []
  let matchedKeywords: string[] = []
  let missingKeywords: string[] = []
  const isJobSpecific = Boolean(jobDescription && jobDescription.trim().length >= 15)

  if (isJobSpecific) {
    const extracted = extractCanonicalKeywords(jobDescription || '')
    const jdCanonicals = extracted.allCanonicals

    if (jdCanonicals.length > 0) {
      // Gather all text from candidate document for deep keyword match
      const docSkills = doc.skills.map((s) => s.name)
      const projectTech = doc.projects.flatMap((p) => p.technologies || [])
      const allCandidateTokens = [
        ...docSkills,
        ...projectTech,
        doc.personal.professionalSummary || '',
        ...doc.projects.map((p) => `${p.name} ${p.description}`),
        ...doc.experience.map((e) => `${e.jobTitle} ${(e.responsibilities || []).join(' ')}`),
      ].join(' ')

      for (const canonical of jdCanonicals) {
        if (isSkillMatch(allCandidateTokens, canonical)) {
          matchedKeywords.push(canonical)
        } else {
          missingKeywords.push(canonical)
        }
      }

      const matchRatio = matchedKeywords.length / Math.max(1, jdCanonicals.length)
      keywordScore = Math.round(matchRatio * 35)

      if (matchedKeywords.length > 0) {
        keywordPassed.push(`Matched ${matchedKeywords.length} of ${jdCanonicals.length} keywords from the job description`)
        allPassedChecks.push(`Direct alignment with ${matchedKeywords.length} JD keywords`)
      }

      if (missingKeywords.length > 0) {
        keywordFailed.push(`Missing ${missingKeywords.length} target JD keywords (${missingKeywords.slice(0, 3).join(', ')}...)`)
        const ptsGap = 35 - keywordScore
        suggestions.push({
          id: 'keywords-jd-gaps',
          priority: ptsGap >= 15 ? 'high' : 'medium',
          category: 'Keywords & Alignment',
          text: `Target posting requires ${missingKeywords.length} skill(s) not found in your resume (${missingKeywords.slice(0, 4).join(', ')}). Add them if you have genuine experience.`,
          pointsToGain: ptsGap,
        })
      }
    } else {
      // Fallback if no recognizable keywords found in JD
      keywordScore = 25
      keywordPassed.push('General job description evaluated')
    }
  } else {
    // General Technical & Industry Competency Density (No JD provided)
    const docSkills = doc.skills.map((s) => s.name)
    const projectTech = doc.projects.flatMap((p) => p.technologies || [])
    const combinedCandidateSkills = [...new Set([...docSkills, ...projectTech])]

    let recognizedCount = 0
    for (const skill of combinedCandidateSkills) {
      if (SKILL_ONTOLOGY.some((entry) => isSkillMatch(skill, entry.canonical))) {
        recognizedCount++
      }
    }

    if (recognizedCount >= 8) {
      keywordScore = 35
      keywordPassed.push(`High industry skill density (${recognizedCount} standard industry skills recognized)`)
      allPassedChecks.push('High concentration of recognized technical keywords')
    } else if (recognizedCount >= 6) {
      keywordScore = 28
      keywordPassed.push(`Good industry skill density (${recognizedCount} recognized skills)`)
      allPassedChecks.push('Solid industry skill keyword density')
    } else if (recognizedCount >= 4) {
      keywordScore = 20
      keywordPassed.push(`Moderate skill density (${recognizedCount} recognized skills)`)
      suggestions.push({
        id: 'keywords-density',
        priority: 'medium',
        category: 'Keywords & Alignment',
        text: 'Add 3-4 more widely recognized technical tools, languages, or frameworks to boost ATS discoverability.',
        pointsToGain: 15,
      })
    } else if (recognizedCount >= 1) {
      keywordScore = 12
      keywordFailed.push(`Low skill density (only ${recognizedCount} recognized industry skills)`)
      suggestions.push({
        id: 'keywords-density-low',
        priority: 'high',
        category: 'Keywords & Alignment',
        text: 'List specific technical competencies (e.g., React, TypeScript, SQL, Git) rather than generic phrases.',
        pointsToGain: 23,
      })
    } else {
      keywordScore = 0
      keywordFailed.push('No recognized industry tech stack keywords detected')
      suggestions.push({
        id: 'keywords-none',
        priority: 'high',
        category: 'Keywords & Alignment',
        text: 'Add canonical technical keywords and tools to your profile.',
        pointsToGain: 35,
      })
    }
  }

  const keywordCategory: ATSCategoryScore = {
    category: 'keywords',
    label: isJobSpecific ? 'Job Description Alignment' : 'Industry Keyword Density',
    score: keywordScore,
    maxScore: 35,
    percentage: Math.round((keywordScore / 35) * 100),
    passedItems: keywordPassed,
    failedItems: keywordFailed,
  }

  // -------------------------------------------------------------
  // 4. Content Impact & Action Verbs (20 Points Max)
  // -------------------------------------------------------------
  let impactScore = 0
  const impactPassed: string[] = []
  const impactFailed: string[] = []

  // Extract all bullet items
  const allBullets: string[] = [
    ...doc.experience.flatMap((e) => [
      ...(e.responsibilities || []),
      ...(e.achievements || []),
    ]),
    ...doc.projects.map((p) => p.description || ''),
  ].filter((b) => b.trim().length > 0)

  // Find unique action verbs
  const actionVerbsFoundSet = new Set<string>()
  for (const bullet of allBullets) {
    const lower = bullet.toLowerCase()
    for (const verb of ACTION_VERBS) {
      // Check if word boundary exists
      const regex = new RegExp(`\\b${verb}\\b`, 'i')
      if (regex.test(lower)) {
        actionVerbsFoundSet.add(verb)
      }
    }
  }
  const actionVerbsFound = Array.from(actionVerbsFoundSet)

  // Score action verbs (10 pts max)
  if (actionVerbsFound.length >= 4) {
    impactScore += 10
    impactPassed.push(`Strong action verbs utilized (${actionVerbsFound.length} unique verbs found: ${actionVerbsFound.slice(0, 4).join(', ')})`)
    allPassedChecks.push(`Action-oriented bullet points (${actionVerbsFound.length} strong verbs)`)
  } else if (actionVerbsFound.length >= 2) {
    impactScore += 6
    impactPassed.push(`Moderate action verbs (${actionVerbsFound.join(', ')})`)
    suggestions.push({
      id: 'impact-verbs-few',
      priority: 'medium',
      category: 'Impact & Verbs',
      text: 'Start more bullets with assertive action verbs (e.g., Architected, Optimized, Spearheaded, Automated).',
      pointsToGain: 4,
    })
  } else {
    impactFailed.push('Few or no strong action verbs detected in descriptions')
    suggestions.push({
      id: 'impact-verbs-none',
      priority: 'high',
      category: 'Impact & Verbs',
      text: 'Replace passive statements with strong action verbs (Built, Led, Engineered, Reduced).',
      pointsToGain: 10,
    })
  }

  // Count bullets with quantifiable metrics (10 pts max)
  let metricsBulletCount = 0
  for (const bullet of allBullets) {
    if (METRIC_REGEX.test(bullet)) {
      metricsBulletCount++
    }
  }

  if (metricsBulletCount >= 3) {
    impactScore += 10
    impactPassed.push(`Measurable impact present (${metricsBulletCount} bullets include quantifiable data/metrics)`)
    allPassedChecks.push('Quantified achievements with percentages and numbers')
  } else if (metricsBulletCount >= 1) {
    impactScore += 6
    impactPassed.push(`Some quantifiable evidence (${metricsBulletCount} bullets with metrics)`)
    suggestions.push({
      id: 'impact-metrics-few',
      priority: 'high',
      category: 'Impact & Metrics',
      text: 'Quantify 2 more achievements with measurable outcomes (e.g., "reduced latency by 40%", "supporting 5k active users").',
      pointsToGain: 4,
    })
  } else {
    impactFailed.push('No measurable metrics, percentages, or numbers found in bullet points')
    suggestions.push({
      id: 'impact-metrics-none',
      priority: 'high',
      category: 'Impact & Metrics',
      text: 'ATS algorithms favor quantified accomplishments. Add numbers, percentages, or scale metrics to your projects or experience.',
      pointsToGain: 10,
    })
  }

  const impactCategory: ATSCategoryScore = {
    category: 'impact',
    label: 'Action Verbs & Impact',
    score: impactScore,
    maxScore: 20,
    percentage: Math.round((impactScore / 20) * 100),
    passedItems: impactPassed,
    failedItems: impactFailed,
  }

  // -------------------------------------------------------------
  // 5. Readability & Length Balance (10 Points Max)
  // -------------------------------------------------------------
  let readabilityScore = 0
  const readabilityPassed: string[] = []
  const readabilityFailed: string[] = []

  // Summary Length check (5 pts)
  const summaryLength = (doc.personal.professionalSummary || '').trim().length
  if (summaryLength >= 100 && summaryLength <= 450) {
    readabilityScore += 5
    readabilityPassed.push(`Optimal summary length (${summaryLength} characters - within 100-450 range)`)
    allPassedChecks.push('Professional summary fits optimal ATS reading length')
  } else if (summaryLength > 450 && summaryLength <= 650) {
    readabilityScore += 3
    readabilityPassed.push('Summary is slightly detailed but acceptable')
    suggestions.push({
      id: 'readability-summary-long',
      priority: 'low',
      category: 'Readability',
      text: 'Trim summary slightly (under 450 characters) to ensure recruiters can scan it in 6 seconds.',
      pointsToGain: 2,
    })
  } else if (summaryLength > 0 && summaryLength < 100) {
    readabilityScore += 2
    readabilityFailed.push(`Summary is too brief (${summaryLength} chars)`)
    suggestions.push({
      id: 'readability-summary-brief',
      priority: 'medium',
      category: 'Readability',
      text: 'Expand summary to at least 100 characters to communicate your core strengths and background.',
      pointsToGain: 3,
    })
  } else {
    readabilityFailed.push('No professional summary provided')
  }

  // Bullets length check (5 pts)
  if (allBullets.length > 0) {
    const hasGiantWallOfText = allBullets.some((b) => b.length > 400)
    const hasTinyEmpty = allBullets.some((b) => b.trim().length < 15)

    if (!hasGiantWallOfText && !hasTinyEmpty) {
      readabilityScore += 5
      readabilityPassed.push('Bullet points are concise and cleanly formatted (no walls of text)')
      allPassedChecks.push('Clean bullet point lengths without dense text blocks')
    } else if (hasGiantWallOfText) {
      readabilityScore += 2
      readabilityFailed.push('Some bullet points exceed 400 characters (dense text blocks)')
      suggestions.push({
        id: 'readability-bullets-long',
        priority: 'medium',
        category: 'Readability',
        text: 'Break down long paragraphs into punchy 1-2 line bullet points.',
        pointsToGain: 3,
      })
    } else {
      readabilityScore += 3
      readabilityPassed.push('Acceptable bullet formatting')
    }
  } else {
    readabilityFailed.push('No bullet points available to assess')
  }

  const readabilityCategory: ATSCategoryScore = {
    category: 'readability',
    label: 'Readability & Length',
    score: readabilityScore,
    maxScore: 10,
    percentage: Math.round((readabilityScore / 10) * 100),
    passedItems: readabilityPassed,
    failedItems: readabilityFailed,
  }

  // -------------------------------------------------------------
  // Overall Score Calculation
  // -------------------------------------------------------------
  const overallScore = Math.min(
    100,
    contactScore + structureScore + keywordScore + impactScore + readabilityScore
  )

  let rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Issues' = 'Needs Improvement'
  if (overallScore >= 85) rating = 'Excellent'
  else if (overallScore >= 70) rating = 'Good'
  else if (overallScore >= 50) rating = 'Needs Improvement'
  else rating = 'Critical Issues'

  // Sort suggestions by priority (high > medium > low) and then by pointsToGain
  const priorityOrder = { high: 1, medium: 2, low: 3 }
  suggestions.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return b.pointsToGain - a.pointsToGain
  })

  return {
    overallScore,
    rating,
    categories: {
      contact: contactCategory,
      structure: structureCategory,
      keywords: keywordCategory,
      impact: impactCategory,
      readability: readabilityCategory,
    },
    passedChecks: allPassedChecks,
    actionableSuggestions: suggestions,
    matchedKeywords,
    missingKeywords,
    actionVerbsFound,
    metricsCount: metricsBulletCount,
    isJobSpecific,
    disclaimer: ATS_DISCLAIMER,
  }
}
