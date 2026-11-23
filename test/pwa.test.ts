import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

console.log('🧪 Starting PWA Manifest, Service Worker & Asset Verification Tests...\n')

// 1. Web App Manifest Verification
console.log('Test 1: Web App Manifest Validation')
const manifestPath = path.resolve('public/manifest.webmanifest')
assert(fs.existsSync(manifestPath), 'manifest.webmanifest must exist in public/')

const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
assert.strictEqual(manifestContent.name, 'ResumeFit - ATS Resume Builder')
assert.strictEqual(manifestContent.short_name, 'ResumeFit')
assert.strictEqual(manifestContent.display, 'standalone')
assert.strictEqual(manifestContent.start_url, '/')
assert.strictEqual(manifestContent.theme_color, '#4F46E5')
assert.strictEqual(manifestContent.background_color, '#F8FAFC')
assert(Array.isArray(manifestContent.icons), 'Icons array must be present')
assert(manifestContent.icons.length >= 3, 'Must define multiple icon sizes')

const has192 = manifestContent.icons.some((i: { sizes: string }) => i.sizes === '192x192')
const has512 = manifestContent.icons.some((i: { sizes: string }) => i.sizes === '512x512')
const hasMaskable = manifestContent.icons.some((i: { purpose: string }) => i.purpose === 'maskable')

assert(has192, 'Manifest must declare 192x192 icon')
assert(has512, 'Manifest must declare 512x512 icon')
assert(hasMaskable, 'Manifest must declare maskable icon for Android adaptive icons')
console.log('  ✓ Web App Manifest passes all PWA installability requirements')

// 2. Service Worker File & Strategies Verification
console.log('\nTest 2: Lightweight Service Worker Verification')
const swPath = path.resolve('public/sw.js')
assert(fs.existsSync(swPath), 'sw.js must exist in public/')

const swCode = fs.readFileSync(swPath, 'utf-8')
assert(swCode.includes('addEventListener(\'install\''), 'SW must have install event listener')
assert(swCode.includes('addEventListener(\'activate\''), 'SW must have activate event listener')
assert(swCode.includes('addEventListener(\'fetch\''), 'SW must have fetch event listener')
assert(swCode.includes('caches.open('), 'SW must open cache')
assert(swCode.includes('navigate'), 'SW must support SPA navigate mode fallback')
assert(swCode.includes('skipWaiting'), 'SW must skipWaiting for instant service updates')
assert(swCode.includes('clients.claim'), 'SW must claim clients upon activation')
console.log('  ✓ Service Worker contains robust offline caching and navigation fallbacks')

// 3. PNG & SVG Icon Assets
console.log('\nTest 3: Icon Assets and PNG Signature Check')
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

const icon192 = fs.readFileSync(path.resolve('public/icon-192.png'))
assert(icon192.subarray(0, 8).equals(pngSignature), 'icon-192.png must be a valid PNG binary')

const icon512 = fs.readFileSync(path.resolve('public/icon-512.png'))
assert(icon512.subarray(0, 8).equals(pngSignature), 'icon-512.png must be a valid PNG binary')

const pwaSvg = fs.readFileSync(path.resolve('public/pwa-icon.svg'), 'utf-8')
assert(pwaSvg.includes('<svg') && pwaSvg.includes('</svg>'), 'pwa-icon.svg must be valid SVG')
console.log('  ✓ Valid PNG signatures and SVG assets verified')

// 4. HTML Head Links
console.log('\nTest 4: HTML PWA Meta Tags Verification')
const htmlContent = fs.readFileSync(path.resolve('index.html'), 'utf-8')
assert(htmlContent.includes('rel="manifest"'), 'index.html must link to manifest')
assert(htmlContent.includes('rel="apple-touch-icon"'), 'index.html must define apple-touch-icon')
assert(htmlContent.includes('name="theme-color"'), 'index.html must define theme-color')
assert(htmlContent.includes('name="apple-mobile-web-app-capable"'), 'index.html must define iOS standalone meta')
console.log('  ✓ HTML head contains all required PWA discovery tags')

console.log('\n🎉 ALL PWA SUPPORT TESTS PASSED SUCCESSFULLY!')
