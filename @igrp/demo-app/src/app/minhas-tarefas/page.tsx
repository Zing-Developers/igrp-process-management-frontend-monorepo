'use client'

import { useEffect, useState } from 'react'
import { getMyTasks, completeTask, releaseTask } from '@igrp/platform-process-management-client-ts'
import { Task } from '@igrp/platform-process-management-types'
import { CheckCircle, Clock, AlertCircle, X } from 'lucide-react'

export default function MinhasTarefasPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completingTask, setCompletingTask] = useState(false)

  const currentUserId = 'user1'

  useEffect(() => {
    fetchMyTasks()
  }, [])

  const fetchMyTasks = async () => {
    try {
      const data = await getMyTasks(currentUserId)
      setTasks(data)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string, variables?: Record<string, any>) => {
    setCompletingTask(true)
    try {
      await completeTask(taskId, variables)
      alert('Tarefa concluída com sucesso!')
      setShowCompleteModal(false)
      fetchMyTasks() // Refresh the list
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error)
      alert('Erro ao concluir tarefa')
    } finally {
      setCompletingTask(false)
    }
  }

  const handleReleaseTask = async (taskId: string) => {
    try {
      await releaseTask(taskId)
      alert('Tarefa liberada com sucesso!')
      fetchMyTasks() // Refresh the list
    } catch (error) {
      console.error('Erro ao liberar tarefa:', error)
      alert('Erro ao liberar tarefa')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CREATED':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'ASSIGNED':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
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
        <p className="text-gray-600">Gerencie suas tarefas atribuídas</p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa atribuída</h3>
          <p className="text-gray-600">Você não possui tarefas atribuídas no momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-2">{task.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Processo: {task.processInstanceId}</span>
                    <span>Criada: {new Date(task.createTime).toLocaleDateString('pt-BR')}</span>
                    {task.dueDate && (
                      <span>Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  
                  <div className="flex space-x-2">
                    {task.status !== 'COMPLETED' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedTask(task)
                            setShowCompleteModal(true)
                          }}
                          className="btn-success text-sm"
                        >
                          Concluir
                        </button>
                        <button
                          onClick={() => handleReleaseTask(task.id)}
                          className="btn-secondary text-sm"
                        >
                          Liberar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Task Modal */}
      {showCompleteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Concluir Tarefa</h2>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja concluir a tarefa "{selectedTask.name}"?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentários (opcional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Adicione comentários sobre a conclusão da tarefa..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleCompleteTask(selectedTask.id, { completed: true, timestamp: new Date().toISOString() })}
                disabled={completingTask}
                className="btn-success flex-1 disabled:opacity-50"
              >
                {completingTask ? 'Concluindo...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}