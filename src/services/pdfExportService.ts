import type { ResumeData } from '../types/resume'

export type PaperSize = 'a4' | 'letter'

/**
 * Formats a clean, standard recruiter-friendly filename
 * e.g., "Alex_Morgan_Frontend_Engineer_Resume.pdf"
 */
export function formatResumeFilename(resume: ResumeData): string {
  const name = resume.personal.fullName?.trim() || 'Candidate'
  const role = resume.targetJobTitle?.trim() || 'Resume'

  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_')
  const cleanRole = role.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_')

  return `${cleanName}_${cleanRole}_ResumeFit.pdf`
}

/**
 * Primary Web Export:
 * Triggers native browser vector print with proper document title.
 * 100% selectable vector text, zero bundle bloat, maximum ATS parser compatibility.
 */
export function exportResumeViaPrint(resume: ResumeData, paperSize: PaperSize = 'a4'): void {
  const originalTitle = document.title
  const pdfFilename = formatResumeFilename(resume).replace(/\.pdf$/i, '')

  // Set document title temporarily so browser default PDF save name matches cleanly
  document.title = pdfFilename

  // Dynamically configure @page size rule in case user selected US Letter vs A4
  let styleEl = document.getElementById('resumefit-print-page-style')
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'resumefit-print-page-style'
    document.head.appendChild(styleEl)
  }

  const pageSizeRule = paperSize === 'letter' ? 'letter portrait' : 'A4 portrait'
  styleEl.textContent = `@media print { @page { size: ${pageSizeRule} !important; margin: 10mm 10mm !important; } }`

  const handleAfterPrint = () => {
    document.title = originalTitle
    window.removeEventListener('afterprint', handleAfterPrint)
  }

  window.addEventListener('afterprint', handleAfterPrint)

  // Trigger print dialog
  window.print()

  // Fallback title restore in case user cancels quickly
  setTimeout(() => {
    document.title = originalTitle
  }, 3000)
}

/**
 * Direct File / Mobile Export:
 * Programmatic vector PDF generation using jsPDF.
 * CRITICAL: Dynamically imported via import('jspdf') ONLY when called,
 * ensuring 0 KB addition to initial landing page or main route bundle.
 */
export async function generateDirectPDF(
  resume: ResumeData,
  paperSize: PaperSize = 'a4'
): Promise<{ blob: Blob; filename: string }> {
  // Dynamic import ensures jsPDF is only loaded on-demand
  // Using self-contained UMD bundle ensures zero auxiliary dependencies (no canvg / html2canvas)
  // @ts-expect-error UMD module import typing
  const jspdfModule = await import('jspdf/dist/jspdf.umd.min.js')
  const jsPDF = jspdfModule.jsPDF || jspdfModule.default?.jsPDF || jspdfModule.default

  const isLetter = paperSize === 'letter'
  const format = isLetter ? 'letter' : 'a4'
  const pageWidth = isLetter ? 215.9 : 210
  const pageHeight = isLetter ? 279.4 : 297

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format,
  })

  const marginLeft = 15
  const marginRight = 15
  const contentWidth = pageWidth - marginLeft - marginRight
  const pageBottomThreshold = pageHeight - 15

  let y = 18

  // Helper for automatic page breaks
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageBottomThreshold) {
      doc.addPage(format, 'portrait')
      y = 18
    }
  }

  // 1. Candidate Name (Header)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42) // Slate 900
  const fullName = resume.personal.fullName || 'Candidate'
  doc.text(fullName, marginLeft, y)
  y += 6

  // Professional Title
  if (resume.personal.professionalTitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(79, 70, 229) // Indigo 600
    doc.text(resume.personal.professionalTitle, marginLeft, y)
    y += 5
  }

  // Contact Info Line
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(100, 116, 139) // Slate 500

  const contactParts: string[] = []
  if (resume.personal.email) contactParts.push(resume.personal.email)
  if (resume.personal.phone) contactParts.push(resume.personal.phone)
  if (resume.personal.location) contactParts.push(resume.personal.location)
  if (resume.personal.linkedinUrl) contactParts.push(resume.personal.linkedinUrl.replace(/^https?:\/\//, ''))
  if (resume.personal.githubUrl) contactParts.push(resume.personal.githubUrl.replace(/^https?:\/\//, ''))
  if (resume.personal.portfolioUrl) contactParts.push(resume.personal.portfolioUrl.replace(/^https?:\/\//, ''))

  const contactLine = contactParts.join('  •  ')
  const contactLines = doc.splitTextToSize(contactLine, contentWidth)
  doc.text(contactLines, marginLeft, y)
  y += contactLines.length * 4 + 3

  // Divider Rule
  doc.setDrawColor(226, 232, 240) // Slate 200
  doc.setLineWidth(0.4)
  doc.line(marginLeft, y, marginLeft + contentWidth, y)
  y += 5

  // Helper for section headings
  const renderSectionHeader = (title: string) => {
    checkPageBreak(12)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(15, 23, 42)
    doc.text(title.toUpperCase(), marginLeft, y)
    y += 1.5

    doc.setDrawColor(79, 70, 229) // Indigo accent bar
    doc.setLineWidth(0.6)
    doc.line(marginLeft, y, marginLeft + 25, y)
    y += 4
  }

  // 2. Professional Summary
  if (resume.personal.professionalSummary && resume.personal.professionalSummary.trim()) {
    renderSectionHeader('Professional Summary')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(51, 65, 85) // Slate 700
    const summaryLines = doc.splitTextToSize(resume.personal.professionalSummary.trim(), contentWidth)
    checkPageBreak(summaryLines.length * 4)
    doc.text(summaryLines, marginLeft, y)
    y += summaryLines.length * 4 + 4
  }

  // 3. Technical Skills
  if (resume.skills && resume.skills.length > 0) {
    renderSectionHeader('Technical Skills')
    const skillNames = resume.skills.map((s) => s.name).join(', ')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(51, 65, 85)
    const skillLines = doc.splitTextToSize(skillNames, contentWidth)
    checkPageBreak(skillLines.length * 4)
    doc.text(skillLines, marginLeft, y)
    y += skillLines.length * 4 + 4
  }

  // 4. Projects
  if (resume.projects && resume.projects.length > 0) {
    renderSectionHeader('Projects')
    for (const proj of resume.projects) {
      checkPageBreak(14)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(15, 23, 42)
      doc.text(proj.name, marginLeft, y)

      if (proj.technologies && proj.technologies.length > 0) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(100, 116, 139)
        const techStr = `(${proj.technologies.join(', ')})`
        const nameWidth = doc.getTextWidth(proj.name)
        doc.text(techStr, marginLeft + nameWidth + 3, y)
      }
      y += 4

      if (proj.description) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(51, 65, 85)
        const descLines = doc.splitTextToSize(proj.description, contentWidth - 4)
        checkPageBreak(descLines.length * 3.8)
        doc.text(descLines, marginLeft + 3, y)
        y += descLines.length * 3.8 + 2
      }
      y += 2
    }
  }

  // 5. Work Experience
  if (resume.experience && resume.experience.length > 0) {
    renderSectionHeader('Experience')
    for (const exp of resume.experience) {
      checkPageBreak(16)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(15, 23, 42)
      doc.text(exp.jobTitle, marginLeft, y)

      // Company and dates on right
      const dates = `${exp.startDate} – ${exp.endDate || 'Present'}`
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(100, 116, 139)
      const dateWidth = doc.getTextWidth(dates)
      doc.text(dates, marginLeft + contentWidth - dateWidth, y)
      y += 4

      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8.5)
      doc.setTextColor(71, 85, 105)
      doc.text(exp.company, marginLeft, y)
      y += 4

      // Bullets
      const bullets = [...(exp.responsibilities || []), ...(exp.achievements || [])]
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(51, 65, 85)

      for (const bullet of bullets) {
        if (!bullet.trim()) continue
        const bulletText = `•  ${bullet.trim()}`
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 4)
        checkPageBreak(bulletLines.length * 3.8)
        doc.text(bulletLines, marginLeft + 2, y)
        y += bulletLines.length * 3.8 + 1
      }
      y += 2
    }
  }

  // 6. Education
  if (resume.education && resume.education.length > 0) {
    renderSectionHeader('Education')
    for (const edu of resume.education) {
      checkPageBreak(10)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      doc.text(edu.degree, marginLeft, y)

      const dates = `${edu.startDate} – ${edu.endDate}`
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(100, 116, 139)
      const dateWidth = doc.getTextWidth(dates)
      doc.text(dates, marginLeft + contentWidth - dateWidth, y)
      y += 3.8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(71, 85, 105)
      const instStr = edu.fieldOfStudy ? `${edu.institution} — ${edu.fieldOfStudy}` : edu.institution
      doc.text(instStr, marginLeft, y)
      y += 4.5
    }
  }

  // 7. Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    renderSectionHeader('Certifications')
    for (const cert of resume.certifications) {
      checkPageBreak(8)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(15, 23, 42)
      doc.text(cert.name, marginLeft, y)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      const rightMeta = `${cert.issuingOrg} (${cert.issueDate})`
      const rightWidth = doc.getTextWidth(rightMeta)
      doc.text(rightMeta, marginLeft + contentWidth - rightWidth, y)
      y += 4.5
    }
  }

  const filename = formatResumeFilename(resume)
  const blob = doc.output('blob')

  return { blob, filename }
}

/**
 * Downloads a generated Blob directly via browser anchor tag
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/**
 * Native Sharing bridge for mobile devices / Capacitor webview.
 * Uses Web Share API (navigator.share) when available, falling back to direct download.
 */
export async function shareOrDownloadPDF(
  resume: ResumeData,
  paperSize: PaperSize = 'a4'
): Promise<boolean> {
  const { blob, filename } = await generateDirectPDF(resume, paperSize)

  // 1. Native mobile container check: If running in Capacitor Android APK, use native storage + share
  if (typeof window !== 'undefined') {
    try {
      const { isCapacitorNative, saveAndShareNativePDF } = await import('./capacitorBridge.ts')
      if (isCapacitorNative()) {
        const shared = await saveAndShareNativePDF(blob, filename)
        if (shared) return true
      }
    } catch (e) {
      console.warn('Native Capacitor share bridge check skipped:', e)
    }
  }

  // 2. Browser Web Share API check
  const file = new File([blob], filename, { type: 'application/pdf' })
  if (
    navigator.canShare &&
    navigator.canShare({ files: [file] }) &&
    navigator.share
  ) {
    try {
      await navigator.share({
        title: filename,
        text: `ATS Resume: ${resume.title}`,
        files: [file],
      })
      return true
    } catch (err: unknown) {
      // User cancelled share dialog or share failed; fall back to download
      if ((err as Error)?.name !== 'AbortError') {
        triggerBlobDownload(blob, filename)
      }
      return false
    }
  }

  // Fallback to direct blob download
  triggerBlobDownload(blob, filename)
  return true
}
