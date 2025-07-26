'use client'

import { useEffect, useState } from 'react'
import { getAvailableTasks, claimTask } from '@igrp/platform-process-management-client-ts'
import { Task } from '@igrp/platform-process-management-types'
import { Clock, User, Calendar, Search } from 'lucide-react'

export default function TarefasDisponiveisPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [claimingTask, setClaimingTask] = useState<string | null>(null)

  const currentUserId = 'user1'

  useEffect(() => {
    fetchAvailableTasks()
  }, [])

  const fetchAvailableTasks = async () => {
    try {
      const data = await getAvailableTasks(currentUserId)
      setTasks(data)
    } catch (error) {
      console.error('Erro ao carregar tarefas disponíveis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimTask = async (taskId: string) => {
    setClaimingTask(taskId)
    try {
      await claimTask(taskId, currentUserId)
      alert('Tarefa atribuída com sucesso!')
      fetchAvailableTasks() // Refresh the list
    } catch (error) {
      console.error('Erro ao atribuir tarefa:', error)
      alert('Erro ao atribuir tarefa')
    } finally {
      setClaimingTask(null)
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tarefas Disponíveis</h1>
        <p className="text-gray-600">Visualize e atribua tarefas disponíveis para você</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa disponível'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Tente ajustar os termos de busca.' 
              : 'Não há tarefas disponíveis para atribuição no momento.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>Processo: {task.processInstanceId}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Criada: {new Date(task.createTime).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                  
                  {task.priority && (
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'HIGH' 
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Prioridade: {task.priority}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {task.status}
                  </span>
                  
                  <button
                    onClick={() => handleClaimTask(task.id)}
                    disabled={claimingTask === task.id}
                    className="btn-primary disabled:opacity-50"
                  >
                    {claimingTask === task.id ? 'Atribuindo...' : 'Atribuir a Mim'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}