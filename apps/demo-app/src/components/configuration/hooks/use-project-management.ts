import { useState } from 'react'
import { 
  getSubareas,
  associateProjectToArea,
  removeProjectFromArea,
  getAreaProjects
} from '@irn/platform-process-management-client-ts'
import { 
  Area, 
  Project, 
  AreaProject,
  CreateAreaProjectRequest,
} from '@irn/platform-process-management-types'

interface ExpandedAreas {
  [key: string]: boolean
}

interface ExtendedArea extends Area {
  subareas?: Area[]
}

export function useProjectManagement(
  areas: ExtendedArea[], 
  setAreas: React.Dispatch<React.SetStateAction<ExtendedArea[]>>,
  projects: Project[]
) {
  const [areaProjects, setAreaProjects] = useState<{ [areaId: string]: AreaProject[] }>({})
  const [expandedAreas, setExpandedAreas] = useState<ExpandedAreas>({})
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedAreaForProject, setSelectedAreaForProject] = useState<string | null>(null)

  const loadSubareas = async (parentAreaId: string) => {
    try {
      const subareas = await getSubareas(parentAreaId)
      setAreas(prev => {
        const updated = [...prev]
        const parentIndex = updated.findIndex(area => area.id === parentAreaId)
        if (parentIndex !== -1) {
          updated[parentIndex] = { ...updated[parentIndex], subareas: subareas || [] }
        }
        return updated
      })
      // No need to load projects here since they're already loaded
    } catch (error) {
      console.error('Error loading subareas:', error)
    }
  }

  const loadAreaProjects = async (areaId: string) => {
    try {
      const projects = await getAreaProjects(areaId)
      setAreaProjects(prev => ({ ...prev, [areaId]: projects || [] }))
    } catch (error) {
      console.error('Error loading area projects:', error)
    }
  }

  // Simplified toggle - no need to load data since everything is already loaded
  const toggleAreaExpansion = async (
    areaId: string, 
    loadSubareasCallback: (areaId: string) => Promise<void>,
    loadAreaProjectsCallback: (areaId: string) => Promise<void>
  ) => {
    const isExpanded = expandedAreas[areaId]
    setExpandedAreas(prev => ({ ...prev, [areaId]: !isExpanded }))
    
    // Only load subareas if not expanded and they don't exist yet
    if (!isExpanded) {
      const area = findAreaById(areas, areaId)
      if (area && !area.subareas) {
        await loadSubareasCallback(areaId)
      }
    }
  }

  // Helper function to find area by ID in the hierarchical structure
  const findAreaById = (areas: ExtendedArea[], areaId: string): ExtendedArea | null => {
    for (const area of areas) {
      if (area.id === areaId) {
        return area
      }
      if (area.subareas) {
        const found = findAreaById(area.subareas, areaId)
        if (found) return found
      }
    }
    return null
  }

  const openProjectModal = (areaId: string) => {
    setSelectedAreaForProject(areaId)
    setShowProjectModal(true)
  }

  const closeProjectModal = () => {
    setShowProjectModal(false)
    setSelectedAreaForProject(null)
  }

  const handleAssociateProject = async (projectId: string) => {
    if (!selectedAreaForProject) return
    
    try {
      const association: CreateAreaProjectRequest = {
        area_fk: selectedAreaForProject,
        project_id: projectId
      }
      await associateProjectToArea(association)
      await loadAreaProjects(selectedAreaForProject)
      closeProjectModal()
    } catch (error) {
      console.error('Error associating project:', error)
      throw error
    }
  }

  const handleRemoveProject = async (areaId: string, projectId: string) => {
    if (!confirm('Tem certeza que deseja remover este projeto da área?')) return
    
    try {
      await removeProjectFromArea(areaId, projectId)
      await loadAreaProjects(areaId)
    } catch (error) {
      console.error('Error removing project:', error)
      throw error
    }
  }

  return {
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
    setAreaProjects, // Export this so the parent can set initial data
  }
}