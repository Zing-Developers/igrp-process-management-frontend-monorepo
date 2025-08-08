import { Area } from '@igrp/platform-process-management-types'
import { ExtendedArea } from '../types'

/**
 * Organizes flat areas into hierarchical structure
 */
export const organizeAreasHierarchy = (flatAreas: Area[]): ExtendedArea[] => {
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

/**
 * Converts hierarchical areas back to flat array
 */
export const getAllAreasFlat = (hierarchicalAreas: ExtendedArea[]): Area[] => {
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

/**
 * Finds area by ID in hierarchical structure
 */
export const findAreaById = (areas: ExtendedArea[], areaId: string): ExtendedArea | null => {
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

/**
 * Filters areas recursively based on search term
 */
export const filterAreasRecursively = (areas: ExtendedArea[], searchTerm: string): ExtendedArea[] => {
  if (!searchTerm) return areas

  const filtered: ExtendedArea[] = []
  
  areas.forEach(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const filteredSubareas = area.subareas ? filterAreasRecursively(area.subareas, searchTerm) : []
    
    if (matchesSearch || filteredSubareas.length > 0) {
      filtered.push({
        ...area,
        subareas: filteredSubareas
      })
    }
  })
  
  return filtered
}