'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api-client'

interface ContractorProfile {
  id: string
  companyName: string
  registrationNumber?: string
  description: string
  servicesOffered: string[]
  yearsExperience?: number
  employeesCount?: number
  locationCity?: string
  locationAddress?: string
  isVerified: boolean
  verifiedAt?: string
  ratingAverage: number
  ratingCount: number
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED'
}

interface DashboardStats {
  activeProjects: number
  completedProjects: number
  totalEarnings: number
  pendingPayments: number
  averageRating: number
  totalReviews: number
}

export default function ContractorDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'CONTRACTOR') {
      router.push('/dashboard')
      return
    }
    loadData()
  }, [user, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [profileRes, statsRes] = await Promise.all([
        apiClient.get('/contractors/my-profile'),
        apiClient.get('/contractors/my-profile/stats'),
      ])

      if (profileRes.data.success) {
        setProfile(profileRes.data.data)
      }

      // Mock stats for now - will be implemented later
      setStats({
        activeProjects: 0,
        completedProjects: 0,
        totalEarnings: 0,
        pendingPayments: 0,
        averageRating: profileRes.data.data?.ratingAverage || 0,
        totalReviews: profileRes.data.data?.ratingCount || 0,
      })
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No profile yet, redirect to create one
        router.push('/contractors/profile/new')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const getStatusBadge = () => {
    switch (profile.status) {
      case 'PENDING':
        return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">⏳ Pending Verification</span>
      case 'VERIFIED':
        return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">✓ Verified</span>
      case 'SUSPENDED':
        return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800">⚠️ Suspended</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.companyName}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-gray-600">{profile.locationCity}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View Site
              </Link>
              <Link
                href="/contractors/profile/edit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {profile.status === 'PENDING' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Awaiting Verification:</strong> Your profile is under review. You'll be notified once it's approved.
              </p>
            </div>
          )}

          {profile.status === 'SUSPENDED' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                <strong>Account Suspended:</strong> Please contact support for more information.
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-3xl font-bold">{stats?.activeProjects || 0}</p>
              </div>
              <div className="text-4xl">🏗️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Projects</p>
                <p className="text-3xl font-bold">{stats?.completedProjects || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-3xl font-bold">${stats?.totalEarnings.toFixed(2) || '0.00'}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-3xl font-bold">${stats?.pendingPayments.toFixed(2) || '0.00'}</p>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
                <p className="text-xs text-gray-500">{stats?.totalReviews || 0} reviews</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-3xl font-bold">{profile.yearsExperience || 0}</p>
                <p className="text-xs text-gray-500">years</p>
              </div>
              <div className="text-4xl">🎓</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/contractors/service-requests"
              className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔔</div>
                <div>
                  <p className="font-semibold text-blue-900">Service Requests</p>
                  <p className="text-sm text-blue-700">View & respond to requests</p>
                </div>
              </div>
            </Link>

            <Link
              href="/contractors/projects"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">📋</div>
                <div>
                  <p className="font-semibold">View Projects</p>
                  <p className="text-sm text-gray-600">Manage your projects</p>
                </div>
              </div>
            </Link>

            <Link
              href="/contractors/schedule"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">📅</div>
                <div>
                  <p className="font-semibold">Schedule</p>
                  <p className="text-sm text-gray-600">View your calendar</p>
                </div>
              </div>
            </Link>

            <Link
              href="/contractors/payments"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💳</div>
                <div>
                  <p className="font-semibold">Payments</p>
                  <p className="text-sm text-gray-600">Track your earnings</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Profile Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Services Offered</p>
              <div className="flex flex-wrap gap-2">
                {profile.servicesOffered.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Company Description</p>
              <p className="text-gray-700">{profile.description}</p>
            </div>

            {profile.registrationNumber && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                <p className="text-gray-700">{profile.registrationNumber}</p>
              </div>
            )}

            {profile.employeesCount && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Team Size</p>
                <p className="text-gray-700">{profile.employeesCount} employees</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
