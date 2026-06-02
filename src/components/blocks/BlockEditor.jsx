import BlockText from './BlockText'
import BlockImage from './BlockImage'

let idCounter = 0
const nextId = () => `block-${++idCounter}`

export default function BlockEditor({ blocks, onChange }) {
  function addBlock(type) {
    onChange([...blocks, { id: nextId(), type, content: '', url: '' }])
  }

  function updateBlock(id, updated) {
    onChange(blocks.map(b => b.id === id ? updated : b))
  }

  function deleteBlock(id) {
    onChange(blocks.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-4">
      {blocks.map(b => (
        <div key={b.id}>
          {b.type === 'text' && <BlockText block={b} onChange={u => updateBlock(b.id, u)} onDelete={() => deleteBlock(b.id)} />}
          {b.type === 'image' && <BlockImage block={b} onChange={u => updateBlock(b.id, u)} onDelete={() => deleteBlock(b.id)} />}
        </div>
      ))}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => addBlock('text')}
          className="px-4 py-2 rounded-lg border text-sm font-semibold text-plai-teal border-plai-teal hover:bg-plai-teal hover:text-white">
          + Texte
        </button>
        <button onClick={() => addBlock('image')}
          className="px-4 py-2 rounded-lg border text-sm font-semibold text-plai-teal border-plai-teal hover:bg-plai-teal hover:text-white">
          + Image
        </button>
      </div>
    </div>
  )
}
