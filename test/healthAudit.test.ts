import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { checkResumeATS, type ATSCheckableDocument } from '../src/services/atsChecker.ts'
import { matchJobDescription, buildTailoredResume } from '../src/services/jdMatcher.ts'
import { formatResumeFilename, generateDirectPDF } from '../src/services/pdfExportService.ts'
import { storageService } from '../src/services/storageService.ts'
import type { UserProfile, ResumeData } from '../src/types/resume.ts'

console.log('🧪 Starting Full-Codebase Comprehensive Health & Edge-Case Audit...\n')

// ============================================================================
// Test 1: ATS Checker Extreme Sparse / Empty Edge-Case Safety
// ============================================================================
console.log('Health Check 1: ATS Checker Sparse / Undefined Field Safety')
// @ts-expect-error Intentionally sparse document for edge-case audit
const sparseDoc: ATSCheckableDocument = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    linkedinUrl: '',
    githubUrl: '',
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
}

const sparseResult = checkResumeATS(sparseDoc, '')
assert.strictEqual(typeof sparseResult.overallScore, 'number')
assert.strictEqual(sparseResult.rating, 'Critical Issues')
assert(sparseResult.actionableSuggestions.length > 0)
assert.strictEqual(sparseResult.disclaimer.includes('Shortlist AI'), true)
console.log('  ✓ ATS Checker safely processes zero-item / sparse documents without throwing')

// ============================================================================
// Test 2: JD Matcher Sparse / Malformed Profile Safety
// ============================================================================
console.log('\nHealth Check 2: JD Matcher Sparse / Malformed Profile Safety')
// @ts-expect-error Intentionally testing missing sub-arrays
const emptyProfile: UserProfile = {
  userId: 'test-user-sparse',
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalTitle: '',
    professionalSummary: '',
    linkedinUrl: '',
    githubUrl: '',
  },
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
}

const matchResult = matchJobDescription('Senior React Developer needed with TypeScript and GraphQL', emptyProfile)
assert.strictEqual(matchResult.matchPercentage, 0)
assert.deepStrictEqual(matchResult.matchedSkills, [])
assert(matchResult.missingSkills.includes('React'))
assert(matchResult.missingSkills.includes('TypeScript'))
assert(matchResult.missingSkills.includes('GraphQL'))

const tailored = buildTailoredResume(emptyProfile, matchResult, 'React Engineer', 'Acme Inc', 'Need React')
assert.strictEqual(tailored.targetJobTitle, 'React Engineer')
assert(tailored.title.includes('Acme Inc'))
console.log('  ✓ JD Matcher and Tailored Resume generator handle sparse inputs safely')

// ============================================================================
// Test 3: PDF Export Service Sparse Resume Safety
// ============================================================================
console.log('\nHealth Check 3: PDF Export Service Filename & jsPDF Vector Export')
// @ts-expect-error Sparse resume data
const sparseResume: ResumeData = {
  id: 'resume-sparse-1',
  userId: 'user-sparse',
  title: '',
  targetJobTitle: '',
  templateId: 'ats-classic',
  personal: {
    fullName: '',
    email: '',
  },
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const safeFilename = formatResumeFilename(sparseResume)
assert(safeFilename.endsWith('_Shortlist_AI.pdf'), 'Filename must end with _Shortlist_AI.pdf')

const { blob, filename } = await generateDirectPDF(sparseResume, 'a4')
assert(blob instanceof Blob)
assert(blob.size > 1000)
assert.strictEqual(filename, safeFilename)
console.log(`  ✓ jsPDF cleanly builds vector PDF from sparse document (${blob.size} bytes: ${filename})`)

// ============================================================================
// Test 4: Storage Service Account Deletion & Cache Purging
// ============================================================================
console.log('\nHealth Check 4: User Account Deletion & Multi-Key Cache Purge')
class MockStorage {
  private data = new Map<string, string>()
  getItem(key: string) { return this.data.get(key) || null }
  setItem(key: string, val: string) { this.data.set(key, val) }
  removeItem(key: string) { this.data.delete(key) }
  clear() { this.data.clear() }
}

const mock = new MockStorage()
;(globalThis as unknown as { localStorage: MockStorage }).localStorage = mock

const testUserId = 'audit-user-delete-test'
mock.setItem(`shortlistai_user_${testUserId}_profile`, JSON.stringify({ userId: testUserId }))
mock.setItem(`shortlistai_user_${testUserId}_resumes`, JSON.stringify([]))
mock.setItem(`resumefit_user_${testUserId}_profile`, JSON.stringify({ userId: testUserId }))
mock.setItem(`resumefit_user_${testUserId}_resumes`, JSON.stringify([]))

await storageService.deleteUserAccount(testUserId)

assert.strictEqual(mock.getItem(`shortlistai_user_${testUserId}_profile`), null)
assert.strictEqual(mock.getItem(`shortlistai_user_${testUserId}_resumes`), null)
assert.strictEqual(mock.getItem(`resumefit_user_${testUserId}_profile`), null)
assert.strictEqual(mock.getItem(`resumefit_user_${testUserId}_resumes`), null)
console.log('  ✓ storageService.deleteUserAccount cleanly purges both modern and legacy keys')

// ============================================================================
// Test 5: Vercel SPA Routing & Manifest Branding Verification
// ============================================================================
console.log('\nHealth Check 5: Vercel SPA Configuration & Manifest Verification')
const vercelRaw = fs.readFileSync(path.resolve('vercel.json'), 'utf-8')
const vercelJson = JSON.parse(vercelRaw)
assert(Array.isArray(vercelJson.rewrites))
assert(vercelJson.rewrites.some((r: { source: string; destination: string }) => r.source === '/(.*)' && r.destination === '/index.html'))

const manifestRaw = fs.readFileSync(path.resolve('public/manifest.json'), 'utf-8')
const manifestJson = JSON.parse(manifestRaw)
assert.strictEqual(manifestJson.name, 'Shortlist AI - ATS Resume Builder')
assert.strictEqual(manifestJson.short_name, 'Shortlist AI')

const webmanifestRaw = fs.readFileSync(path.resolve('public/manifest.webmanifest'), 'utf-8')
const webmanifestJson = JSON.parse(webmanifestRaw)
assert.strictEqual(webmanifestJson.name, 'Shortlist AI - ATS Resume Builder')
assert.strictEqual(webmanifestJson.short_name, 'Shortlist AI')

const swRaw = fs.readFileSync(path.resolve('public/sw.js'), 'utf-8')
assert(swRaw.includes('shortlistai-v1.0.0'))
console.log('  ✓ vercel.json, manifest.json, manifest.webmanifest, and sw.js all verified')

// ============================================================================
// Test 6: Strict Recruiter ATS White Paper Invariant
// ============================================================================
console.log('\nHealth Check 6: CSS Dark Mode Isolation for .resume-paper')
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf-8')
assert(indexCss.includes('.resume-paper'))
assert(indexCss.includes('background-color: #ffffff !important'))
assert(indexCss.includes('color: #0f172a !important'))
console.log('  ✓ Resume document sheet is strictly locked to #ffffff / #0f172a across all themes')

console.log('\n=============================================================')
console.log('🎉 ALL FULL-CODEBASE HEALTH & EDGE-CASE AUDIT CHECKS PASSED!')
console.log('=============================================================\n')
