'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '@/lib/api-client'

interface User {
  id: string
  firstName: string
  lastName: string
  name?: string
  email: string
  role: 'BUYER' | 'OWNER' | 'CONTRACTOR' | 'SUPPLIER' | 'AGENT' | 'ADMIN'
  phone?: string
  avatar?: string
  profileImageUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    phone?: string
  }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from token on mount
  useEffect(() => {
    console.log('🔵 [AuthContext] Initializing - Loading user from token')
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken')
      console.log('🔵 [AuthContext] Tokens in localStorage:', {
        hasAccessToken: !!token,
        accessTokenLength: token?.length,
        note: 'refreshToken is in HTTP-only cookie',
      })
      
      if (token) {
        console.log('🔵 [AuthContext] Token found, attempting to load user')
        try {
          const response = await authAPI.getCurrentUser()
          // Handle both data.data and direct data response formats
          const userData = response.data?.data || response.data
          setUser(userData)
          console.log('✅ [AuthContext] User loaded successfully:', userData)
        } catch (error) {
          console.error('❌ [AuthContext] Failed to load user:', error)
          console.log('🔵 [AuthContext] Clearing invalid token')
          localStorage.removeItem('accessToken')
        }
      } else {
        console.log('⚠️ [AuthContext] No access token found in localStorage')
      }
      setLoading(false)
      console.log('🔵 [AuthContext] Loading complete')
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    console.log('🔵 [AuthContext] Login attempt for:', email)
    try {
      const response = await authAPI.login(email, password)
      console.log('🔵 [AuthContext] Login API response received:', response)
      // Backend returns { success, data: { user, accessToken }, message }
      // refreshToken is in HTTP-only cookie
      const data = (response.data?.data || response.data) as {
        accessToken?: string
        user?: User
      }
      console.log('🔵 [AuthContext] Parsed login data:', {
        hasAccessToken: !!data.accessToken,
        hasUser: !!data.user,
        userRole: data.user?.role,
        note: 'refreshToken in HTTP-only cookie',
      })

      if (!data.accessToken || !data.user) {
        throw new Error('Invalid login response from server')
      }

      localStorage.setItem('accessToken', data.accessToken)
      console.log('✅ [AuthContext] AccessToken saved to localStorage')
      setUser(data.user)
      console.log('✅ [AuthContext] Login successful, user set:', data.user)
    } catch (error) {
      console.error('❌ [AuthContext] Login error:', error)
      throw error
    }
  }

  const register = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    phone?: string
  }) => {
    console.log('🔵 [AuthContext] Registration attempt for:', data.email)
    try {
      const response = await authAPI.register(data)
      console.log('🔵 [AuthContext] Registration API response received')
      // Backend returns { success, data: { user, accessToken }, message }
      // refreshToken is in HTTP-only cookie
      const responseData = (response.data?.data || response.data) as {
        accessToken?: string
        user?: User
      }
      console.log('🔵 [AuthContext] Parsed registration data:', {
        hasAccessToken: !!responseData.accessToken,
        hasUser: !!responseData.user,
        note: 'refreshToken in HTTP-only cookie',
      })

      if (!responseData.accessToken || !responseData.user) {
        throw new Error('Invalid registration response from server')
      }

      localStorage.setItem('accessToken', responseData.accessToken)
      console.log('✅ [AuthContext] AccessToken saved to localStorage')
      setUser(responseData.user)
      console.log('✅ [AuthContext] Registration successful, user set:', responseData.user)
    } catch (error) {
      console.error('❌ [AuthContext] Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('🔵 [AuthContext] Logout initiated')
    localStorage.removeItem('accessToken')
    console.log('🔵 [AuthContext] AccessToken removed from localStorage')
    console.log('🔵 [AuthContext] Note: refreshToken in HTTP-only cookie will be cleared by backend')
    setUser(null)
    console.log('✅ [AuthContext] User state cleared, logout complete')
    // Call backend logout endpoint to clear HTTP-only cookie
    authAPI.logout().catch(() => {})
  }

  const hasRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false
  }

  // Debug: Log whenever user or loading state changes
  useEffect(() => {
    console.log('🔵 [AuthContext] State changed:', {
      isAuthenticated: !!user,
      loading,
      userId: user?.id,
      userName: user?.name,
      userRole: user?.role,
    })
  }, [user, loading])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
