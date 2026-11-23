import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import {
  isCapacitorNative,
  getCapacitorPlatform,
  blobToBase64,
} from '../src/services/capacitorBridge.ts'

console.log('🧪 Starting Capacitor Android Integration Tests...\n')

// 1. Safe runtime guards
console.log('Test 1: Web Fallback & Runtime Safety')
assert.strictEqual(isCapacitorNative(), false, 'isCapacitorNative should be false in node/web environment')
assert.strictEqual(getCapacitorPlatform(), 'web', 'Platform should default to web outside native wrapper')
console.log('  ✓ Web runtime safely detected (no native crash)')

// 2. Base64 Blob Conversion
console.log('\nTest 2: Blob to Base64 Encoding for Native Filesystem')
const sampleText = 'ResumeFit ATS PDF binary content'
const testBlob = new Blob([sampleText], { type: 'text/plain' })
const base64 = await blobToBase64(testBlob)
const decoded = Buffer.from(base64, 'base64').toString('utf-8')
assert.strictEqual(decoded, sampleText, 'Decoded base64 must match original text')
console.log('  ✓ Base64 conversion verified for Capacitor Filesystem bridge')

// 3. Capacitor Config
console.log('\nTest 3: capacitor.config.ts Validation')
const configPath = path.resolve('capacitor.config.ts')
assert(fs.existsSync(configPath), 'capacitor.config.ts must exist')
const configContent = fs.readFileSync(configPath, 'utf-8')
assert(configContent.includes("appId: 'com.resumefit.app'"), 'Must define com.resumefit.app appId')
assert(configContent.includes("appName: 'ResumeFit'"), 'Must define ResumeFit appName')
assert(configContent.includes("webDir: 'dist'"), 'Must define dist as webDir')
console.log('  ✓ capacitor.config.ts correctly configured for Android APK')

// 4. Android Project Structure & Metadata
console.log('\nTest 4: Android Native Project Directory Verification')
const androidRoot = path.resolve('android')
assert(fs.existsSync(androidRoot), 'android/ folder must exist')
assert(fs.existsSync(path.join(androidRoot, 'app/build.gradle')), 'android/app/build.gradle must exist')
assert(fs.existsSync(path.join(androidRoot, 'app/src/main/AndroidManifest.xml')), 'AndroidManifest.xml must exist')
assert(fs.existsSync(path.join(androidRoot, 'app/src/main/java/com/resumefit/app/MainActivity.java')), 'MainActivity.java must exist')

const appGradle = fs.readFileSync(path.join(androidRoot, 'app/build.gradle'), 'utf-8')
assert(appGradle.includes('com.resumefit.app'), 'app/build.gradle must use com.resumefit.app namespace/applicationId')

const stringsXml = fs.readFileSync(path.join(androidRoot, 'app/src/main/res/values/strings.xml'), 'utf-8')
assert(stringsXml.includes('ResumeFit'), 'strings.xml must have ResumeFit app_name')

const colorsXml = fs.readFileSync(path.join(androidRoot, 'app/src/main/res/values/colors.xml'), 'utf-8')
assert(colorsXml.includes('#4F46E5'), 'colors.xml must define #4F46E5 brand primary')

console.log('  ✓ Android project verified: com.resumefit.app, MainActivity, strings, and colors intact')

console.log('\n🎉 ALL CAPACITOR ANDROID INTEGRATION TESTS PASSED!')
