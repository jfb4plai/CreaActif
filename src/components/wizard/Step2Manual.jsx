import { useWizard } from '../../hooks/useWizard'
import BlockEditor from '../blocks/BlockEditor'

export default function Step2Manual() {
  const { data, update } = useWizard()

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Contenu de l'activité</h2>
        <p className="text-sm text-gray-500">Ajoutez vos blocs de contenu. Les AUs CUA seront appliquées à l'export.</p>
      </div>
      <BlockEditor
        blocks={data.blocks || []}
        onChange={blocks => update({ blocks })}
      />
    </div>
  )
}
