export default function BlockText({ block, onChange, onDelete }) {
  return (
    <div className="border rounded-lg p-4 bg-white space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase">Texte</span>
        <button onClick={onDelete} className="text-red-400 text-xs hover:text-red-600">Supprimer</button>
      </div>
      <textarea
        value={block.content || ''}
        onChange={e => onChange({ ...block, content: e.target.value })}
        placeholder="Saisissez votre texte. Consignes : **Verbe** en gras avec astérisques."
        rows={4}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal resize-none"
      />
      <p className="text-xs text-gray-400">Mettre en gras : **mot** — les AUs seront appliquées à l'export.</p>
    </div>
  )
}
