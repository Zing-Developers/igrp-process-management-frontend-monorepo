'use client'

import { useEffect, useState } from 'react'
import { 
  getAvailableTasks, 
  claimTask 
} from '@igrp/platform-process-management-client-ts'
import { Task } from '@igrp/platform-process-management-types'
import { UserPlus, Clock, AlertCircle, Search } from 'lucide-react'

export default function AvailableTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimingTask, setClaimingTask] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    loadAvailableTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, priorityFilter])

  const loadAvailableTasks = async () => {
    try {
      const data = await getAvailableTasks('currentUser')
      setTasks(data)
    } catch (error) {
      console.error('Error loading available tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.processInstanceId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => {
        const priority = task.priority || 0
        switch (priorityFilter) {
          case 'high':
            return priority >= 80
          case 'medium':
            return priority >= 50 && priority < 80
          case 'low':
            return priority < 50
          default:
            return true
        }
      })
    }

    setFilteredTasks(filtered)
  }

  const handleClaimTask = async (taskId: string) => {
    setClaimingTask(taskId)
    try {
      await claimTask(taskId, 'currentUser')
      alert('Tarefa atribuída com sucesso!')
      loadAvailableTasks()
    } catch (error) {
      console.error('Error claiming task:', error)
      alert('Erro ao atribuir tarefa')
    } finally {
      setClaimingTask(null)
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600'
    if (priority >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return 'Alta'
    if (priority >= 50) return 'Média'
    return 'Baixa'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tarefas Disponíveis</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todas as prioridades</option>
            <option value="high">Alta prioridade</option>
            <option value="medium">Média prioridade</option>
            <option value="low">Baixa prioridade</option>
          </select>
          <span className="text-sm text-gray-600">
            {filteredTasks.length} de {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tasks.length === 0 ? 'Nenhuma tarefa disponível' : 'Nenhuma tarefa encontrada'}
          </h3>
          <p className="text-gray-600">
            {tasks.length === 0 
              ? 'Não há tarefas disponíveis para atribuição no momento.'
              : 'Tente ajustar os filtros de busca.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    {task.priority && (
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)} ({task.priority})
                      </span>
                    )}
                    {task.dueDate && new Date(task.dueDate) < new Date() && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Vencida
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Processo:</span> {task.processInstanceId}
                    </div>
                    <div>
                      <span className="font-medium">Criado em:</span> {new Date(task.createTime).toLocaleDateString('pt-BR')}
                    </div>
                    {task.dueDate && (
                      <div>
                        <span className="font-medium">Vencimento:</span> {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-gray-700 mb-4">{task.description}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="btn-secondary"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => handleClaimTask(task.id)}
                  disabled={claimingTask === task.id}
                  className="btn-primary flex items-center"
                >
                  {claimingTask === task.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Atribuindo...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Atribuir a Mim
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detalhes da Tarefa</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.description || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.priority ? `${getPriorityLabel(selectedTask.priority)} (${selectedTask.priority})` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Criação</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedTask.createTime).toLocaleString('pt-BR')}
                  </p>
                </div>
                {selectedTask.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedTask.dueDate).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Processo</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.processInstanceId}</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="btn-secondary flex-1"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleClaimTask(selectedTask.id)
                  setSelectedTask(null)
                }}
                disabled={claimingTask === selectedTask.id}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Atribuir a Mim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}