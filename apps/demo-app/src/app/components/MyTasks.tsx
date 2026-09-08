'use client'

import { useEffect, useState } from 'react'
import { 
  getMyTasks, 
  getTaskById, 
  completeTask, 
  releaseTask 
} from '@igrp/platform-process-management-client-ts'
import { Task, PaginatedResponse } from '@igrp/platform-process-management-types'
import { 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  Eye,
  Play,
  X
} from 'lucide-react'

export function MyTasks() {
  const [tasks, setTasks] = useState<PaginatedResponse<Task> | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const currentUserId = 'user1' // Mock user ID

  useEffect(() => {
    fetchMyTasks()
  }, [])

  const fetchMyTasks = async () => {
    try {
      setLoading(true)
      const data = await getMyTasks({
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
      console.error('Error fetching my tasks:', error)
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

  const handleCompleteTask = async (taskId: string) => {
    try {
      setActionLoading(taskId)
      await completeTask(taskId, {
        completedBy: currentUserId,
        completedAt: new Date().toISOString()
      })
      alert('Tarefa concluída com sucesso!')
      fetchMyTasks() // Refresh the list
      setSelectedTask(null)
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Erro ao concluir tarefa')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReleaseTask = async (taskId: string) => {
    try {
      setActionLoading(taskId)
      await releaseTask(taskId)
      alert('Tarefa liberada com sucesso!')
      fetchMyTasks() // Refresh the list
      setSelectedTask(null)
    } catch (error) {
      console.error('Error releasing task:', error)
      alert('Erro ao liberar tarefa')
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

  const taskList = tasks?.content || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Tarefas</h1>
        <p className="text-gray-600">Gerencie suas tarefas atribuídas</p>
      </div>

      {taskList.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa atribuída</h3>
          <p className="text-gray-500">Você não possui tarefas atribuídas no momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {taskList.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    {task.priority && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(String(task.priority))}`}>
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
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={actionLoading === task.id || task.status === 'COMPLETED'}
                    className="btn-success flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {actionLoading === task.id ? 'Concluindo...' : 'Concluir'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleReleaseTask(task.id)}
                    disabled={actionLoading === task.id || task.status === 'COMPLETED'}
                    className="btn-danger flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>
                      {actionLoading === task.id ? 'Liberando...' : 'Liberar'}
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes da Tarefa</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
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
                    <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleCompleteTask(selectedTask.id)}
                    disabled={actionLoading === selectedTask.id || selectedTask.status === 'COMPLETED'}
                    className="btn-success flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {actionLoading === selectedTask.id ? 'Concluindo...' : 'Concluir Tarefa'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleReleaseTask(selectedTask.id)}
                    disabled={actionLoading === selectedTask.id || selectedTask.status === 'COMPLETED'}
                    className="btn-danger flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>
                      {actionLoading === selectedTask.id ? 'Liberando...' : 'Liberar Tarefa'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}