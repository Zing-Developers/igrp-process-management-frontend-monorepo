'use client'

import { useEffect, useState } from 'react'
import { getProcesses, getProcessById, startProcess } from '@igrp/platform-process-management-client-ts'
import { Process, PaginatedResponse, ProcessInstance } from '@igrp/platform-process-management-types'
import { Play, Search, Filter, Eye } from 'lucide-react'

export default function ProcessosPage() {
  const [processes, setProcesses] = useState<PaginatedResponse<Process> | null>(null)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showStartModal, setShowStartModal] = useState(false)
  const [startingProcess, setStartingProcess] = useState(false)

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    try {
      const data = await getProcesses(0, 20)
      setProcesses(data)
    } catch (error) {
      console.error('Erro ao carregar processos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartProcess = async (processId: string) => {
    setStartingProcess(true)
    try {
      const businessKey = `BK_${Date.now()}`
      const variables = { initiatedBy: 'user1', timestamp: new Date().toISOString() }
      
      const processInstance = await startProcess(processId, businessKey, variables)
      alert(`Processo iniciado com sucesso! ID: ${processInstance.id}`)
      setShowStartModal(false)
    } catch (error) {
      console.error('Erro ao iniciar processo:', error)
      alert('Erro ao iniciar processo')
    } finally {
      setStartingProcess(false)
    }
  }

  const filteredProcesses = processes?.content.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Processos</h1>
        <p className="text-gray-600">Visualize e gerencie todos os processos disponíveis</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar processos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>

      {/* Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProcesses.map((process) => (
          <div key={process.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{process.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{process.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                process.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {process.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Versão {process.version}</span>
              <span>ID: {process.id}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedProcess(process)
                  setShowStartModal(true)
                }}
                disabled={process.status !== 'ACTIVE'}
                className="btn-primary flex items-center flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar
              </button>
              <button
                onClick={() => setSelectedProcess(process)}
                className="btn-secondary flex items-center"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Start Process Modal */}
      {showStartModal && selectedProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Iniciar Processo</h2>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja iniciar o processo "{selectedProcess.name}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleStartProcess(selectedProcess.id)}
                disabled={startingProcess}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {startingProcess ? 'Iniciando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setShowStartModal(false)}
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