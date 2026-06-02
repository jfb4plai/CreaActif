import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard({ onNewActivity }) {
  const [activities, setActivities] = useState([])
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data: acts } = await supabase
      .from('creaactif_activities')
      .select('id, title, subject, class_level, created_at')
      .order('created_at', { ascending: false })
    setActivities(acts || [])

    if (acts?.length) {
      const { data: res } = await supabase
        .from('creaactif_results')
        .select('id, activity_id, student_code, score, submitted_at')
        .in('activity_id', acts.map(a => a.id))
      const grouped = {}
      for (const r of (res || [])) {
        if (!grouped[r.activity_id]) grouped[r.activity_id] = []
        grouped[r.activity_id].push(r)
      }
      setResults(grouped)
    }
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/plai-logo.jpg" alt="PLAI" className="h-8" />
          <span className="font-bold text-plai-teal text-lg">CréaActif</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onNewActivity}
            className="px-4 py-2 bg-plai-teal text-white rounded-lg text-sm font-semibold hover:bg-opacity-90">
            + Nouvelle activité
          </button>
          <button onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-gray-600 underline">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Mes activités</h2>

        {activities.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">Aucune activité créée.</p>
            <button onClick={onNewActivity}
              className="px-6 py-3 bg-plai-teal text-white rounded-xl font-semibold text-sm hover:bg-opacity-90">
              Créer ma première activité
            </button>
          </div>
        )}

        {activities.map(act => {
          const actResults = results[act.id] || []
          const isExpanded = expanded === act.id
          return (
            <div key={act.id} className="bg-white rounded-xl border overflow-hidden">
              <button
                className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                onClick={() => setExpanded(isExpanded ? null : act.id)}>
                <div>
                  <p className="font-semibold text-gray-800">{act.title}</p>
                  <p className="text-xs text-gray-400">
                    {act.subject} — {act.class_level} — {act.created_at?.slice(0, 10)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 rounded-full px-3 py-1">
                    {actResults.length} résultat{actResults.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-3">
                  {actResults.length === 0 ? (
                    <p className="text-gray-400 text-sm">Aucun résultat reçu.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 text-left">
                          <th className="pb-2">Élève</th>
                          <th className="pb-2">Score</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actResults.map(r => (
                          <tr key={r.id} className="border-t">
                            <td className="py-2 font-mono font-semibold text-plai-teal">{r.student_code}</td>
                            <td className="py-2">{r.score !== null ? `${r.score}%` : '—'}</td>
                            <td className="py-2 text-gray-400 text-xs">{r.submitted_at?.slice(0, 10)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
