'use client'

import { useEffect, useState } from 'react'
import { 
  getAvailableTasks, 
  getTaskById, 
  claimTask 
} from '@irn/platform-process-management-client-ts'
import { Task, PaginatedResponse } from '@irn/platform-process-management-types'
import { 
  Clock, 
  User, 
  Calendar,
  Eye,
  UserPlus,
  Search
} from 'lucide-react'

export function AvailableTasks() {
  const [tasks, setTasks] = useState<PaginatedResponse<Task> | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimingTask, setClaimingTask] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const currentUserId = 'user1' // Mock user ID

  useEffect(() => {
    fetchAvailableTasks()
  }, [])

  const fetchAvailableTasks = async () => {
    try {
      setLoading(true)
      const data = await getAvailableTasks({
        processNumber: '',
        processKey: '',
        user: currentUserId,
        status: '',
        dateFrom: '',
        dateTo: '',
        page: 0,
        size: 20
      })
      setTasks(data)
    } catch (error) {
      console.error('Error fetching available tasks:', error)
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
      setClaimingTask(taskId)
      await claimTask(taskId, currentUserId)
      alert('Tarefa atribuída com sucesso!')
      fetchAvailableTasks() // Refresh the list
      setSelectedTask(null)
    } catch (error) {
      console.error('Error claiming task:', error)
      alert('Erro ao atribuir tarefa')
    } finally {
      setClaimingTask(null)
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

  const taskList = tasks?.content || []
  const filteredTasks = taskList.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tarefas Disponíveis</h1>
        <p className="text-gray-600">Visualize e atribua tarefas disponíveis para você</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar tarefas disponíveis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa disponível'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Tente ajustar os termos de busca.' 
              : 'Não há tarefas disponíveis para atribuição no momento.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    {task.priority && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority?.toString() || '')}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Processo: {task.processInstanceId}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {task.createdDate && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Criada: {new Date(task.createdDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewTask(task.id)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => handleClaimTask(task.id)}
                    disabled={claimingTask === task.id}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {claimingTask === task.id ? 'Atribuindo...' : 'Atribuir'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                
                {selectedTask.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                    <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleString()}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Criação</label>
                  <p className="text-gray-900">{new Date(selectedTask.createdDate).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleClaimTask(selectedTask.id)}
                  disabled={claimingTask === selectedTask.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {claimingTask === selectedTask.id ? 'Atribuindo...' : 'Atribuir a Mim'}
                </button>
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