import { jsPDF } from 'jspdf'
import { generateQRDataURL } from './qrGenerator'

function parseInlineBold(text) {
  const parts = []
  const regex = /\*\*(.+?)\*\*/g
  let last = 0
  let m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), bold: false })
    parts.push({ text: m[1], bold: true })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), bold: false })
  return parts
}

export async function generatePDF(activity, studentCodes = []) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 20
  const pageW = 210
  const pageH = 297
  const contentW = pageW - margin * 2
  const fontSize = 12
  const lineHeightMM = fontSize * 0.3528 * 1.5

  function setupPage() {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`${activity.title || ''} — CUA PLAI`, margin, pageH - 8)
    doc.setTextColor(0)
    doc.setFontSize(fontSize)
  }

  let y = margin

  // En-tête première page
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(`${activity.subject || ''} — ${activity.classLevel || ''} — ${activity.date || ''}`, margin, y)
  y += 7
  doc.setFontSize(16)
  doc.setTextColor(10, 147, 112)
  doc.setFont('helvetica', 'bold')
  doc.text(activity.title || 'Activité', margin, y)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0)
  doc.setFontSize(fontSize)
  setupPage()

  // Blocs de contenu (sur la première page)
  for (const block of (activity.blocks || [])) {
    if (block.type === 'text') {
      const cleaned = (block.content || '').replace(/\*\*/g, '')
      const lines = doc.splitTextToSize(cleaned, contentW)
      for (const line of lines) {
        if (y + lineHeightMM > pageH - margin) {
          doc.addPage()
          y = margin
          setupPage()
        }
        doc.text(line, margin, y)
        y += lineHeightMM
      }
      y += 4
    }
  }

  // Questions — une par page (AU : une tâche par face)
  for (let qi = 0; qi < (activity.questions || []).length; qi++) {
    const q = activity.questions[qi]

    // Nouvelle page pour chaque question
    doc.addPage()
    y = margin
    setupPage()

    // Numéro + texte de la question avec verbe en gras
    const parts = parseInlineBold(`${qi + 1}. ${q.text || ''}`)
    let xCursor = margin
    doc.setFontSize(fontSize)
    for (const part of parts) {
      doc.setFont('helvetica', part.bold ? 'bold' : 'normal')
      const words = part.text.split(' ')
      for (let wi = 0; wi < words.length; wi++) {
        const word = (wi === 0 && xCursor === margin ? '' : ' ') + words[wi]
        const ww = doc.getTextWidth(word)
        if (xCursor + ww > pageW - margin) {
          y += lineHeightMM
          xCursor = margin
        }
        doc.text(word, xCursor, y)
        xCursor += ww
      }
    }
    doc.setFont('helvetica', 'normal')
    y += lineHeightMM + 3

    // Options
    for (let oi = 0; oi < (q.options || []).length; oi++) {
      if (y + lineHeightMM > pageH - margin - 30) break
      doc.text(`  ○  ${q.options[oi]}`, margin + 4, y)
      y += lineHeightMM
    }

    // Zone de réponse (short answer ou espace vide)
    y += 6
    if (q.type === 'short') {
      doc.setDrawColor(200)
      doc.rect(margin, y, contentW, 25)
      y += 29
    } else {
      // Espace vide pour noter
      doc.setDrawColor(220)
      doc.rect(margin, y, contentW, 15)
      y += 19
    }

    // Indication de niveau si différenciation
    if ((activity.levelCount || 1) > 1) {
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(`Niveau ${q.level || 1}`, pageW - margin - 20, pageH - margin - 12)
      doc.setTextColor(0)
      doc.setFontSize(fontSize)
    }
  }

  // Page QR codes pour les élèves identifiés
  if (studentCodes.length > 0) {
    doc.addPage()
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(10, 147, 112)
    doc.text('Versions adaptées — codes élèves', margin, margin)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0)
    doc.setFontSize(10)
    doc.text("Découpez et collez sur la feuille de l'élève concerné.", margin, margin + 7)

    y = margin + 16

    for (const code of studentCodes) {
      if (y + 35 > pageH - margin) {
        doc.addPage()
        y = margin
      }
      try {
        const qrDataUrl = await generateQRDataURL(`${code}::${activity.id || 'local'}::${activity.title || ''}`)
        doc.addImage(qrDataUrl, 'PNG', margin, y, 22, 22)
      } catch {
        // QR code optionnel — continuer si échec
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(code, margin + 26, y + 8)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text('Scannez pour accéder à la version adaptée.', margin + 26, y + 15)
      doc.setTextColor(0)
      y += 32
    }
  }

  return doc
}
