'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface ContractorProfile {
  id: string
  companyName: string
  registrationNumber?: string
  description?: string
  servicesOffered?: string[]
  yearsExperience?: number
  employeesCount?: number
  locationCity?: string
  locationAddress?: string
  isVerified?: boolean
  verifiedAt?: string
  ratingAverage?: number | string
  ratingCount?: number
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED'
}

interface DashboardStats {
  activeProjects: number
  completedProjects: number
  activeServiceRequests: number
  completedServiceRequests: number
  totalEarnings: number
  pendingPayments: number
  averageRating: number
  totalReviews: number
}

export default function ContractorDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    completedProjects: 0,
    activeServiceRequests: 0,
    completedServiceRequests: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    averageRating: 0,
    totalReviews: 0,
  })
  const [profileMissing, setProfileMissing] = useState(false)
  const [loading, setLoading] = useState(true)

  const toNumber = (value: unknown) => {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) ? numberValue : 0
  }

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
      setProfileMissing(false)

      const profileRes = await apiClient.get('/contractors/my-profile')
      const profileData = profileRes.data?.data || profileRes.data
      setProfile(profileData)

      try {
        const statsRes = await apiClient.get(`/contractors/${profileData.id}/stats`)
        const statsData = statsRes.data?.data || statsRes.data
        setStats({
          activeProjects: toNumber(statsData?.activeProjects),
          completedProjects: toNumber(statsData?.completedProjects),
          activeServiceRequests: toNumber(statsData?.activeServiceRequests),
          completedServiceRequests: toNumber(statsData?.completedServiceRequests),
          totalEarnings: toNumber(statsData?.totalEarnings),
          pendingPayments: toNumber(statsData?.pendingPayments),
          averageRating: toNumber(statsData?.rating?.average ?? profileData?.ratingAverage),
          totalReviews: toNumber(statsData?.rating?.count ?? profileData?.ratingCount),
        })
      } catch {
        setStats({
          activeProjects: 0,
          completedProjects: 0,
          activeServiceRequests: 0,
          completedServiceRequests: 0,
          totalEarnings: 0,
          pendingPayments: 0,
          averageRating: toNumber(profileData?.ratingAverage),
          totalReviews: toNumber(profileData?.ratingCount),
        })
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setProfileMissing(true)
        setProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (!profile) return null

    switch (profile.status) {
      case 'PENDING':
        return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">⏳ Pending Verification</span>
      case 'VERIFIED':
        return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">✓ Verified</span>
      case 'SUSPENDED':
        return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800">⚠️ Suspended</span>
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold">
                    {profile?.companyName || 'Complete Your Contractor Profile'}
                  </h1>
                  {getStatusBadge()}
                </div>
                <p className="text-gray-600">
                  {profile?.locationCity || 'Set up your company profile so clients can find and trust your business.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={profile ? '/contractors/profile/edit' : '/contractors/profile/new'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {profile ? 'Edit Profile' : 'Complete Profile'}
                </Link>
              </div>
            </div>

            {profileMissing && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <strong>Profile setup required:</strong> Your dashboard is available now, but you need to complete your company profile to receive project requests.
                </p>
              </div>
            )}

            {profile?.status === 'PENDING' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Awaiting Verification:</strong> Your profile is under review. You'll be notified once it's approved.
                </p>
              </div>
            )}

            {profile?.status === 'SUSPENDED' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">
                  <strong>Account Suspended:</strong> Please contact support for more information.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Projects</p>
                  <p className="text-3xl font-bold">{stats.activeProjects}</p>
                </div>
                <div className="text-4xl">🏗️</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed Projects</p>
                  <p className="text-3xl font-bold">{stats.completedProjects}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Payments</p>
                  <p className="text-3xl font-bold">${stats.pendingPayments.toFixed(2)}</p>
                </div>
                <div className="text-4xl">⏱️</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Rating</p>
                  <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{stats.totalReviews} reviews</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-3xl font-bold">{profile?.yearsExperience || 0}</p>
                  <p className="text-xs text-gray-500">years</p>
                </div>
                <div className="text-4xl">🎓</div>
              </div>
            </div>
          </div>

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
                href="/contractors/portfolio"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📋</div>
                  <div>
                    <p className="font-semibold">Portfolio</p>
                    <p className="text-sm text-gray-600">View public work</p>
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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Profile Summary</h2>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Services Offered</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile.servicesOffered || []).map((service, index) => (
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
                  <p className="text-gray-700">{profile.description || 'No description provided yet.'}</p>
                </div>

                {profile.registrationNumber && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                    <p className="text-gray-700">{profile.registrationNumber}</p>
                  </div>
                )}

                {profile.employeesCount !== undefined && profile.employeesCount !== null && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Team Size</p>
                    <p className="text-gray-700">{profile.employeesCount} employees</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                <p className="text-gray-700">Your company profile is not set up yet.</p>
                <p className="mt-1 text-sm text-gray-500">Complete it to unlock project requests and a public-facing company page.</p>
                <Link
                  href="/contractors/profile/new"
                  className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
