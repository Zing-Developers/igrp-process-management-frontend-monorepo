import { useState, useEffect } from 'react'
import { Project, AreaProject } from '@igrp/platform-process-management-types'
import { ExtendedArea, AreaProjectsMap } from '../types'
import { AreaService } from '../services/area.service'
import { ProjectService } from '../services/project.service'
import { organizeAreasHierarchy } from '../utils/area-hierarchy'

export function useConfiguration() {
  const [areas, setAreas] = useState<ExtendedArea[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [areaProjects, setAreaProjects] = useState<AreaProjectsMap>({})
  const [loading, setLoading] = useState(true)

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load all data at once
      const [areasResponse, projectsResponse, areaProjectsResponse] = await Promise.all([
        AreaService.getAreas(0, 100),
        ProjectService.getAllProjects(0, 100),
        ProjectService.getAllAreaProjects()
      ])
      
      const flatAreas = areasResponse?.content || []
      const organizedAreas = organizeAreasHierarchy(flatAreas)
      setAreas(organizedAreas)
      setProjects(projectsResponse?.content || [])
      
      // Organize area projects by area ID for quick lookup
      const areaProjectsMap: AreaProjectsMap = {}
      areaProjectsResponse.forEach(areaProject => {
        if (!areaProjectsMap[areaProject.area_fk]) {
          areaProjectsMap[areaProject.area_fk] = []
        }
        areaProjectsMap[areaProject.area_fk].push(areaProject)
      })
      setAreaProjects(areaProjectsMap)
      
    } catch (error) {
      console.error('Error loading initial data:', error)
      setAreas([])
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  return {
    areas,
    setAreas,
    projects,
    setProjects,
    areaProjects,
    setAreaProjects,
    loading,
    loadInitialData,
  }
}