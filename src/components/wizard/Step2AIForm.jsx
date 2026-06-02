import { useState } from 'react'
import { useWizard } from '../../hooks/useWizard'

const FIELDS = [
  { key: 'objective', label: 'Sujet et objectif précis', placeholder: "ex : Comprendre la règle de l'accord du participe passé avec avoir" },
  { key: 'difficulty', label: 'Difficulté principale de ce groupe-classe', placeholder: 'ex : Ils confondent COD placé avant et après' },
  { key: 'teacherStyle', label: 'Formulation ou exemple que vous utilisez habituellement', placeholder: 'ex : Je dis toujours : pose-toi la question "quoi ?" après le verbe' },
  { key: 'localContext', label: "Contexte concret tiré de votre classe ou environnement", placeholder: "ex : Utiliser l'exemple du match de foot de vendredi" },
  { key: 'outcome', label: 'Ce que les élèves doivent savoir faire à la fin', placeholder: 'ex : Accorder sans aide dans une phrase avec COD antéposé' },
]

export default function Step2AIForm() {
  const { data, update } = useWizard()
  const [form, setForm] = useState(data.aiForm || {
    objective: '', difficulty: '', teacherStyle: '', localContext: '', outcome: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generated, setGenerated] = useState(false)

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const isComplete = FIELDS.every(({ key }) => (form[key] || '').trim().length >= 10)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_activity',
          payload: { ...form, subject: data.subject || '', profiles: data.profiles || [] },
        }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      // Convertir feedbackDrafts (index-based) en feedbacks par question id
      const questions = (json.questions || []).map((q, i) => ({
        ...q,
        id: q.id || `q-${Date.now()}-${i}`,
        level: 1,
        correct: q.correct !== undefined ? String(q.correct) : '',
        options: (q.options || []).map(String),
      }))
      const feedbacks = {}
      if (json.feedbackDrafts) {
        Object.entries(json.feedbackDrafts).forEach(([idx, text]) => {
          const q = questions[parseInt(idx)]
          if (q) feedbacks[q.id] = { raw: text, adapted: {} }
        })
      }

      update({ blocks: json.blocks || [], questions, feedbacks, aiForm: form })
      setGenerated(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Génération IA</h2>
        <p className="text-sm text-gray-500">5 questions pour ancrer l'activité dans votre singularité et celle de vos élèves.</p>
      </div>

      <div className="space-y-4">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {label} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form[key] || ''}
              onChange={e => setField(key, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-orange resize-none"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>}

      {generated && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">Brouillon généré — vérifiez et adaptez avant de continuer.</p>
          <p className="text-xs text-amber-600 mt-1">Blocs et questions ont été ajoutés. Passez à l'étape suivante pour les revoir.</p>
        </div>
      )}

      <button onClick={generate} disabled={loading || !isComplete}
        className="w-full py-3 rounded-xl bg-plai-orange text-white font-bold text-sm hover:bg-opacity-90 disabled:opacity-40">
        {loading ? 'Génération en cours...' : generated ? 'Régénérer' : 'Générer le brouillon'}
      </button>

      <p className="text-xs text-gray-400 text-center">Coût estimé : ~0,008 € par génération</p>
    </div>
  )
}
