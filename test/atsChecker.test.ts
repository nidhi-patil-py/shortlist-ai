import assert from 'node:assert'
import {
  checkResumeATS,
  ATS_DISCLAIMER,
  type ATSCheckableDocument,
} from '../src/services/atsChecker.ts'

console.log('🧪 Starting ATS Compatibility Checker Engine Tests...\n')

// 1. Comprehensive High-Quality Document
const perfectDoc: ATSCheckableDocument = {
  personal: {
    fullName: 'Jane Developer',
    email: 'jane.developer@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    professionalTitle: 'Senior Full Stack Engineer',
    professionalSummary:
      'Product-focused software engineer with 5+ years of experience architecting resilient cloud services and accessible web applications using TypeScript and React.',
    linkedinUrl: 'https://linkedin.com/in/janedev',
    githubUrl: 'https://github.com/janedev',
    portfolioUrl: 'https://janedev.com',
  },
  skills: [
    { id: '1', name: 'React', category: 'technical' },
    { id: '2', name: 'TypeScript', category: 'technical' },
    { id: '3', name: 'Node.js', category: 'technical' },
    { id: '4', name: 'PostgreSQL', category: 'technical' },
    { id: '5', name: 'Docker', category: 'tools' },
    { id: '6', name: 'AWS', category: 'tools' },
    { id: '7', name: 'Tailwind CSS', category: 'technical' },
    { id: '8', name: 'REST APIs', category: 'technical' },
  ],
  experience: [
    {
      id: 'e1',
      company: 'SaaS Platform Inc',
      jobTitle: 'Senior Software Engineer',
      startDate: '2022',
      endDate: '2025',
      responsibilities: [
        'Built full-stack real-time analytics dashboards serving 250,000+ monthly active users.',
        'Architected backend REST microservices in Node.js, reducing average query response time by 42%.',
      ],
      achievements: [
        'Spearheaded migration to TypeScript, eliminating 35% of runtime production exceptions.',
      ],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Open Source Cloud Monitor',
      description:
        'Engineered containerized telemetry monitor using Docker and AWS, achieving 99.99% uptime for 10,000 requests per minute.',
      technologies: ['TypeScript', 'Docker', 'AWS'],
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      startDate: '2016',
      endDate: '2020',
    },
  ],
}

console.log('Test 1: High-Quality Resume (General ATS Baseline - No JD)')
const resultGeneral = checkResumeATS(perfectDoc)

assert(resultGeneral.overallScore >= 95, `Expected score >= 95, got ${resultGeneral.overallScore}`)
assert.strictEqual(resultGeneral.rating, 'Excellent')
assert.strictEqual(resultGeneral.categories.contact.score, 15, 'Contact should be 15/15')
assert.strictEqual(resultGeneral.categories.structure.score, 20, 'Structure should be 20/20')
assert.strictEqual(resultGeneral.categories.impact.score, 20, 'Impact should be 20/20')
assert.strictEqual(resultGeneral.categories.readability.score, 10, 'Readability should be 10/10')
assert(resultGeneral.metricsCount >= 3, 'Should detect >= 3 metrics')
assert(resultGeneral.actionVerbsFound.length >= 4, 'Should detect >= 4 action verbs')
console.log(`  ✓ General check scored ${resultGeneral.overallScore}/100 (Rating: ${resultGeneral.rating})`)

// 2. Target Job Description Keyword Alignment
console.log('\nTest 2: Target Job Description Keyword Alignment')
const jd = `
We are looking for a Senior React and TypeScript engineer experienced in AWS, Docker, and REST APIs.
`
const resultJD = checkResumeATS(perfectDoc, jd)
assert.strictEqual(resultJD.isJobSpecific, true, 'Should mark isJobSpecific as true')
assert(resultJD.matchedKeywords.includes('React'), 'Matched keywords must contain React')
assert(resultJD.matchedKeywords.includes('TypeScript'), 'Matched keywords must contain TypeScript')
assert(resultJD.matchedKeywords.includes('AWS'), 'Matched keywords must contain AWS')
assert(resultJD.matchedKeywords.includes('Docker'), 'Matched keywords must contain Docker')
assert(resultJD.categories.keywords.score >= 30, 'Keyword score should be high for matching JD')
console.log(`  ✓ Job-specific alignment verified: ${resultJD.matchedKeywords.length} keywords matched`)

// 3. Sparse / Incomplete Document (Low Score & Actionable Suggestions)
console.log('\nTest 3: Incomplete Document Diagnostics & Suggestions')
const sparseDoc: ATSCheckableDocument = {
  personal: {
    fullName: '',
    email: 'bad-email-no-domain',
    phone: '',
    location: '',
    professionalSummary: '',
  },
  skills: [],
  experience: [],
  projects: [],
  education: [],
}

const resultSparse = checkResumeATS(sparseDoc)
assert(resultSparse.overallScore <= 15, `Expected score <= 15 for empty doc, got ${resultSparse.overallScore}`)
assert.strictEqual(resultSparse.rating, 'Critical Issues')
assert(resultSparse.actionableSuggestions.length >= 5, 'Should generate multiple prioritized suggestions')

// Check that top suggestions are high priority
const highPrioritySuggestions = resultSparse.actionableSuggestions.filter((s) => s.priority === 'high')
assert(highPrioritySuggestions.length >= 3, 'Should have multiple high priority suggestions')
console.log(`  ✓ Sparse document accurately scored ${resultSparse.overallScore}/100 with ${resultSparse.actionableSuggestions.length} targeted suggestions`)

// 4. Action Verbs & Metrics Detection
console.log('\nTest 4: Action Verbs and Measurable Metrics Extraction')
assert(resultGeneral.actionVerbsFound.includes('built'), 'Should extract "built"')
assert(resultGeneral.actionVerbsFound.includes('architected'), 'Should extract "architected"')
assert(resultGeneral.actionVerbsFound.includes('spearheaded'), 'Should extract "spearheaded"')
assert(resultGeneral.actionVerbsFound.includes('engineered'), 'Should extract "engineered"')
console.log(`  ✓ Detected action verbs: ${resultGeneral.actionVerbsFound.join(', ')}`)

// 5. Disclaimer Integrity
console.log('\nTest 5: Educational Disclaimer Integrity')
assert(resultGeneral.disclaimer.includes("does not guarantee employment"), 'Disclaimer must state no employment guarantee')
assert.strictEqual(resultGeneral.disclaimer, ATS_DISCLAIMER)
console.log('  ✓ Disclaimer verified: Transparent educational disclosure')

console.log('\n🎉 ALL ATS CHECKER ENGINE TESTS PASSED SUCCESSFULLY!')
