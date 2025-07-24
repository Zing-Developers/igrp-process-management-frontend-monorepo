'use client'

import { 
  LayoutDashboard, 
  GitBranch, 
  CheckSquare, 
  Clock, 
  Settings,
  User,
  Cog
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ActiveView = 'dashboard' | 'processes' | 'my-tasks' | 'available-tasks' | 'task-management' | 'process-configuration'

interface SidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

const menuItems = [
  {
    id: 'dashboard' as ActiveView,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'processes' as ActiveView,
    label: 'Mapa de Processos',
    icon: GitBranch,
  },
  {
    id: 'my-tasks' as ActiveView,
    label: 'Minhas Tarefas',
    icon: CheckSquare,
  },
  {
    id: 'available-tasks' as ActiveView,
    label: 'Tarefas Disponíveis',
    icon: Clock,
  },
  {
    id: 'task-management' as ActiveView,
    label: 'Gestão de Tarefas',
    icon: Settings,
  },
  {
    id: 'process-configuration' as ActiveView,
    label: 'Configuração do Processo',
    icon: Cog,
  },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">IGRP</h1>
            <p className="text-sm text-gray-500">Process Management</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                    activeView === item.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}