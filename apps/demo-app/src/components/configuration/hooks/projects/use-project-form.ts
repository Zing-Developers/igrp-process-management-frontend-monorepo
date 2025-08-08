import { useState } from 'react'
import { ProjectModalState } from '../../types'

export function useProjectForm() {
  const [modalState, setModalState] = useState<ProjectModalState>({
    isOpen: false,
    selectedAreaId: null,
  })

  const openModal = (areaId: string) => {
    setModalState({
      isOpen: true,
      selectedAreaId: areaId,
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedAreaId: null,
    })
  }

  return {
    modalState,
    openModal,
    closeModal,
  }
}