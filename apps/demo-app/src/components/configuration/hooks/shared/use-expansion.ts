import { useState } from 'react'
import { ExpandedAreas, ExtendedArea } from '../../types'
import { findAreaById } from '../../utils/area-hierarchy'

export function useExpansion(areas: ExtendedArea[]) {
  const [expandedAreas, setExpandedAreas] = useState<ExpandedAreas>({})

  const toggleAreaExpansion = async (
    areaId: string, 
    loadSubareasCallback: (areaId: string) => Promise<void>
  ) => {
    const isExpanded = expandedAreas[areaId]
    setExpandedAreas(prev => ({ ...prev, [areaId]: !isExpanded }))
    
    // Only load subareas if not expanded and they don't exist yet
    if (!isExpanded) {
      const area = findAreaById(areas, areaId)
      if (area && !area.subareas) {
        await loadSubareasCallback(areaId)
      }
    }
  }

  return {
    expandedAreas,
    toggleAreaExpansion,
  }
}