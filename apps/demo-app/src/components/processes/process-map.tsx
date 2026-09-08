'use client'

import { useEffect, useState } from 'react'
import { 
  getProcessById, 
  startProcess 
} from '@irn/platform-process-management-client-ts'
import {
  getAreas,
  getAllProjects
} from '@irn/platform-process-management-client-ts'
import { 
  Process, 
  PaginatedResponse, 
  ProcessInstance,
  Area,
  AreaProject,
  Project
} from '@irn/platform-process-management-types'
import { 
  Play, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Folder,
  FolderOpen,
  FileText,
  Building
} from 'lucide-react'

interface ProcessTreeNode {
  type: 'area' | 'subarea' | 'project' | 'process';
  id: string;
  name: string;
  description?: string;
  data: Area | Project | Process;
  children: ProcessTreeNode[];
  expanded?: boolean;
}

export function ProcessMap() {
  const [treeData, setTreeData] = useState<ProcessTreeNode[]>([])
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingProcess, setStartingProcess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    buildProcessTree()
  }, [])

  const buildProcessTree = async () => {
    try {
      setLoading(true)
      
      // Fetch all data - processes are now nested within projects
      const [areasResponse, projectsResponse] = await Promise.all([
        getAreas(0, 100), // Get all areas
        getAllProjects(0, 1000), // Get all projects (with nested processDefinitions)
      ])

      const areas = areasResponse.content
      const projects = projectsResponse.content

      console.log('Areas:', areas)
      console.log('Projects:', projects)

      // Build tree structure
      const tree = buildTree(areas, projects)
      setTreeData(tree)
    } catch (error) {
      console.error('Error building process tree:', error)
    } finally {
      setLoading(false)
    }
  }

  const buildTree = (areas: Area[], projects: Project[]): ProcessTreeNode[] => {
    // Get root areas (areas without parent)
    const rootAreas = areas.filter(area => !area.area_fk)
    
    const tree: ProcessTreeNode[] = []

    for (const area of rootAreas) {
      const areaNode = buildAreaNode(area, areas, projects)
      tree.push(areaNode)
    }

    return tree
  }

  const buildAreaNode = (area: Area, allAreas: Area[], allProjects: Project[]): ProcessTreeNode => {
    const children: ProcessTreeNode[] = []

    // Get subareas first
    const subareas = allAreas.filter(subarea => subarea.area_fk === area.id)
    for (const subarea of subareas) {
      const subareaNode = buildAreaNode(subarea, allAreas, allProjects)
      children.push(subareaNode)
    }

    // Get projects directly associated with this area
    const areaProjects = getProjectsForArea(area.id, allProjects)
    
    for (const project of areaProjects) {
      const projectNode = buildProjectNode(project)
      children.push(projectNode)
    }

    return {
      type: area.area_fk ? 'subarea' : 'area',
      id: area.id,
      name: area.name,
      description: area.description,
      data: area,
      children,
      expanded: false
    }
  }

  // Simulate area-project associations based on the dummy data structure
  const getProjectsForArea = (areaId: string, allProjects: Project[]): Project[] => {
    // This simulates the AreaProject association table
    // Updated with actual project IDs from dummy data
    const areaProjectAssociations: AreaProject[] = [
      // Tecnologia area projects
      { id: 'area_proj_1', area_fk: '1', project_id: 'cb919966-30d4-4933-a82f-91b84fb4a940', createdAt: '2024-01-01T00:00:00Z' },
      { id: 'area_proj_2', area_fk: '1', project_id: 'portal-cliente-001', createdAt: '2024-01-01T00:00:00Z' },
      // Development subarea projects
      { id: 'area_proj_3', area_fk: '3', project_id: 'cb919966-30d4-4933-a82f-91b84fb4a940', createdAt: '2024-01-01T00:00:00Z' },
      { id: 'area_proj_4', area_fk: '3', project_id: 'sistema-relatorios-001', createdAt: '2024-01-01T00:00:00Z' },
      // Infrastructure subarea projects
      { id: 'area_proj_5', area_fk: '4', project_id: 'portal-cliente-001', createdAt: '2024-01-01T00:00:00Z' },
      // HR area projects
      { id: 'area_proj_6', area_fk: '2', project_id: 'sistema-rh-001', createdAt: '2024-01-01T00:00:00Z' },
      // Recruitment subarea projects
      { id: 'area_proj_7', area_fk: '5', project_id: 'portal-vagas-001', createdAt: '2024-01-01T00:00:00Z' },
      // Payroll subarea projects
      { id: 'area_proj_8', area_fk: '6', project_id: 'sistema-rh-001', createdAt: '2024-01-01T00:00:00Z' }
    ]

    const associatedProjectIds = areaProjectAssociations
      .filter(ap => ap.area_fk === areaId)
      .map(ap => ap.project_id)

    return allProjects.filter(project => associatedProjectIds.includes(project.projectId))
  }

  const buildProjectNode = (project: Project): ProcessTreeNode => {
    // Use processDefinitions from the project instead of filtering separate processes
    const children: ProcessTreeNode[] = project.processDefinitions.map(process => ({
      type: 'process',
      id: process.processDefinitionId,
      name: process.title,
      description: process.description,
      data: process,
      children: []
    }))

    return {
      type: 'project',
      id: project.projectId,
      name: project.name,
      description: project.description,
      data: project,
      children
    }
  }

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const handleStartProcess = async (process: Process) => {
    try {
      setStartingProcess(process.processDefinitionId)
      const instance = await startProcess(process.processDefinitionId, `BK_${Date.now()}`, {
        initiatedBy: 'user1',
        startDate: new Date().toISOString()
      })
      alert(`Processo iniciado com sucesso! ID da instância: ${instance.id}`)
    } catch (error) {
      console.error('Error starting process:', error)
      alert('Erro ao iniciar processo')
    } finally {
      setStartingProcess(null)
    }
  }

  const handleViewProcess = async (processId: string) => {
    try {
      const process = await getProcessById(processId)
      setSelectedProcess(process || null)
    } catch (error) {
      console.error('Error fetching process details:', error)
    }
  }

  const renderTreeNode = (node: ProcessTreeNode, level: number = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children.length > 0
    const paddingLeft = level * 24

    const getIcon = () => {
      switch (node.type) {
        case 'area':
          return <Building className="w-4 h-4 text-blue-600" />
        case 'subarea':
          return <Folder className="w-4 h-4 text-blue-500" />
        case 'project':
          return isExpanded ? <FolderOpen className="w-4 h-4 text-green-600" /> : <Folder className="w-4 h-4 text-green-600" />
        case 'process':
          return <FileText className="w-4 h-4 text-purple-600" />
        default:
          return null
      }
    }

    const getStatusBadge = () => {
      if (node.type === 'process') {
        const process = node.data as Process
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            process.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            v{process.version}
          </span>
        )
      }
      if (node.type === 'project') {
        const project = node.data as Project
        const processCount = project.processDefinitions?.length || 0
        return (
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {processCount} {processCount === 1 ? 'processo' : 'processos'}
            </span>
          </div>
        )
      }
      if (node.type === 'area' || node.type === 'subarea') {
        const childCount = node.children.length
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {childCount} {childCount === 1 ? 'item' : 'itens'}
          </span>
        )
      }
      return null
    }

    return (
      <div key={node.id}>
        <div 
          className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          {/* Expand/Collapse Button */}
          <div className="w-6 h-6 flex items-center justify-center mr-2">
            {hasChildren && (
              <button
                onClick={() => toggleNode(node.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>

          {/* Icon */}
          <div className="mr-3">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {node.name}
                </h4>
                {node.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {node.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {getStatusBadge()}
                
                {node.type === 'process' && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleViewProcess(node.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartProcess(node.data as Process)}
                      disabled={startingProcess === node.id}
                      className="p-1 text-green-600 hover:text-green-800 rounded disabled:opacity-50"
                      title="Iniciar processo"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const filterTree = (nodes: ProcessTreeNode[], searchTerm: string): ProcessTreeNode[] => {
    if (!searchTerm) return nodes

    return nodes.reduce((filtered: ProcessTreeNode[], node) => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (node.description?.toLowerCase().includes(searchTerm.toLowerCase()))

      const filteredChildren = filterTree(node.children, searchTerm)
      
      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren
        })
      }

      return filtered
    }, [])
  }

  const expandAll = () => {
    const getAllNodeIds = (nodes: ProcessTreeNode[]): string[] => {
      const ids: string[] = []
      nodes.forEach(node => {
        ids.push(node.id)
        ids.push(...getAllNodeIds(node.children))
      })
      return ids
    }
    setExpandedNodes(new Set(getAllNodeIds(treeData)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const filteredTreeData = filterTree(treeData, searchTerm)

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Processos</h1>
        <p className="text-gray-600">Visualize processos organizados por área, subárea e projeto</p>
      </div>

      {/* Search and Controls */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar áreas, projetos ou processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={expandAll}
              className="btn-secondary"
            >
              Expandir Tudo
            </button>
            <button 
              onClick={collapseAll}
              className="btn-secondary"
            >
              Recolher Tudo
            </button>
          </div>
        </div>
      </div>

      {/* Process Tree */}
      <div className="card">
        <div className="space-y-1">
          {filteredTreeData.length > 0 ? (
            filteredTreeData.map(node => renderTreeNode(node))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum processo disponível'}
            </div>
          )}
        </div>
      </div>

      {/* Process Details Modal */}
      {selectedProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes do Processo</h2>
                <button
                  onClick={() => setSelectedProcess(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900">{selectedProcess.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <p className="text-gray-900">{selectedProcess.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <p className="text-gray-900">{selectedProcess.processDefinitionId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Versão</label>
                    <p className="text-gray-900">{selectedProcess.version}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Projeto ID</label>
                    <p className="text-gray-900">{selectedProcess.projectId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <p className="text-gray-900">{selectedProcess.category}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Deploy</label>
                  <p className="text-gray-900">{new Date(selectedProcess.deploymentDate).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}