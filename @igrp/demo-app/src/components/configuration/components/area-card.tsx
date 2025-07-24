import { 
  ChevronRight,
  ChevronDown,
  Building,
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'
import { Area, Project, AreaProject } from '@igrp/platform-process-management-types'
import { SubareasList } from './subareas-list'
import { ProjectsList } from './projects-list'

interface ExtendedArea extends Area {
  subareas?: Area[]
}

interface AreaCardProps {
  area: ExtendedArea
  isExpanded: boolean
  onToggleExpansion: () => void
  onEdit: () => void
  onDelete: () => void
  onAddSubarea: () => void
  onAddProject: () => void
  onRemoveProject: (projectId: string) => void
  areaProjects: AreaProject[]
  projects: Project[]
}

export function AreaCard({ 
  area, 
  isExpanded, 
  onToggleExpansion, 
  onEdit, 
  onDelete, 
  onAddSubarea, 
  onAddProject,
  onRemoveProject,
  areaProjects,
  projects 
}: AreaCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggleExpansion}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <Building className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{area.name}</h3>
              {area.description && (
                <p className="text-sm text-gray-600 mt-1">{area.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddSubarea}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Adicionar Subárea"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={onAddProject}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
              title="Adicionar Projeto"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pl-8 space-y-3">
            <SubareasList 
              subareas={area.subareas || []}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <ProjectsList 
              areaProjects={areaProjects}
              projects={projects}
              onRemoveProject={onRemoveProject}
            />
          </div>
        )}
      </div>
    </div>
  )
}