export default function BlockImage({ block, onChange, onDelete }) {
  return (
    <div className="border rounded-lg p-4 bg-white space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase">Image</span>
        <button onClick={onDelete} className="text-red-400 text-xs hover:text-red-600">Supprimer</button>
      </div>
      <input type="url" value={block.url || ''}
        onChange={e => onChange({ ...block, url: e.target.value })}
        placeholder="URL de l'image (hébergement externe)"
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plai-teal" />
      <p className="text-xs text-gray-400">Taille minimale affichée : A5. Aucun texte autour (AU-P5).</p>
      {block.url && <img src={block.url} alt="aperçu" className="max-h-40 rounded mt-2 object-contain" />}
    </div>
  )
}
