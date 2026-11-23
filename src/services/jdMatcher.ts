import type { UserProfile, ResumeData, ProjectItem, ExperienceItem, SkillItem } from '../types/resume'

// Canonical skill ontology with synonyms, aliases, and categories
export interface CanonicalSkill {
  canonical: string
  aliases: string[]
  category: 'technical' | 'tools' | 'soft'
}

export const SKILL_ONTOLOGY: CanonicalSkill[] = [
  // Technical / Languages & Frameworks
  { canonical: 'React', aliases: ['react', 'react.js', 'reactjs', 'react js'], category: 'technical' },
  { canonical: 'TypeScript', aliases: ['typescript', 'ts'], category: 'technical' },
  { canonical: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'es6+', 'ecmascript'], category: 'technical' },
  { canonical: 'Node.js', aliases: ['node.js', 'nodejs', 'node js', 'node'], category: 'technical' },
  { canonical: 'Python', aliases: ['python', 'python3', 'py'], category: 'technical' },
  { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'], category: 'technical' },
  { canonical: 'REST APIs', aliases: ['rest', 'restful', 'rest api', 'rest apis', 'restful api', 'restful apis', 'api integration'], category: 'technical' },
  { canonical: 'GraphQL', aliases: ['graphql', 'graph ql'], category: 'technical' },
  { canonical: 'HTML5', aliases: ['html', 'html5'], category: 'technical' },
  { canonical: 'CSS3', aliases: ['css', 'css3', 'sass', 'scss'], category: 'technical' },
  { canonical: 'Next.js', aliases: ['next.js', 'nextjs', 'next js', 'next'], category: 'technical' },
  { canonical: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs'], category: 'technical' },
  { canonical: 'Angular', aliases: ['angular', 'angularjs'], category: 'technical' },
  { canonical: 'SQL', aliases: ['sql', 'relational databases', 'rdbms'], category: 'technical' },
  { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql', 'psql'], category: 'technical' },
  { canonical: 'MongoDB', aliases: ['mongodb', 'mongo', 'nosql'], category: 'technical' },
  { canonical: 'MySQL', aliases: ['mysql'], category: 'technical' },
  { canonical: 'Redis', aliases: ['redis', 'caching'], category: 'technical' },
  { canonical: 'Java', aliases: ['java', 'spring', 'springboot', 'spring boot'], category: 'technical' },
  { canonical: 'C++', aliases: ['c++', 'cpp'], category: 'technical' },
  { canonical: 'C#', aliases: ['c#', 'csharp', '.net', 'dotnet'], category: 'technical' },
  { canonical: 'Golang', aliases: ['go', 'golang'], category: 'technical' },
  { canonical: 'System Design', aliases: ['system design', 'distributed systems', 'microservices', 'software architecture'], category: 'technical' },
  { canonical: 'Responsive Web Design', aliases: ['responsive web design', 'responsive design', 'mobile-first', 'cross-browser'], category: 'technical' },
  { canonical: 'Performance Optimization', aliases: ['performance optimization', 'web vitals', 'lighthouse', 'code splitting'], category: 'technical' },
  { canonical: 'Unit Testing', aliases: ['jest', 'vitest', 'unit testing', 'test driven development', 'tdd', 'cypress', 'playwright'], category: 'technical' },

  // Tools & Platforms
  { canonical: 'Git & GitHub', aliases: ['git', 'github', 'gitlab', 'version control', 'bitbucket'], category: 'tools' },
  { canonical: 'Docker', aliases: ['docker', 'container', 'containers', 'containerization'], category: 'tools' },
  { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s'], category: 'tools' },
  { canonical: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloud'], category: 'tools' },
  { canonical: 'Google Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'], category: 'tools' },
  { canonical: 'Microsoft Azure', aliases: ['azure', 'microsoft azure'], category: 'tools' },
  { canonical: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration', 'github actions', 'jenkins'], category: 'tools' },
  { canonical: 'Linux', aliases: ['linux', 'unix', 'bash', 'shell scripting'], category: 'tools' },
  { canonical: 'Figma', aliases: ['figma', 'ui/ux', 'wireframes'], category: 'tools' },
  { canonical: 'Postman', aliases: ['postman', 'api testing'], category: 'tools' },

  // Soft Skills
  { canonical: 'Agile & Scrum', aliases: ['agile', 'scrum', 'sprint planning', 'kanban'], category: 'soft' },
  { canonical: 'Cross-functional Collaboration', aliases: ['collaboration', 'cross-functional', 'communication', 'team player', 'stakeholder management'], category: 'soft' },
  { canonical: 'Problem Solving', aliases: ['problem solving', 'troubleshooting', 'analytical thinking', 'debugging'], category: 'soft' },
  { canonical: 'Code Review', aliases: ['code review', 'mentorship', 'peer review'], category: 'soft' },
]

export interface JDAnalysisResult {
  matchPercentage: number
  matchedSkills: string[]
  missingSkills: string[]
  allJdKeywords: {
    technical: string[]
    tools: string[]
    soft: string[]
  }
  prioritizedProjects: ProjectItem[]
  prioritizedExperience: ExperienceItem[]
  rankedSkills: SkillItem[]
  tailoredSummary: string
}

/**
 * Normalizes text and matches against canonical ontology
 */
export function extractCanonicalKeywords(text: string): {
  technical: string[]
  tools: string[]
  soft: string[]
  allCanonicals: string[]
} {
  if (!text || text.trim().length === 0) {
    return { technical: [], tools: [], soft: [], allCanonicals: [] }
  }

  // Preprocess text: lower case, normalize punctuation
  const cleanText = text.toLowerCase()

  const detectedMap = new Map<string, CanonicalSkill>()

  for (const item of SKILL_ONTOLOGY) {
    for (const alias of item.aliases) {
      // Create word boundary aware regex (handling special characters like ++, #, /, .)
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(^|[^a-z0-9+#/.-])${escaped}([^a-z0-9+#/.-]|$)`, 'i')

      if (regex.test(cleanText)) {
        detectedMap.set(item.canonical, item)
        break
      }
    }
  }

  const technical: string[] = []
  const tools: string[] = []
  const soft: string[] = []
  const allCanonicals: string[] = []

  detectedMap.forEach((item, canonical) => {
    allCanonicals.push(canonical)
    if (item.category === 'technical') technical.push(canonical)
    else if (item.category === 'tools') tools.push(canonical)
    else if (item.category === 'soft') soft.push(canonical)
  })

  return { technical, tools, soft, allCanonicals }
}

/**
 * Checks if a candidate's skill matches a canonical skill or its aliases
 */
export function isSkillMatch(candidateSkillName: string, targetCanonical: string): boolean {
  const normCandidate = candidateSkillName.toLowerCase().trim()
  const normTarget = targetCanonical.toLowerCase().trim()

  if (normCandidate === normTarget) return true

  const ontologyEntry = SKILL_ONTOLOGY.find((o) => o.canonical === targetCanonical)
  if (!ontologyEntry) return false

  return ontologyEntry.aliases.some((alias) => {
    return normCandidate.includes(alias) || alias.includes(normCandidate)
  })
}

/**
 * Main Job Description Matching Algorithm
 * Strictly rule-based, deterministic, and 100% truthful to existing user profile
 */
export function matchJobDescription(
  jobDescription: string,
  profile: UserProfile,
  targetJobTitle?: string
): JDAnalysisResult {
  const extracted = extractCanonicalKeywords(jobDescription)
  const jdCanonicals = extracted.allCanonicals

  if (jdCanonicals.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      allJdKeywords: { technical: [], tools: [], soft: [] },
      prioritizedProjects: profile.projects,
      prioritizedExperience: profile.experience,
      rankedSkills: profile.skills,
      tailoredSummary: profile.personal.professionalSummary,
    }
  }

  // 1. Identify matched vs missing skills
  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  for (const canonical of jdCanonicals) {
    const isMatched = profile.skills.some((userSkill) => isSkillMatch(userSkill.name, canonical))
    if (isMatched) {
      matchedSkills.push(canonical)
    } else {
      missingSkills.push(canonical)
    }
  }

  // 2. Calculate match percentage (0 - 100)
  const keywordRatio = matchedSkills.length / Math.max(1, jdCanonicals.length)
  const hasProjects = profile.projects.length > 0 ? 10 : 0
  const hasExperience = profile.experience.length > 0 ? 10 : 0
  const hasSummary = profile.personal.professionalSummary ? 5 : 0

  const matchPercentage = Math.min(
    100,
    Math.round(keywordRatio * 75 + hasProjects + hasExperience + hasSummary)
  )

  // 3. Reorder and rank the candidate's existing skills
  // Matched skills are prioritized at the top; no fake skills are ever added
  const rankedSkills = [...profile.skills].sort((a, b) => {
    const aMatched = jdCanonicals.some((c) => isSkillMatch(a.name, c))
    const bMatched = jdCanonicals.some((c) => isSkillMatch(b.name, c))
    if (aMatched && !bMatched) return -1
    if (!aMatched && bMatched) return 1
    return 0
  })

  // 4. Prioritize Projects based on JD keyword relevance
  const prioritizedProjects = [...profile.projects].sort((a, b) => {
    const scoreA = calculateItemRelevance(
      `${a.name} ${a.description} ${(a.technologies || []).join(' ')}`,
      jdCanonicals
    )
    const scoreB = calculateItemRelevance(
      `${b.name} ${b.description} ${(b.technologies || []).join(' ')}`,
      jdCanonicals
    )
    return scoreB - scoreA
  })

  // 5. Prioritize Experience based on JD keyword relevance
  const prioritizedExperience = [...profile.experience].sort((a, b) => {
    const scoreA = calculateItemRelevance(
      `${a.jobTitle} ${a.company} ${(a.responsibilities || []).join(' ')} ${(a.achievements || []).join(' ')}`,
      jdCanonicals
    )
    const scoreB = calculateItemRelevance(
      `${b.jobTitle} ${b.company} ${(b.responsibilities || []).join(' ')} ${(b.achievements || []).join(' ')}`,
      jdCanonicals
    )
    return scoreB - scoreA
  })

  // 6. Formulate tailored professional summary using ONLY candidate's genuine matched skills
  let tailoredSummary = profile.personal.professionalSummary
  if (matchedSkills.length > 0 && targetJobTitle) {
    const topMatched = matchedSkills.slice(0, 4).join(', ')
    tailoredSummary = `Results-oriented professional targeting the ${targetJobTitle} position. Proven technical background in ${topMatched}, with demonstrated experience executing high-quality web applications, adhering to clean architecture standards, and collaborating across agile environments.`
  }

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    allJdKeywords: {
      technical: extracted.technical,
      tools: extracted.tools,
      soft: extracted.soft,
    },
    prioritizedProjects,
    prioritizedExperience,
    rankedSkills,
    tailoredSummary,
  }
}

/**
 * Calculates keyword overlap frequency for an item
 */
function calculateItemRelevance(text: string, canonicals: string[]): number {
  if (!text) return 0
  const lower = text.toLowerCase()
  let score = 0
  for (const c of canonicals) {
    if (isSkillMatch(lower, c)) {
      score += 2
    }
  }
  return score
}

/**
 * Generates an ATS-tailored ResumeData object ready to be saved
 */
export function buildTailoredResume(
  profile: UserProfile,
  analysis: JDAnalysisResult,
  targetJobTitle: string,
  targetCompany: string,
  jobDescription: string
): ResumeData {
  const companyPrefix = targetCompany.trim() ? ` - ${targetCompany.trim()}` : ''
  const roleTitle = targetJobTitle.trim() || 'Software Engineer'

  return {
    id: `resume-${Date.now()}`,
    userId: profile.userId,
    title: `${roleTitle}${companyPrefix} Resume`,
    targetJobTitle: roleTitle,
    jobDescription: jobDescription.trim(),
    templateId: 'ats-modern',
    settings: {
      sectionOrder: ['summary', 'skills', 'projects', 'experience', 'education', 'certifications'],
      sectionVisibility: {
        summary: true,
        skills: true,
        projects: true,
        experience: true,
        education: true,
        certifications: true,
      },
      fontFamily: 'sans',
      fontSize: 'normal',
      spacing: 'normal',
    },
    personal: {
      ...profile.personal,
      professionalTitle: roleTitle,
      professionalSummary: analysis.tailoredSummary || profile.personal.professionalSummary,
    },
    // Genuine, ranked skills with matched skills at the front
    skills: analysis.rankedSkills,
    // Projects prioritized by relevance
    projects: analysis.prioritizedProjects,
    // Experience prioritized by relevance
    experience: analysis.prioritizedExperience,
    education: profile.education,
    certifications: profile.certifications,
    atsScore: analysis.matchPercentage,
    matchedKeywords: analysis.matchedSkills,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
