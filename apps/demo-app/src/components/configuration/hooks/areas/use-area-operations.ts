import { AreaService } from '../../services/area.service'
import { AreaFormData, ExtendedArea } from '../../types'
import { organizeAreasHierarchy, getAllAreasFlat } from '../../utils/area-hierarchy'
import { CreateAreaRequest, UpdateAreaRequest } from '@irn/platform-process-management-types'

export function useAreaOperations(
  areas: ExtendedArea[], 
  setAreas: React.Dispatch<React.SetStateAction<ExtendedArea[]>>
) {
  const handleCreateArea = async (formData: AreaFormData) => {
    try {
      const newArea = await AreaService.createArea(formData as CreateAreaRequest)
      
      // Add the new area to the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas)
      flatAreas.push(newArea)
      const organizedAreas = organizeAreasHierarchy(flatAreas)
      setAreas(organizedAreas)
      
      return newArea
    } catch (error) {
      console.error('Error creating area:', error)
      throw error
    }
  }

  const handleUpdateArea = async (areaId: string, formData: AreaFormData) => {
    try {
      const updatedArea = await AreaService.updateArea(areaId, formData as UpdateAreaRequest)
      
      // Update the area in the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas)
      const index = flatAreas.findIndex(area => area.id === areaId)
      if (index !== -1) {
        flatAreas[index] = updatedArea
      }
      const organizedAreas = organizeAreasHierarchy(flatAreas)
      setAreas(organizedAreas)
      
      return updatedArea
    } catch (error) {
      console.error('Error updating area:', error)
      throw error
    }
  }

  const handleDeleteArea = async (areaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta área? Todas as subáreas também serão removidas.')) return
    
    try {
      await AreaService.deleteArea(areaId)
      
      // Remove the area and its subareas from the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas)
      const filteredAreas = flatAreas.filter(area => area.id !== areaId && area.area_fk !== areaId)
      const organizedAreas = organizeAreasHierarchy(filteredAreas)
      setAreas(organizedAreas)
    } catch (error) {
      console.error('Error deleting area:', error)
      throw error
    }
  }

  const loadSubareas = async (parentAreaId: string) => {
    try {
      const subareas = await AreaService.getSubareas(parentAreaId)
      setAreas(prev => {
        const updated = [...prev]
        const parentIndex = updated.findIndex(area => area.id === parentAreaId)
        if (parentIndex !== -1) {
          updated[parentIndex] = { ...updated[parentIndex], subareas: subareas || [] }
        }
        return updated
      })
    } catch (error) {
      console.error('Error loading subareas:', error)
    }
  }

  return {
    handleCreateArea,
    handleUpdateArea,
    handleDeleteArea,
    loadSubareas,
  }
}