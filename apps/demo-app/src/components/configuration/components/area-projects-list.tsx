import { FileText, X } from 'lucide-react'
import { Project, AreaProject } from '@irn/platform-process-management-types'

interface ProjectsListProps {
  areaProjects: AreaProject[]
  projects: Project[]
  onRemoveProject: (projectId: string) => void
}

export function ProjectsList({ areaProjects, projects, onRemoveProject }: ProjectsListProps) {
  if (!areaProjects || areaProjects.length === 0) {
    return null
  }

  const getProjectById = (projectId: string) => 
    projects.find(p => p.projectId === projectId)

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Projetos Associados
      </h4>
      <div className="space-y-2">
        {areaProjects.map((areaProject) => {
          const project = getProjectById(areaProject.project_id)
          return (
            <div key={areaProject.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">{project?.name || 'Projeto não encontrado'}</span>
              <button
                onClick={() => onRemoveProject(areaProject.project_id)}
                className="p-1 text-gray-500 hover:text-red-600 rounded"
                title="Remover projeto"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}