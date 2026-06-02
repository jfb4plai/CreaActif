import { useWizard } from '../../hooks/useWizard'

const SUBJECTS = ['Français', 'Mathématiques', 'Sciences', 'Histoire-Géo', 'Langues', 'Autre']
const LEVELS = ['1P', '2P', '3P', '4P', '5P', '6P', '1S', '2S', '3S', '4S', '5S', '6S']

export default function Step1Identity() {
  const { data, update } = useWizard()

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Identité de l'activité</h2>
        <p className="text-sm text-gray-500">Ces informations apparaîtront sur le document généré.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Titre de l'activité <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={e => update({ title: e.target.value })}
            placeholder="ex : Les accords du participe passé"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Matière</label>
            <select
              value={data.subject || ''}
              onChange={e => update({ subject: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal"
            >
              <option value="">-- choisir --</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Niveau</label>
            <select
              value={data.classLevel || ''}
              onChange={e => update({ classLevel: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal"
            >
              <option value="">-- choisir --</option>
              {LEVELS.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={data.date || ''}
              onChange={e => update({ date: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Code séquence <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={data.sequenceCode || ''}
              onChange={e => update({ sequenceCode: e.target.value })}
              placeholder="ex : SEQ-03"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
