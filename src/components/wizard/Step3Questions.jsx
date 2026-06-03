import { useWizard } from '../../hooks/useWizard'
import QuestionList from '../questions/QuestionList'

export default function Step3Questions() {
  const { data, update } = useWizard()

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Questions</h2>
        <p className="text-sm text-gray-500">Chaque question = une tâche = un écran pour l'élève (AU : une tâche par face).</p>
      </div>
      <QuestionList
        questions={data.questions || []}
        onChange={questions => update({ questions })}
        levelCount={data.levelCount || 1}
        hasDyspraxie={(data.profiles || []).includes('dyspraxie')}
      />
    </div>
  )
}
