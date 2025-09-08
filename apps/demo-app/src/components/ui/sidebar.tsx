'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/processes',
    label: 'Mapa de Processos',
    icon: GitBranch,
  },
  {
    href: '/tasks/my-tasks',
    label: 'Minhas Tarefas',
    icon: CheckSquare,
  },
  {
    href: '/tasks/available',
    label: 'Tarefas Disponíveis',
    icon: Clock,
  },
  {
    href: '/tasks/management',
    label: 'Gestão de Tarefas',
    icon: Settings,
  },
  {
    href: '/configuration',
    label: 'Configuração do Processo',
    icon: Cog,
  },
]

export function Sidebar() {
  const pathname = usePathname()

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
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}