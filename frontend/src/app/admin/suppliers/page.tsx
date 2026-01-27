'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import { useRouter } from 'next/navigation'

interface Supplier {
  id: string
  companyName: string
  description: string
  location: string
  phone: string
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED'
  verifiedAt: string | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  _count: {
    products: number
    orders: number
  }
}

export default function AdminSuppliersPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'VERIFIED' | 'SUSPENDED' | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadSuppliers()
  }, [page, statusFilter, searchTerm])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getAllSuppliers({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      })
      setSuppliers(data.suppliers)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Failed to load suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (supplierId: string) => {
    if (!confirm('Verify this supplier? This will allow them to sell products on the platform.')) return

    try {
      setActionLoading(supplierId)
      await adminApi.verifySupplier(supplierId)
      loadSuppliers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify supplier')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (supplierId: string) => {
    const reason = prompt('Enter rejection reason (will be sent to supplier):')
    if (!reason) return

    try {
      setActionLoading(supplierId)
      await adminApi.rejectSupplier(supplierId, reason)
      loadSuppliers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject supplier')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (supplierId: string) => {
    const reason = prompt('Enter suspension reason:')
    if (!reason) return

    try {
      setActionLoading(supplierId)
      await adminApi.suspendSupplier(supplierId, reason)
      loadSuppliers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to suspend supplier')
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async (supplierId: string) => {
    if (!confirm('Reactivate this supplier?')) return

    try {
      setActionLoading(supplierId)
      await adminApi.activateSupplier(supplierId)
      loadSuppliers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to activate supplier')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        <h1 className="text-2xl font-bold">Supplier Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setPage(1)
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              placeholder="Search by company name, location..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-2">No Suppliers Found</h3>
            <p className="text-gray-600">Try adjusting your filters.</p>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{supplier.companyName}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{supplier.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{supplier.user.firstName} {supplier.user.lastName}</p>
                      <p className="text-sm text-gray-500">{supplier.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Products</p>
                      <p className="font-medium">{supplier._count.products}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Orders</p>
                      <p className="font-medium">{supplier._count.orders}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(supplier.createdAt).toLocaleDateString()}</p>
                    {supplier.verifiedAt && (
                      <p>Verified: {new Date(supplier.verifiedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {supplier.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleVerify(supplier.id)}
                        disabled={actionLoading === supplier.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {actionLoading === supplier.id ? 'Processing...' : '✓ Verify'}
                      </button>
                      <button
                        onClick={() => handleReject(supplier.id)}
                        disabled={actionLoading === supplier.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {supplier.status === 'VERIFIED' && (
                    <button
                      onClick={() => handleSuspend(supplier.id)}
                      disabled={actionLoading === supplier.id}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  )}
                  {supplier.status === 'SUSPENDED' && (
                    <button
                      onClick={() => handleActivate(supplier.id)}
                      disabled={actionLoading === supplier.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Reactivate
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/admin/suppliers/${supplier.id}`)}
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
