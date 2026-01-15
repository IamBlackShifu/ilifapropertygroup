'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  price: string
  locationCity: string
  locationArea?: string
  status: string
  viewCount: number
  images: any[]
  createdAt: string
}

export default function MyPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={['OWNER', 'AGENT', 'ADMIN']}>
      <MyPropertiesContent />
    </ProtectedRoute>
  )
}

function MyPropertiesContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:4000/api/properties/my-properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
      } else {
        setError('Failed to load properties')
      }
    } catch (error) {
      setError('An error occurred while loading properties')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:4000/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id))
        setDeleteConfirm(null)
      } else {
        alert('Failed to delete property')
      }
    } catch (error) {
      alert('An error occurred while deleting the property')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800'
      case 'PENDING_VERIFICATION': return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'SOLD': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="mt-2 text-gray-600">Manage your property listings</p>
            </div>
            <Link
              href="/my-properties/new"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              + Add New Property
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No properties yet</h3>
              <p className="mt-2 text-gray-600">Get started by listing your first property</p>
              <Link
                href="/my-properties/new"
                className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                    {property.images && property.images.length > 0 && property.images[0].imageUrl ? (
                      <img
                        src={property.images[0].imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white text-4xl">
                        🏠
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {property.locationCity}{property.locationArea ? `, ${property.locationArea}` : ''}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${parseFloat(property.price).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {property.viewCount} views
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/buy-property/${property.id}`}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-center text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/my-properties/edit/${property.id}`}
                        className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-center text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(property.id)}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this property? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
