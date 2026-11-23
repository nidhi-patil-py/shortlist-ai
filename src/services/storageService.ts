import { supabase, isSupabaseConfigured } from './supabase'
import type {
  UserProfile,
  ResumeData,
  EducationItem,
  SkillItem,
  ExperienceItem,
  ProjectItem,
  CertificationItem,
} from '../types/resume'

// Default seed profile for demo or new user onboarding
export const DEFAULT_SAMPLE_PROFILE: UserProfile = {
  personal: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    professionalTitle: 'Frontend Software Engineer',
    professionalSummary:
      'Passionate and results-focused Frontend Engineer with a strong foundation in modern JavaScript, React, and responsive UI design. Proven track record building fast, accessible web applications and collaborating on agile product teams.',
    linkedinUrl: 'https://linkedin.com/in/alexmorgan',
    githubUrl: 'https://github.com/alexmorgan',
    portfolioUrl: 'https://alexmorgan.dev',
    otherUrl: 'https://dev.to/alexmorgan',
  },
  skills: [
    { id: 'sk-1', name: 'HTML5', category: 'technical', level: 'advanced' },
    { id: 'sk-2', name: 'CSS3', category: 'technical', level: 'advanced' },
    { id: 'sk-3', name: 'JavaScript (ES6+)', category: 'technical', level: 'advanced' },
    { id: 'sk-4', name: 'React', category: 'technical', level: 'advanced' },
    { id: 'sk-5', name: 'TypeScript', category: 'technical', level: 'intermediate' },
    { id: 'sk-6', name: 'Tailwind CSS', category: 'technical', level: 'advanced' },
    { id: 'sk-7', name: 'REST APIs', category: 'technical', level: 'intermediate' },
    { id: 'sk-8', name: 'Git & GitHub', category: 'tools', level: 'advanced' },
    { id: 'sk-9', name: 'Responsive Web Design', category: 'technical', level: 'advanced' },
    { id: 'sk-10', name: 'Agile & Scrum', category: 'soft', level: 'intermediate' },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2020',
      endDate: '2024',
      grade: '3.8 / 4.0 GPA',
      description: 'Coursework in Data Structures, Web Architecture, Algorithms, and UI Engineering.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'NextGen Digital Labs',
      jobTitle: 'Junior Frontend Developer',
      startDate: 'Jun 2024',
      endDate: 'Present',
      duration: 'Present',
      responsibilities: [
        'Built reusable React components with TypeScript and Tailwind CSS for client dashboards.',
        'Integrated RESTful API endpoints for user authentication and dynamic analytics feeds.',
        'Improved mobile viewport accessibility and Lighthouse performance scores by 22%.',
      ],
      achievements: [
        'Recognized for rapid delivery on quarterly UI redesign sprints.',
      ],
    },
  ],
  projects: [
    {
      id: 'prj-1',
      name: 'E-Commerce React Catalog',
      description:
        'A fully responsive online store featuring real-time product filtering, search debouncing, and cart persistence using React and Tailwind CSS.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
      projectLink: 'https://github.com/alexmorgan/ecommerce-store',
      startDate: 'Jan 2024',
      endDate: 'Apr 2024',
    },
    {
      id: 'prj-2',
      name: 'Job Application Tracker',
      description:
        'Lightweight personal CRM for tracking internship and job applications with status boards, notes, and local storage caching.',
      technologies: ['React', 'TypeScript', 'CSS3', 'HTML5'],
      projectLink: 'https://github.com/alexmorgan/app-tracker',
      startDate: 'May 2024',
      endDate: 'Jun 2024',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Meta Front-End Developer Certificate',
      issuingOrg: 'Meta / Coursera',
      issueDate: '2024',
      credentialUrl: 'https://coursera.org/verify/sample',
    },
  ],
}

// Blank profile template for clean user onboarding
export const createEmptyProfile = (userId: string, email = ''): UserProfile => ({
  userId,
  personal: {
    fullName: '',
    email,
    phone: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    otherUrl: '',
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
})

// Helper keys for local demo mode isolation
const getStorageKey = (userId: string, key: string) => `resumefit_user_${userId}_${key}`

export const storageService = {
  // --------------------------------------------------------------------------
  // USER PROFILE
  // --------------------------------------------------------------------------
  async getUserProfile(userId: string): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        if (profileErr) throw profileErr

        const [eduRes, skillsRes, expRes, prjRes, certRes] = await Promise.all([
          supabase.from('education').select('*').eq('user_id', userId),
          supabase.from('skills').select('*').eq('user_id', userId),
          supabase.from('experience').select('*').eq('user_id', userId),
          supabase.from('projects').select('*').eq('user_id', userId),
          supabase.from('certifications').select('*').eq('user_id', userId),
        ])

        if (profileData) {
          return {
            userId,
            personal: {
              fullName: profileData.full_name || '',
              email: profileData.email || '',
              phone: profileData.phone || '',
              location: profileData.location || '',
              professionalTitle: profileData.professional_title || '',
              professionalSummary: profileData.professional_summary || '',
              linkedinUrl: profileData.linkedin_url || '',
              githubUrl: profileData.github_url || '',
              portfolioUrl: profileData.portfolio_url || '',
              otherUrl: profileData.other_url || '',
            },
            education: (eduRes.data || []).map((e) => ({
              id: e.id,
              degree: e.degree,
              institution: e.institution,
              fieldOfStudy: e.field_of_study || '',
              startDate: e.start_date,
              endDate: e.end_date,
              grade: e.grade || '',
              description: e.description,
            })),
            skills: (skillsRes.data || []).map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              level: s.level,
            })),
            experience: (expRes.data || []).map((ex) => ({
              id: ex.id,
              company: ex.company,
              jobTitle: ex.job_title,
              startDate: ex.start_date,
              endDate: ex.end_date,
              duration: ex.duration,
              responsibilities: ex.responsibilities || [],
              achievements: ex.achievements || [],
            })),
            projects: (prjRes.data || []).map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              technologies: p.technologies || [],
              projectLink: p.project_link,
              startDate: p.start_date || '',
              endDate: p.end_date || '',
            })),
            certifications: (certRes.data || []).map((c) => ({
              id: c.id,
              name: c.name,
              issuingOrg: c.issuing_org,
              issueDate: c.issue_date,
              credentialUrl: c.credential_url,
            })),
          }
        }
      } catch (err) {
        console.warn('Falling back to local storage profile:', err)
      }
    }

    // Local / Demo Storage
    const saved = localStorage.getItem(getStorageKey(userId, 'profile'))
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Corrupted JSON, reset
      }
    }

    // Initialize with default template or blank profile
    const initialProfile = { ...DEFAULT_SAMPLE_PROFILE, userId }
    localStorage.setItem(getStorageKey(userId, 'profile'), JSON.stringify(initialProfile))
    return initialProfile
  },

  async saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
    const updatedProfile = {
      ...profile,
      userId,
      updatedAt: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').upsert({
          user_id: userId,
          full_name: profile.personal.fullName,
          email: profile.personal.email,
          phone: profile.personal.phone,
          location: profile.personal.location,
          professional_title: profile.personal.professionalTitle || '',
          professional_summary: profile.personal.professionalSummary,
          linkedin_url: profile.personal.linkedinUrl,
          github_url: profile.personal.githubUrl,
          portfolio_url: profile.personal.portfolioUrl,
          other_url: profile.personal.otherUrl || '',
          updated_at: updatedProfile.updatedAt,
        })

        // Replace education entries
        await supabase.from('education').delete().eq('user_id', userId)
        if (profile.education.length > 0) {
          await supabase.from('education').insert(
            profile.education.map((e) => ({
              user_id: userId,
              degree: e.degree,
              institution: e.institution,
              field_of_study: e.fieldOfStudy || '',
              start_date: e.startDate,
              end_date: e.endDate,
              grade: e.grade || '',
              description: e.description,
            }))
          )
        }

        // Replace skills
        await supabase.from('skills').delete().eq('user_id', userId)
        if (profile.skills.length > 0) {
          await supabase.from('skills').insert(
            profile.skills.map((s) => ({
              user_id: userId,
              name: s.name,
              category: s.category,
              level: s.level,
            }))
          )
        }

        // Replace experience
        await supabase.from('experience').delete().eq('user_id', userId)
        if (profile.experience.length > 0) {
          await supabase.from('experience').insert(
            profile.experience.map((ex) => ({
              user_id: userId,
              company: ex.company,
              job_title: ex.jobTitle,
              start_date: ex.startDate,
              end_date: ex.endDate,
              duration: ex.duration,
              responsibilities: ex.responsibilities,
              achievements: ex.achievements,
            }))
          )
        }

        // Replace projects
        await supabase.from('projects').delete().eq('user_id', userId)
        if (profile.projects.length > 0) {
          await supabase.from('projects').insert(
            profile.projects.map((p) => ({
              user_id: userId,
              name: p.name,
              description: p.description,
              technologies: p.technologies,
              project_link: p.projectLink,
              start_date: p.startDate || '',
              end_date: p.endDate || '',
            }))
          )
        }

        // Replace certifications
        await supabase.from('certifications').delete().eq('user_id', userId)
        if (profile.certifications.length > 0) {
          await supabase.from('certifications').insert(
            profile.certifications.map((c) => ({
              user_id: userId,
              name: c.name,
              issuing_org: c.issuingOrg,
              issue_date: c.issueDate,
              credential_url: c.credentialUrl,
            }))
          )
        }
      } catch (err) {
        console.warn('Failed to save to Supabase, saving locally:', err)
      }
    }

    // Always update local cache for offline resiliency
    localStorage.setItem(getStorageKey(userId, 'profile'), JSON.stringify(updatedProfile))
  },

  // Reset profile to blank or default sample
  async resetProfile(userId: string, toSample = false): Promise<UserProfile> {
    const fresh = toSample ? { ...DEFAULT_SAMPLE_PROFILE, userId } : createEmptyProfile(userId)
    await this.saveUserProfile(userId, fresh)
    return fresh
  },

  // --------------------------------------------------------------------------
  // RESUMES
  // --------------------------------------------------------------------------
  async getResumes(userId: string): Promise<ResumeData[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })

        if (error) throw error

        if (data) {
          return data.map((r) => ({
            id: r.id,
            userId: r.user_id,
            title: r.title,
            targetJobTitle: r.target_job_title,
            jobDescription: r.job_description,
            templateId: r.template_id,
            personal: r.personal || {},
            education: (r.education as EducationItem[]) || [],
            skills: (r.skills as SkillItem[]) || [],
            experience: (r.experience as ExperienceItem[]) || [],
            projects: (r.projects as ProjectItem[]) || [],
            certifications: (r.certifications as CertificationItem[]) || [],
            atsScore: r.ats_score,
            matchedKeywords: r.matched_keywords || [],
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }))
        }
      } catch (err) {
        console.warn('Falling back to local resumes:', err)
      }
    }

    const saved = localStorage.getItem(getStorageKey(userId, 'resumes'))
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  },

  async getResumeById(userId: string, resumeId: string): Promise<ResumeData | null> {
    const resumes = await this.getResumes(userId)
    return resumes.find((r) => r.id === resumeId) || null
  },

  async saveResume(userId: string, resume: ResumeData): Promise<ResumeData> {
    const now = new Date().toISOString()
    const updatedResume: ResumeData = {
      ...resume,
      userId,
      updatedAt: now,
      createdAt: resume.createdAt || now,
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .upsert({
            id: updatedResume.id,
            user_id: userId,
            title: updatedResume.title,
            target_job_title: updatedResume.targetJobTitle,
            job_description: updatedResume.jobDescription,
            template_id: updatedResume.templateId,
            personal: updatedResume.personal,
            education: updatedResume.education,
            skills: updatedResume.skills,
            experience: updatedResume.experience,
            projects: updatedResume.projects,
            certifications: updatedResume.certifications,
            ats_score: updatedResume.atsScore || 0,
            matched_keywords: updatedResume.matchedKeywords || [],
            updated_at: now,
          })
          .select()
          .single()

        if (!error && data) {
          updatedResume.id = data.id
        }
      } catch (err) {
        console.warn('Failed saving resume to Supabase, saving locally:', err)
      }
    }

    // Local storage persistence
    const resumes = await this.getResumes(userId)
    const existingIdx = resumes.findIndex((r) => r.id === updatedResume.id)
    if (existingIdx >= 0) {
      resumes[existingIdx] = updatedResume
    } else {
      resumes.unshift(updatedResume)
    }
    localStorage.setItem(getStorageKey(userId, 'resumes'), JSON.stringify(resumes))

    return updatedResume
  },

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('resumes').delete().eq('id', resumeId).eq('user_id', userId)
      } catch (err) {
        console.warn('Failed to delete resume in Supabase:', err)
      }
    }

    const resumes = await this.getResumes(userId)
    const filtered = resumes.filter((r) => r.id !== resumeId)
    localStorage.setItem(getStorageKey(userId, 'resumes'), JSON.stringify(filtered))
  },
}
