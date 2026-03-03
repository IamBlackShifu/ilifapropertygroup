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
      <main className="flex-1 ml-64 transition-all duration-300">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
