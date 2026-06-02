import { create } from 'zustand'

const TOTAL_STEPS = 7

export const useWizard = create((set) => ({
  step: 1,
  data: {
    title: '',
    subject: '',
    classLevel: '',
    date: new Date().toISOString().split('T')[0],
    sequenceCode: '',
    contentMode: null,
    blocks: [],
    aiForm: {},
    questions: [],
    levelCount: 1,
    profiles: [],
    studentCodes: [],
    feedbacks: {},
  },
  next: () => set(s => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
  prev: () => set(s => ({ step: Math.max(s.step - 1, 1) })),
  goTo: (n) => set({ step: n }),
  update: (patch) => set(s => ({ data: { ...s.data, ...patch } })),
  reset: () => set({
    step: 1,
    data: {
      title: '', subject: '', classLevel: '',
      date: new Date().toISOString().split('T')[0],
      sequenceCode: '', contentMode: null, blocks: [],
      aiForm: {}, questions: [], levelCount: 1,
      profiles: [], studentCodes: [], feedbacks: {},
    }
  }),
}))
