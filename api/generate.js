export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { action, payload } = req.body

  if (!action || !payload) return res.status(400).json({ error: 'action et payload requis' })

  const ACTIONS = ['validate_consigne', 'generate_activity', 'adapt_feedback']
  if (!ACTIONS.includes(action)) return res.status(400).json({ error: 'action inconnue' })

  let systemPrompt = ''
  let userPrompt = ''

  if (action === 'validate_consigne') {
    systemPrompt = `Tu valides la structure d'une consigne pédagogique FWB.
Règles obligatoires : commence par un verbe d'action en gras (**Verbe**), phrase courte, un seul verbe d'action par puce.
Réponds UNIQUEMENT en JSON : {"valid": true} ou {"valid": false, "suggestion": "version corrigée"}.
Aucun commentaire, aucun préambule.`
    userPrompt = payload.consigne

  } else if (action === 'generate_activity') {
    const { subject, objective, difficulty, teacherStyle, localContext, outcome, profiles } = payload
    systemPrompt = `Tu génères un brouillon d'activité pédagogique pour un enseignant FWB.
Profils élèves actifs : ${(profiles || []).join(', ') || 'aucun profil spécifique'}.
Règles de mise en forme obligatoires :
- Police Arial, interligne 1,5
- Consignes : verbe d'action en gras (**Verbe**), une seule action par puce, phrase courte
- Une tâche par question
Génère entre 5 et 7 questions variées (qcu, qcm, fill, truefalse, match, order).
Réponds UNIQUEMENT en JSON valide :
{
  "blocks": [{"type": "text", "content": "..."}],
  "questions": [{"type": "qcu", "text": "**Verbe** ...", "options": ["A", "B", "C"], "correct": "0"}],
  "feedbackDrafts": {"0": "explication q1", "1": "explication q2"}
}
Aucun préambule, aucune transition.`
    userPrompt = `Matière : ${subject || ''}
Objectif : ${objective || ''}
Difficulté principale de ce groupe-classe : ${difficulty || ''}
Formulation habituelle de l'enseignant : ${teacherStyle || ''}
Contexte concret de la classe : ${localContext || ''}
Ce que les élèves doivent savoir faire : ${outcome || ''}`

  } else if (action === 'adapt_feedback') {
    const { feedback, profile } = payload
    const rules = {
      dyslexie: 'Phrases très courtes. Mots fréquents. Pas d\'abstraction. Max 2 phrases.',
      tdah: 'Très court (1-2 phrases max). Termine par une courte phrase d\'encouragement.',
      tdl: 'Vocabulaire très simple. Reformule en 2 temps : résultat d\'abord, puis comment progresser.',
      dyspraxie: 'Neutre, factuel, sans surcharge émotionnelle. Max 2 phrases.',
      tsa: 'Neutre, factuel, structure prévisible. Commence toujours par le résultat, puis l\'explication.',
    }
    systemPrompt = `Tu reformules un feedback pédagogique selon ce profil : ${profile}.
Règle : ${rules[profile] || 'Court et factuel.'}
Aucun préambule. Aucune transition. Réponds directement avec le texte reformulé.`
    userPrompt = feedback
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: 'Haiku error', detail: err })
    }

    const data = await response.json()
    const text = data.content[0].text

    if (action === 'validate_consigne' || action === 'generate_activity') {
      try {
        // Haiku wraps JSON in ```json ... ``` sometimes — strip it
        const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
        return res.json(JSON.parse(cleaned))
      } catch {
        return res.status(502).json({ error: 'JSON invalide', raw: text })
      }
    }

    return res.json({ result: text })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
