import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import WizardShell from './components/wizard/WizardShell'
import Step1Identity from './components/wizard/Step1Identity'
import { useWizard } from './hooks/useWizard'

function WizardContent() {
  const { step } = useWizard()
  return (
    <>
      {step === 1 && <Step1Identity />}
      {step > 1 && <p className="text-gray-400 text-sm pb-20">Étape {step} — à venir</p>}
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
