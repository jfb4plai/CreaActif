import { useWizard } from '../../hooks/useWizard'

export default function Step4Levels() {
  const { data, update } = useWizard()
  const levelCount = data.levelCount || 1

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Différenciation par niveau</h2>
        <p className="text-sm text-gray-500">L'outil génère autant de fichiers HTML qu'il y a de niveaux.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(n => (
          <button
            key={n}
            onClick={() => update({ levelCount: n })}
            className={`py-6 rounded-xl border-2 font-bold text-lg transition-colors ${
              levelCount === n
                ? 'border-plai-teal bg-plai-teal text-white'
                : 'border-gray-200 hover:border-plai-teal'
            }`}
          >
            {n === 1 ? 'Unique' : `${n} niveaux`}
          </button>
        ))}
      </div>

      {levelCount > 1 && (
        <div className="bg-blue-50 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-700">
            Les questions seront marquées par niveau à l'étape suivante. L'élève ne voit que les questions de son niveau.
          </p>
        </div>
      )}
    </div>
  )
}
