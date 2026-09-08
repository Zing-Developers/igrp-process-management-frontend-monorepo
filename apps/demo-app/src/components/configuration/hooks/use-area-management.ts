import { useState } from 'react'
import { 
  createArea, 
  updateArea, 
  deleteArea,
} from '@irn/platform-process-management-client-ts'
import { 
  Area, 
  CreateAreaRequest, 
  UpdateAreaRequest,
} from '@irn/platform-process-management-types'

interface AreaFormData {
  code: string
  name: string
  description: string
  area_fk?: string
}

interface ExtendedArea extends Area {
  subareas?: ExtendedArea[]
}

export function useAreaManagement(
  areas: ExtendedArea[], 
  setAreas: React.Dispatch<React.SetStateAction<ExtendedArea[]>>
) {
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [areaForm, setAreaForm] = useState<AreaFormData>({
    code: '',
    name: '',
    description: '',
    area_fk: undefined
  })

  const openAreaModal = (area?: Area, parentAreaId?: string) => {
    if (area) {
      setEditingArea(area)
      setAreaForm({
        code: area.code,
        name: area.name,
        description: area.description || '',
        area_fk: area.area_fk
      })
    } else {
      setEditingArea(null)
      setAreaForm({
        code: '',
        name: '',
        description: '',
        area_fk: parentAreaId
      })
    }
    setShowAreaModal(true)
  }

  const closeAreaModal = () => {
    setShowAreaModal(false)
    setEditingArea(null)
    resetAreaForm()
  }

  const resetAreaForm = () => {
    setAreaForm({
      code: '',
      name: '',
      description: '',
      area_fk: undefined
    })
  }

  // Helper function to organize areas into hierarchical structure
  const organizeAreasHierarchy = (flatAreas: Area[]): ExtendedArea[] => {
    const areaMap = new Map<string, ExtendedArea>()
    const topLevelAreas: ExtendedArea[] = []

    // First pass: create all areas
    flatAreas.forEach(area => {
      areaMap.set(area.id, { ...area, subareas: [] })
    })

    // Second pass: organize hierarchy
    flatAreas.forEach(area => {
      const extendedArea = areaMap.get(area.id)!
      
      if (area.area_fk) {
        // This is a subarea
        const parentArea = areaMap.get(area.area_fk)
        if (parentArea) {
          parentArea.subareas!.push(extendedArea)
        }
      } else {
        // This is a top-level area
        topLevelAreas.push(extendedArea)
      }
    })

    return topLevelAreas
  }

  const handleCreateArea = async () => {
    try {
      const newArea = await createArea(areaForm as CreateAreaRequest)
      
      // Add the new area to the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas)
      flatAreas.push(newArea)
      const organizedAreas = organizeAreasHierarchy(flatAreas)
      setAreas(organizedAreas)
      
      closeAreaModal()
    } catch (error) {
      console.error('Error creating area:', error)
      throw error
    }
  }

  const handleUpdateArea = async () => {
    if (!editingArea) return
    
    try {
      const updatedArea = await updateArea(editingArea.id, areaForm as UpdateAreaRequest)
      
      // Update the area in the flat list and reorganize
      const flatAreas = getAllAreasFlat(areas)
      const index = flatAreas.findIndex(area => area.id === editingArea.id)
      if (index !== -1) {
        flatAreas[index] = updatedArea
      }
      const organizedAreas = organizeAreasHierarchy(flatAreas)
      setAreas(organizedAreas)
      
      closeAreaModal()
    } catch (error) {
      console.error('Error updating area:', error)
      throw error
    }
  }

  const handleDeleteArea = async (areaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta área? Todas as subáreas também serão removidas.')) return
    
    try {
      await deleteArea(areaId)
      
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

  // Helper function to get all areas as a flat array
  const getAllAreasFlat = (hierarchicalAreas: ExtendedArea[]): Area[] => {
    const flatAreas: Area[] = []
    
    const addAreasRecursively = (areas: ExtendedArea[]) => {
      areas.forEach(area => {
        flatAreas.push({
          id: area.id,
          code: area.code,
          name: area.name,
          description: area.description,
          area_fk: area.area_fk
        })
        
        if (area.subareas && area.subareas.length > 0) {
          addAreasRecursively(area.subareas)
        }
      })
    }
    
    addAreasRecursively(hierarchicalAreas)
    return flatAreas
  }

  return {
    areaForm,
    editingArea,
    showAreaModal,
    setAreaForm,
    openAreaModal,
    closeAreaModal,
    handleCreateArea,
    handleUpdateArea,
    handleDeleteArea,
    organizeAreasHierarchy,
    getAllAreasFlat,
  }
}