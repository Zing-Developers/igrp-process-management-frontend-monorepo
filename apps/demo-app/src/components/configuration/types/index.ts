import { Area, Project, AreaProject } from '@igrp/platform-process-management-types'

// Extended interfaces for UI components
export interface ExtendedArea extends Area {
  subareas?: ExtendedArea[]
}

export interface AreaFormData {
  code: string
  name: string
  description: string
  area_fk?: string
}

export interface ExpandedAreas {
  [key: string]: boolean
}

export interface AreaProjectsMap {
  [areaId: string]: AreaProject[]
}

// Modal states
export interface AreaModalState {
  isOpen: boolean
  editingArea: Area | null
  parentAreaId?: string
}

export interface ProjectModalState {
  isOpen: boolean
  selectedAreaId: string | null
}