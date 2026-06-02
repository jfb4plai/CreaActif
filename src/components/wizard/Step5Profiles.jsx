import { useState } from 'react'
import { useWizard } from '../../hooks/useWizard'

const PROFILES = [
  { id: 'dyslexie', label: 'Dyslexie' },
  { id: 'tdah', label: 'TDAH' },
  { id: 'dyspraxie', label: 'Dyspraxie' },
  { id: 'tdl', label: 'TDL' },
  { id: 'tsa', label: 'TSA' },
]

export default function Step5Profiles() {
  const { data, update } = useWizard()
  const profiles = data.profiles || []
  const studentCodes = data.studentCodes || []
  const [newCode, setNewCode] = useState('')

  function toggleProfile(id) {
    update({
      profiles: profiles.includes(id)
        ? profiles.filter(p => p !== id)
        : [...profiles, id]
    })
  }

  function addCode() {
    const code = newCode.trim().toUpperCase()
    if (code && !studentCodes.includes(code)) {
      update({ studentCodes: [...studentCodes, code] })
    }
    setNewCode('')
  }

  function removeCode(code) {
    update({ studentCodes: studentCodes.filter(c => c !== code) })
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Profils et élèves</h2>
        <p className="text-sm text-gray-500">Les AUs CUA sont toujours actives. Cochez les profils supplémentaires présents dans votre classe.</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Profils actifs</p>
        <div className="flex flex-wrap gap-2">
          {PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => toggleProfile(p.id)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-colors ${
                profiles.includes(p.id)
                  ? 'bg-plai-teal border-plai-teal text-white'
                  : 'border-gray-300 text-gray-600 hover:border-plai-teal'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Codes élèves à besoins spécifiques</p>
        <p className="text-xs text-gray-400 mb-3">Format : E11, E07... — Aucun nom, conformité RGPD.</p>
        <div className="flex gap-2">
          <input
            value={newCode}
            onChange={e => setNewCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && addCode()}
            placeholder="E11"
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal"
          />
          <button
            onClick={addCode}
            className="px-4 py-2 bg-plai-teal text-white rounded-lg text-sm font-semibold hover:bg-opacity-90"
          >
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {studentCodes.map(code => (
            <span
              key={code}
              className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm font-mono"
            >
              {code}
              <button
                onClick={() => removeCode(code)}
                className="text-gray-400 hover:text-red-500 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
