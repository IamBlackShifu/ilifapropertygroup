import apiClient from '@/lib/api-client';
import { Property, PropertyStatus, PropertyType } from '@/types';

export interface PropertyFilters {
  search?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  locationCity?: string;
  locationArea?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertyResponse {
  success: boolean;
  data: Property;
  message?: string;
}

export interface PropertiesListResponse {
  success: boolean;
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PropertyStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: {
      draft: number;
      pending: number;
      verified: number;
      reserved: number;
      sold: number;
    };
  };
}

export interface PropertyMutationPayload extends Partial<Omit<Property, 'images'>> {
  images?: string[];
  imageUrls?: string[];
  parkingSpaces?: number;
  yearBuilt?: number;
  features?: string[];
}

export const propertiesAPI = {
  // Get all properties with filters
  async getProperties(filters?: PropertyFilters): Promise<PropertiesListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  async getProperty(id: string): Promise<PropertyResponse> {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  // Get current user's properties
  async getMyProperties(): Promise<PropertiesListResponse> {
    const response = await apiClient.get('/properties/my-properties');
    return response.data;
  },

  // Get property statistics
  async getPropertyStats(): Promise<PropertyStatsResponse> {
    const response = await apiClient.get('/properties/user/stats');
    return response.data;
  },

  // Create new property
  async createProperty(data: PropertyMutationPayload): Promise<PropertyResponse> {
    const response = await apiClient.post('/properties', data);
    return response.data;
  },

  // Update property
  async updateProperty(id: string, data: PropertyMutationPayload): Promise<PropertyResponse> {
    const response = await apiClient.patch(`/properties/${id}`, data);
    return response.data;
  },

  // Delete property
  async deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },

  // Submit property for verification
  async submitForVerification(id: string): Promise<PropertyResponse> {
    const response = await apiClient.patch(`/properties/${id}/submit-verification`);
    return response.data;
  },

  // Verify property (Admin only)
  async verifyProperty(id: string): Promise<PropertyResponse> {
    const response = await apiClient.patch(`/properties/${id}/verify`);
    return response.data;
  },

  // Mark as reserved
  async markAsReserved(id: string): Promise<PropertyResponse> {
    const response = await apiClient.patch(`/properties/${id}/reserve`);
    return response.data;
  },

  // Mark as sold
  async markAsSold(id: string): Promise<PropertyResponse> {
    const response = await apiClient.patch(`/properties/${id}/sold`);
    return response.data;
  },
};

// File upload API
export const filesAPI = {
  // Upload single property image
  async uploadPropertyImage(file: File): Promise<{ success: boolean; data: { imageUrl: string } }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/files/upload/property-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple property images
  async uploadPropertyImages(files: File[]): Promise<{ success: boolean; data: { imageUrls: string[] } }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post('/files/upload/property-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete file
  async deleteFile(imageUrl: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete('/files/delete', {
      data: { imageUrl },
    });
    return response.data;
  },
};
