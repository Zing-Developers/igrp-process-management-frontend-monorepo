'use client'

import { useEffect, useState } from 'react'
import { 
  getMyTasks, 
  completeTask, 
  releaseTask 
} from '@igrp/platform-process-management-client-ts'
import { Task } from '@igrp/platform-process-management-types'
import { CheckCircle, Clock, AlertCircle, Unlock } from 'lucide-react'

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [variables, setVariables] = useState('')

  useEffect(() => {
    loadMyTasks()
  }, [])

  const loadMyTasks = async () => {
    try {
      const data = await getMyTasks('currentUser')
      setTasks(data)
    } catch (error) {
      console.error('Error loading my tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    setActionLoading(taskId)
    try {
      let parsedVariables = {}
      if (variables.trim()) {
        try {
          parsedVariables = JSON.parse(variables)
        } catch (e) {
          alert('Variáveis devem estar em formato JSON válido')
          return
        }
      }

      await completeTask(
        taskId, 
        Object.keys(parsedVariables).length > 0 ? parsedVariables : undefined
      )
      
      alert('Tarefa concluída com sucesso!')
      setShowCompleteModal(false)
      setVariables('')
      loadMyTasks()
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Erro ao concluir tarefa')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReleaseTask = async (taskId: string) => {
    setActionLoading(taskId)
    try {
      await releaseTask(taskId)
      alert('Tarefa liberada com sucesso!')
      loadMyTasks()
    } catch (error) {
      console.error('Error releasing task:', error)
      alert('Erro ao liberar tarefa')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CREATED':
        return 'bg-blue-100 text-blue-800'
      case 'CLAIMED':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600'
    if (priority >= 50) return 'text-yellow-600'
    return 'text-green-600'
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
        <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa atribuída</h3>
          <p className="text-gray-600">Você não possui tarefas atribuídas no momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    {task.priority && (
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        Prioridade: {task.priority}
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
                  onClick={() => {
                    setSelectedTask(task)
                    setShowCompleteModal(true)
                  }}
                  disabled={actionLoading === task.id}
                  className="btn-success"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Concluir
                </button>
                <button
                  onClick={() => handleReleaseTask(task.id)}
                  disabled={actionLoading === task.id}
                  className="btn-secondary"
                >
                  {actionLoading === task.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <Unlock className="w-4 h-4 mr-2" />
                  )}
                  Liberar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && !showCompleteModal && (
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
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.priority || 'N/A'}</p>
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
          </div>
        </div>
      )}

      {/* Complete Task Modal */}
      {showCompleteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Concluir Tarefa</h2>
              <button
                onClick={() => {
                  setShowCompleteModal(false)
                  setVariables('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarefa
                </label>
                <p className="text-sm text-gray-900 font-medium">{selectedTask.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variáveis de Saída (JSON, opcional)
                </label>
                <textarea
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder='{"resultado": "aprovado", "observacoes": "Processo validado"}'
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCompleteModal(false)
                  setVariables('')
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleCompleteTask(selectedTask.id)}
                disabled={actionLoading === selectedTask.id}
                className="btn-success flex-1 flex items-center justify-center"
              >
                {actionLoading === selectedTask.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Concluindo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Concluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}