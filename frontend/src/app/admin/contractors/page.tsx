'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import { useRouter } from 'next/navigation'

interface Contractor {
  id: string | null
  userId?: string
  companyName: string | null
  description: string | null
  locationCity: string | null
  yearsExperience: number | null
  employeesCount: number | null
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'INCOMPLETE'
  isVerified: boolean
  verifiedAt: string | null
  ratingAverage: number | string
  ratingCount: number
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  _count: {
    stages: number
    reviews: number
  }
}

export default function AdminContractorsPage() {
  const router = useRouter()
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'INCOMPLETE' | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadContractors()
  }, [page, statusFilter, searchTerm])

  const loadContractors = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getAllContractors({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      })
      setContractors(data.contractors)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Failed to load contractors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (contractorId: string) => {
    if (!confirm('Verify this contractor? This will allow them to bid on projects.')) return

    try {
      setActionLoading(contractorId)
      await adminApi.verifyContractor(contractorId)
      loadContractors()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify contractor')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (contractorId: string) => {
    const reason = prompt('Enter rejection reason (will be sent to contractor):')
    if (!reason) return

    try {
      setActionLoading(contractorId)
      await adminApi.rejectContractor(contractorId, reason)
      loadContractors()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject contractor')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (contractorId: string) => {
    const reason = prompt('Enter suspension reason:')
    if (!reason) return

    try {
      setActionLoading(contractorId)
      await adminApi.suspendContractor(contractorId, reason)
      loadContractors()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to suspend contractor')
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async (contractorId: string) => {
    if (!confirm('Reactivate this contractor?')) return

    try {
      setActionLoading(contractorId)
      await adminApi.activateContractor(contractorId)
      loadContractors()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to activate contractor')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INCOMPLETE':
        return 'bg-orange-100 text-orange-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contractor Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setPage(1)
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Filter contractors by status"
            >
              <option value="">All Statuses</option>
              <option value="INCOMPLETE">Incomplete Profile</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              id="search-filter"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              placeholder="Search by company name, city..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Search contractors"
            />
          </div>
        </div>
      </div>

      {/* Contractors List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : contractors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold mb-2">No Contractors Found</h3>
            <p className="text-gray-600">Try adjusting your filters.</p>
          </div>
        ) : (
          contractors.map((contractor) => (
            <div key={contractor.id || contractor.userId} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">
                      {contractor.companyName || `${contractor.user.firstName} ${contractor.user.lastName}`}
                    </h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(contractor.status)}`}>
                      {contractor.status}
                    </span>
                    {contractor.ratingCount > 0 && (
                      <span className="text-sm text-gray-600">
                        ⭐ {Number(contractor.ratingAverage).toFixed(1)} ({contractor.ratingCount})
                      </span>
                    )}
                  </div>

                  {contractor.status === 'INCOMPLETE' ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-orange-800 font-medium">⚠️ Profile Not Completed</p>
                      <p className="text-sm text-orange-700 mt-1">
                        This user registered as a contractor but hasn't completed their profile yet.
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-4 line-clamp-2">{contractor.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{contractor.locationCity || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{contractor.user.firstName} {contractor.user.lastName}</p>
                      <p className="text-sm text-gray-500">{contractor.user.email}</p>
                      {contractor.user.phone && <p className="text-sm text-gray-500">{contractor.user.phone}</p>}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{contractor.yearsExperience || 0} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Projects</p>
                      <p className="font-medium">{contractor._count.stages || 0}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Registered: {new Date(contractor.createdAt).toLocaleDateString()}</p>
                    {contractor.verifiedAt && (
                      <p>Verified: {new Date(contractor.verifiedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {contractor.status === 'INCOMPLETE' && (
                    <div className="text-sm text-gray-600 text-center p-4">
                      <p className="mb-2">Waiting for profile completion</p>
                      <button
                        onClick={() => router.push(`/admin/users/${contractor.user.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View User
                      </button>
                    </div>
                  )}
                  {contractor.status === 'PENDING' && contractor.id && (
                    <>
                      <button
                        onClick={() => handleVerify(contractor.id!)}
                        disabled={actionLoading === contractor.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {actionLoading === contractor.id ? 'Processing...' : '✓ Verify'}
                      </button>
                      <button
                        onClick={() => handleReject(contractor.id!)}
                        disabled={actionLoading === contractor.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {contractor.status === 'VERIFIED' && contractor.id && (
                    <button
                      onClick={() => handleSuspend(contractor.id!)}
                      disabled={actionLoading === contractor.id}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  )}
                  {contractor.status === 'SUSPENDED' && contractor.id && (
                    <button
                      onClick={() => handleActivate(contractor.id!)}
                      disabled={actionLoading === contractor.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Reactivate
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/admin/contractors/${contractor.id}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
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
