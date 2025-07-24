import { useState } from 'react'
import { 
  createArea, 
  updateArea, 
  deleteArea,
} from '@igrp/platform-process-management-client-ts'
import { 
  Area, 
  CreateAreaRequest, 
  UpdateAreaRequest,
} from '@igrp/platform-process-management-types'

interface AreaFormData {
  code: string
  name: string
  description: string
  area_fk?: string
}

interface ExtendedArea extends Area {
  subareas?: Area[]
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

  const handleCreateArea = async () => {
    try {
      const newArea = await createArea(areaForm as CreateAreaRequest)
      setAreas(prev => [...prev, newArea])
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
      setAreas(prev => prev.map(area => area.id === editingArea.id ? updatedArea : area))
      closeAreaModal()
    } catch (error) {
      console.error('Error updating area:', error)
      throw error
    }
  }

  const handleDeleteArea = async (areaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta área?')) return
    
    try {
      await deleteArea(areaId)
      setAreas(prev => prev.filter(area => area.id !== areaId))
    } catch (error) {
      console.error('Error deleting area:', error)
      throw error
    }
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
  }
}