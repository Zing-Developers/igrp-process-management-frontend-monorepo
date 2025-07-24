'use client'

import { useEffect, useState } from 'react'
import { 
  getMyTasks, 
  completeTask, 
  claimTask 
} from '@igrp/platform-process-management-client-ts'
import { 
  Task, 
  PaginatedResponse 
} from '@igrp/platform-process-management-types'
import { 
  CheckSquare, 
  Clock, 
  User,
  Calendar,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react'

export function MyTasksContent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [completingTask, setCompletingTask] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  useEffect(() => {
    loadMyTasks()
  }, [])

  const loadMyTasks = async () => {
    try {
      setLoading(true)
      const response = await getMyTasks(0, 50)
      setTasks(response?.content || [])
    } catch (error) {
      console.error('Error loading my tasks:', error)
      setTasks([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.processInstanceId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTask(taskId)
      await completeTask(taskId, {})
      await loadMyTasks() // Reload tasks
      alert('Tarefa concluída com sucesso!')
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Erro ao concluir tarefa')
    } finally {
      setCompletingTask(null)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Tarefas</h1>
        <p className="text-gray-600">Tarefas atribuídas a você</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todas as prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Média</option>
            <option value="LOW">Baixa</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Processo: {task.processInstanceId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Criada: {new Date(task.createTime).toLocaleDateString()}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Vencimento: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="mt-2 text-gray-700">{task.description}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completingTask === task.id}
                    className="btn-primary disabled:opacity-50"
                  >
                    {completingTask === task.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Concluindo...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="w-4 h-4" />
                        <span>Concluir</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-8">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || filterPriority !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Você não possui tarefas atribuídas no momento'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}