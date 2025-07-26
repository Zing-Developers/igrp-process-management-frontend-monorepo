'use client'

import { useEffect, useState } from 'react'
import { getTasks, getTaskById, claimTask, releaseTask, completeTask } from '@igrp/platform-process-management-client-ts'
import { Task, PaginatedResponse } from '@igrp/platform-process-management-types'
import { Search, Filter, Eye, UserPlus, UserMinus, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function GestaoTarefasPage() {
  const [tasks, setTasks] = useState<PaginatedResponse<Task> | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const currentUserId = 'user1'

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const data = await getTasks(0, 50)
      setTasks(data)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAction = async (action: string, taskId: string) => {
    setActionLoading(taskId)
    try {
      switch (action) {
        case 'claim':
          await claimTask(taskId, currentUserId)
          alert('Tarefa atribuída com sucesso!')
          break
        case 'release':
          await releaseTask(taskId)
          alert('Tarefa liberada com sucesso!')
          break
        case 'complete':
          await completeTask(taskId, { completedBy: currentUserId, timestamp: new Date().toISOString() })
          alert('Tarefa concluída com sucesso!')
          break
      }
      fetchTasks() // Refresh the list
    } catch (error) {
      console.error(`Erro ao executar ação ${action}:`, error)
      alert(`Erro ao executar ação`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewTask = async (taskId: string) => {
    try {
      const task = await getTaskById(taskId)
      if (task) {
        setSelectedTask(task)
        setShowTaskModal(true)
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes da tarefa:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CREATED':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'ASSIGNED':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  const filteredTasks = tasks?.content.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Tarefas</h1>
        <p className="text-gray-600">Gerencie todas as tarefas do sistema</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="ALL">Todos os Status</option>
          <option value="CREATED">Criadas</option>
          <option value="ASSIGNED">Atribuídas</option>
          <option value="COMPLETED">Concluídas</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarefa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atribuída a
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criada em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.assignee || 'Não atribuída'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.createTime).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewTask(task.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {task.status === 'CREATED' && (
                        <button
                          onClick={() => handleTaskAction('claim', task.id)}
                          disabled={actionLoading === task.id}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      )}
                      
                      {task.status === 'ASSIGNED' && task.assignee === currentUserId && (
                        <>
                          <button
                            onClick={() => handleTaskAction('release', task.id)}
                            disabled={actionLoading === task.id}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleTaskAction('complete', task.id)}
                            disabled={actionLoading === task.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Detalhes da Tarefa</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Atribuída a</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.assignee || 'Não atribuída'}</p>
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
                <label className="block text-sm font-medium text-gray-700">ID do Processo</label>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.processInstanceId}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTaskModal(false)}
                className="btn-secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}