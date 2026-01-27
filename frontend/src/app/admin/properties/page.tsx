'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  status: string
  price: number
  location: string
  createdAt: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [page, statusFilter])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getAllProperties({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search || undefined,
      })
      setProperties(data.properties)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Failed to load properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadProperties()
  }

  const handleApprove = async (propertyId: string) => {
    if (!confirm('Approve this property?')) return

    try {
      setActionLoading(propertyId)
      await adminApi.approveProperty(propertyId)
      loadProperties()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve property')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (propertyId: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      setActionLoading(propertyId)
      await adminApi.rejectProperty(propertyId, reason)
      loadProperties()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject property')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to permanently delete this property?')) return

    try {
      setActionLoading(propertyId)
      await adminApi.deleteProperty(propertyId)
      loadProperties()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete property')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Property Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Title, location, description..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No properties found
          </div>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {property.location}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {property.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ml-4 ${getStatusColor(property.status)}`}>
                    {property.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 my-4">
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium">
                      {property.owner.firstName} {property.owner.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-lg font-bold text-green-600">
                      ${property.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/properties/${property.id}`}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>

                  {property.status === 'PENDING_VERIFICATION' && (
                    <>
                      <button
                        onClick={() => handleApprove(property.id)}
                        disabled={actionLoading === property.id}
                        className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === property.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(property.id)}
                        disabled={actionLoading === property.id}
                        className="px-4 py-2 text-sm bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(property.id)}
                    disabled={actionLoading === property.id}
                    className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow px-6 py-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
    VERIFIED: 'bg-green-100 text-green-800',
    RESERVED: 'bg-blue-100 text-blue-800',
    SOLD: 'bg-purple-100 text-purple-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
