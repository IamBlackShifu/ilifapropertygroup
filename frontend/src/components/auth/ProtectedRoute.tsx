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

  const requiredRolesLabel = allowedRoles?.length
    ? allowedRoles.map((role) => role.toLowerCase()).join(', ')
    : null

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
        router.replace('/auth/login')
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Sign in required</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access this page. You will be redirected to the login screen.
          </p>
          <button
            onClick={() => router.replace('/auth/login')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access denied</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your role ({(user?.role || 'unknown').toLowerCase()}) does not have access to this page.
          </p>
          {requiredRolesLabel && (
            <p className="mt-2 text-xs text-gray-500">
              Allowed roles: {requiredRolesLabel}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Go back
            </button>
            <button
              onClick={() => router.replace('/')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Return home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
