'use client'

import { DashboardSidebar } from './DashboardSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  // Don't show sidebar on auth pages
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>
  }

  // Don't show sidebar if not authenticated
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 pt-16 transition-all duration-300 lg:ml-64 lg:pt-0">
        <div className="min-h-screen overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
