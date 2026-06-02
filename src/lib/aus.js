const BASE = {
  fontFamily: 'Arial',
  fontSize: 12,
  lineHeight: 1.5,
  textAlign: 'left',
  boldActionVerb: true,
  oneTaskPerScreen: true,
  paginate: true,
  audioEnabled: false,
  timerVisible: false,
  progressBar: false,
  shortAnswerDisabled: false,
  minTargetSize: 32,
  letterSpacing: 'normal',
  neutralColors: false,
  identicalScreenStructure: false,
  pictogramsEnabled: false,
  simplifiedVocab: false,
}

const PROFILES = {
  dyslexie: {
    fontSize: 14,
    letterSpacing: '0.05em',
    audioEnabled: true,
    chunkingStrict: true,
  },
  tdah: {
    timerVisible: true,
    progressBar: true,
    feedbackEncouragement: true,
    noAnimation: true,
  },
  dyspraxie: {
    shortAnswerDisabled: true,
    minTargetSize: 44,
    noGlisserDeposer: true,
  },
  tdl: {
    simplifiedVocab: true,
    pictogramsEnabled: true,
    audioEnabled: true,
  },
  tsa: {
    neutralColors: true,
    identicalScreenStructure: true,
    noVisualSurprise: true,
    noAnimation: true,
  },
}

// TSA neutralise les éléments potentiellement perturbants activés par d'autres profils
const TSA_OVERRIDES = { timerVisible: false, progressBar: false, pictogramsEnabled: false }

export function getAUs(profiles = []) {
  const merged = { ...BASE }
  for (const p of profiles) {
    if (PROFILES[p]) Object.assign(merged, PROFILES[p])
  }
  if (profiles.includes('tsa')) Object.assign(merged, TSA_OVERRIDES)
  return merged
}

export function mergeProfiles(profiles) {
  return getAUs(profiles)
}

export function resolveConflicts(aus) {
  return aus
}
