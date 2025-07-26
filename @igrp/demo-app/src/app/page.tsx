'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Dashboard } from '../components/Dashboard'
import { ProcessMap } from '../components/ProcessMap'
import { MyTasks } from '../components/MyTasks'
import { AvailableTasks } from '../components/AvailableTasks'
import { TaskManagement } from '../components/TaskManagement'
import ProcessConfiguration from '../components/ProcessConfiguration'

type ActiveView = 'dashboard' | 'processes' | 'my-tasks' | 'available-tasks' | 'task-management' | 'process-configuration'

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'processes':
        return <ProcessMap />
      case 'my-tasks':
        return <MyTasks />
      case 'available-tasks':
        return <AvailableTasks />
      case 'task-management':
        return <TaskManagement />
      case 'process-configuration':
        return <ProcessConfiguration />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}