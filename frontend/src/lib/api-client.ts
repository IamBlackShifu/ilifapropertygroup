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

  // Save/Unsave property
  saveProperty: (propertyId: string, notes?: string) => 
    apiClient.post<any>('/properties/saved', { propertyId, notes }),

  unsaveProperty: (propertyId: string) => 
    apiClient.delete(`/properties/saved/${propertyId}`),

  getSavedProperties: () => 
    apiClient.get<any>('/properties/saved/list'),

  checkIfSaved: (propertyId: string) => 
    apiClient.get<any>(`/properties/saved/check/${propertyId}`),

  // Schedule viewing
  scheduleViewing: (data: {
    propertyId: string
    preferredDate: string
    preferredTime: string
    contactName: string
    contactEmail: string
    contactPhone: string
    message?: string
  }) => apiClient.post<any>('/properties/viewings', data),

  getViewingRequests: () => 
    apiClient.get<any>('/properties/viewings/my-requests'),

  getPropertyViewings: (propertyId: string) => 
    apiClient.get<any>(`/properties/${propertyId}/viewings`),

  // Contact owner
  contactOwner: (data: {
    propertyId: string
    name: string
    email: string
    phone: string
    message: string
  }) => apiClient.post<any>('/properties/contact-owner', data),
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

// Suppliers API methods
export const suppliersAPI = {
  // Supplier profile
  createProfile: (data: any) => apiClient.post<any>('/suppliers/profile', data),
  
  getMyProfile: () => apiClient.get<any>('/suppliers/profile/me'),
  
  updateProfile: (data: any) => apiClient.put<any>('/suppliers/profile', data),
  
  getAllSuppliers: (params?: {
    category?: string
    city?: string
    isVerified?: boolean
    status?: string
    search?: string
  }) => apiClient.get<any[]>('/suppliers', { params }),
  
  getSupplierById: (id: string) => apiClient.get<any>(`/suppliers/${id}`),
  
  // Products
  createProduct: (data: any) => apiClient.post<any>('/suppliers/products', data),
  
  getSupplierProducts: (supplierId: string, params?: {
    category?: string
    status?: string
  }) => apiClient.get<any[]>(`/suppliers/${supplierId}/products`, { params }),
  
  searchProducts: (params: {
    category?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    search?: string
  }) => apiClient.get<any[]>('/suppliers/products/search', { params }),
  
  getProductById: (id: string) => apiClient.get<any>(`/suppliers/products/${id}`),
  
  updateProduct: (id: string, data: any) => apiClient.put<any>(`/suppliers/products/${id}`, data),
  
  deleteProduct: (id: string) => apiClient.delete(`/suppliers/products/${id}`),
  
  // Orders
  createOrder: (data: {
    supplierId: string
    items: Array<{ productId: string; quantity: number }>
    deliveryAddress: string
    deliveryCity: string
    contactName: string
    contactPhone: string
    notes?: string
  }) => apiClient.post<any>('/suppliers/orders', data),
  
  getMySupplierOrders: (params?: { status?: string }) => 
    apiClient.get<any[]>('/suppliers/orders/my-orders', { params }),
  
  getMyPurchases: (params?: { status?: string }) => 
    apiClient.get<any[]>('/suppliers/orders/my-purchases', { params }),
  
  getOrderById: (id: string) => apiClient.get<any>(`/suppliers/orders/${id}`),
  
  updateOrderStatus: (id: string, data: { status?: string }) => 
    apiClient.put<any>(`/suppliers/orders/${id}/status`, data),
  
  // Analytics
  getAnalytics: () => apiClient.get<any>('/suppliers/analytics/dashboard'),
}

// Files API
export const filesAPI = {
  uploadProductImages: (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    return apiClient.post<{ success: boolean; data: { imageUrls: string[] } }>(
      '/files/upload/product-images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
  
  deleteFile: (imageUrl: string) => 
    apiClient.delete('/files/delete', { data: { imageUrl } }),
}
