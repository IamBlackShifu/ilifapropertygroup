import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const { accessToken } = response.data.data

        // Save new token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken)
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
// Auth API methods
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', {
      email,
      password,
    }),

  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    phone?: string
  }) =>
    apiClient.post<{ accessToken: string; refreshToken: string; user: any }>(
      '/auth/register',
      data
    ),

  logout: () => apiClient.post('/auth/logout', {}),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),

  getCurrentUser: () => apiClient.get<any>('/auth/me'),
}

// Properties API methods
export const propertiesAPI = {
  getAll: (params?: any) => apiClient.get<any[]>('/properties', { params }),

  getById: (id: string) => apiClient.get<any>(`/properties/${id}`),

  create: (data: any) => apiClient.post<any>('/properties', data),

  update: (id: string, data: any) => apiClient.patch<any>(`/properties/${id}`, data),

  delete: (id: string) => apiClient.delete(`/properties/${id}`),
}

// Professionals API methods
export const professionalsAPI = {
  getAll: (params?: any) => apiClient.get<any[]>('/professionals', { params }),

  getById: (id: string) => apiClient.get<any>(`/professionals/${id}`),

  create: (data: any) => apiClient.post<any>('/professionals', data),

  update: (id: string, data: any) => apiClient.patch<any>(`/professionals/${id}`, data),

  delete: (id: string) => apiClient.delete(`/professionals/${id}`),
}

// Projects API methods
export const projectsAPI = {
  getAll: (params?: any) => apiClient.get<any[]>('/projects', { params }),

  getById: (id: string) => apiClient.get<any>(`/projects/${id}`),

  create: (data: any) => apiClient.post<any>('/projects', data),

  update: (id: string, data: any) => apiClient.patch<any>(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete(`/projects/${id}`),
}

// Users API methods
export const usersAPI = {
  getAll: (params?: any) => apiClient.get<any[]>('/users', { params }),

  getById: (id: string) => apiClient.get<any>(`/users/${id}`),

  update: (id: string, data: any) => apiClient.patch<any>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),
}