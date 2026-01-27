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
  locationAddress: string | null
  estimatedBudget: string | null
  quotedAmount: string | null
  requestedAt: string
  requester: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  property: {
    id: string
    title: string
    locationCity: string
  } | null
}

export default function ContractorRequestsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'CONTRACTOR') {
      router.push('/dashboard')
      return
    }
    loadRequests()
  }, [user, filter])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/services/requests/contractor-requests', {
        params: { status: filter || undefined }
      })
      setRequests(response.data.data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id: string) => {
    const quotedAmount = prompt('Enter your quoted amount (USD):')
    if (!quotedAmount) return

    const notes = prompt('Add any notes for the client (optional):')

    try {
      setActionLoading(id)
      await apiClient.patch(`/services/requests/${id}`, {
        status: 'ACCEPTED',
        quotedAmount: parseFloat(quotedAmount),
        contractorNotes: notes || undefined,
      })
      alert('Request accepted successfully')
      loadRequests()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to accept request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      setActionLoading(id)
      await apiClient.patch(`/services/requests/${id}`, {
        status: 'REJECTED',
        rejectionReason: reason,
      })
      alert('Request rejected')
      loadRequests()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkInProgress = async (id: string) => {
    if (!confirm('Mark this request as in progress?')) return

    try {
      setActionLoading(id)
      await apiClient.patch(`/services/requests/${id}`, {
        status: 'IN_PROGRESS',
        startDate: new Date().toISOString(),
      })
      alert('Request marked as in progress')
      loadRequests()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (id: string) => {
    if (!confirm('Mark this request as completed?')) return

    try {
      setActionLoading(id)
      await apiClient.patch(`/services/requests/${id}`, {
        status: 'COMPLETED',
        completedDate: new Date().toISOString(),
      })
      alert('Request marked as completed')
      loadRequests()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to complete request')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT': return 'text-red-600 font-semibold'
      case 'NORMAL': return 'text-gray-600'
      case 'LOW': return 'text-gray-400'
      default: return 'text-gray-600'
    }
  }

  if (user?.role !== 'CONTRACTOR') return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Service Requests</h1>
            <p className="text-gray-600 mt-1">Manage incoming service requests from clients</p>
          </div>
          <Link
            href="/contractors/dashboard"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((status) => (
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
            <p className="text-gray-600 text-lg">No service requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{request.serviceType}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      <span className={`text-sm ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      From: <span className="font-medium">{request.requester.firstName} {request.requester.lastName}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      📧 {request.requester.email} {request.requester.phone && `| 📞 ${request.requester.phone}`}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{request.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm bg-gray-50 p-4 rounded">
                  {request.locationCity && (
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{request.locationCity}</p>
                      {request.locationAddress && <p className="text-xs text-gray-500">{request.locationAddress}</p>}
                    </div>
                  )}
                  {request.estimatedBudget && (
                    <div>
                      <p className="text-gray-500">Client Budget</p>
                      <p className="font-medium">${Number(request.estimatedBudget).toLocaleString()}</p>
                    </div>
                  )}
                  {request.quotedAmount && (
                    <div>
                      <p className="text-gray-500">Your Quote</p>
                      <p className="font-medium text-green-600">${Number(request.quotedAmount).toLocaleString()}</p>
                    </div>
                  )}
                  {request.preferredDate && (
                    <div>
                      <p className="text-gray-500">Preferred Start</p>
                      <p className="font-medium">{new Date(request.preferredDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {request.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAccept(request.id)}
                        disabled={actionLoading === request.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Accept & Quote
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleMarkInProgress(request.id)}
                      disabled={actionLoading === request.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Start Project
                    </button>
                  )}
                  {request.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleComplete(request.id)}
                      disabled={actionLoading === request.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <a
                    href={`mailto:${request.requester.email}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Contact Client
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
