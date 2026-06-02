import { QUESTION_TYPES } from './questionTypes'

export default function QuestionEditor({ question, onChange, onDelete, levelCount }) {
  const typeDef = QUESTION_TYPES.find(t => t.id === question.type)

  function setField(key, value) {
    onChange({ ...question, [key]: value })
  }

  function setOption(i, value) {
    const opts = [...(question.options || [])]
    opts[i] = value
    onChange({ ...question, options: opts })
  }

  function addOption() {
    onChange({ ...question, options: [...(question.options || []), ''] })
  }

  function toggleCorrect(i) {
    if (question.type === 'qcm') {
      const parts = (question.correct || '').split(',').filter(Boolean)
      const idx = String(i)
      setField('correct', parts.includes(idx) ? parts.filter(p => p !== idx).join(',') : [...parts, idx].join(','))
    } else {
      setField('correct', String(i))
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white space-y-3">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-plai-teal uppercase">{typeDef?.label}</span>
        <button onClick={onDelete} className="text-red-400 text-xs hover:text-red-600">Supprimer</button>
      </div>

      <textarea
        value={question.text}
        onChange={e => setField('text', e.target.value)}
        placeholder="**Verbe** en gras + question courte (AU FWB)"
        rows={2}
        className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-plai-teal"
      />

      {['qcu', 'qcm', 'fill', 'truefalse'].includes(question.type) && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500">Options</p>
          {(question.options || []).map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type={question.type === 'qcm' ? 'checkbox' : 'radio'}
                checked={question.type === 'qcm'
                  ? (question.correct || '').split(',').includes(String(i))
                  : question.correct === String(i)}
                onChange={() => toggleCorrect(i)}
                disabled={question.type === 'truefalse'}
                className="mt-0.5"
              />
              <input value={opt} onChange={e => setOption(i, e.target.value)}
                disabled={question.type === 'truefalse'}
                className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-plai-teal disabled:bg-gray-50"
              />
            </div>
          ))}
          {!['truefalse'].includes(question.type) && (
            <button onClick={addOption} className="text-xs text-plai-teal underline">+ Ajouter une option</button>
          )}
        </div>
      )}

      {question.type === 'short' && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">Réponse courte — désactivée automatiquement pour le profil dyspraxie.</p>
      )}

      {levelCount > 1 && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500">Niveau</label>
          <select value={question.level || 1} onChange={e => setField('level', Number(e.target.value))}
            className="border rounded px-2 py-1 text-xs focus:outline-none">
            {Array.from({ length: levelCount }, (_, i) => (
              <option key={i + 1} value={i + 1}>Niveau {i + 1}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
