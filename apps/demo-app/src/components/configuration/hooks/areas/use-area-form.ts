import { useState } from 'react'
import { Area } from '@igrp/platform-process-management-types'
import { AreaFormData, AreaModalState } from '../../types'

export function useAreaForm() {
  const [modalState, setModalState] = useState<AreaModalState>({
    isOpen: false,
    editingArea: null,
  })
  
  const [formData, setFormData] = useState<AreaFormData>({
    code: '',
    name: '',
    description: '',
    area_fk: undefined
  })

  const openModal = (area?: Area, parentAreaId?: string) => {
    if (area) {
      setModalState({
        isOpen: true,
        editingArea: area,
        parentAreaId
      })
      setFormData({
        code: area.code,
        name: area.name,
        description: area.description || '',
        area_fk: area.area_fk
      })
    } else {
      setModalState({
        isOpen: true,
        editingArea: null,
        parentAreaId
      })
      setFormData({
        code: '',
        name: '',
        description: '',
        area_fk: parentAreaId
      })
    }
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      editingArea: null,
    })
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      area_fk: undefined
    })
  }

  return {
    modalState,
    formData,
    setFormData,
    openModal,
    closeModal,
    resetForm,
  }
}