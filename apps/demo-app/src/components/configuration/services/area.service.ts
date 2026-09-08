import { 
  createArea, 
  updateArea, 
  deleteArea,
  getAreas,
  getSubareas,
} from '@irn/platform-process-management-client-ts'
import { 
  Area, 
  CreateAreaRequest, 
  UpdateAreaRequest,
} from '@irn/platform-process-management-types'

export class AreaService {
  static async createArea(areaData: CreateAreaRequest): Promise<Area> {
    return await createArea(areaData)
  }

  static async updateArea(areaId: string, areaData: UpdateAreaRequest): Promise<Area> {
    return await updateArea(areaId, areaData)
  }

  static async deleteArea(areaId: string): Promise<void> {
    return await deleteArea(areaId)
  }

  static async getAreas(page: number = 0, size: number = 100) {
    return await getAreas(page, size)
  }

  static async getSubareas(parentAreaId: string): Promise<Area[]> {
    return await getSubareas(parentAreaId)
  }
}