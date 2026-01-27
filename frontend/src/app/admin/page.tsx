'use client'

import { useEffect, useState } from 'react'
import { adminApi, DashboardStats, RecentUser, RecentProperty } from '@/lib/api/admin'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await adminApi.getDashboardStats()
      setStats(data.stats)
      setRecentUsers(data.recentActivity.users)
      setRecentProperties(data.recentActivity.properties)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon="🏠"
          color="bg-green-500"
        />
        <StatCard
          title="Pending Verifications"
          value={stats?.pendingVerifications || 0}
          icon="⏳"
          color="bg-yellow-500"
          link="/admin/verifications"
        />
        <StatCard
          title="Active Properties"
          value={stats?.activeProperties || 0}
          icon="✅"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toLocaleString() || 0}`}
          icon="💰"
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Users</h3>
            <Link
              href="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Properties</h3>
            <Link
              href="/admin/properties"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{property.title}</p>
                  <p className="text-xs text-gray-500">
                    by {property.owner.firstName} {property.owner.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    ${property.price.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionButton
            href="/admin/verifications"
            icon="🔍"
            label="Review Verifications"
          />
          <QuickActionButton
            href="/admin/users"
            icon="👤"
            label="Manage Users"
          />
          <QuickActionButton
            href="/admin/properties"
            icon="🏢"
            label="Manage Properties"
          />
          <QuickActionButton
            href="/admin/users?status=suspended"
            icon="⚠️"
            label="Suspended Accounts"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
  link,
}: {
  title: string
  value: number | string
  icon: string
  color: string
  link?: string
}) {
  const content = (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (link) {
    return <Link href={link}>{content}</Link>
  }

  return content
}

function QuickActionButton({
  href,
  icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  )
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
    VERIFIED: 'bg-green-100 text-green-800',
    RESERVED: 'bg-blue-100 text-blue-800',
    SOLD: 'bg-purple-100 text-purple-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
