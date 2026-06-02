import { useWizard } from '../../hooks/useWizard'

const STEPS = [
  'Identité', 'Contenu', 'Questions', 'Niveaux', 'Profils', 'Feedbacks', 'Générer'
]

export default function WizardShell({ children, onBack }) {
  const { step, prev, next } = useWizard()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <img src="/plai-logo.jpg" alt="PLAI" className="h-8" />
        <span className="font-bold text-plai-teal text-lg">CréaActif</span>
        {onBack && (
          <button onClick={onBack} className="ml-auto text-sm text-gray-400 hover:text-gray-600">
            ← Tableau de bord
          </button>
        )}
      </div>

      {/* Barre de progression */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex gap-1 max-w-2xl mx-auto">
          {STEPS.map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`h-1.5 rounded-full mb-1 ${i + 1 <= step ? 'bg-plai-teal' : 'bg-gray-200'}`} />
              <span className={`text-xs ${i + 1 === step ? 'text-plai-teal font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </div>

      {/* Navigation bas de page */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3">
        <div className="flex justify-between max-w-2xl mx-auto">
          <button onClick={prev} disabled={step === 1}
            className="px-6 py-2 rounded-lg border text-sm font-semibold disabled:opacity-30 hover:bg-gray-50">
            ← Précédent
          </button>
          {step < 7 && (
            <button onClick={next}
              className="px-6 py-2 rounded-lg bg-plai-teal text-white text-sm font-semibold hover:bg-opacity-90">
              Suivant →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
