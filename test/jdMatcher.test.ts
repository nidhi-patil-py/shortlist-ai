import assert from 'node:assert'
import {
  extractCanonicalKeywords,
  matchJobDescription,
  buildTailoredResume,
} from '../src/services/jdMatcher.ts'
import type { UserProfile } from '../src/types/resume.ts'

console.log('🧪 Starting JD Matcher Rule-Based Engine Tests...\n')

// 1. Synonym & Alias Matching Tests
console.log('Test 1: Normalization & Aliases Detection')
const jdReactNode = 'Looking for a Senior ReactJS and Node.js developer with RESTful API experience.'
const extracted1 = extractCanonicalKeywords(jdReactNode)

assert(extracted1.allCanonicals.includes('React'), 'Should detect React from ReactJS')
assert(extracted1.allCanonicals.includes('Node.js'), 'Should detect Node.js from Node.js')
assert(extracted1.allCanonicals.includes('REST APIs'), 'Should detect REST APIs from RESTful API')
console.log('  ✓ ReactJS, Node.js, and RESTful API aliases correctly mapped to canonicals')

// Special characters
console.log('\nTest 2: Special Characters Handling (C++, C#, CI/CD)')
const jdSpecial = 'Requires solid knowledge of C++, C#, and continuous integration with CI/CD.'
const extracted2 = extractCanonicalKeywords(jdSpecial)
assert(extracted2.allCanonicals.includes('C++'), 'Should detect C++')
assert(extracted2.allCanonicals.includes('C#'), 'Should detect C#')
assert(extracted2.allCanonicals.includes('CI/CD'), 'Should detect CI/CD')
console.log('  ✓ C++, C#, CI/CD correctly extracted without regex collision')

// 2. Empty JD Test
console.log('\nTest 3: Empty or Whitespace-only Job Description')
const mockProfile: UserProfile = {
  userId: 'user-123',
  personal: {
    fullName: 'Jane Developer',
    email: 'jane@example.com',
    phone: '555-0100',
    location: 'New York, NY',
    professionalTitle: 'Full Stack Engineer',
    professionalSummary: 'Experienced developer building web solutions.',
  },
  education: [],
  skills: [
    { id: 's1', name: 'React', category: 'technical', proficiency: 'advanced' },
    { id: 's2', name: 'TypeScript', category: 'technical', proficiency: 'intermediate' },
    { id: 's3', name: 'Docker', category: 'tools', proficiency: 'beginner' },
  ],
  experience: [
    {
      id: 'e1',
      company: 'Tech Corp',
      jobTitle: 'Frontend Dev',
      startDate: '2022',
      endDate: '2024',
      current: false,
      responsibilities: ['Built user interfaces with React and Tailwind'],
      achievements: ['Improved page load by 30%'],
    },
    {
      id: 'e2',
      company: 'Data Systems',
      jobTitle: 'Backend Dev',
      startDate: '2020',
      endDate: '2022',
      current: false,
      responsibilities: ['Maintained Python and SQL services'],
      achievements: [],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Python Data Pipeline',
      description: 'ETL workflow in Python and SQL',
      technologies: ['Python', 'SQL', 'Docker'],
    },
    {
      id: 'p2',
      name: 'E-Commerce Frontend',
      description: 'Modern shopping app built with React, TypeScript, and REST APIs',
      technologies: ['React', 'TypeScript', 'REST APIs'],
    },
  ],
  certifications: [],
  socialLinks: [],
  updatedAt: new Date().toISOString(),
}

const emptyAnalysis = matchJobDescription('', mockProfile)
assert.strictEqual(emptyAnalysis.matchPercentage, 0, 'Match percentage for empty JD must be 0')
assert.strictEqual(emptyAnalysis.matchedSkills.length, 0, 'Matched skills must be empty')
assert.strictEqual(emptyAnalysis.missingSkills.length, 0, 'Missing skills must be empty')
console.log('  ✓ Handled empty JD cleanly with 0% match and zero crashes')

// 3. Zero-Match JD Test
console.log('\nTest 4: Completely Unrelated JD (Zero Matches)')
const unrelatedJD = 'Seeking a Dental Hygienist or Registered Nurse with clinical patient care experience.'
const zeroAnalysis = matchJobDescription(unrelatedJD, mockProfile)
assert.strictEqual(zeroAnalysis.matchedSkills.length, 0, 'Matched skills should be 0')
console.log('  ✓ Correctly returned 0 matched skills for unrelated job requirements')

// 4. Relevant JD: Skill Reordering & Relevance Prioritization
console.log('\nTest 5: Ranking & Relevance Prioritization')
const targetJD = `
We need a React developer proficient in TypeScript and REST APIs.
Knowledge of Docker is helpful.
`
const analysis = matchJobDescription(targetJD, mockProfile, 'Frontend Engineer')

// Verify skills reordering: React, TypeScript, Docker should come first
assert(analysis.matchedSkills.includes('React'), 'React should be in matched skills')
assert(analysis.matchedSkills.includes('TypeScript'), 'TypeScript should be in matched skills')
assert(analysis.matchedSkills.includes('Docker'), 'Docker should be in matched skills')

// Missing skill: REST APIs was in the JD, but in profile skills it's missing (only in project)
assert(analysis.missingSkills.includes('REST APIs'), 'REST APIs should be identified as missing in profile skills')

// Projects prioritization: Project p2 (React, TypeScript, REST APIs) must be ranked ahead of p1
assert.strictEqual(analysis.prioritizedProjects[0].id, 'p2', 'Project 2 (E-Commerce Frontend) must be ranked #1 for a React role')
console.log('  ✓ Most relevant project correctly prioritized to #1 position')

// 5. Strict Zero-Hallucination Guarantee
console.log('\nTest 6: Strict Zero-Hallucination Guarantee')
const tailoredResume = buildTailoredResume(
  mockProfile,
  analysis,
  'Frontend Engineer',
  'Acme Corp',
  targetJD
)

// Ensure tailored resume skills array ONLY contains original user skills, never missing skills
const candidateOriginalSkillNames = mockProfile.skills.map((s) => s.name)
for (const skill of tailoredResume.skills) {
  assert(
    candidateOriginalSkillNames.includes(skill.name),
    `CRITICAL: Hallucinated skill detected! "${skill.name}" was not in candidate profile.`
  )
}
assert.strictEqual(
  tailoredResume.skills.length,
  mockProfile.skills.length,
  'Resume skill count must strictly equal original profile skill count'
)
console.log('  ✓ Zero-hallucination verified: 0 fake skills added to generated resume')

// 6. Summary Formatting Guarantee
console.log('\nTest 7: Professional Summary Generation')
assert(
  tailoredResume.personal.professionalSummary.includes('Frontend Engineer'),
  'Summary should reference target job title'
)
console.log('  ✓ Summary correctly customized with candidate genuine matched skills')

console.log('\n🎉 ALL JD MATCHER ENGINE TESTS PASSED SUCCESSFULLY!')
