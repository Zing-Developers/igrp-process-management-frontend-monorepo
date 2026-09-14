import { ProjectService } from '../../services/project.service'
import { AreaProjectsMap } from '../../types'
import { CreateAreaProjectRequest } from '@irn/platform-process-management-types'

export function useProjectOperations(
  areaProjects: AreaProjectsMap,
  setAreaProjects: React.Dispatch<React.SetStateAction<AreaProjectsMap>>
) {
  const handleAssociateProject = async (areaId: string, projectId: string) => {
    try {
      const association: CreateAreaProjectRequest = {
        area_fk: areaId,
        project_id: projectId
      }
      await ProjectService.associateProjectToArea(association)
      
      // Reload area projects for this area
      const updatedProjects = await ProjectService.getAreaProjects(areaId)
      setAreaProjects(prev => ({ ...prev, [areaId]: updatedProjects || [] }))
    } catch (error) {
      console.error('Error associating project:', error)
      throw error
    }
  }

  const handleRemoveProject = async (areaId: string, projectId: string) => {
    if (!confirm('Tem certeza que deseja remover este projeto da área?')) return
    
    try {
      await ProjectService.removeProjectFromArea(areaId, projectId)
      
      // Reload area projects for this area
      const updatedProjects = await ProjectService.getAreaProjects(areaId)
      setAreaProjects(prev => ({ ...prev, [areaId]: updatedProjects || [] }))
    } catch (error) {
      console.error('Error removing project:', error)
      throw error
    }
  }

  return {
    handleAssociateProject,
    handleRemoveProject,
  }
}