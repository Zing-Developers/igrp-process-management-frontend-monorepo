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
import { ProjectsList } from './area-projects-list'

interface ExtendedArea extends Area {
  subareas?: ExtendedArea[]
}

interface AreaCardProps {
  area: ExtendedArea
  isExpanded: boolean
  expandedAreas: { [key: string]: boolean }
  allAreaProjects: { [areaId: string]: AreaProject[] }
  projects: Project[]
  onToggleExpansion: (areaId: string) => void
  onEdit: (area: Area) => void
  onDelete: (areaId: string) => void
  onAddSubarea: (parentAreaId: string) => void
  onAddProject: (areaId: string) => void
  onRemoveProject: (areaId: string, projectId: string) => void
  level?: number
}

export function AreaCard({ 
  area, 
  isExpanded, 
  expandedAreas,
  allAreaProjects,
  projects,
  onToggleExpansion,
  onEdit, 
  onDelete, 
  onAddSubarea, 
  onAddProject,
  onRemoveProject,
  level = 0
}: AreaCardProps) {
  const areaProjects = allAreaProjects[area.id] || []
  const hasSubareas = area.subareas && area.subareas.length > 0
  const hasProjects = areaProjects.length > 0
  const hasContent = hasSubareas || hasProjects

  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-sm ${level > 0 ? 'ml-6 mt-2' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {hasContent && (
              <button
                onClick={() => onToggleExpansion(area.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            <Building className={`w-5 h-5 ${level === 0 ? 'text-blue-600' : 'text-purple-600'}`} />
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 ${level > 0 ? 'text-sm' : ''}`}>
                {level > 0 ? `Subárea: ${area.name}` : area.name}
              </h3>
              {area.description && (
                <p className="text-sm text-gray-600 mt-1">{area.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddSubarea(area.id)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Adicionar Subárea"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddProject(area.id)}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
              title="Adicionar Projeto"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(area)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(area.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && hasContent && (
          <div className="mt-4 space-y-3">
            {/* Projects for this area */}
            {hasProjects && (
              <div className="pl-8">
                <ProjectsList 
                  areaProjects={areaProjects}
                  projects={projects}
                  onRemoveProject={(projectId) => onRemoveProject(area.id, projectId)}
                />
              </div>
            )}
            
            {/* Subareas with their own projects */}
            {hasSubareas && (
              <div className="space-y-2">
                {area.subareas!.map((subarea) => (
                  <AreaCard
                    key={subarea.id}
                    area={subarea}
                    isExpanded={expandedAreas[subarea.id] || false}
                    expandedAreas={expandedAreas}
                    allAreaProjects={allAreaProjects}
                    projects={projects}
                    onToggleExpansion={onToggleExpansion}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubarea={onAddSubarea}
                    onAddProject={onAddProject}
                    onRemoveProject={onRemoveProject}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}