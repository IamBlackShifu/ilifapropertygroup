'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface DashboardStats {
  properties: number
  projects: number
  reservations: number
  totalValue: number
  totalViews?: number
  propertyStats?: {
    total: number
    draft: number
    pending: number
    verified: number
    reserved: number
    sold: number
  }
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    properties: 0,
    projects: 0,
    reservations: 0,
    totalValue: 0,
    totalViews: 0,
    propertyStats: {
      total: 0,
      draft: 0,
      pending: 0,
      verified: 0,
      reserved: 0,
      sold: 0
    }
  })
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Debug auth state
  useEffect(() => {
    console.log('Dashboard - Auth State:', {
      isAuthenticated,
      user: user ? { name: user.name, role: user.role, email: user.email } : null,
      loading,
      hasToken: !!localStorage.getItem('accessToken')
    })
  }, [user, isAuthenticated, loading])

  useEffect(() => {
    fetchDashboardData()
  }, [user?.role])

  const fetchDashboardData = async () => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('accessToken')
      
      // Fetch data based on role
      if (user.role === 'OWNER' || user.role === 'AGENT' || user.role === 'ADMIN') {
        const [propertiesRes, statsRes] = await Promise.all([
          fetch('http://localhost:4000/api/properties/my-properties', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:4000/api/properties/user/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])
        
        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json()
          const properties = propertiesData.data || []
          
          const totalValue = properties.reduce((sum: number, prop: any) => 
            sum + parseFloat(prop.price), 0
          )

          const totalViews = properties.reduce((sum: number, prop: any) => 
            sum + (prop.viewCount || 0), 0
          )
          
          let propertyStats: any = {
            total: properties.length,
            draft: 0,
            pending: 0,
            verified: 0,
            reserved: 0,
            sold: 0
          }

          if (statsRes.ok) {
            const statsData = await statsRes.json()
            propertyStats = {
              total: statsData.data.total,
              draft: statsData.data.byStatus.draft,
              pending: statsData.data.byStatus.pending,
              verified: statsData.data.byStatus.verified,
              reserved: statsData.data.byStatus.reserved,
              sold: statsData.data.byStatus.sold
            }
          }
          
          setStats({
            properties: properties.length,
            projects: 0,
            reservations: 0,
            totalValue: totalValue,
            totalViews: totalViews,
            propertyStats: propertyStats
          })
          
          setRecentActivity(properties.slice(0, 5))
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setDashboardLoading(false)
    }
  }

  const getRoleName = () => {
    switch (user?.role) {
      case 'BUYER': return 'Property Buyer'
      case 'OWNER': return 'Property Owner'
      case 'AGENT': return 'Real Estate Agent'
      case 'CONTRACTOR': return 'Contractor'
      case 'SUPPLIER': return 'Supplier'
      case 'ADMIN': return 'Administrator'
      default: return 'User'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
              <p className="mt-2 text-gray-600">
                Role: <span className="font-semibold text-primary-600">{getRoleName()}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/profile"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Role-specific content */}
        {user?.role === 'BUYER' && <BuyerDashboard />}
        {user?.role === 'OWNER' && <OwnerDashboard stats={stats} loading={loading} recentActivity={recentActivity} />}
        {user?.role === 'AGENT' && <AgentDashboard stats={stats} loading={loading} recentActivity={recentActivity} />}
        {user?.role === 'CONTRACTOR' && <ContractorDashboard />}
        {user?.role === 'SUPPLIER' && <SupplierDashboard />}
        {user?.role === 'ADMIN' && <AdminDashboard stats={stats} loading={loading} />}
      </div>
    </div>
  )
}

// BUYER Dashboard
function BuyerDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Saved Properties" 
          value="0" 
          icon="heart" 
          color="blue"
          link="/saved"
        />
        <StatCard 
          title="Property Searches" 
          value="0" 
          icon="search" 
          color="green"
        />
        <StatCard 
          title="Inquiries Sent" 
          value="0" 
          icon="message" 
          color="purple"
        />
        <StatCard 
          title="Scheduled Tours" 
          value="0" 
          icon="calendar" 
          color="orange"
        />
      </div>

      <QuickActions actions={[
        { href: '/buy-property', icon: 'search', title: 'Browse Properties', desc: 'Find your dream home', color: 'blue' },
        { href: '/professionals', icon: 'users', title: 'Find Professionals', desc: 'Connect with agents', color: 'green' },
        { href: '/build-home', icon: 'home', title: 'Build Your Home', desc: 'Start a project', color: 'purple' },
      ]} />

      <InfoCard 
        title="Get Started with Property Buying"
        description="Browse verified properties, connect with trusted agents, and find your perfect home in Zimbabwe."
      />
    </>
  )
}

// OWNER Dashboard
function OwnerDashboard({ stats, loading, recentActivity }: any) {
  return (
    <>
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="My Properties" 
          value={loading ? '...' : stats.properties.toString()} 
          icon="home" 
          color="blue"
          link="/my-properties"
        />
        <StatCard 
          title="Total Value" 
          value={loading ? '...' : `$${stats.totalValue.toLocaleString()}`} 
          icon="dollar" 
          color="green"
        />
        <StatCard 
          title="Total Views" 
          value={loading ? '...' : stats.totalViews?.toString() || '0'} 
          icon="eye" 
          color="purple"
        />
        <StatCard 
          title="Live Properties" 
          value={loading ? '...' : stats.propertyStats?.verified.toString() || '0'} 
          icon="check" 
          color="orange"
        />
      </div>

      {/* Property Status Breakdown */}
      {!loading && stats.propertyStats && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Property Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">{stats.propertyStats.draft}</div>
              <div className="text-xs text-gray-600 mt-1">Draft</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{stats.propertyStats.pending}</div>
              <div className="text-xs text-yellow-600 mt-1">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{stats.propertyStats.verified}</div>
              <div className="text-xs text-green-600 mt-1">Verified</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-700">{stats.propertyStats.reserved}</div>
              <div className="text-xs text-primary-600 mt-1">Reserved</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{stats.propertyStats.sold}</div>
              <div className="text-xs text-red-600 mt-1">Sold</div>
            </div>
          </div>
        </div>
      )}

      <QuickActions actions={[
        { href: '/my-properties/new', icon: 'plus', title: 'List a Property', desc: 'Add new listing', color: 'blue' },
        { href: '/my-properties', icon: 'grid', title: 'Manage Properties', desc: 'View all listings', color: 'green' },
        { href: '/verify/property', icon: 'check', title: 'Verify Property', desc: 'Get verified', color: 'purple' },
      ]} />

      {recentActivity.length > 0 && (
        <RecentPropertiesCard properties={recentActivity} title="Your Recent Properties" />
      )}
    </>
  )
}

// AGENT Dashboard
function AgentDashboard({ stats, loading, recentActivity }: any) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Listed Properties" 
          value={loading ? '...' : stats.properties.toString()} 
          icon="home" 
          color="blue"
          link="/my-properties"
        />
        <StatCard 
          title="Active Clients" 
          value="0" 
          icon="users" 
          color="green"
        />
        <StatCard 
          title="Closed Deals" 
          value="0" 
          icon="check" 
          color="purple"
        />
        <StatCard 
          title="Commission" 
          value="$0" 
          icon="dollar" 
          color="orange"
        />
      </div>

      <QuickActions actions={[
        { href: '/my-properties/new', icon: 'plus', title: 'Add Listing', desc: 'List new property', color: 'blue' },
        { href: '/my-properties', icon: 'grid', title: 'My Listings', desc: 'Manage properties', color: 'green' },
        { href: '/buy-property', icon: 'search', title: 'Browse Market', desc: 'View all properties', color: 'purple' },
      ]} />

      {recentActivity.length > 0 && (
        <RecentPropertiesCard properties={recentActivity} title="Your Listed Properties" />
      )}
    </>
  )
}

// CONTRACTOR Dashboard
function ContractorDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Projects" 
          value="0" 
          icon="briefcase" 
          color="blue"
        />
        <StatCard 
          title="Completed Projects" 
          value="0" 
          icon="check" 
          color="green"
        />
        <StatCard 
          title="Pending Quotes" 
          value="0" 
          icon="document" 
          color="purple"
        />
        <StatCard 
          title="Earnings" 
          value="$0" 
          icon="dollar" 
          color="orange"
        />
      </div>

      <QuickActions actions={[
        { href: '/build-home', icon: 'home', title: 'Find Projects', desc: 'Browse opportunities', color: 'blue' },
        { href: '/profile', icon: 'user', title: 'My Profile', desc: 'Update portfolio', color: 'green' },
        { href: '/suppliers', icon: 'box', title: 'Find Suppliers', desc: 'Source materials', color: 'purple' },
      ]} />

      <InfoCard 
        title="Grow Your Contracting Business"
        description="Connect with homeowners, showcase your portfolio, and win more projects on ILifa Property Group."
      />
    </>
  )
}

// SUPPLIER Dashboard
function SupplierDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Products Listed" 
          value="0" 
          icon="box" 
          color="blue"
        />
        <StatCard 
          title="Orders" 
          value="0" 
          icon="shopping" 
          color="green"
        />
        <StatCard 
          title="Pending Quotes" 
          value="0" 
          icon="document" 
          color="purple"
        />
        <StatCard 
          title="Revenue" 
          value="$0" 
          icon="dollar" 
          color="orange"
        />
      </div>

      <QuickActions actions={[
        { href: '/suppliers', icon: 'plus', title: 'Add Products', desc: 'List your catalog', color: 'blue' },
        { href: '/suppliers', icon: 'grid', title: 'My Catalog', desc: 'Manage products', color: 'green' },
        { href: '/profile', icon: 'user', title: 'Company Profile', desc: 'Update details', color: 'purple' },
      ]} />

      <InfoCard 
        title="Expand Your Supply Business"
        description="Reach contractors and homeowners across Zimbabwe. List your products and grow your business."
      />
    </>
  )
}

// ADMIN Dashboard
function AdminDashboard({ stats, loading }: any) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value="0" 
          icon="users" 
          color="blue"
        />
        <StatCard 
          title="Total Properties" 
          value={loading ? '...' : stats.properties.toString()} 
          icon="home" 
          color="green"
        />
        <StatCard 
          title="Pending Verifications" 
          value="0" 
          icon="clock" 
          color="orange"
        />
        <StatCard 
          title="Platform Revenue" 
          value="$0" 
          icon="dollar" 
          color="purple"
        />
      </div>

      <QuickActions actions={[
        { href: '/buy-property', icon: 'home', title: 'Manage Properties', desc: 'View all listings', color: 'blue' },
        { href: '/professionals', icon: 'users', title: 'Manage Users', desc: 'User management', color: 'green' },
        { href: '/verify/property', icon: 'check', title: 'Verifications', desc: 'Pending requests', color: 'orange' },
      ]} />

      <InfoCard 
        title="Platform Administration"
        description="Manage users, properties, and platform operations. Monitor system health and resolve issues."
      />
    </>
  )
}

// Reusable Components
interface StatCardProps {
  title: string
  value: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  link?: string
}

function StatCard({ title, value, icon, color, link }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    blue: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  const iconPaths: Record<string, string> = {
    heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    message: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    dollar: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    plus: 'M12 4v16m8-8H4',
    grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    shopping: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  const card = (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-1">{title}</h2>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`h-12 w-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[icon]} />
          </svg>
        </div>
      </div>
      {link && (
        <Link href={link} className={`mt-4 text-sm text-${color}-600 hover:text-${color}-700 font-medium inline-block`}>
          View all →
        </Link>
      )}
    </div>
  )

  return card
}

function QuickActions({ actions }: { actions: Array<{ href: string; icon: string; title: string; desc: string; color: string }> }) {
  const colorClasses: Record<string, { border: string; bg: string; icon: string }> = {
    primary: { border: 'hover:border-primary-500', bg: 'hover:bg-primary-50', icon: 'bg-primary-100 text-primary-600' },
    blue: { border: 'hover:border-primary-500', bg: 'hover:bg-primary-50', icon: 'bg-primary-100 text-primary-600' },
    green: { border: 'hover:border-green-500', bg: 'hover:bg-green-50', icon: 'bg-green-100 text-green-600' },
    purple: { border: 'hover:border-purple-500', bg: 'hover:bg-purple-50', icon: 'bg-purple-100 text-purple-600' },
    orange: { border: 'hover:border-orange-500', bg: 'hover:bg-orange-50', icon: 'bg-orange-100 text-orange-600' },
  }

  const iconPaths: Record<string, string> = {
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    home: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    plus: 'M12 4v16m8-8H4',
    grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    box: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    shopping: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, idx) => {
          const colors = colorClasses[action.color] || colorClasses.blue
          return (
            <Link 
              key={idx}
              href={action.href}
              className={`flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg ${colors.border} ${colors.bg} transition`}
            >
              <div className={`mr-4 h-10 w-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[action.icon]} />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function RecentPropertiesCard({ properties, title }: { properties: any[]; title: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {properties.map((property: any) => (
          <Link 
            key={property.id}
            href={`/buy-property/${property.id}`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{property.title}</h3>
              <p className="text-sm text-gray-600">{property.locationCity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-600">${parseFloat(property.price).toLocaleString()}</p>
              <p className="text-sm text-gray-500">{property.propertyType}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
