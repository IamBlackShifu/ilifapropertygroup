'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { suppliersAPI } from '@/lib/api-client'

const supplierCategories = [
  {
    phase: 'Pre-Construction',
    categories: [
      { name: 'Architects', count: 124, filter: null },
      { name: 'Surveyors', count: 52, filter: null },
      { name: 'Soil Testing', count: 18, filter: null },
      { name: 'Geotechnical Services', count: 12, filter: null },
    ]
  },
  {
    phase: 'Legal & Compliance',
    categories: [
      { name: 'Conveyancing Lawyers', count: 67, filter: null },
      { name: 'Council Approvals', count: 8, filter: null },
      { name: 'EMA Clearance', count: 5, filter: null },
      { name: 'ZESA Connections', count: 3, filter: null },
    ]
  },
  {
    phase: 'Foundation & Structure',
    categories: [
      { name: 'Cement Suppliers', count: 45, filter: 'CEMENT' },
      { name: 'Bricks & Blocks', count: 78, filter: 'BRICKS' },
      { name: 'Steel & Reinforcement', count: 56, filter: 'STEEL' },
      { name: 'Aggregates (Sand, Stone)', count: 34, filter: null },
      { name: 'Roofing Materials', count: 92, filter: 'ROOFING' },
      { name: 'Timber', count: 41, filter: 'TIMBER' },
    ]
  },
  {
    phase: 'Windows & Doors',
    categories: [
      { name: 'Aluminum Windows', count: 38, filter: 'DOORS_WINDOWS' },
      { name: 'Wooden Doors', count: 29, filter: 'DOORS_WINDOWS' },
      { name: 'Security Doors', count: 47, filter: 'DOORS_WINDOWS' },
      { name: 'Garage Doors', count: 23, filter: 'DOORS_WINDOWS' },
    ]
  },
  {
    phase: 'Finishes',
    categories: [
      { name: 'Kitchen Cupboards', count: 56, filter: null },
      { name: 'Built-in Cupboards', count: 43, filter: null },
      { name: 'Tiles & Flooring', count: 89, filter: 'TILES' },
      { name: 'Ceilings', count: 31, filter: null },
      { name: 'Paint & Painting', count: 67, filter: 'PAINT' },
      { name: 'Sanitary Ware', count: 52, filter: 'PLUMBING' },
    ]
  },
  {
    phase: 'Services',
    categories: [
      { name: 'Plumbing', count: 123, filter: 'PLUMBING' },
      { name: 'Electrical', count: 145, filter: 'ELECTRICAL' },
      { name: 'Solar Systems', count: 78, filter: 'ELECTRICAL' },
      { name: 'Borehole Drilling', count: 34, filter: null },
      { name: 'Water Tanks', count: 29, filter: 'HARDWARE' },
      { name: 'Septic Tanks', count: 18, filter: null },
    ]
  },
  {
    phase: 'Exterior & Security',
    categories: [
      { name: 'Paving', count: 56, filter: 'TILES' },
      { name: 'Fencing & Gates', count: 71, filter: 'HARDWARE' },
      { name: 'CCTV Systems', count: 45, filter: 'ELECTRICAL' },
      { name: 'Electric Fencing', count: 39, filter: 'ELECTRICAL' },
      { name: 'Smart Home Systems', count: 22, filter: 'ELECTRICAL' },
      { name: 'Landscaping', count: 34, filter: null },
    ]
  },
]

interface Supplier {
  id: string
  companyName: string
  description: string
  categories: string[]
  locationCity: string
  isVerified: boolean
  ratingAverage: number
  ratingCount: number
  deliveryAvailable: boolean
  _count?: {
    products: number
  }
}

export default function SuppliersPage() {
  const [featuredSuppliers, setFeaturedSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    categories: 8,
    totalProducts: 0,
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const response = await suppliersAPI.getAllSuppliers({ isVerified: true })
      const suppliers = response.data || []
      
      setFeaturedSuppliers(suppliers.slice(0, 3))
      
      // Calculate stats
      const totalProducts = suppliers.reduce((sum: number, s: Supplier) => sum + (s._count?.products || 0), 0)
      setStats({
        totalSuppliers: suppliers.length,
        categories: 8,
        totalProducts,
      })
    } catch (err: any) {
      console.error('Error loading suppliers:', err)
      setError(err.response?.data?.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Suppliers & Materials Directory</h1>
          <p className="text-xl text-primary-100 mb-8">
            A-Z of everything you need to build a house in Zimbabwe
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 flex">
              <input
                type="text"
                placeholder="Search suppliers, materials, or services..."
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              />
              <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">{loading ? '...' : stats.totalSuppliers}</p>
            <p className="text-sm text-gray-600">Verified Suppliers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">{stats.categories}</p>
            <p className="text-sm text-gray-600">Product Categories</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">{loading ? '...' : stats.totalProducts}</p>
            <p className="text-sm text-gray-600">Products Listed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">24/7</p>
            <p className="text-sm text-gray-600">Support Available</p>
          </div>
        </div>
      </section>

      {/* Categories by Building Phase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {supplierCategories.map((phase) => (
            <div key={phase.phase} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b">{phase.phase}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {phase.categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.filter ? `/marketplace?category=${category.filter}` : `/suppliers/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium mb-2 group-hover:text-primary-600">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} suppliers</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Suppliers</h2>
          
          {loading ? (
            <div className="text-center text-gray-600">Loading suppliers...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : featuredSuppliers.length === 0 ? (
            <div className="text-center text-gray-600">No featured suppliers available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSuppliers.map((supplier) => (
                <div key={supplier.id} className="bg-gray-50 rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded flex items-center justify-center text-white text-2xl font-bold">
                      {supplier.companyName.charAt(0)}
                    </div>
                    {supplier.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Verified</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{supplier.companyName}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 text-sm">
                      {'★'.repeat(Math.round(Number(supplier.ratingAverage)))}
                      {'☆'.repeat(5 - Math.round(Number(supplier.ratingAverage)))}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">({supplier.ratingCount} reviews)</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {supplier.locationCity}</p>
                    {supplier.deliveryAvailable && <p>📦 Delivery Available</p>}
                    <p>🏷️ {supplier._count?.products || 0} Products</p>
                  </div>
                  <Link 
                    href={`/marketplace?supplier=${supplier.id}`}
                    className="block mt-4 text-center py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700"
                  >
                    View Products
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a supplier?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our verified supplier network and reach thousands of builders
          </p>
          <Link href="/for-professionals" className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50">
            List Your Business
          </Link>
        </div>
      </section>
    </div>
  )
}
