'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api-client'

interface ServiceRequest {
  id: string
  serviceType: string
  description: string
  urgency: string
  status: string
  preferredDate: string | null
  locationCity: string | null
  estimatedBudget: string | null
  quotedAmount: string | null
  requestedAt: string
  respondedAt: string | null
  contractor: {
    id: string
    companyName: string
    locationCity: string
    user: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }
  }
  property: {
    id: string
    title: string
    locationCity: string
  } | null
}

export default function MyRequestsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    loadRequests()
  }, [user, filter])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/services/requests/my-requests', {
        params: { status: filter || undefined }
      })
      setRequests(response.data.data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this service request?')) return

    try {
      await apiClient.delete(`/services/requests/${id}`)
      alert('Request cancelled')
      loadRequests()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel request')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Service Requests</h1>
          <Link
            href="/professionals"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Request New Service
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            {['', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No service requests found</p>
            <Link
              href="/professionals"
              className="text-primary-600 hover:underline"
            >
              Browse contractors to request a service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{request.serviceType}</h3>
                    <p className="text-gray-600">
                      Requested from: <Link href={`/contractor/${request.contractor.id}`} className="text-primary-600 hover:underline">{request.contractor.companyName}</Link>
                    </p>
                    {request.property && (
                      <p className="text-sm text-gray-500">
                        Property: {request.property.title}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{request.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Urgency</p>
                    <p className="font-medium">{request.urgency}</p>
                  </div>
                  {request.locationCity && (
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{request.locationCity}</p>
                    </div>
                  )}
                  {request.estimatedBudget && (
                    <div>
                      <p className="text-gray-500">Estimated Budget</p>
                      <p className="font-medium">${Number(request.estimatedBudget).toLocaleString()}</p>
                    </div>
                  )}
                  {request.quotedAmount && (
                    <div>
                      <p className="text-gray-500">Quoted Amount</p>
                      <p className="font-medium">${Number(request.quotedAmount).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Requested</p>
                    <p className="font-medium">{new Date(request.requestedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/services/requests/${request.id}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                  {request.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(request.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
