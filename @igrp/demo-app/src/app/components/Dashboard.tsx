'use client'

import { useEffect, useState } from 'react'
import { 
  getTasks, 
  getProcesses, 
  getMyTasks, 
  getAvailableTasks 
} from '@igrp/platform-process-management-client-ts'
import { Task, Process } from '@igrp/platform-process-management-types'
import { Activity, CheckCircle, Clock, GitBranch } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProcesses: 0,
    myTasks: 0,
    availableTasks: 0,
    completedTasks: 0
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [processesData, tasksData, myTasksData, availableTasksData] = await Promise.all([
          getProcesses(0, 100),
          getTasks(0, 100),
          getMyTasks('currentUser'),
          getAvailableTasks('currentUser')
        ])

        setStats({
          totalProcesses: processesData.totalElements,
          myTasks: myTasksData.length,
          availableTasks: availableTasksData.length,
          completedTasks: tasksData.content.filter(t => t.status === 'COMPLETED').length
        })

        setRecentTasks(tasksData.content.slice(0, 5))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Processos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProcesses}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Minhas Tarefas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.myTasks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tarefas Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableTasks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tarefas Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarefas Recentes</h2>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{task.name}</h3>
                <p className="text-sm text-gray-600">Processo: {task.processInstanceId}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  task.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'CREATED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(task.createTime).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}