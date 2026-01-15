'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🔵 [ProtectedRoute] Auth check:', {
      loading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
      allowedRoles,
      hasAccessToken: !!localStorage.getItem('accessToken'),
      note: 'refreshToken in HTTP-only cookie',
    })
    
    if (!loading) {
      if (!isAuthenticated) {
        console.log('⚠️ [ProtectedRoute] User not authenticated, redirecting to login')
        router.push('/auth/login')
      } else if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
        console.log('⚠️ [ProtectedRoute] User role not allowed, redirecting to home')
        router.push('/') // Redirect to home if user doesn't have required role
      } else {
        console.log('✅ [ProtectedRoute] Access granted')
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return null
  }

  return <>{children}</>
}
