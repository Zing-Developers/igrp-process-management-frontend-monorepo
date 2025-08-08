'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FolderPlus, 
  Settings,
  ChevronRight,
  ChevronDown,
  Search,
  Save,
  X,
  Building,
  Folder,
  FileText
} from 'lucide-react'
import { 
  createArea, 
  updateArea, 
  deleteArea, 
  getAreas, 
  getSubareas,
  getAreaById,
  getAllProjects,
  associateProjectToArea,
  removeProjectFromArea,
  getAreaProjects
} from '@igrp/platform-process-management-client-ts'
import { 
  Area, 
  CreateAreaRequest, 
  UpdateAreaRequest, 
  Project, 
  AreaProject,
  CreateAreaProjectRequest,
  AreaWithProjects
} from '@igrp/platform-process-management-types'

interface ExpandedAreas {
  [key: string]: boolean
}

interface AreaFormData {
  code: string
  name: string
  description: string
  area_fk?: string
}

interface ExtendedArea extends Area {
  subareas?: Area[]
}

export default function ProcessConfiguration() {
  const [areas, setAreas] = useState<ExtendedArea[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [areaProjects, setAreaProjects] = useState<{ [areaId: string]: AreaProject[] }>({})
  const [expandedAreas, setExpandedAreas] = useState<ExpandedAreas>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [selectedAreaForProject, setSelectedAreaForProject] = useState<string | null>(null)
  
  // Form states
  const [areaForm, setAreaForm] = useState<AreaFormData>({
    code: '',
    name: '',
    description: '',
    area_fk: undefined
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [areasResponse, projectsResponse] = await Promise.all([
        getAreas(0, 100),
        getAllProjects(0, 100)
      ])
      setAreas(areasResponse.content)
      setProjects(projectsResponse.content)
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubareas = async (parentAreaId: string) => {
    try {
      const subareas = await getSubareas(parentAreaId)
      setAreas(prev => {
        const updated = [...prev]
        const parentIndex = updated.findIndex(area => area.id === parentAreaId)
        if (parentIndex !== -1) {
          updated[parentIndex] = { ...updated[parentIndex], subareas: subareas }
        }
        return updated
      })
    } catch (error) {
      console.error('Error loading subareas:', error)
    }
  }

  const loadAreaProjects = async (areaId: string) => {
    try {
      const projects = await getAreaProjects(areaId)
      setAreaProjects(prev => ({ ...prev, [areaId]: projects }))
    } catch (error) {
      console.error('Error loading area projects:', error)
    }
  }

  const toggleAreaExpansion = async (areaId: string) => {
    const isExpanded = expandedAreas[areaId]
    setExpandedAreas(prev => ({ ...prev, [areaId]: !isExpanded }))
    
    if (!isExpanded) {
      await Promise.all([
        loadSubareas(areaId),
        loadAreaProjects(areaId)
      ])
    }
  }

  const handleCreateArea = async () => {
    try {
      const newArea = await createArea(areaForm as CreateAreaRequest)
      setAreas(prev => [...prev, newArea])
      setShowAreaModal(false)
      resetAreaForm()
    } catch (error) {
      console.error('Error creating area:', error)
    }
  }

  const handleUpdateArea = async () => {
    if (!editingArea) return
    
    try {
      const updatedArea = await updateArea(editingArea.id, areaForm as UpdateAreaRequest)
      setAreas(prev => prev.map(area => area.id === editingArea.id ? updatedArea : area))
      setShowAreaModal(false)
      setEditingArea(null)
      resetAreaForm()
    } catch (error) {
      console.error('Error updating area:', error)
    }
  }

  const handleDeleteArea = async (areaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta área?')) return
    
    try {
      await deleteArea(areaId)
      setAreas(prev => prev.filter(area => area.id !== areaId))
    } catch (error) {
      console.error('Error deleting area:', error)
    }
  }

  const handleAssociateProject = async (projectId: string) => {
    if (!selectedAreaForProject) return
    
    try {
      const association: CreateAreaProjectRequest = {
        area_fk: selectedAreaForProject,
        project_id: projectId
      }
      await associateProjectToArea(association)
      await loadAreaProjects(selectedAreaForProject)
      setShowProjectModal(false)
      setSelectedAreaForProject(null)
    } catch (error) {
      console.error('Error associating project:', error)
    }
  }

  const handleRemoveProject = async (areaId: string, projectId: string) => {
    if (!confirm('Tem certeza que deseja remover este projeto da área?')) return
    
    try {
      await removeProjectFromArea(areaId, projectId)
      await loadAreaProjects(areaId)
    } catch (error) {
      console.error('Error removing project:', error)
    }
  }

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

  const resetAreaForm = () => {
    setAreaForm({
      code: '',
      name: '',
      description: '',
      area_fk: undefined
    })
  }

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAvailableProjects = (areaId: string) => {
    const associatedProjectIds = areaProjects[areaId]?.map(ap => ap.project_id) || []
    return projects.filter(project => !associatedProjectIds.includes(project.projectId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração do Processo</h1>
        <p className="text-gray-600">Gerencie áreas, subáreas e projetos do sistema</p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar áreas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => openAreaModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Área
        </button>
      </div>

      {/* Areas List */}
      <div className="space-y-4">
        {filteredAreas.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            isExpanded={expandedAreas[area.id]}
            onToggleExpansion={() => toggleAreaExpansion(area.id)}
            onEdit={() => openAreaModal(area)}
            onDelete={() => handleDeleteArea(area.id)}
            onAddSubarea={() => openAreaModal(undefined, area.id)}
            onAddProject={() => {
              setSelectedAreaForProject(area.id)
              setShowProjectModal(true)
            }}
            onRemoveProject={(projectId) => handleRemoveProject(area.id, projectId)}
            areaProjects={areaProjects[area.id] || []}
            projects={projects}
          />
        ))}
      </div>

      {/* Area Modal */}
      {showAreaModal && (
        <AreaModal
          isEditing={!!editingArea}
          formData={areaForm}
          onFormChange={setAreaForm}
          onSave={editingArea ? handleUpdateArea : handleCreateArea}
          onClose={() => {
            setShowAreaModal(false)
            setEditingArea(null)
            resetAreaForm()
          }}
          areas={areas}
        />
      )}

      {/* Project Association Modal */}
      {showProjectModal && selectedAreaForProject && (
        <ProjectModal
          availableProjects={getAvailableProjects(selectedAreaForProject)}
          onAssociate={handleAssociateProject}
          onClose={() => {
            setShowProjectModal(false)
            setSelectedAreaForProject(null)
          }}
        />
      )}
    </div>
  )
}

// Area Card Component
interface AreaCardProps {
  area: ExtendedArea
  isExpanded: boolean
  onToggleExpansion: () => void
  onEdit: () => void
  onDelete: () => void
  onAddSubarea: () => void
  onAddProject: () => void
  onRemoveProject: (projectId: string) => void
  areaProjects: AreaProject[]
  projects: Project[]
}

function AreaCard({ 
  area, 
  isExpanded, 
  onToggleExpansion, 
  onEdit, 
  onDelete, 
  onAddSubarea, 
  onAddProject,
  onRemoveProject,
  areaProjects,
  projects 
}: AreaCardProps) {
  const getProjectById = (projectId: string) => 
    projects.find(p => p.projectId === projectId)

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggleExpansion}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <Building className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{area.name}</h3>
              {area.description && (
                <p className="text-sm text-gray-600 mt-1">{area.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddSubarea}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Adicionar Subárea"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={onAddProject}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
              title="Adicionar Projeto"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pl-8 space-y-3">
            {/* Subareas */}
            {area.subareas && area.subareas.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Subáreas
                </h4>
                <div className="space-y-2">
                  {area.subareas.map((subarea: Area) => (
                    <div key={subarea.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{subarea.name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEdit()}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDelete()}
                          className="p-1 text-gray-500 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Projects */}
            {areaProjects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Projetos Associados
                </h4>
                <div className="space-y-2">
                  {areaProjects.map((areaProject) => {
                    const project = getProjectById(areaProject.project_id)
                    return (
                      <div key={areaProject.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">{project?.name || 'Projeto não encontrado'}</span>
                        <button
                          onClick={() => onRemoveProject(areaProject.project_id)}
                          className="p-1 text-gray-500 hover:text-red-600 rounded"
                          title="Remover projeto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Area Modal Component
interface AreaModalProps {
  isEditing: boolean
  formData: AreaFormData
  onFormChange: (data: AreaFormData) => void
  onSave: () => void
  onClose: () => void
  areas: Area[]
}

function AreaModal({ isEditing, formData, onFormChange, onSave, onClose, areas }: AreaModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Área' : 'Nova Área'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => onFormChange({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Código da área"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome da área"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição da área"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área Pai
            </label>
            <select
              value={formData.area_fk || ''}
              onChange={(e) => onFormChange({ ...formData, area_fk: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Nenhuma (Área principal)</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!formData.name.trim() || !formData.code.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Project Modal Component
interface ProjectModalProps {
  availableProjects: Project[]
  onAssociate: (projectId: string) => void
  onClose: () => void
}

function ProjectModal({ availableProjects, onAssociate, onClose }: ProjectModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = availableProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Associar Projeto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-96">
          {filteredProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {availableProjects.length === 0 
                ? 'Todos os projetos já estão associados a esta área'
                : 'Nenhum projeto encontrado'
              }
            </p>
          ) : (
            <div className="space-y-2">
              {filteredProjects.map((project) => (
                <div
                  key={project.projectId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onAssociate(project.projectId)}
                    className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Associar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}