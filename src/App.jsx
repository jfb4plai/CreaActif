import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import WizardShell from './components/wizard/WizardShell'
import Step1Identity from './components/wizard/Step1Identity'
import Step2Mode from './components/wizard/Step2Mode'
import Step2Manual from './components/wizard/Step2Manual'
import { useWizard } from './hooks/useWizard'

function WizardContent() {
  const { step, data } = useWizard()
  return (
    <>
      {step === 1 && <Step1Identity />}
      {step === 2 && data.contentMode === null && <Step2Mode />}
      {step === 2 && data.contentMode === 'manual' && <Step2Manual />}
      {step === 2 && data.contentMode === 'ai' && <p className="text-gray-400 text-sm pb-20">Formulaire IA — bientôt</p>}
      {step > 2 && <p className="text-gray-400 text-sm pb-20">Étape {step} — à venir</p>}
    </>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null
  if (!session) return <Auth />

  return (
    <WizardShell>
      <WizardContent />
    </WizardShell>
  )
}
