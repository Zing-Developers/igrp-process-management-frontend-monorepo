'use client'

import { useEffect, useState } from 'react'
import { 
  getProcesses, 
  getTasks, 
  getMyTasks, 
  getAvailableTasks 
} from '@igrp/platform-process-management-client-ts'
import { 
  Process, 
  Task, 
  PaginatedResponse 
} from '@igrp/platform-process-management-types'
import { 
  Activity, 
  CheckSquare, 
  Clock, 
  GitBranch,
  TrendingUp
} from 'lucide-react'

export function Dashboard() {
  const [processes, setProcesses] = useState<PaginatedResponse<Process> | null>(null)
  const [allTasks, setAllTasks] = useState<PaginatedResponse<Task> | null>(null)
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const currentUserId = 'user1' // Mock user ID

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [processesData, tasksData, myTasksData, availableTasksData] = await Promise.all([
          getProcesses(0, 10),
          getTasks(0, 10),
          getMyTasks(currentUserId),
          getAvailableTasks(currentUserId)
        ])

        setProcesses(processesData)
        setAllTasks(tasksData)
        setMyTasks(myTasksData)
        setAvailableTasks(availableTasksData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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

  const stats = [
    {
      title: 'Total de Processos',
      value: processes?.totalElements || 0,
      icon: GitBranch,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total de Tarefas',
      value: allTasks?.totalElements || 0,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Minhas Tarefas',
      value: myTasks.length,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Tarefas Disponíveis',
      value: availableTasks.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de processos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Processes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Processos Recentes</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {processes?.content.slice(0, 5).map((process) => (
              <div key={process.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{process.name}</p>
                  <p className="text-sm text-gray-500">ID: {process.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  process.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {process.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tarefas Recentes</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {allTasks?.content.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.name}</p>
                  <p className="text-sm text-gray-500">
                    {task.assignee ? `Atribuída a: ${task.assignee}` : 'Não atribuída'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.status === 'CREATED' 
                    ? 'bg-blue-100 text-blue-800' 
                    : task.status === 'ASSIGNED'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}