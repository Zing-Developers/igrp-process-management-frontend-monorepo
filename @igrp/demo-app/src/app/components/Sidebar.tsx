'use client'

import { 
  LayoutDashboard, 
  GitBranch, 
  CheckSquare, 
  Clock, 
  Settings 
} from 'lucide-react'
import clsx from 'clsx'

type ActiveView = 'dashboard' | 'processes' | 'my-tasks' | 'available-tasks' | 'task-management'

interface SidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'processes', label: 'Mapa de Processos', icon: GitBranch },
  { id: 'my-tasks', label: 'Minhas Tarefas', icon: CheckSquare },
  { id: 'available-tasks', label: 'Tarefas Disponíveis', icon: Clock },
  { id: 'task-management', label: 'Gestão de Tarefas', icon: Settings },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">IGRP</h1>
        <p className="text-sm text-gray-600">Gestão de Processos</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ActiveView)}
              className={clsx(
                'w-full flex items-center px-6 py-3 text-left transition-colors',
                activeView === item.id
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}