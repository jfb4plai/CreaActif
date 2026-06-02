import { useWizard } from '../../hooks/useWizard'

export default function Step2Mode() {
  const { update, next } = useWizard()

  function choose(mode) {
    update({ contentMode: mode })
    next()
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Créer le contenu</h2>
        <p className="text-sm text-gray-500">Comment souhaitez-vous construire votre activité ?</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => choose('manual')}
          className="border-2 border-plai-teal rounded-xl p-6 text-left hover:bg-plai-teal hover:text-white transition-colors">
          <p className="font-bold text-lg mb-1">Mode manuel</p>
          <p className="text-sm opacity-70">Ajoutez vos blocs de contenu et questions un par un.</p>
        </button>
        <button onClick={() => choose('ai')}
          className="border-2 border-plai-orange rounded-xl p-6 text-left hover:bg-plai-orange hover:text-white transition-colors">
          <p className="font-bold text-lg mb-1">Génération IA</p>
          <p className="text-sm opacity-70">Décrivez votre activité en 5 questions — l'IA génère un brouillon que vous retouchez.</p>
          <p className="text-xs mt-2 opacity-50">~0,008 € par génération</p>
        </button>
      </div>
    </div>
  )
}
