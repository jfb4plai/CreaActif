import { useState } from 'react'
import { useWizard } from '../../hooks/useWizard'

export default function Step6Feedbacks() {
  const { data, update } = useWizard()
  const questions = data.questions || []
  const profiles = data.profiles || []
  const feedbacks = data.feedbacks || {}
  const [adapting, setAdapting] = useState({})

  async function adaptFeedback(qId, profile) {
    const raw = feedbacks[qId]?.raw || ''
    if (raw.length < 20) return
    const key = `${qId}-${profile}`
    setAdapting(a => ({ ...a, [key]: true }))
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adapt_feedback', payload: { feedback: raw, profile } }),
      })
      const json = await res.json()
      update({
        feedbacks: {
          ...feedbacks,
          [qId]: {
            ...feedbacks[qId],
            adapted: { ...(feedbacks[qId]?.adapted || {}), [profile]: json.result },
          },
        },
      })
    } finally {
      setAdapting(a => ({ ...a, [key]: false }))
    }
  }

  function setRaw(qId, value) {
    update({
      feedbacks: {
        ...feedbacks,
        [qId]: { ...(feedbacks[qId] || {}), raw: value, adapted: {} },
      },
    })
  }

  if (questions.length === 0) {
    return (
      <div className="pb-20">
        <p className="text-gray-400 text-sm">Aucune question — revenez à l'étape 3.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Feedbacks</h2>
        <p className="text-sm text-gray-500">Rédigez une explication par question. L'IA adapte la forme selon chaque profil.</p>
        <p className="text-xs text-amber-600 bg-amber-50 rounded px-3 py-2 mt-2">
          Un feedback qui dit seulement "correct/incorrect" n'a aucun effet pédagogique (Tricot, 2020). Expliquez pourquoi et comment progresser.
        </p>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} className="border rounded-xl p-4 bg-white space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Q{i + 1} — {q.text ? q.text.replace(/\*\*/g, '') : '(sans texte)'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Votre explication <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedbacks[q.id]?.raw || ''}
              onChange={e => setRaw(q.id, e.target.value)}
              placeholder="Expliquez pourquoi c'est correct ou incorrect, et comment progresser."
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-plai-teal"
            />
          </div>

          {profiles.length > 0 && (feedbacks[q.id]?.raw || '').length >= 20 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">Versions adaptées par profil</p>
              {profiles.map(profile => (
                <div key={profile} className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-plai-teal w-20 pt-1 shrink-0">{profile}</span>
                  <div className="flex-1">
                    {feedbacks[q.id]?.adapted?.[profile] ? (
                      <p className="text-sm bg-gray-50 rounded px-3 py-2">{feedbacks[q.id].adapted[profile]}</p>
                    ) : (
                      <button
                        onClick={() => adaptFeedback(q.id, profile)}
                        disabled={adapting[`${q.id}-${profile}`]}
                        className="text-xs text-plai-teal underline disabled:opacity-50">
                        {adapting[`${q.id}-${profile}`] ? 'Adaptation...' : 'Adapter pour ce profil'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
