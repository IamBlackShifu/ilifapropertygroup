'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface SupplierDetails {
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
    profileImageUrl: string | null
    createdAt: string
  }
  products: any[]
  orders: any[]
  _count: {
    products: number
    orders: number
  }
}

export default function AdminSupplierDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const supplierId = params.id as string

  const [supplier, setSupplier] = useState<SupplierDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (supplierId) {
      loadSupplier()
    }
  }, [supplierId])

  const loadSupplier = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getSupplierById(supplierId)
      setSupplier(data)
    } catch (error) {
      console.error('Failed to load supplier:', error)
      alert('Failed to load supplier details')
      router.push('/admin/suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!confirm('Verify this supplier? This will allow them to sell products on the platform.')) return

    try {
      setActionLoading(true)
      await adminApi.verifySupplier(supplierId)
      loadSupplier()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify supplier')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason (will be sent to supplier):')
    if (!reason) return

    try {
      setActionLoading(true)
      await adminApi.rejectSupplier(supplierId, reason)
      loadSupplier()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject supplier')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSuspend = async () => {
    const reason = prompt('Enter suspension reason:')
    if (!reason) return

    try {
      setActionLoading(true)
      await adminApi.suspendSupplier(supplierId, reason)
      loadSupplier()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to suspend supplier')
    } finally {
      setActionLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!confirm('Reactivate this supplier?')) return

    try {
      setActionLoading(true)
      await adminApi.activateSupplier(supplierId)
      loadSupplier()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to activate supplier')
    } finally {
      setActionLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!supplier) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/suppliers')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            ← Back to Suppliers
          </button>
          <h1 className="text-2xl font-bold">{supplier.companyName}</h1>
        </div>
        <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusBadge(supplier.status)}`}>
          {supplier.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="flex gap-3">
          {supplier.status === 'PENDING' && (
            <>
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                ✓ Verify Supplier
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                ✗ Reject
              </button>
            </>
          )}
          {supplier.status === 'VERIFIED' && (
            <button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              Suspend Supplier
            </button>
          )}
          {supplier.status === 'SUSPENDED' && (
            <button
              onClick={handleActivate}
              disabled={actionLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Reactivate Supplier
            </button>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Company Name</p>
            <p className="font-medium">{supplier.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Location</p>
            <p className="font-medium">{supplier.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p className="font-medium">{supplier.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-medium">{new Date(supplier.createdAt).toLocaleDateString()}</p>
          </div>
          {supplier.verifiedAt && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Verified On</p>
              <p className="font-medium">{new Date(supplier.verifiedAt).toLocaleDateString()}</p>
            </div>
          )}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="font-medium">{supplier.description}</p>
          </div>
        </div>
      </div>

      {/* Contact Person */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Person</h2>
        <div className="flex items-center gap-4">
          {supplier.user.profileImageUrl ? (
            <Image
              src={supplier.user.profileImageUrl}
              alt={`${supplier.user.firstName} ${supplier.user.lastName}`}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">
              {supplier.user.firstName} {supplier.user.lastName}
            </p>
            <p className="text-gray-600">{supplier.user.email}</p>
            <p className="text-gray-600">{supplier.user.phone}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold">{supplier._count.products}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold">{supplier._count.orders}</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Products ({supplier.products.length})</h2>
        {supplier.products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products listed yet</p>
        ) : (
          <div className="space-y-4">
            {supplier.products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 flex items-start gap-4">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    📦
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-medium text-green-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stockQuantity}
                    </span>
                    <span className="text-sm text-gray-500">
                      Category: {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
