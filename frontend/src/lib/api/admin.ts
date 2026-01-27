import apiClient from '@/lib/api-client'

export interface DashboardStats {
  totalUsers: number
  totalProperties: number
  pendingVerifications: number
  activeProperties: number
  totalRevenue: number
}

export interface RecentUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export interface RecentProperty {
  id: string
  title: string
  price: number
  status: string
  createdAt: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    const { data } = await apiClient.get('/admin/dashboard/stats')
    return data
  },

  // Users
  getAllUsers: async (params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
    status?: string
  }) => {
    const { data } = await apiClient.get('/admin/users', { params })
    return data
  },

  getUserById: async (id: string) => {
    const { data } = await apiClient.get(`/admin/users/${id}`)
    return data
  },

  updateUser: async (id: string, updateData: any) => {
    const { data } = await apiClient.put(`/admin/users/${id}`, updateData)
    return data
  },

  suspendUser: async (id: string, reason?: string) => {
    const { data } = await apiClient.post(`/admin/users/${id}/suspend`, { reason })
    return data
  },

  activateUser: async (id: string) => {
    const { data } = await apiClient.post(`/admin/users/${id}/activate`)
    return data
  },

  deleteUser: async (id: string) => {
    const { data } = await apiClient.delete(`/admin/users/${id}`)
    return data
  },

  // Properties
  getAllProperties: async (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) => {
    const { data } = await apiClient.get('/admin/properties', { params })
    return data
  },

  updateProperty: async (id: string, updateData: any) => {
    const { data } = await apiClient.put(`/admin/properties/${id}`, updateData)
    return data
  },

  deleteProperty: async (id: string) => {
    const { data } = await apiClient.delete(`/admin/properties/${id}`)
    return data
  },

  approveProperty: async (id: string) => {
    const { data } = await apiClient.post(`/admin/properties/${id}/approve`)
    return data
  },

  rejectProperty: async (id: string, rejectionReason: string) => {
    const { data } = await apiClient.post(`/admin/properties/${id}/reject`, {
      rejectionReason,
    })
    return data
  },

  // Verifications
  getPendingVerifications: async (params?: {
    page?: number
    limit?: number
    entityType?: string
  }) => {
    const { data } = await apiClient.get('/admin/verifications/pending', { params })
    return data
  },

  approveVerification: async (id: string) => {
    const { data } = await apiClient.post(`/admin/verifications/${id}/approve`)
    return data
  },

  rejectVerification: async (id: string, rejectionReason: string) => {
    const { data } = await apiClient.post(`/admin/verifications/${id}/reject`, {
      rejectionReason,
    })
    return data
  },

  // Suppliers
  getAllSuppliers: async (params?: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'VERIFIED' | 'SUSPENDED'
    search?: string
  }) => {
    const { data } = await apiClient.get('/admin/suppliers', { params })
    return data
  },

  getSupplierById: async (id: string) => {
    const { data } = await apiClient.get(`/admin/suppliers/${id}`)
    return data
  },

  verifySupplier: async (id: string) => {
    const { data } = await apiClient.post(`/admin/suppliers/${id}/verify`)
    return data
  },

  rejectSupplier: async (id: string, rejectionReason: string) => {
    const { data } = await apiClient.post(`/admin/suppliers/${id}/reject`, {
      rejectionReason,
    })
    return data
  },

  suspendSupplier: async (id: string, reason?: string) => {
    const { data } = await apiClient.post(`/admin/suppliers/${id}/suspend`, { reason })
    return data
  },

  activateSupplier: async (id: string) => {
    const { data } = await apiClient.post(`/admin/suppliers/${id}/activate`)
    return data
  },

  // Contractors
  getAllContractors: async (params?: {
    page?: number
    limit?: number
    status?: 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'INCOMPLETE'
    search?: string
  }) => {
    const { data } = await apiClient.get('/admin/contractors', { params })
    return data
  },

  getContractorById: async (id: string) => {
    const { data } = await apiClient.get(`/admin/contractors/${id}`)
    return data
  },

  verifyContractor: async (id: string) => {
    const { data } = await apiClient.post(`/admin/contractors/${id}/verify`)
    return data
  },

  rejectContractor: async (id: string, rejectionReason: string) => {
    const { data } = await apiClient.post(`/admin/contractors/${id}/reject`, {
      rejectionReason,
    })
    return data
  },

  suspendContractor: async (id: string, reason?: string) => {
    const { data } = await apiClient.post(`/admin/contractors/${id}/suspend`, { reason })
    return data
  },

  activateContractor: async (id: string) => {
    const { data } = await apiClient.post(`/admin/contractors/${id}/activate`)
    return data
  },

  // Subscriptions
  getAllSubscriptions: async (params?: {
    page?: number
    limit?: number
    status?: string
    plan?: string
  }) => {
    const { data } = await apiClient.get('/admin/subscriptions', { params })
    return data
  },

  getSubscriptionStats: async () => {
    const { data } = await apiClient.get('/admin/subscriptions/stats')
    return data
  },

  // Payments
  getAllPayments: async (params?: {
    page?: number
    limit?: number
    status?: string
  }) => {
    const { data } = await apiClient.get('/admin/payments', { params })
    return data
  },

  getPaymentStats: async () => {
    const { data } = await apiClient.get('/admin/payments/stats')
    return data
  },
}
