import { Area, Project, AreaProject } from '@igrp/platform-process-management-types'
import { AreaCard } from './area-card'


interface ExtendedArea extends Area {
  subareas?: Area[]
}

interface ExpandedAreas {
  [key: string]: boolean
}

interface AreasListProps {
  areas: ExtendedArea[]
  expandedAreas: ExpandedAreas
  areaProjects: { [areaId: string]: AreaProject[] }
  projects: Project[]
  onToggleExpansion: (areaId: string) => void
  onEdit: (area: Area) => void
  onDelete: (areaId: string) => void
  onAddSubarea: (parentAreaId: string) => void
  onAddProject: (areaId: string) => void
  onRemoveProject: (areaId: string, projectId: string) => void
}

export function AreasList({
  areas,
  expandedAreas,
  areaProjects,
  projects,
  onToggleExpansion,
  onEdit,
  onDelete,
  onAddSubarea,
  onAddProject,
  onRemoveProject,
}: AreasListProps) {
  if (areas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma área encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {areas.map((area) => (
        <AreaCard
          key={area.id}
          area={area}
          isExpanded={expandedAreas[area.id] || false}
          onToggleExpansion={() => onToggleExpansion(area.id)}
          onEdit={() => onEdit(area)}
          onDelete={() => onDelete(area.id)}
          onAddSubarea={() => onAddSubarea(area.id)}
          onAddProject={() => onAddProject(area.id)}
          onRemoveProject={(projectId) => onRemoveProject(area.id, projectId)}
          areaProjects={areaProjects[area.id] || []}
          projects={projects}
        />
      ))}
    </div>
  )
}