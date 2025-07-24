'use client'

import { useEffect, useState } from 'react'
import { 
  getTasks, 
  getTaskById,
  getTasksByProcessInstance 
} from '@igrp/platform-process-management-client-ts'
import { Task } from '@igrp/platform-process-management-types'
import { Search, Filter, Eye, Calendar, User, Activity } from 'lucide-react'

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10

  useEffect(() => {
    loadTasks()
  }, [currentPage])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, assigneeFilter])

  const loadTasks = async () => {
    try {
      const data = await getTasks(currentPage, pageSize)
      setTasks(data.content)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error loading tasks:', error)
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
        task.processInstanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned') {
        filtered = filtered.filter(task => !task.assignee)
      } else {
        filtered = filtered.filter(task => task.assignee === assigneeFilter)
      }
    }

    setFilteredTasks(filtered)
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

  const getUniqueAssignees = () => {
    const assignees = tasks
      .map(task => task.assignee)
      .filter((assignee, index, self) => assignee && self.indexOf(assignee) === index)
    return assignees
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
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Tarefas</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {filteredTasks.length} de {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, descrição, processo ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todos os status</option>
            <option value="CREATED">Criada</option>
            <option value="CLAIMED">Atribuída</option>
            <option value="COMPLETED">Concluída</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todos os responsáveis</option>
            <option value="unassigned">Não atribuídas</option>
            {getUniqueAssignees().map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
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
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
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
                      <div className="text-sm text-gray-500">{task.processInstanceId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{task.assignee || 'Não atribuída'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.priority ? (
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(task.createTime).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.dueDate ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className={`text-sm ${
                          new Date(task.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-900'
                        }`}>
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-primary-600 hover:text-primary-900 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando página <span className="font-medium">{currentPage + 1}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detalhes da Tarefa</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.description || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsável</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.assignee || 'Não atribuída'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.priority || 'N/A'}</p>
                </div>
                
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Processo</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.processInstanceId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}