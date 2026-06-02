import { describe, it, expect } from 'vitest'
import { generateHTML } from './htmlGenerator'

const mockActivity = {
  id: 'test-id',
  title: 'Test activité',
  subject: 'Français',
  classLevel: '3S',
  date: '2026-06-02',
  blocks: [{ id: 'b1', type: 'text', content: '**Lis** le texte suivant.' }],
  questions: [{
    id: 'q1', type: 'qcu', text: '**Choisissez** la bonne réponse.',
    options: ['Option A', 'Option B'], correct: '0', level: 1
  }],
  feedbacks: { q1: { raw: 'Option A est correcte car...', adapted: { dyslexie: 'A est la bonne réponse.' } } },
  levelCount: 1,
}

describe('generateHTML', () => {
  it('génère un fichier HTML valide', () => {
    const html = generateHTML(mockActivity, [], 1, 'E11')
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Test activité')
    expect(html).toContain('E11')
  })

  it('applique Arial 14 pour profil dyslexie', () => {
    const html = generateHTML(mockActivity, ['dyslexie'], 1, 'E11')
    expect(html).toContain('font-size: 14px')
    expect(html).toContain('font-family: Arial')
  })

  it('filtre les questions par niveau', () => {
    const activity = {
      ...mockActivity,
      levelCount: 2,
      questions: [
        { ...mockActivity.questions[0], level: 1 },
        { id: 'q2', type: 'truefalse', text: 'Q niveau 2', options: ['Vrai', 'Faux'], correct: '0', level: 2 }
      ]
    }
    const html1 = generateHTML(activity, [], 1, 'E01')
    const html2 = generateHTML(activity, [], 2, 'E02')
    expect(html1).toContain('Choisissez')
    expect(html1).not.toContain('Q niveau 2')
    expect(html2).toContain('Q niveau 2')
    expect(html2).not.toContain('Choisissez')
  })

  it('contient le code élève dans le HTML', () => {
    const html = generateHTML(mockActivity, [], 1, 'E07')
    expect(html).toContain('E07')
  })
})
