import apiClient from '@/lib/api-client'
import type { User, RegisterFormData, LoginFormData, ApiResponse } from '@/types'

export interface AuthResponse {
  user: User
  accessToken: string
}

/**
 * Register new user
 */
export async function register(data: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
  if (response.data.success && response.data.data) {
    // Store token
    localStorage.setItem('accessToken', response.data.data.accessToken)
  }
  return response.data
}

/**
 * Login user
 */
export async function login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data)
  if (response.data.success && response.data.data) {
    // Store token
    localStorage.setItem('accessToken', response.data.data.accessToken)
  }
  return response.data
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    // Always clear local storage
    localStorage.removeItem('accessToken')
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me')
  return response.data
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
  if (response.data.success && response.data.data) {
    localStorage.setItem('accessToken', response.data.data.accessToken)
  }
  return response.data
}
