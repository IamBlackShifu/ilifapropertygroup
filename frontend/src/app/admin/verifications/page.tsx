'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'

interface Verification {
  id: string
  entityType: string
  entityId: string
  status: string
  submittedAt: string
  submitter: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  documents: any[]
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [entityTypeFilter, setEntityTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadVerifications()
  }, [page, entityTypeFilter])

  const loadVerifications = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getPendingVerifications({
        page,
        limit: 20,
        entityType: entityTypeFilter || undefined,
      })
      setVerifications(data.verifications)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Failed to load verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (verificationId: string) => {
    if (!confirm('Approve this verification?')) return

    try {
      setActionLoading(verificationId)
      await adminApi.approveVerification(verificationId)
      loadVerifications()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve verification')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (verificationId: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      setActionLoading(verificationId)
      await adminApi.rejectVerification(verificationId, reason)
      loadVerifications()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject verification')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pending Verifications</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity Type
            </label>
            <select
              value={entityTypeFilter}
              onChange={(e) => {
                setEntityTypeFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="PROPERTY">Property</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="SUPPLIER">Supplier</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : verifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending verifications at the moment.</p>
          </div>
        ) : (
          verifications.map((verification) => (
            <div key={verification.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      {verification.entityType}
                    </span>
                    <span className="text-sm text-gray-500">
                      Submitted {new Date(verification.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Submitted by:</p>
                    <p className="font-medium">
                      {verification.submitter.firstName} {verification.submitter.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{verification.submitter.email}</p>
                  </div>

                  {verification.documents && verification.documents.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Documents ({verification.documents.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {verification.documents.map((doc: any) => (
                          <a
                            key={doc.id}
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            📄 {doc.documentType}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(verification.id)}
                    disabled={actionLoading === verification.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === verification.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(verification.id)}
                    disabled={actionLoading === verification.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Reject
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
