import { getAUs } from '../lib/aus'

function renderBold(text) {
  return (text || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function buildCSS(aus) {
  return `
    body {
      font-family: ${aus.fontFamily}, sans-serif;
      font-size: ${aus.fontSize}px;
      line-height: ${aus.lineHeight};
      text-align: left;
      letter-spacing: ${aus.letterSpacing || 'normal'};
      color: #1a1a1a;
      background: #fff;
      margin: 0 auto;
      padding: 16px;
      max-width: 760px;
    }
    .screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      page-break-after: always;
    }
    .block { margin-bottom: 20px; }
    .question-text { font-weight: 600; margin-bottom: 12px; }
    .option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      min-height: ${aus.minTargetSize || 32}px;
      transition: border-color 0.15s;
    }
    .option:hover { border-color: #0a9370; }
    .option.selected { border-color: #0a9370; background: #f0fdf4; }
    .option.correct { border-color: #16a34a; background: #dcfce7; }
    .option.incorrect { border-color: #dc2626; background: #fee2e2; }
    .feedback {
      display: none;
      padding: 12px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      margin-top: 12px;
      font-size: ${aus.fontSize - 1}px;
    }
    .feedback.visible { display: block; }
    .validate-btn {
      background: #0a9370;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: ${aus.fontSize}px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
      min-height: ${aus.minTargetSize || 32}px;
    }
    .progress { height: 4px; background: #e5e7eb; border-radius: 2px; margin-bottom: 20px; }
    .progress-fill { height: 4px; background: #0a9370; border-radius: 2px; transition: width 0.3s; }
    ${aus.audioEnabled ? '.audio-btn { background: none; border: 1px solid #0a9370; color: #0a9370; padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; margin-bottom: 8px; }' : ''}
  `
}

function renderQuestion(q, aus, feedbackText, qIndex, total) {
  const progress = Math.round(((qIndex + 1) / total) * 100)

  let optionsHTML = ''
  if (['qcu', 'qcm', 'fill', 'truefalse'].includes(q.type)) {
    optionsHTML = (q.options || []).map((opt, i) => `
      <div class="option" data-index="${i}" onclick="selectOption(this, '${q.id}', ${q.type === 'qcm'})">
        <span>${opt}</span>
      </div>`).join('')
  } else if (q.type === 'short' && !aus.shortAnswerDisabled) {
    optionsHTML = `<textarea id="ans-${q.id}" rows="3" style="width:100%;border:2px solid #e5e7eb;border-radius:8px;padding:10px;font-size:${aus.fontSize}px;font-family:${aus.fontFamily},sans-serif;resize:none;" placeholder="Votre réponse..."></textarea>`
  } else if (q.type === 'order') {
    optionsHTML = `<p style="color:#888;font-size:12px;">Remettez dans l'ordre :</p>` +
      (q.options || []).map((opt, i) => `<div class="option" draggable="true" data-index="${i}">${opt}</div>`).join('')
  }

  const audioBtn = aus.audioEnabled
    ? `<button class="audio-btn" onclick="speakText(\`${(q.text || '').replace(/`/g, '\\`').replace(/\*\*/g, '')}\`)">🔊 Écouter</button><br>`
    : ''

  return `
    <div class="screen" id="screen-${q.id}">
      ${aus.progressBar ? `<div class="progress"><div class="progress-fill" style="width:${progress}%"></div></div>` : ''}
      <div class="question-text">${audioBtn}${renderBold(q.text || '')}</div>
      <div id="opts-${q.id}">${optionsHTML}</div>
      <div class="feedback" id="fb-${q.id}">${feedbackText || ''}</div>
      <button class="validate-btn" onclick="validateQuestion('${q.id}', '${q.correct}', '${q.type}')">Valider</button>
    </div>`
}

const buildJS = (studentCode, activityId) => `
<script>
window._answers = {};

function selectOption(el, qId, multi) {
  if (!multi) {
    document.querySelectorAll('#opts-' + qId + ' .option').forEach(o => o.classList.remove('selected'));
  }
  el.classList.toggle('selected');
}

function validateQuestion(qId, correct, type) {
  const fb = document.getElementById('fb-' + qId);
  let ok = false;
  if (type === 'qcu' || type === 'truefalse' || type === 'fill') {
    const sel = document.querySelector('#opts-' + qId + ' .option.selected');
    if (sel) {
      ok = sel.dataset.index === String(correct);
      sel.classList.add(ok ? 'correct' : 'incorrect');
    }
  } else if (type === 'qcm') {
    const selected = Array.from(document.querySelectorAll('#opts-' + qId + ' .option.selected'))
      .map(o => o.dataset.index).sort().join(',');
    const expected = String(correct).split(',').sort().join(',');
    ok = selected === expected;
    document.querySelectorAll('#opts-' + qId + ' .option.selected')
      .forEach(o => o.classList.add(ok ? 'correct' : 'incorrect'));
  }
  if (fb) fb.classList.add('visible');
  window._answers[qId] = ok;
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    speechSynthesis.speak(u);
  }
}

async function submitResults() {
  const total = Object.keys(window._answers).length;
  const correct = Object.values(window._answers).filter(Boolean).length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const supabaseUrl = document.getElementById('_supabase_url').value;
  const supabaseKey = document.getElementById('_supabase_key').value;
  try {
    await fetch(supabaseUrl + '/rest/v1/creaactif_results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        activity_id: '${activityId}',
        student_code: '${studentCode}',
        score: score,
        answers: window._answers,
      }),
    });
    document.getElementById('_submit_btn').textContent = 'Résultats envoyés ✓';
    document.getElementById('_submit_btn').disabled = true;
  } catch(e) {
    localStorage.setItem('pending_result_${activityId}_${studentCode}', JSON.stringify({ score, answers: window._answers }));
    document.getElementById('_submit_btn').textContent = 'Sauvegardé localement (pas de connexion)';
  }
}
<\/script>`

export function generateHTML(activity, profiles, level, studentCode) {
  const aus = getAUs(profiles)
  const questions = (activity.questions || []).filter(q =>
    !activity.levelCount || activity.levelCount <= 1 || q.level === level
  )

  const blocksHTML = (activity.blocks || []).map(b => {
    if (b.type === 'text') return `<div class="block">${renderBold(b.content || '')}</div>`
    if (b.type === 'image') return `<div class="block"><img src="${b.url || ''}" style="max-width:100%;min-width:148mm" alt="" /></div>`
    return ''
  }).join('')

  const questionsHTML = questions.map((q, i) => {
    const profile0 = profiles[0]
    const feedbackText = profile0 && activity.feedbacks?.[q.id]?.adapted?.[profile0]
      ? activity.feedbacks[q.id].adapted[profile0]
      : activity.feedbacks?.[q.id]?.raw || ''
    return renderQuestion(q, aus, feedbackText, i, questions.length)
  }).join('')

  const levelLabel = activity.levelCount > 1 ? ` — Niveau ${level}` : ''

  const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || ''
  const supabaseKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || ''

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${activity.title || 'Activité'} — ${studentCode}</title>
<style>${buildCSS(aus)}</style>
</head>
<body>
<input type="hidden" id="_supabase_url" value="${supabaseUrl}">
<input type="hidden" id="_supabase_key" value="${supabaseKey}">
<div style="margin-bottom:24px">
  <p style="font-size:12px;color:#888">${activity.subject || ''} — ${activity.classLevel || ''} — ${activity.date || ''}</p>
  <h1 style="font-size:${aus.fontSize + 4}px;font-weight:700;color:#0a9370;margin:4px 0">${activity.title || ''}</h1>
  <p style="font-size:12px;color:#888">Élève : <strong>${studentCode}</strong>${levelLabel}</p>
</div>
${blocksHTML}
${questionsHTML}
<div style="margin-top:32px;padding:16px;background:#f0fdf4;border-radius:10px;text-align:center">
  <button id="_submit_btn" class="validate-btn" onclick="submitResults()">
    Terminer et envoyer les résultats
  </button>
</div>
${buildJS(studentCode, activity.id || '')}
</body>
</html>`
}
