'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import { useRouter, useParams } from 'next/navigation'

interface UserDetails {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  emailVerified: boolean
  isActive: boolean
  isSuspended: boolean
  profileImageUrl: string | null
  createdAt: string
  lastLogin: string | null
  properties: any[]
  projects: any[]
  _count: {
    properties: number
    projects: number
    payments: number
    reviews: number
  }
}

export default function AdminUserDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      loadUser()
    }
  }, [userId])

  const loadUser = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getUserById(userId)
      setUser(data)
    } catch (error) {
      console.error('Failed to load user:', error)
      alert('Failed to load user details')
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    const reason = prompt('Enter suspension reason:')
    if (!reason) return

    try {
      setActionLoading(true)
      await adminApi.suspendUser(userId, reason)
      loadUser()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to suspend user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!confirm('Reactivate this user?')) return

    try {
      setActionLoading(true)
      await adminApi.activateUser(userId)
      loadUser()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to activate user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      setActionLoading(true)
      await adminApi.deleteUser(userId)
      alert('User deleted successfully')
      router.push('/admin/users')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user')
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

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            ← Back to Users
          </button>
          <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.isActive && !user.isSuspended
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {user.isSuspended ? 'Suspended' : user.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.emailVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="flex gap-3">
          {user.isSuspended ? (
            <button
              onClick={handleActivate}
              disabled={actionLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Activate User
            </button>
          ) : (
            <button
              onClick={handleSuspend}
              disabled={actionLoading || user.role === 'ADMIN'}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              Suspend User
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={actionLoading || user.role === 'ADMIN'}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Delete User
          </button>
        </div>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone</p>
            <p className="font-medium">{user.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Member Since</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          {user.lastLogin && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Login</p>
              <p className="font-medium">{new Date(user.lastLogin).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Properties</p>
              <p className="text-3xl font-bold">{user._count.properties}</p>
            </div>
            <div className="text-4xl">🏠</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Projects</p>
              <p className="text-3xl font-bold">{user._count.projects}</p>
            </div>
            <div className="text-4xl">🏗️</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payments</p>
              <p className="text-3xl font-bold">{user._count.payments}</p>
            </div>
            <div className="text-4xl">💳</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="text-3xl font-bold">{user._count.reviews}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      {user.properties && user.properties.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Properties</h2>
          <div className="space-y-4">
            {user.properties.map((property: any) => (
              <div key={property.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    property.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                    property.status === 'PENDING_VERIFICATION' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                  <span className="text-gray-600">${Number(property.price).toLocaleString()}</span>
                  <span className="text-gray-600">{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
