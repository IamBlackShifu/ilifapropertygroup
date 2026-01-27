'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import { useRouter, useParams } from 'next/navigation'

interface ContractorDetails {
  id: string
  userId: string
  companyName: string
  registrationNumber: string | null
  description: string
  servicesOffered: string[]
  yearsExperience: number | null
  employeesCount: number | null
  locationCity: string | null
  locationAddress: string | null
  isVerified: boolean
  verifiedAt: string | null
  ratingAverage: string
  ratingCount: number
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string | null
    role: string
    isActive: boolean
    isSuspended: boolean
  }
  services: any[]
  stages: any[]
  reviews: any[]
  _count: {
    stages: number
    services: number
    reviews: number
  }
}

export default function AdminContractorDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const contractorId = params.id as string

  const [contractor, setContractor] = useState<ContractorDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (contractorId) {
      loadContractor()
    }
  }, [contractorId])

  const loadContractor = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getContractorById(contractorId)
      setContractor(data)
    } catch (error) {
      console.error('Failed to load contractor:', error)
      alert('Failed to load contractor details')
      router.push('/admin/contractors')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!confirm('Verify this contractor?')) return

    try {
      setActionLoading(true)
      await adminApi.verifyContractor(contractorId)
      alert('Contractor verified successfully')
      loadContractor()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify contractor')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      setActionLoading(true)
      await adminApi.rejectContractor(contractorId, reason)
      alert('Contractor rejected')
      loadContractor()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject contractor')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSuspend = async () => {
    const reason = prompt('Enter suspension reason:')
    if (!reason) return

    try {
      setActionLoading(true)
      await adminApi.suspendContractor(contractorId, reason)
      alert('Contractor suspended')
      loadContractor()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to suspend contractor')
    } finally {
      setActionLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!confirm('Reactivate this contractor?')) return

    try {
      setActionLoading(true)
      await adminApi.activateContractor(contractorId)
      alert('Contractor reactivated')
      loadContractor()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to activate contractor')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!contractor) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
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
        <div>
          <button
            onClick={() => router.push('/admin/contractors')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            ← Back to Contractors
          </button>
          <h1 className="text-2xl font-bold">{contractor.companyName}</h1>
          <p className="text-gray-600">ID: {contractor.id}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contractor.status)}`}>
            {contractor.status}
          </span>
          {contractor.isVerified && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="flex gap-3">
          {contractor.status === 'PENDING' && (
            <>
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Verify Contractor
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
          {contractor.status === 'VERIFIED' && (
            <button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              Suspend
            </button>
          )}
          {contractor.status === 'SUSPENDED' && (
            <button
              onClick={handleActivate}
              disabled={actionLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Reactivate
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
            <p className="font-medium">{contractor.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Registration Number</p>
            <p className="font-medium">{contractor.registrationNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Years of Experience</p>
            <p className="font-medium">{contractor.yearsExperience || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Number of Employees</p>
            <p className="font-medium">{contractor.employeesCount || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Location</p>
            <p className="font-medium">
              {contractor.locationCity || 'N/A'}
              {contractor.locationAddress && `, ${contractor.locationAddress}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-medium">{new Date(contractor.createdAt).toLocaleDateString()}</p>
          </div>
          {contractor.verifiedAt && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Verified At</p>
              <p className="font-medium">{new Date(contractor.verifiedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Company Description</p>
          <p className="text-gray-700">{contractor.description}</p>
        </div>
      </div>

      {/* Services Offered */}
      {contractor.servicesOffered && contractor.servicesOffered.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {contractor.servicesOffered.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* User Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Person</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="font-medium">{contractor.user.firstName} {contractor.user.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-medium">{contractor.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p className="font-medium">{contractor.user.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Account Status</p>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                contractor.user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {contractor.user.isActive ? 'Active' : 'Inactive'}
              </span>
              {contractor.user.isSuspended && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                  Suspended
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Projects</p>
              <p className="text-3xl font-bold">{contractor._count?.stages || 0}</p>
            </div>
            <div className="text-4xl">🏗️</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-3xl font-bold">
                {contractor.ratingCount > 0 ? Number(contractor.ratingAverage).toFixed(1) : 'N/A'}
              </p>
              {contractor.ratingCount > 0 && (
                <p className="text-sm text-gray-500">⭐ {contractor.ratingCount} reviews</p>
              )}
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="text-3xl font-bold">{contractor._count?.reviews || 0}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      {contractor.reviews && contractor.reviews.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {contractor.reviews.map((review: any) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {review.reviewer?.firstName} {review.reviewer?.lastName}
                    </span>
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
