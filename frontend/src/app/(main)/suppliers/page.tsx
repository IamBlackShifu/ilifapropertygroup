'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { suppliersAPI } from '@/lib/api-client'

const supplierCategories = [
  {
    phase: 'Pre-Construction',
    categories: [
      { name: 'Architects', filter: null },
      { name: 'Surveyors', filter: null },
      { name: 'Soil Testing', filter: null },
      { name: 'Geotechnical Services', filter: null },
    ]
  },
  {
    phase: 'Legal & Compliance',
    categories: [
      { name: 'Conveyancing Lawyers', filter: null },
      { name: 'Council Approvals', filter: null },
      { name: 'EMA Clearance', filter: null },
      { name: 'ZESA Connections', filter: null },
    ]
  },
  {
    phase: 'Foundation & Structure',
    categories: [
      { name: 'Cement Suppliers', filter: 'CEMENT' },
      { name: 'Bricks & Blocks', filter: 'BRICKS' },
      { name: 'Steel & Reinforcement', filter: 'STEEL' },
      { name: 'Aggregates (Sand, Stone)', filter: null },
      { name: 'Roofing Materials', filter: 'ROOFING' },
      { name: 'Timber', filter: 'TIMBER' },
    ]
  },
  {
    phase: 'Windows & Doors',
    categories: [
      { name: 'Aluminum Windows', filter: 'DOORS_WINDOWS' },
      { name: 'Wooden Doors', filter: 'DOORS_WINDOWS' },
      { name: 'Security Doors', filter: 'DOORS_WINDOWS' },
      { name: 'Garage Doors', filter: 'DOORS_WINDOWS' },
    ]
  },
  {
    phase: 'Finishes',
    categories: [
      { name: 'Kitchen Cupboards', filter: null },
      { name: 'Built-in Cupboards', filter: null },
      { name: 'Tiles & Flooring', filter: 'TILES' },
      { name: 'Ceilings', filter: null },
      { name: 'Paint & Painting', filter: 'PAINT' },
      { name: 'Sanitary Ware', filter: 'PLUMBING' },
    ]
  },
  {
    phase: 'Services',
    categories: [
      { name: 'Plumbing', filter: 'PLUMBING' },
      { name: 'Electrical', filter: 'ELECTRICAL' },
      { name: 'Solar Systems', filter: 'ELECTRICAL' },
      { name: 'Borehole Drilling', filter: null },
      { name: 'Water Tanks', filter: 'HARDWARE' },
      { name: 'Septic Tanks', filter: null },
    ]
  },
  {
    phase: 'Exterior & Security',
    categories: [
      { name: 'Paving', filter: 'TILES' },
      { name: 'Fencing & Gates', filter: 'HARDWARE' },
      { name: 'CCTV Systems', filter: 'ELECTRICAL' },
      { name: 'Electric Fencing', filter: 'ELECTRICAL' },
      { name: 'Smart Home Systems', filter: 'ELECTRICAL' },
      { name: 'Landscaping', filter: null },
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
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [featuredSuppliers, setFeaturedSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    categories: 0,
    totalProducts: 0,
    deliverySuppliers: 0,
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const [suppliersResponse, productsResponse] = await Promise.all([
        suppliersAPI.getAllSuppliers({ isVerified: true }),
        suppliersAPI.searchProducts({}),
      ])
      const suppliers = suppliersResponse.data || []
      const products = productsResponse.data || []
      
      setSuppliers(suppliers)
      setFeaturedSuppliers(suppliers.slice(0, 3))
      
      const supplierCategories = suppliers.flatMap((supplier: Supplier) => supplier.categories || [])
      const productCategories = products.map((product: { category?: string }) => product.category).filter(Boolean)
      const categories = new Set([...supplierCategories, ...productCategories]).size
      const totalProducts = products.length || suppliers.reduce((sum: number, s: Supplier) => sum + (s._count?.products || 0), 0)

      setStats({
        totalSuppliers: suppliers.length,
        categories,
        totalProducts,
        deliverySuppliers: suppliers.filter((supplier: Supplier) => supplier.deliveryAvailable).length,
      })
    } catch (err: any) {
      console.error('Error loading suppliers:', err)
      setError(err.response?.data?.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  const getCategorySupplierCount = (filter: string | null) => {
    if (!filter) return null

    return suppliers.length === 0 && loading
      ? null
      : suppliers.filter((supplier) => supplier.categories?.includes(filter)).length
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
            <p className="text-3xl font-bold text-primary-600 mb-2">{loading ? '...' : stats.categories}</p>
            <p className="text-sm text-gray-600">Active Categories</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">{loading ? '...' : stats.totalProducts}</p>
            <p className="text-sm text-gray-600">Products Listed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">{loading ? '...' : stats.deliverySuppliers}</p>
            <p className="text-sm text-gray-600">Offer Delivery</p>
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
                {phase.categories.map((category) => {
                  const count = getCategorySupplierCount(category.filter)

                  return (
                    <Link
                      key={category.name}
                      href={category.filter ? `/marketplace?category=${category.filter}` : `/marketplace?search=${encodeURIComponent(category.name)}`}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
                    >
                      <h3 className="font-medium mb-2 group-hover:text-primary-600">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {count === null ? 'Loading...' : category.filter ? `${count} supplier${count === 1 ? '' : 's'}` : 'Search marketplace'}
                      </p>
                    </Link>
                  )
                })}
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
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                    )}
                    {false && supplier.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Verified</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{supplier.companyName}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>
                  <div className="hidden">
                    <span className="text-yellow-400 text-sm">
                      {'★'.repeat(Math.round(Number(supplier.ratingAverage)))}
                      {'☆'.repeat(5 - Math.round(Number(supplier.ratingAverage)))}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">({supplier.ratingCount} reviews)</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-sm font-medium text-gray-900">
                      {Number(supplier.ratingAverage) > 0 ? Number(supplier.ratingAverage).toFixed(1) : 'No rating'}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {supplier.ratingCount} review{supplier.ratingCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="hidden">
                    <p>📍 {supplier.locationCity}</p>
                    {supplier.deliveryAvailable && <p>📦 Delivery Available</p>}
                    <p>🏷️ {supplier._count?.products || 0} Products</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Location: {supplier.locationCity || 'Not provided'}</p>
                    {supplier.deliveryAvailable && <p>Delivery available</p>}
                    <p>{supplier._count?.products || 0} product{supplier._count?.products === 1 ? '' : 's'}</p>
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
