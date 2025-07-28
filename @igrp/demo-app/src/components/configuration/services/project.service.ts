import { 
  getAllProjects,
  associateProjectToArea,
  removeProjectFromArea,
  getAreaProjects,
  getAllAreaProjects,
} from '@igrp/platform-process-management-client-ts'
import { 
  AreaProject,
  CreateAreaProjectRequest,
} from '@igrp/platform-process-management-types'

export class ProjectService {
  static async getAllProjects(page: number = 0, size: number = 100) {
    return await getAllProjects(page, size)
  }

  static async getAllAreaProjects(): Promise<AreaProject[]> {
    return await getAllAreaProjects()
  }

  static async getAreaProjects(areaId: string): Promise<AreaProject[]> {
    return await getAreaProjects(areaId)
  }

  static async associateProjectToArea(association: CreateAreaProjectRequest): Promise<void> {
    return await associateProjectToArea(association)
  }

  static async removeProjectFromArea(areaId: string, projectId: string): Promise<void> {
    return await removeProjectFromArea(areaId, projectId)
  }
}