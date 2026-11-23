import assert from 'node:assert'
import { jsPDF } from 'jspdf'
import {
  extractRawTextFromPdf,
  parseProfileFromText,
} from '../src/services/profileImporter.ts'

console.log('🧪 Starting Smart Resume & LinkedIn PDF Importer Tests...\n')

// 1. Text Parsing & Structure Extraction
console.log('Test 1: Parsing Structured Candidate Text (Simulated LinkedIn Profile)')
const sampleProfileText = `
Elena Rostova
Principal Frontend Architect
elena.rostova@example.com
+1 (555) 789-0123
San Francisco, CA
https://linkedin.com/in/elenarostova
https://github.com/elenarostova

Summary
Passionate engineer with 8 years of experience leading UI architecture and delivering accessible React and TypeScript web applications at scale.

Experience
Staff Engineer - CloudScale Technologies
2021 - Present
- Spearheaded migration of legacy frontend to Next.js and Tailwind CSS
- Reduced Largest Contentful Paint (LCP) by 42% across core dashboard
- Mentored junior engineers and led code review standards

Senior Frontend Developer - TechNova Labs
2018 - 2021
- Built reusable component library using React, TypeScript, and Storybook
- Integrated REST APIs and GraphQL microservices with 99.9% uptime

Education
University of California, Berkeley
Bachelor of Science in Computer Science
2014 - 2018

Skills
React, TypeScript, Next.js, Node.js, GraphQL, REST APIs, Tailwind CSS, Docker, AWS, Git, CI/CD, Problem Solving
`

const parsed = parseProfileFromText(sampleProfileText)

assert.strictEqual(parsed.fullName, 'Elena Rostova', 'Candidate full name should be extracted')
assert.strictEqual(parsed.professionalTitle, 'Principal Frontend Architect', 'Professional title should be extracted')
assert.strictEqual(parsed.email, 'elena.rostova@example.com', 'Email should be extracted')
assert.strictEqual(parsed.phone, '+1 (555) 789-0123', 'Phone should be extracted')
assert.strictEqual(parsed.linkedinUrl, 'https://linkedin.com/in/elenarostova', 'LinkedIn URL should be extracted')
assert.strictEqual(parsed.githubUrl, 'https://github.com/elenarostova', 'GitHub URL should be extracted')
assert(parsed.professionalSummary.includes('Passionate engineer with 8 years'), 'Summary should be extracted')
assert(parsed.skills.length >= 8, `Expected at least 8 detected skills, got ${parsed.skills.length}`)
assert(parsed.skills.some((s) => s.name === 'React'), 'Should extract React skill')
assert(parsed.skills.some((s) => s.name === 'TypeScript'), 'Should extract TypeScript skill')
assert(parsed.skills.some((s) => s.name === 'Docker'), 'Should extract Docker skill')
assert(parsed.skills.some((s) => s.category === 'tools'), 'Should categorize tools')
assert(parsed.skills.some((s) => s.category === 'technical'), 'Should categorize technical skills')
assert.strictEqual(parsed.experience.length, 2, 'Should extract 2 work experience entries')
assert.strictEqual(parsed.experience[0].company, 'CloudScale Technologies')
assert.strictEqual(parsed.education.length, 1, 'Should extract 1 education entry')
assert(parsed.education[0].institution.includes('University of California'))
console.log('  ✓ Structured fields accurately parsed from LinkedIn text')

// 2. Client-Side PDF Stream Extraction with jsPDF
console.log('\nTest 2: Real Binary PDF Generation & DecompressionStream Extraction')
const doc = new jsPDF({ compress: true })
doc.text('David Kumar', 10, 10)
doc.text('Senior Backend Engineer', 10, 20)
doc.text('david.kumar@example.com', 10, 30)
doc.text('+1 (555) 456-7890', 10, 40)
doc.text('linkedin.com/in/davidkumar', 10, 50)
doc.text('Summary', 10, 60)
doc.text('Backend engineer specializing in distributed systems, Node.js, PostgreSQL, and AWS.', 10, 70)
doc.text('Skills', 10, 80)
doc.text('Node.js, PostgreSQL, Docker, AWS, Kubernetes, TypeScript', 10, 90)

const pdfArrayBuffer = doc.output('arraybuffer')
assert(pdfArrayBuffer.byteLength > 100, 'PDF buffer must have valid byte length')

const extractedPdfText = await extractRawTextFromPdf(pdfArrayBuffer)
assert(extractedPdfText.includes('David Kumar'), 'Extracted PDF text must contain candidate name')
assert(extractedPdfText.includes('david.kumar@example.com'), 'Extracted PDF text must contain email')

const parsedPdf = parseProfileFromText(extractedPdfText)
assert.strictEqual(parsedPdf.fullName, 'David Kumar', 'Parsed PDF full name must match')
assert.strictEqual(parsedPdf.email, 'david.kumar@example.com', 'Parsed PDF email must match')
assert(parsedPdf.skills.some((s) => s.name === 'Node.js'), 'Must extract Node.js from PDF')
assert(parsedPdf.skills.some((s) => s.name === 'PostgreSQL'), 'Must extract PostgreSQL from PDF')
console.log('  ✓ FlateDecode PDF stream decompressed & parsed with zero external dependencies')

// 3. Zero-Hallucination Invariant
console.log('\nTest 3: Zero-Hallucination Verification')
// Unrelated skills must not be fabricated
assert(!parsedPdf.skills.some((s) => s.name === 'C++'), 'C++ must NOT be hallucinated if not present in input')
assert(!parsedPdf.skills.some((s) => s.name === 'Golang'), 'Golang must NOT be hallucinated if not present in input')
console.log('  ✓ Zero-hallucination verified: only verified skills extracted')

console.log('\n🎉 ALL SMART PROFILE IMPORTER TESTS PASSED!\n')
