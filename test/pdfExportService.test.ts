import assert from 'node:assert'
import {
  formatResumeFilename,
  generateDirectPDF,
} from '../src/services/pdfExportService.ts'
import type { ResumeData } from '../src/types/resume.ts'

console.log('🧪 Starting PDF Export Service Tests...\n')

const mockResume: ResumeData = {
  id: 'resume-test-1',
  title: 'Senior Frontend Developer Resume',
  targetJobTitle: 'Senior Frontend Developer',
  templateId: 'ats-modern',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    fullName: 'Jane C. Developer',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Seattle, WA',
    professionalTitle: 'Lead UI Architect',
    professionalSummary:
      'Passionate UI architect with 8+ years building enterprise React systems, improving web vitals by 45%, and leading cross-functional engineering teams.',
    linkedinUrl: 'https://linkedin.com/in/janedev',
    githubUrl: 'https://github.com/janedev',
  },
  skills: [
    { id: '1', name: 'React', category: 'technical' },
    { id: '2', name: 'TypeScript', category: 'technical' },
    { id: '3', name: 'Node.js', category: 'technical' },
    { id: '4', name: 'Tailwind CSS', category: 'technical' },
  ],
  experience: [
    {
      id: 'e1',
      company: 'Tech Solutions Inc',
      jobTitle: 'Senior UI Engineer',
      startDate: '2021',
      endDate: 'Present',
      responsibilities: [
        'Architected modern micro-frontend applications serving 500k daily visitors.',
        'Mentored junior engineers and spearheaded automated unit testing.',
      ],
      achievements: [
        'Reduced Time-to-Interactive by 38% across core user checkouts.',
      ],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Design System Library',
      description: 'Built accessible, themeable React component library downloaded 100k+ times.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Software Engineering',
      institution: 'University of Washington',
      startDate: '2013',
      endDate: '2017',
    },
  ],
  certifications: [
    {
      id: 'c1',
      name: 'AWS Certified Cloud Practitioner',
      issuingOrg: 'Amazon Web Services',
      issueDate: '2023',
    },
  ],
}

// 1. Filename Sanitization & Formatting
console.log('Test 1: Filename Formatting and Sanitization')
const filename = formatResumeFilename(mockResume)
assert(
  filename.startsWith('Jane_C_Developer_Senior_Frontend_Developer_ResumeFit.pdf'),
  `Unexpected filename: ${filename}`
)
console.log(`  ✓ Formatted filename: ${filename}`)

// 2. Direct Vector PDF File Generation (A4)
console.log('\nTest 2: Direct Vector PDF File Generation (A4)')
const a4Result = await generateDirectPDF(mockResume, 'a4')
assert(a4Result.blob, 'Should return a valid PDF blob')
assert.strictEqual(a4Result.filename, filename, 'Filename must match format')
assert(a4Result.blob.size > 2000, `Expected PDF blob size > 2000 bytes, got ${a4Result.blob.size}`)
console.log(`  ✓ Generated valid A4 PDF (${a4Result.blob.size} bytes)`)

// 3. Direct Vector PDF File Generation (US Letter)
console.log('\nTest 3: Direct Vector PDF File Generation (US Letter)')
const letterResult = await generateDirectPDF(mockResume, 'letter')
assert(letterResult.blob, 'Should return a valid Letter PDF blob')
assert(letterResult.blob.size > 2000, `Expected PDF blob size > 2000 bytes, got ${letterResult.blob.size}`)
console.log(`  ✓ Generated valid US Letter PDF (${letterResult.blob.size} bytes)`)

console.log('\n🎉 ALL PDF EXPORT SERVICE TESTS PASSED SUCCESSFULLY!')
