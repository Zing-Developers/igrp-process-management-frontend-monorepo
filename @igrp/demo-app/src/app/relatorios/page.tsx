'use client'

import { useEffect, useState } from 'react'
import { getProcesses, getTasks } from '@igrp/platform-process-management-client-ts'
import { Process, Task, PaginatedResponse } from '@igrp/platform-process-management-types'
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react'

export default function RelatoriosPage() {
  const [processes, setProcesses] = useState<PaginatedResponse<Process> | null>(null)
  const [tasks, setTasks] = useState<PaginatedResponse<Task> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [processesData, tasksData] = await Promise.all([
        getProcesses(0, 100),
        getTasks(0, 100)
      ])
      setProcesses(processesData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTaskStatusStats = () => {
    if (!tasks) return []
    
    const statusCount = tasks.content.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / tasks.content.length) * 100)
    }))
  }

  const getProcessStatusStats = () => {
    if (!processes) return []
    
    const statusCount = processes.content.reduce((acc, process) => {
      acc[process.status] = (acc[process.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / processes.content.length) * 100)
    }))
  }

  const getTasksByProcess = () => {
    if (!tasks) return []
    
    const processCount = tasks.content.reduce((acc, task) => {
      acc[task.processInstanceId] = (acc[task.processInstanceId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(processCount)
      .map(([processId, count]) => ({ processId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const taskStatusStats = getTaskStatusStats()
  const processStatusStats = getProcessStatusStats()
  const tasksByProcess = getTasksByProcess()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
          <p className="text-gray-600">Análise e estatísticas do sistema</p>
        </div>
        <button className="btn-primary flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Processos</p>
              <p className="text-2xl font-bold text-gray-900">{processes?.totalElements || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Tarefas</p>
              <p className="text-2xl font-bold text-gray-900">{tasks?.totalElements || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <PieChart className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Processos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {processStatusStats.find(s => s.status === 'ACTIVE')?.count || 0}
              </p>
            </div>
          </div>