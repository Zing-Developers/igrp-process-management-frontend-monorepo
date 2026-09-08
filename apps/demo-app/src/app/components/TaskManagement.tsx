'use client'

import { useEffect, useState } from 'react'
import { 
  getTasks, 
  getTaskById, 
  getTasksByProcessInstance,
  getMyTasks,
  getAvailableTasks,
  claimTask,
  releaseTask,
  completeTask
} from '@irn/platform-process-management-client-ts'
import { Task, PaginatedResponse } from '@irn/platform-process-management-types'
import { 
  Search, 
  Filter, 
  Eye, 
  UserPlus, 
  CheckCircle, 
  X,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react'

export function TaskManagement() {
  const [tasks, setTasks] = useState<PaginatedResponse<Task> | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [taskTypeFilter, setTaskTypeFilter] = useState<'ALL' | 'MY_TASKS' | 'AVAILABLE'>('ALL')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  const currentUserId = 'user1' // Mock user ID

  useEffect(() => {
    fetchTasks()
  }, [currentPage, taskTypeFilter])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      let data: PaginatedResponse<Task>
      
      switch (taskTypeFilter) {
        case 'MY_TASKS':
          data = await getMyTasks({
            processNumber: '',
            processKey: '',
            user: currentUserId,
            status: statusFilter === 'ALL' ? '' : statusFilter,
            dateFrom: '',
            dateTo: '',
            page: currentPage,
            size: pageSize
          })
          break
        case 'AVAILABLE':
          data = await getAvailableTasks({
            processNumber: '',
            processKey: '',
            user: '',
            status: statusFilter === 'ALL' ? '' : statusFilter,
            dateFrom: '',
            dateTo: '',
            page: currentPage,
            size: pageSize
          })
          break
        default:
          data = await getTasks(currentPage, pageSize)
          break
      }
      
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewTask = async (taskId: string) => {
    try {
      const task = await getTaskById(taskId)
      setSelectedTask(task || null)
    } catch (error) {
      console.error('Error fetching task details:', error)
    }
  }

  const handleClaimTask = async (taskId: string) => {
    try {
      setActionLoading(taskId)
      await claimTask(taskId, currentUserId)
      alert('Tarefa atribuída com sucesso!')
      fetchTasks()
      setSelectedTask(null)
    } catch (error) {
      console.error('Error claiming task:', error)
      alert('Erro ao atribuir tarefa')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReleaseTask = async (taskId: string) => {
    try {
      setActionLoading(taskId)
      await releaseTask(taskId)
      alert('Tarefa liberada com sucesso!')
      fetchTasks()
      setSelectedTask(null)
    } catch (error) {
      console.error('Error releasing task:', error)
      alert('Erro ao liberar tarefa')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      setActionLoading(taskId)
      await completeTask(taskId, {
        completedBy: currentUserId,
        completedAt: new Date().toISOString()
      })
      alert('Tarefa concluída com sucesso!')
      fetchTasks()
      setSelectedTask(null)
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Erro ao concluir tarefa')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'bg-blue-100 text-blue-800'
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'DELETED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTasks = tasks?.content.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  if (loading && !tasks) {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Gestão de Tarefas
        </h1>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={taskTypeFilter}
            onChange={(e) => {
              setTaskTypeFilter(e.target.value as 'ALL' | 'MY_TASKS' | 'AVAILABLE')
              setCurrentPage(0)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Todas as Tarefas</option>
            <option value="MY_TASKS">Minhas Tarefas</option>
            <option value="AVAILABLE">Tarefas Disponíveis</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Todos os Status</option>
            <option value="CREATED">Criada</option>
            <option value="ASSIGNED">Atribuída</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELED">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4 mb-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma tarefa encontrada
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    {task.priority && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(String(task.priority))}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Processo: {task.processInstanceId}</span>
                    {task.assignee && <span>Atribuída a: {task.assignee}</span>}
                    <span>Criada: {new Date(task.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewTask(task.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {!task.assignee && (
                    <button
                      onClick={() => handleClaimTask(task.id)}
                      disabled={actionLoading === task.id}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Atribuir tarefa"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  )}
                  {task.assignee === currentUserId && task.status !== 'COMPLETED' && (
                    <>
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={actionLoading === task.id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Concluir tarefa"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReleaseTask(task.id)}
                        disabled={actionLoading === task.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Liberar tarefa"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {tasks && tasks.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {tasks.content.length} de {tasks.totalElements} tarefas
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm">
              Página {currentPage + 1} de {tasks.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(tasks.totalPages - 1, currentPage + 1))}
              disabled={currentPage >= tasks.totalPages - 1}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Detalhes da Tarefa</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900">{selectedTask.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <p className="text-gray-900">{selectedTask.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    {selectedTask.priority ? (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(String(selectedTask.priority))}`}>
                        {selectedTask.priority}
                      </span>
                    ) : (
                      <span className="text-gray-500">Não definida</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processo</label>
                  <p className="text-gray-900">{selectedTask.processInstanceId}</p>
                </div>
                
                {selectedTask.assignee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Atribuída a</label>
                    <p className="text-gray-900">{selectedTask.assignee}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Criação</label>
                    <p className="text-gray-900">{new Date(selectedTask.createdDate).toLocaleString()}</p>
                  </div>
                  
                  {selectedTask.dueDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                      <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                {!selectedTask.assignee && (
                  <button
                    onClick={() => handleClaimTask(selectedTask.id)}
                    disabled={actionLoading === selectedTask.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Atribuir a Mim
                  </button>
                )}
                {selectedTask.assignee === currentUserId && selectedTask.status !== 'COMPLETED' && (
                  <>
                    <button
                      onClick={() => handleCompleteTask(selectedTask.id)}
                      disabled={actionLoading === selectedTask.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Concluir
                    </button>
                    <button
                      onClick={() => handleReleaseTask(selectedTask.id)}
                      disabled={actionLoading === selectedTask.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Liberar
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}