'use client'

import { useEffect, useState } from 'react'
import { 
  getProcesses, 
  getProcessById, 
  startProcess 
} from '@igrp/platform-process-management-client-ts'
import { Process, ProcessInstance } from '@igrp/platform-process-management-types'
import { Play, Eye, Search, Plus } from 'lucide-react'

export default function ProcessMap() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [startingProcess, setStartingProcess] = useState<string | null>(null)
  const [showStartModal, setShowStartModal] = useState(false)
  const [businessKey, setBusinessKey] = useState('')
  const [variables, setVariables] = useState('')

  useEffect(() => {
    loadProcesses()
  }, [])

  const loadProcesses = async () => {
    try {
      const data = await getProcesses(0, 100)
      setProcesses(data.content)
    } catch (error) {
      console.error('Error loading processes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartProcess = async (processId: string) => {
    setStartingProcess(processId)
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

      const instance = await startProcess(
        processId, 
        businessKey || undefined, 
        Object.keys(parsedVariables).length > 0 ? parsedVariables : undefined
      )
      
      alert(`Processo iniciado com sucesso! ID da instância: ${instance.id}`)
      setShowStartModal(false)
      setBusinessKey('')
      setVariables('')
    } catch (error) {
      console.error('Error starting process:', error)
      alert('Erro ao iniciar processo')
    } finally {
      setStartingProcess(null)
    }
  }

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mapa de Processos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProcesses.map((process) => (
          <div key={process.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{process.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{process.description}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                process.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {process.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Versão:</span>
                <span className="font-medium">{process.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{process.category || 'N/A'}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedProcess(process)}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </button>
              <button
                onClick={() => {
                  setSelectedProcess(process)
                  setShowStartModal(true)
                }}
                disabled={process.status !== 'ACTIVE'}
                className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Process Details Modal */}
      {selectedProcess && !showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detalhes do Processo</h2>
              <button
                onClick={() => setSelectedProcess(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProcess.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProcess.description || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Versão</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProcess.version}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProcess.status}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProcess.category || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Process Modal */}
      {showStartModal && selectedProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Iniciar Processo</h2>
              <button
                onClick={() => {
                  setShowStartModal(false)
                  setBusinessKey('')
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
                  Processo
                </label>
                <p className="text-sm text-gray-900 font-medium">{selectedProcess.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chave de Negócio (opcional)
                </label>
                <input
                  type="text"
                  value={businessKey}
                  onChange={(e) => setBusinessKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: REQ-2024-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variáveis (JSON, opcional)
                </label>
                <textarea
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder='{"campo1": "valor1", "campo2": "valor2"}'
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStartModal(false)
                  setBusinessKey('')
                  setVariables('')
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleStartProcess(selectedProcess.id)}
                disabled={startingProcess === selectedProcess.id}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                {startingProcess === selectedProcess.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
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