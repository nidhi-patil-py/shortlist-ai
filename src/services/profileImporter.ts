import { SKILL_ONTOLOGY } from './jdMatcher.ts'
import type { SkillItem, ExperienceItem, EducationItem } from '../types/resume.ts'

export interface ExtractedProfileData {
  fullName: string
  email: string
  phone: string
  location: string
  professionalTitle: string
  professionalSummary: string
  linkedinUrl: string
  githubUrl: string
  skills: SkillItem[]
  experience: ExperienceItem[]
  education: EducationItem[]
  rawTextSnippet: string
}

/**
 * Unescapes special PDF character representations
 */
function unescapePdfString(str: string): string {
  return str
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
}

/**
 * Extracts plain text lines from decompressed PDF content stream
 */
function extractTextFromStreamContent(streamText: string): string[] {
  const lines: string[] = []

  // 1. Match Tj single-string operators: (Hello World) Tj
  const tjRegex = /\((.*?)\)\s*Tj/g
  let match: RegExpExecArray | null
  while ((match = tjRegex.exec(streamText)) !== null) {
    const unescaped = unescapePdfString(match[1]).trim()
    if (unescaped) lines.push(unescaped)
  }

  // 2. Match TJ array operators: [(Hello) -10 (World)] TJ
  const tjArrayRegex = /\[(.*?)\]\s*TJ/g
  while ((match = tjArrayRegex.exec(streamText)) !== null) {
    const inner = match[1]
    const strParts: string[] = []
    const innerStrRegex = /\((.*?)\)/g
    let subMatch: RegExpExecArray | null
    while ((subMatch = innerStrRegex.exec(inner)) !== null) {
      strParts.push(unescapePdfString(subMatch[1]))
    }
    const combined = strParts.join('').trim()
    if (combined) lines.push(combined)
  }

  return lines
}

/**
 * Extracts text from PDF using modern browser DecompressionStream ('deflate').
 * Fully client-side with 0 external dependencies.
 */
export async function extractRawTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const uint8 = new Uint8Array(arrayBuffer)
  const marker = new TextEncoder().encode('stream')
  const endMarker = new TextEncoder().encode('endstream')

  const textLines: string[] = []

  // Helper to find sub-array index
  const indexOfSubarray = (src: Uint8Array, sub: Uint8Array, startFrom = 0): number => {
    outer: for (let i = startFrom; i <= src.length - sub.length; i++) {
      for (let j = 0; j < sub.length; j++) {
        if (src[i + j] !== sub[j]) continue outer
      }
      return i
    }
    return -1
  }

  let start = indexOfSubarray(uint8, marker)

  while (start !== -1) {
    let dataStart = start + marker.length
    // Skip CRLF or LF after 'stream'
    if (uint8[dataStart] === 0x0d && uint8[dataStart + 1] === 0x0a) dataStart += 2
    else if (uint8[dataStart] === 0x0a) dataStart += 1

    let dataEnd = indexOfSubarray(uint8, endMarker, dataStart)
    if (dataEnd > dataStart) {
      // Trim trailing newline before 'endstream'
      if (uint8[dataEnd - 1] === 0x0a && uint8[dataEnd - 2] === 0x0d) dataEnd -= 2
      else if (uint8[dataEnd - 1] === 0x0a) dataEnd -= 1

      const streamBytes = uint8.subarray(dataStart, dataEnd)

      // Try decompressing with DecompressionStream
      let decompressedText = ''
      try {
        if (typeof DecompressionStream !== 'undefined') {
          const ds = new DecompressionStream('deflate')
          const writer = ds.writable.getWriter()
          writer.write(streamBytes)
          writer.close()
          const reader = ds.readable.getReader()
          const chunks: Uint8Array[] = []
          while (true) {
            const { value, done } = await reader.read()
            if (done) break
            if (value) chunks.push(value)
          }

          // Combine chunks
          const totalLength = chunks.reduce((acc, c) => acc + c.length, 0)
          const merged = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            merged.set(chunk, offset)
            offset += chunk.length
          }
          decompressedText = new TextDecoder('latin1').decode(merged)
        }
      } catch {
        // Fallback: check if stream was uncompressed plain text
        decompressedText = new TextDecoder('latin1').decode(streamBytes)
      }

      if (decompressedText) {
        const lines = extractTextFromStreamContent(decompressedText)
        textLines.push(...lines)
      }
    }

    start = indexOfSubarray(uint8, marker, dataEnd > 0 ? dataEnd + endMarker.length : dataStart + 1)
  }

  // If no streams yielded text, fallback to decoding the whole file as latin1 and extracting parenthesized literals
  if (textLines.length === 0) {
    const rawPdf = new TextDecoder('latin1').decode(uint8)
    const literalMatches = rawPdf.match(/\((.*?)\)\s*T[jd]/g) || []
    for (const m of literalMatches) {
      const match = m.match(/\((.*?)\)/)
      if (match) textLines.push(unescapePdfString(match[1]))
    }
  }

  return textLines.join('\n')
}

/**
 * Intelligent rule-based NLP parser to convert raw extracted text into structured profile fields.
 * Handles LinkedIn Profile PDFs and standard Resume PDFs.
 */
export function parseProfileFromText(rawText: string): ExtractedProfileData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  // 1. Contact Extraction
  let email = ''
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
  const emailMatch = rawText.match(emailRegex)
  if (emailMatch) email = emailMatch[1].toLowerCase()

  let phone = ''
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  const phoneMatch = rawText.match(phoneRegex)
  if (phoneMatch) phone = phoneMatch[0].trim()

  let linkedinUrl = ''
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i
  const linkedinMatch = rawText.match(linkedinRegex)
  if (linkedinMatch) linkedinUrl = `https://linkedin.com/in/${linkedinMatch[1]}`

  let githubUrl = ''
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
  const githubMatch = rawText.match(githubRegex)
  if (githubMatch) githubUrl = `https://github.com/${githubMatch[1]}`

  // 2. Full Name & Headline / Professional Title
  let fullName = ''
  let professionalTitle = ''
  let location = ''

  // Filter header candidates (non-meta, non-link lines)
  const nonMetaLines = lines.filter(
    (l) =>
      !l.includes('@') &&
      !l.includes('http') &&
      !l.includes('linkedin.com') &&
      !l.includes('github.com') &&
      !/^\+?\d/.test(l) &&
      !/^Page \d/i.test(l) &&
      l.length < 70
  )

  if (nonMetaLines.length > 0) {
    fullName = nonMetaLines[0]
  }

  if (nonMetaLines.length > 1) {
    const candidateTitle = nonMetaLines[1]
    if (
      !/^(Summary|Experience|Skills|Education|About)/i.test(candidateTitle) &&
      candidateTitle.length > 3
    ) {
      professionalTitle = candidateTitle
    }
  }

  // Location search: "City, State" or "Country"
  const locationRegex = /\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}|[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z]+)\b/
  const locMatch = rawText.match(locationRegex)
  if (locMatch && !locMatch[1].includes('University') && !locMatch[1].includes('College')) {
    location = locMatch[1].trim()
  }

  // 3. Section Slicing: Summary, Experience, Education, Skills
  let professionalSummary = ''
  const lowerText = rawText.toLowerCase()

  const summaryStart = lowerText.indexOf('summary') !== -1 ? lowerText.indexOf('summary') : lowerText.indexOf('about')
  const experienceStart = lowerText.indexOf('experience')
  const educationStart = lowerText.indexOf('education')

  if (summaryStart !== -1) {
    const end = experienceStart !== -1 && experienceStart > summaryStart
      ? experienceStart
      : educationStart !== -1 && educationStart > summaryStart
      ? educationStart
      : summaryStart + 600

    const rawSummaryBlock = rawText.slice(summaryStart, end)
    const summaryLines = rawSummaryBlock
      .split('\n')
      .slice(1) // skip the word "Summary"
      .map((l) => l.trim())
      .filter((l) => l.length > 15 && !l.includes('http') && !l.includes('@'))

    if (summaryLines.length > 0) {
      professionalSummary = summaryLines.slice(0, 4).join(' ')
    }
  }

  // 4. Skills Extraction using Canonical Ontology
  const detectedSkills: SkillItem[] = []
  const seenSkillNames = new Set<string>()

  for (const item of SKILL_ONTOLOGY) {
    const matchesCanonical = new RegExp(`\\b${item.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText)
    const matchesAlias = item.aliases.some((alias) =>
      new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText)
    )

    if ((matchesCanonical || matchesAlias) && !seenSkillNames.has(item.canonical.toLowerCase())) {
      seenSkillNames.add(item.canonical.toLowerCase())
      detectedSkills.push({
        id: `skill-${Date.now()}-${detectedSkills.length}`,
        name: item.canonical,
        category: item.category,
      })
    }
  }

  // 5. Work Experience Parsing
  const experience: ExperienceItem[] = []
  if (experienceStart !== -1) {
    const expEnd = educationStart !== -1 && educationStart > experienceStart
      ? educationStart
      : rawText.length

    const expText = rawText.slice(experienceStart, expEnd)
    const expLines = expText
      .split('\n')
      .slice(1) // skip "Experience"
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    let currentExp: Partial<ExperienceItem> | null = null

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i]
      const dateRegex = /\b(19\d{2}|20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b.*?\b(Present|Current|19\d{2}|20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i
      const dateMatch = line.match(dateRegex)

      if (dateMatch) {
        if (currentExp && currentExp.jobTitle) {
          experience.push({
            id: `exp-${Date.now()}-${experience.length}`,
            company: currentExp.company || 'Company',
            jobTitle: currentExp.jobTitle || 'Role',
            startDate: currentExp.startDate || '',
            endDate: currentExp.endDate || 'Present',
            responsibilities: currentExp.responsibilities || [],
          })
        }

        const dateParts = line.split(/[-–—to]/i)
        const startDate = dateParts[0]?.trim() || '2022'
        const endDate = dateParts[1]?.trim() || 'Present'

        // The line before or the text on same line is the title/company
        const prevLine = i > 0 ? expLines[i - 1] : ''
        let jobTitle = 'Software Engineer'
        let company = 'Tech Corp'

        if (prevLine && prevLine.length < 60) {
          if (prevLine.includes(' - ') || prevLine.includes(' at ')) {
            const parts = prevLine.split(/ - | at /i)
            jobTitle = parts[0]?.trim() || jobTitle
            company = parts[1]?.trim() || company
          } else {
            jobTitle = prevLine
          }
        }

        currentExp = {
          jobTitle,
          company,
          startDate,
          endDate,
          responsibilities: [],
        }
      } else if (currentExp) {
        if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
          const bullet = line.replace(/^[-•*]\s*/, '').trim()
          if (bullet.length > 10) {
            currentExp.responsibilities = currentExp.responsibilities || []
            currentExp.responsibilities.push(bullet)
          }
        } else if (line.length > 25 && !line.includes('Page ')) {
          currentExp.responsibilities = currentExp.responsibilities || []
          if (currentExp.responsibilities.length < 5) {
            currentExp.responsibilities.push(line)
          }
        }
      }
    }

    if (currentExp && currentExp.jobTitle) {
      experience.push({
        id: `exp-${Date.now()}-${experience.length}`,
        company: currentExp.company || 'Company',
        jobTitle: currentExp.jobTitle || 'Role',
        startDate: currentExp.startDate || '',
        endDate: currentExp.endDate || 'Present',
        responsibilities: currentExp.responsibilities || [],
      })
    }
  }

  // 6. Education Parsing
  const education: EducationItem[] = []
  if (educationStart !== -1) {
    const eduText = rawText.slice(educationStart)
    const eduLines = eduText
      .split('\n')
      .slice(1) // skip "Education"
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i]
      if (
        /University|College|Institute|School|Academy|Polytechnic/i.test(line) ||
        /Bachelor|Master|B\.?S|M\.?S|B\.?Tech|M\.?Tech|Ph\.?D|Degree/i.test(line)
      ) {
        const nextLine = i + 1 < eduLines.length ? eduLines[i + 1] : ''
        const dateMatch = (line + ' ' + nextLine).match(/\b(20\d{2}|19\d{2})\b.*?(\b(20\d{2}|19\d{2})\b|Present|Graduated)?/i)

        let institution = 'University'
        let degree = 'Bachelor of Science in Computer Science'

        if (/University|College|Institute|School|Academy/i.test(line)) {
          institution = line
          if (nextLine && /Bachelor|Master|B\.?S|M\.?S|B\.?Tech|Degree|Science|Engineering/i.test(nextLine)) {
            degree = nextLine
            i++ // advance past consumed degree line
          }
        } else {
          degree = line
          if (nextLine && /University|College|Institute|School/i.test(nextLine)) {
            institution = nextLine
            i++ // advance past consumed institution line
          }
        }

        // If the very next line contains the date, skip it on next iteration
        if (i + 1 < eduLines.length && /\b(19\d{2}|20\d{2})\b/.test(eduLines[i + 1])) {
          i++
        }

        education.push({
          id: `edu-${Date.now()}-${education.length}`,
          institution,
          degree,
          startDate: dateMatch ? dateMatch[1] : '2018',
          endDate: dateMatch && dateMatch[2] ? dateMatch[2] : '2022',
        })

        if (education.length >= 3) break
      }
    }
  }

  return {
    fullName: fullName || '',
    email: email || '',
    phone: phone || '',
    location: location || '',
    professionalTitle: professionalTitle || '',
    professionalSummary: professionalSummary || '',
    linkedinUrl: linkedinUrl || '',
    githubUrl: githubUrl || '',
    skills: detectedSkills,
    experience,
    education,
    rawTextSnippet: rawText.slice(0, 300),
  }
}

/**
 * Main entry point: extracts text from any uploaded PDF/Text resume or LinkedIn PDF
 */
export async function extractProfileFromFile(file: File): Promise<ExtractedProfileData> {
  let rawText = ''

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer()
    rawText = await extractRawTextFromPdf(arrayBuffer)
  } else {
    // Plain text / Markdown / JSON fallback
    rawText = await file.text()
  }

  return parseProfileFromText(rawText)
}
