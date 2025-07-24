'use client'

import { useEffect, useState } from 'react'
import { 
  getProcesses, 
  getMyTasks, 
  getAvailableTasks 
} from '@igrp/platform-process-management-client-ts'
import { 
  Process, 
  Task, 
  PaginatedResponse 
} from '@igrp/platform-process-management-types'
import { 
  Play, 
  Clock, 
  CheckSquare, 
  Users,
  TrendingUp,
  Activity
} from 'lucide-react'

export function DashboardContent() {
  const [stats, setStats] = useState({
    totalProcesses: 0,
    myTasks: 0,
    availableTasks: 0,
    completedTasks: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentProcesses, setRecentProcesses] = useState<Process[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [processesResponse, myTasksResponse, availableTasksResponse] = await Promise.all([
        getProcesses(0, 5),
        getMyTasks(0, 5),
        getAvailableTasks(0, 5)
      ])

      setStats({
        totalProcesses: processesResponse?.totalElements || 0,
        myTasks: myTasksResponse?.totalElements || 0,
        availableTasks: availableTasksResponse?.totalElements || 0,
        completedTasks: 0 // This would come from a completed tasks endpoint
      })

      setRecentProcesses(processesResponse?.content || [])
      setRecentTasks(myTasksResponse?.content || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set default values in case of error
      setStats({
        totalProcesses: 0,
        myTasks: 0,
        availableTasks: 0,
        completedTasks: 0
      })
      setRecentProcesses([])
      setRecentTasks([])
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total de Processos',
      value: stats.totalProcesses,
      icon: Activity,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Minhas Tarefas',
      value: stats.myTasks,
      icon: CheckSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Tarefas Disponíveis',
      value: stats.availableTasks,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Tarefas Concluídas',
      value: stats.completedTasks,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de processos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Processes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Processos Recentes</h2>
            <Play className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentProcesses.length > 0 ? (
              recentProcesses.map((process) => (
                <div key={process.processDefinitionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{process.title}</h3>
                    <p className="text-sm text-gray-500">{process.category}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    v{process.version}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum processo disponível</p>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tarefas Recentes</h2>
            <CheckSquare className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.name}</h3>
                    <p className="text-sm text-gray-500">
                      {task.processInstanceId}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'HIGH' 
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma tarefa disponível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}