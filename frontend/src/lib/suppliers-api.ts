import apiClient from './api-client'

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
  
  updateOrderStatus: (id: string, data: { status: string }) => 
    apiClient.put<any>(`/suppliers/orders/${id}/status`, data),
  
  // Analytics
  getAnalytics: () => apiClient.get<any>('/suppliers/analytics/dashboard'),
}
