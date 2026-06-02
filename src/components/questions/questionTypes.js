export const QUESTION_TYPES = [
  { id: 'qcu', label: 'Choix unique (QCU)', description: 'Une seule bonne réponse parmi plusieurs options' },
  { id: 'qcm', label: 'Choix multiple (QCM)', description: 'Une ou plusieurs bonnes réponses' },
  { id: 'fill', label: 'Texte à trous', description: 'Sélection dans une liste (pas de saisie libre)' },
  { id: 'match', label: 'Mise en relation', description: 'Associer des éléments deux à deux' },
  { id: 'order', label: 'Ordonnancement', description: 'Remettre des éléments dans le bon ordre' },
  { id: 'short', label: 'Réponse courte', description: 'Saisie libre courte (désactivée profil dyspraxie)' },
  { id: 'truefalse', label: 'Vrai / Faux', description: 'Affirmer ou infirmer une proposition' },
]

export const DEFAULT_QUESTION = (type) => ({
  id: `q-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
  type,
  text: '',
  options: type === 'truefalse' ? ['Vrai', 'Faux'] : ['', ''],
  correct: '',
  level: 1,
})
