import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Project } from '@irn/platform-process-management-types'
import { ProjectList } from './project-list'

interface ProjectModalProps {
  availableProjects: Project[]
  onAssociate: (projectId: string) => void
  onClose: () => void
}

export function ProjectModal({ availableProjects, onAssociate, onClose }: ProjectModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = availableProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Associar Projeto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <ProjectList
          projects={filteredProjects}
          availableProjects={availableProjects}
          onAssociate={onAssociate}
        />
      </div>
    </div>
  )
}