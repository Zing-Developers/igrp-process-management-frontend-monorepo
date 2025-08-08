import { Folder, Edit2, Trash2 } from 'lucide-react'
import { Area } from '@igrp/platform-process-management-types'

interface SubareasListProps {
  subareas: Area[]
  onEdit: () => void
  onDelete: () => void
}

export function SubareasList({ subareas, onEdit, onDelete }: SubareasListProps) {
  if (!subareas || subareas.length === 0) {
    return null
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Folder className="w-4 h-4" />
        Subáreas
      </h4>
      <div className="space-y-2">
        {subareas.map((subarea) => (
          <div key={subarea.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">{subarea.name}</span>
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="p-1 text-gray-500 hover:text-blue-600 rounded"
                title="Editar subárea"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-gray-500 hover:text-red-600 rounded"
                title="Excluir subárea"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}