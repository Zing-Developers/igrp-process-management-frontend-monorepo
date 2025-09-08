'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

// Hooks
import { useConfiguration } from './hooks/use-configuration'
import { useAreaForm } from './hooks/areas/use-area-form'
import { useAreaOperations } from './hooks/areas/use-area-operations'
import { useProjectForm } from './hooks/projects/use-project-form'
import { useProjectOperations } from './hooks/projects/use-project-operations'
import { useExpansion } from './hooks/shared/use-expansion'

// Components
import { AreasList } from './components/areas-list'
import { AreaModal } from './components/area-modal'
import { ProjectModal } from './components/project-modal'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SearchInput } from '@/components/ui/search-input'

// Utils
import { filterAreasRecursively, getAllAreasFlat } from './utils/area-hierarchy'

export function ProcessConfigurationContent() {
  const [searchTerm, setSearchTerm] = useState('')

  // Main data management
  const {
    areas,
    setAreas,
    projects,
    areaProjects,
    setAreaProjects,
    loading,
  } = useConfiguration()

  // Area management
  const areaForm = useAreaForm()
  const areaOperations = useAreaOperations(areas, setAreas)

  // Project management
  const projectForm = useProjectForm()
  const projectOperations = useProjectOperations(areaProjects, setAreaProjects)

  // UI state
  const expansion = useExpansion(areas)

  // Handlers
  const handleCreateArea = async () => {
    try {
      await areaOperations.handleCreateArea(areaForm.formData)
      areaForm.closeModal()
    } catch (error) {
      // Handle error (could show toast notification)
    }
  }

  const handleUpdateArea = async () => {
    if (!areaForm.modalState.editingArea) return
    
    try {
      await areaOperations.handleUpdateArea(areaForm.modalState.editingArea.id, areaForm.formData)
      areaForm.closeModal()
    } catch (error) {
      // Handle error
    }
  }

  const handleAssociateProject = async (projectId: string) => {
    if (!projectForm.modalState.selectedAreaId) return
    
    try {
      await projectOperations.handleAssociateProject(projectForm.modalState.selectedAreaId, projectId)
      projectForm.closeModal()
    } catch (error) {
      // Handle error
    }
  }

  // Computed values
  const filteredAreas = filterAreasRecursively(areas, searchTerm)
  const allAreasFlat = getAllAreasFlat(areas)

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
          onClick={() => areaForm.openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Área
        </button>
      </div>

      {/* Areas List */}
      <AreasList
        areas={filteredAreas}
        expandedAreas={expansion.expandedAreas}
        areaProjects={areaProjects}
        projects={projects}
        onToggleExpansion={(areaId) => expansion.toggleAreaExpansion(areaId, areaOperations.loadSubareas)}
        onEdit={areaForm.openModal}
        onDelete={areaOperations.handleDeleteArea}
        onAddSubarea={(parentAreaId) => areaForm.openModal(undefined, parentAreaId)}
        onAddProject={projectForm.openModal}
        onRemoveProject={projectOperations.handleRemoveProject}
      />

      {/* Modals */}
      {areaForm.modalState.isOpen && (
        <AreaModal
          isEditing={!!areaForm.modalState.editingArea}
          formData={areaForm.formData}
          areas={allAreasFlat}
          onFormChange={areaForm.setFormData}
          onSave={areaForm.modalState.editingArea ? handleUpdateArea : handleCreateArea}
          onClose={areaForm.closeModal}
        />
      )}

      {projectForm.modalState.isOpen && projectForm.modalState.selectedAreaId && (
        <ProjectModal
          availableProjects={getAvailableProjects(projectForm.modalState.selectedAreaId)}
          onAssociate={handleAssociateProject}
          onClose={projectForm.closeModal}
        />
      )}
    </div>
  )
}