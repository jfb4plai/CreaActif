import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWizard } from './useWizard'

beforeEach(() => {
  useWizard.setState({
    step: 1,
    data: {
      title: '', subject: '', classLevel: '',
      date: new Date().toISOString().split('T')[0],
      sequenceCode: '', contentMode: null, blocks: [],
      aiForm: {}, questions: [], levelCount: 1,
      profiles: [], studentCodes: [], feedbacks: {},
    }
  })
})

describe('useWizard', () => {
  it('démarre à l\'étape 1', () => {
    const { result } = renderHook(() => useWizard())
    expect(result.current.step).toBe(1)
  })

  it('avance à l\'étape suivante', () => {
    const { result } = renderHook(() => useWizard())
    act(() => result.current.next())
    expect(result.current.step).toBe(2)
  })

  it('ne recule pas avant l\'étape 1', () => {
    const { result } = renderHook(() => useWizard())
    act(() => result.current.prev())
    expect(result.current.step).toBe(1)
  })

  it('met à jour les données wizard', () => {
    const { result } = renderHook(() => useWizard())
    act(() => result.current.update({ title: 'Mon activité' }))
    expect(result.current.data.title).toBe('Mon activité')
  })
})
