import { useState } from 'react'
import QuestionEditor from './QuestionEditor'
import { QUESTION_TYPES, DEFAULT_QUESTION } from './questionTypes'

export default function QuestionList({ questions, onChange, levelCount }) {
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  function addQuestion(type) {
    onChange([...questions, DEFAULT_QUESTION(type)])
    setShowTypeMenu(false)
  }

  function updateQuestion(id, updated) {
    onChange(questions.map(q => q.id === id ? updated : q))
  }

  function deleteQuestion(id) {
    onChange(questions.filter(q => q.id !== id))
  }

  return (
    <div className="space-y-4">
      {questions.map(q => (
        <QuestionEditor
          key={q.id}
          question={q}
          onChange={u => updateQuestion(q.id, u)}
          onDelete={() => deleteQuestion(q.id)}
          levelCount={levelCount}
        />
      ))}

      <div className="relative">
        <button onClick={() => setShowTypeMenu(v => !v)}
          className="w-full py-2 border-2 border-dashed border-plai-teal rounded-lg text-sm text-plai-teal font-semibold hover:bg-plai-teal hover:text-white transition-colors">
          + Ajouter une question
        </button>
        {showTypeMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-10 mt-1">
            {QUESTION_TYPES.map(t => (
              <button key={t.id} onClick={() => addQuestion(t.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0">
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-gray-400">{t.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
