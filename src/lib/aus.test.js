import { describe, it, expect } from 'vitest'
import { getAUs, mergeProfiles, resolveConflicts } from './aus'

describe('getAUs', () => {
  it('retourne les AUs CUA de base sans profil', () => {
    const aus = getAUs([])
    expect(aus.fontSize).toBe(12)
    expect(aus.lineHeight).toBe(1.5)
    expect(aus.fontFamily).toBe('Arial')
    expect(aus.oneTaskPerScreen).toBe(true)
  })

  it('force taille 14 pour dyslexie', () => {
    const aus = getAUs(['dyslexie'])
    expect(aus.fontSize).toBe(14)
    expect(aus.audioEnabled).toBe(true)
  })

  it('active timer pour TDAH', () => {
    const aus = getAUs(['tdah'])
    expect(aus.timerVisible).toBe(true)
    expect(aus.progressBar).toBe(true)
  })

  it('désactive réponse courte pour dyspraxie', () => {
    const aus = getAUs(['dyspraxie'])
    expect(aus.shortAnswerDisabled).toBe(true)
    expect(aus.minTargetSize).toBe(44)
  })

  it('TSA prime sur TDAH pour éléments visuels additionnels', () => {
    const aus = getAUs(['tdah', 'tsa'])
    expect(aus.timerVisible).toBe(false)
    expect(aus.neutralColors).toBe(true)
  })
})
