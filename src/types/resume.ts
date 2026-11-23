export interface PersonalDetails {
  fullName: string
  email: string
  phone: string
  location: string
  professionalSummary: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string
  description?: string
}

export interface SkillItem {
  id: string
  name: string
  category: 'technical' | 'soft' | 'tools'
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export interface ExperienceItem {
  id: string
  company: string
  jobTitle: string
  startDate: string
  endDate: string
  duration?: string
  responsibilities: string[]
  achievements?: string[]
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string[]
  projectLink?: string
}

export interface CertificationItem {
  id: string
  name: string
  issuingOrg: string
  issueDate: string
  credentialUrl?: string
}

export interface UserProfile {
  id?: string
  userId?: string
  personal: PersonalDetails
  education: EducationItem[]
  skills: SkillItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  updatedAt?: string
}

export interface ATSMatchResult {
  score: number // 0-100
  matchedSkills: string[]
  missingSkills: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  selectedProjects: ProjectItem[]
  selectedExperience: ExperienceItem[]
  improvementSuggestions: string[]
  explanation: {
    keywordScore: number
    completenessScore: number
    formattingScore: number
    relevanceScore: number
  }
}

export type ResumeTemplateId = 'ats-classic' | 'ats-modern' | 'ats-executive'

export interface ResumeData {
  id: string
  userId?: string
  title: string
  targetJobTitle?: string
  jobDescription?: string
  templateId: ResumeTemplateId
  personal: PersonalDetails
  education: EducationItem[]
  skills: SkillItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  atsScore?: number
  matchedKeywords?: string[]
  createdAt: string
  updatedAt: string
}
