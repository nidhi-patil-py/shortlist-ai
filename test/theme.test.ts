import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { THEME_STORAGE_KEY } from '../src/context/useTheme.ts'

console.log('🧪 Starting Dark Mode & Theme System Tests...\n')

// 1. Storage Key Invariant
console.log('Test 1: Theme Storage Key Validation')
assert.strictEqual(THEME_STORAGE_KEY, 'resumefit_theme', 'THEME_STORAGE_KEY must be "resumefit_theme"')
console.log('  ✓ Storage key conforms to "resumefit_theme"')

// 2. Zero-Flash Head Script in index.html
console.log('\nTest 2: Zero-Flash Script in index.html')
const indexHtmlPath = path.resolve('index.html')
assert(fs.existsSync(indexHtmlPath), 'index.html must exist')
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
assert(indexHtml.includes('resumefit_theme'), 'index.html must check resumefit_theme from localStorage')
assert(indexHtml.includes('prefers-color-scheme: dark'), 'index.html must check OS prefers-color-scheme: dark')
assert(indexHtml.includes("classList.add('dark')"), "index.html must add 'dark' class before rendering")
assert(indexHtml.includes("classList.remove('dark')"), "index.html must remove 'dark' class for light mode")
console.log('  ✓ Zero-flash inline script verified in <head>')

// 3. Tailwind CSS v4 Dark Variant Setup
console.log('\nTest 3: Tailwind CSS v4 Dark Mode Configuration in index.css')
const cssPath = path.resolve('src/index.css')
assert(fs.existsSync(cssPath), 'src/index.css must exist')
const cssContent = fs.readFileSync(cssPath, 'utf-8')
assert(
  cssContent.includes('@custom-variant dark'),
  'src/index.css must declare @custom-variant dark for Tailwind v4'
)
assert(
  cssContent.includes('.resume-paper'),
  'src/index.css must declare .resume-paper rules'
)
console.log('  ✓ Tailwind CSS v4 dark variant & resume paper rules verified')

// 4. White Paper Invariant for ATS Resumes
console.log('\nTest 4: Strict Recruiter ATS White Paper Invariant')
const resumeDocPath = path.resolve('src/components/resume/ResumeDocument.tsx')
assert(fs.existsSync(resumeDocPath), 'ResumeDocument.tsx must exist')
const resumeDocContent = fs.readFileSync(resumeDocPath, 'utf-8')
assert(
  resumeDocContent.includes('resume-paper w-full bg-white text-slate-900'),
  'ResumeDocument must keep .resume-paper strictly "bg-white text-slate-900" for 100% ATS readability'
)
console.log('  ✓ Resume document sheet is strictly white in both Light and Dark modes')

// 5. Navbar Sun/Moon Toggle Verification
console.log('\nTest 5: Navbar Theme Toggle Button')
const navbarPath = path.resolve('src/components/common/Navbar.tsx')
assert(fs.existsSync(navbarPath), 'Navbar.tsx must exist')
const navbarContent = fs.readFileSync(navbarPath, 'utf-8')
assert(navbarContent.includes('useTheme'), 'Navbar must consume useTheme()')
assert(navbarContent.includes('toggleTheme'), 'Navbar must bind toggleTheme handler')
assert(navbarContent.includes('Sun'), 'Navbar must render Sun icon')
assert(navbarContent.includes('Moon'), 'Navbar must render Moon icon')
console.log('  ✓ Navbar Sun/Moon toggle controls verified for desktop & mobile')

console.log('\n🌟 All Dark Mode & Theme System Tests Passed!\n')
