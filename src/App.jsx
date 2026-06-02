import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import WizardShell from './components/wizard/WizardShell'
import Dashboard from './components/dashboard/Dashboard'
import Step1Identity from './components/wizard/Step1Identity'
import Step2Mode from './components/wizard/Step2Mode'
import Step2Manual from './components/wizard/Step2Manual'
import Step2AIForm from './components/wizard/Step2AIForm'
import Step3Questions from './components/wizard/Step3Questions'
import Step4Levels from './components/wizard/Step4Levels'
import Step5Profiles from './components/wizard/Step5Profiles'
import Step6Feedbacks from './components/wizard/Step6Feedbacks'
import Step7Generate from './components/wizard/Step7Generate'
import { useWizard } from './hooks/useWizard'

function WizardContent() {
  const { step, data } = useWizard()
  return (
    <>
      {step === 1 && <Step1Identity />}
      {step === 2 && data.contentMode === null && <Step2Mode />}
      {step === 2 && data.contentMode === 'manual' && <Step2Manual />}
      {step === 2 && data.contentMode === 'ai' && <Step2AIForm />}
      {step === 3 && <Step3Questions />}
      {step === 4 && <Step4Levels />}
      {step === 5 && <Step5Profiles />}
      {step === 6 && <Step6Feedbacks />}
      {step === 7 && <Step7Generate />}
    </>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('dashboard')
  const { reset } = useWizard()

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

  if (view === 'dashboard') {
    return <Dashboard onNewActivity={() => { reset(); setView('wizard') }} />
  }

  return (
    <WizardShell onBack={() => setView('dashboard')}>
      <WizardContent />
    </WizardShell>
  )
}
