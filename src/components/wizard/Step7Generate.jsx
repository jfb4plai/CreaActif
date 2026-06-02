import { useState } from 'react'
import { useWizard } from '../../hooks/useWizard'
import { generateHTML } from '../../generators/htmlGenerator'
import { generatePDF } from '../../generators/pdfGenerator'
import { supabase } from '../../lib/supabase'

export default function Step7Generate() {
  const { data } = useWizard()
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  async function generate() {
    setGenerating(true)
    setError(null)
    try {
      // Sauvegarder l'activité dans Supabase
      const { data: { user } } = await supabase.auth.getUser()
      const { data: saved, error: dbErr } = await supabase
        .from('creaactif_activities')
        .insert({
          user_id: user.id,
          title: data.title,
          subject: data.subject,
          class_level: data.classLevel,
          content: data,
        })
        .select()
        .single()
      if (dbErr) throw new Error(dbErr.message)

      const activityWithId = { ...data, id: saved.id }

      // Générer et télécharger le PDF CUA
      const pdf = await generatePDF(activityWithId, data.studentCodes || [])
      pdf.save(`${data.title || 'activite'}-CUA.pdf`)

      // Générer les fichiers HTML par profil et par niveau pour chaque élève
      const profiles = data.profiles || []
      const levelCount = data.levelCount || 1
      const codes = data.studentCodes || []
      const targets = codes.length > 0 ? codes : ['Eleve']

      for (const code of targets) {
        for (let level = 1; level <= levelCount; level++) {
          const html = generateHTML(activityWithId, profiles, level, code)
          const blob = new Blob([html], { type: 'text/html' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          const suffix = levelCount > 1 ? `-N${level}` : ''
          a.download = `${data.title || 'activite'}-${code}${suffix}.html`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          await new Promise(r => setTimeout(r, 200))
        }
      }

      setDone(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const targets = (data.studentCodes || []).length > 0 ? data.studentCodes : ['Eleve']

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Générer les fichiers</h2>
        <p className="text-sm text-gray-500">Récapitulatif avant export.</p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <p><span className="font-semibold">Activité :</span> {data.title || '—'}</p>
        <p><span className="font-semibold">Matière :</span> {data.subject || '—'} — {data.classLevel || '—'}</p>
        <p><span className="font-semibold">Questions :</span> {(data.questions || []).length}</p>
        <p><span className="font-semibold">Niveaux :</span> {data.levelCount || 1}</p>
        <p><span className="font-semibold">Profils actifs :</span> {(data.profiles || []).join(', ') || 'CUA uniquement'}</p>
        <p><span className="font-semibold">Élèves :</span> {(data.studentCodes || []).join(', ') || 'aucun code saisi'}</p>
      </div>

      {/* Liste des fichiers qui seront générés */}
      <div className="border rounded-xl p-4 space-y-1">
        <p className="text-sm font-semibold text-gray-700 mb-2">Fichiers générés :</p>
        <p className="text-sm text-gray-500">📄 {data.title || 'activite'}-CUA.pdf</p>
        {targets.map(code =>
          Array.from({ length: data.levelCount || 1 }, (_, i) => (
            <p key={`${code}-${i}`} className="text-sm text-gray-500">
              🌐 {data.title || 'activite'}-{code}{(data.levelCount || 1) > 1 ? `-N${i + 1}` : ''}.html
            </p>
          ))
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      {done ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-semibold">Fichiers téléchargés.</p>
          <p className="text-sm text-green-600 mt-1">
            Distribuez le PDF à la classe et les fichiers HTML aux élèves concernés.
          </p>
        </div>
      ) : (
        <button onClick={generate} disabled={generating}
          className="w-full py-4 rounded-xl bg-plai-teal text-white font-bold text-base hover:bg-opacity-90 disabled:opacity-50">
          {generating ? 'Génération en cours...' : 'Générer et télécharger'}
        </button>
      )}
    </div>
  )
}
