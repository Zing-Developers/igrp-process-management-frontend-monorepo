'use client'

import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { 
  getAreas, 
  getAllProjects,
} from '@igrp/platform-process-management-client-ts'
import { 
  Area, 
  Project, 
  AreaProject,
} from '@igrp/platform-process-management-types'

// Try using absolute imports with @ alias
import { useAreaManagement } from '@/components/configuration/hooks/use-area-management'
import { useProjectManagement } from '@/components/configuration/hooks/use-project-management'
import { AreasList } from '@/components/configuration/components/areas-list'
import { AreaModal } from '@/components/configuration/components/area-modal'
import { ProjectModal } from '@/components/configuration/components/project-modal'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SearchInput } from '@/components/ui/search-input'

interface ExtendedArea extends Area {
  subareas?: Area[]
}

export function ProcessConfigurationContent() {
  const [areas, setAreas] = useState<ExtendedArea[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    areaForm,
    editingArea,
    showAreaModal,
    setAreaForm,
    openAreaModal,
    closeAreaModal,
    handleCreateArea,
    handleUpdateArea,
    handleDeleteArea,
  } = useAreaManagement(areas, setAreas)

  const {
    areaProjects,
    expandedAreas,
    showProjectModal,
    selectedAreaForProject,
    toggleAreaExpansion,
    openProjectModal,
    closeProjectModal,
    handleAssociateProject,
    handleRemoveProject,
    loadAreaProjects,
    loadSubareas,
  } = useProjectManagement(areas, setAreas, projects)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [areasResponse, projectsResponse] = await Promise.all([
        getAreas(0, 100),
        getAllProjects(0, 100)
      ])
      setAreas(areasResponse?.content || [])
      setProjects(projectsResponse?.content || [])
    } catch (error) {
      console.error('Error loading initial data:', error)
      setAreas([])
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAreas = (areas || []).filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAvailableProjects = (areaId: string) => {
    const associatedProjectIds = areaProjects[areaId]?.map(ap => ap.project_id) || []
    return projects.filter(project => !associatedProjectIds.includes(project.projectId))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração do Processo</h1>
        <p className="text-gray-600">Gerencie áreas, subáreas e projetos do sistema</p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar áreas..."
          className="flex-1 max-w-md"
        />
        <button
          onClick={() => openAreaModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Área
        </button>
      </div>

      {/* Areas List */}
      <AreasList
        areas={filteredAreas}
        expandedAreas={expandedAreas}
        areaProjects={areaProjects}
        projects={projects}
        onToggleExpansion={(areaId) => toggleAreaExpansion(areaId, loadSubareas, loadAreaProjects)}
        onEdit={openAreaModal}
        onDelete={handleDeleteArea}
        onAddSubarea={(parentAreaId) => openAreaModal(undefined, parentAreaId)}
        onAddProject={openProjectModal}
        onRemoveProject={handleRemoveProject}
      />

      {/* Modals */}
      {showAreaModal && (
        <AreaModal
          isEditing={!!editingArea}
          formData={areaForm}
          areas={areas}
          onFormChange={setAreaForm}
          onSave={editingArea ? handleUpdateArea : handleCreateArea}
          onClose={closeAreaModal}
        />
      )}

      {showProjectModal && selectedAreaForProject && (
        <ProjectModal
          availableProjects={getAvailableProjects(selectedAreaForProject)}
          onAssociate={handleAssociateProject}
          onClose={closeProjectModal}
        />
      )}
    </div>
  )
}