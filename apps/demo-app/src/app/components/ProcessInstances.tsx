'use client'

import { useEffect, useState } from 'react'
import { 
  getProcessInstances,
  getProcessInstanceById,
  terminateProcessInstance,
  suspendProcessInstance,
  resumeProcessInstance,
  getProcessInstancesStatus,
  getRunningProcessInstances
} from '@irn/platform-process-management-client-ts'
import { ProcessInstance, PaginatedResponse } from '@irn/platform-process-management-types'
import { 
  Search, 
  Filter, 
  Eye, 
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react'

interface StatusOption {
  label: string;
  value: string;
}

export function ProcessInstances() {
  const [instances, setInstances] = useState<PaginatedResponse<ProcessInstance> | null>(null)
  const [selectedInstance, setSelectedInstance] = useState<ProcessInstance | null>(null)
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)

  useEffect(() => {
    fetchInitialData()
  }, [currentPage])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [instancesData, statusData] = await Promise.all([
        getProcessInstances(currentPage, pageSize, {
          status: statusFilter === 'ALL' ? undefined : statusFilter as any
        }),
        getProcessInstancesStatus()
      ])
      setInstances(instancesData)
      setStatusOptions(statusData)
    } catch (error) {
      console.error('Error fetching process instances:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewInstance = async (instanceId: string) => {
    try {
      const instance = await getProcessInstanceById(instanceId)
      setSelectedInstance(instance)
    } catch (error) {
      console.error('Error fetching instance details:', error)
    }
  }

  const handleTerminateInstance = async (instanceId: string) => {
    if (!confirm('Tem certeza que deseja terminar esta instância de processo?')) return
    
    try {
      setActionLoading(instanceId)
      await terminateProcessInstance(instanceId, 'Terminado pelo usuário')
      alert('Instância terminada com sucesso!')
      fetchInitialData()
      setSelectedInstance(null)
    } catch (error) {
      console.error('Error terminating instance:', error)
      alert('Erro ao terminar instância')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspendInstance = async (instanceId: string) => {
    try {
      setActionLoading(instanceId)
      await suspendProcessInstance(instanceId)
      alert('Instância suspensa com sucesso!')
      fetchInitialData()
      setSelectedInstance(null)
    } catch (error) {
      console.error('Error suspending instance:', error)
      alert('Erro ao suspender instância')
    } finally {
      setActionLoading(null)
    }
  }

  const handleResumeInstance = async (instanceId: string) => {
    try {
      setActionLoading(instanceId)
      await resumeProcessInstance(instanceId)
      alert('Instância retomada com sucesso!')
      fetchInitialData()
      setSelectedInstance(null)
    } catch (error) {
      console.error('Error resuming instance:', error)
      alert('Erro ao retomar instância')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-green-100 text-green-800'
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'TERMINATED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInstances = instances?.content.filter(instance => {
    const matchesSearch = instance.procReleaseKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instance.businessKey?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || instance.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  if (loading && !instances) {
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-