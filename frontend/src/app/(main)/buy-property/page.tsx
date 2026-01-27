'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  price: string
  locationCity: string
  locationArea?: string
  bedrooms?: number
  bathrooms?: number
  sizeSqm?: string
  status: string
  isVerified: boolean
  images: Array<{ imageUrl: string; isPrimary: boolean }>
  owner: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

interface Filters {
  search: string
  propertyType: string
  minPrice: string
  maxPrice: string
  minBedrooms: string
  maxBedrooms: string
  locationCity: string
  minSizeSqm: string
  maxSizeSqm: string
}

export default function BuyPropertyPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    locationCity: '',
    minSizeSqm: '',
    maxSizeSqm: '',
  })

  useEffect(() => {
    fetchProperties()
  }, [currentPage, sortBy, sortOrder])

  const fetchProperties = async () => {
    setLoading(true)
    setError('')

    try {
      // Build query params
      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', '10')
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      if (filters.search) params.append('search', filters.search)
      if (filters.propertyType && filters.propertyType !== 'ALL') params.append('propertyType', filters.propertyType)
      if (filters.locationCity) params.append('locationCity', filters.locationCity)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms)
      if (filters.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms)

      const response = await fetch(`http://localhost:4000/api/properties?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
        setTotalCount(data.meta?.total || 0)
        setTotalPages(data.meta?.totalPages || 1)
      } else {
        setError('Failed to load properties')
      }
    } catch (err) {
      setError('An error occurred while loading properties')
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProperties()
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      locationCity: '',
      minSizeSqm: '',
      maxSizeSqm: '',
    })
    setCurrentPage(1)
    setTimeout(fetchProperties, 100)
  }

  const handleSortChange = (value: string) => {
    switch (value) {
      case 'newest':
        setSortBy('createdAt')
        setSortOrder('desc')
        break
      case 'oldest':
        setSortBy('createdAt')
        setSortOrder('asc')
        break
      case 'price-low':
        setSortBy('price')
        setSortOrder('asc')
        break
      case 'price-high':
        setSortBy('price')
        setSortOrder('desc')
        break
    }
  }

  const getPriceRange = (value: string) => {
    switch (value) {
      case 'under-50k': return { min: '', max: '50000' }
      case '50k-100k': return { min: '50000', max: '100000' }
      case '100k-200k': return { min: '100000', max: '200000' }
      case 'over-200k': return { min: '200000', max: '' }
      default: return { min: '', max: '' }
    }
  }

  const handlePriceRangeChange = (value: string) => {
    const range = getPriceRange(value)
    setFilters({ ...filters, minPrice: range.min, maxPrice: range.max })
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Verified Property</h1>
          <p className="text-xl text-primary-100 mb-8">
            Search through verified properties with complete legal documentation
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Borrowdale, Harare"
                  value={filters.locationCity}
                  onChange={(e) => setFilters({ ...filters, locationCity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select 
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Types</option>
                  <option value="LAND">Land</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select 
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Price</option>
                  <option value="under-50k">Under $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-200k">$100,000 - $200,000</option>
                  <option value="over-200k">Over $200,000</option>
                </select>
              </div>
            </div>
            <button 
              type="submit"
              className="mt-4 w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
            >
              Search Properties
            </button>
          </form>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Bedrooms */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Bedrooms</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5'].map((bed) => (
                    <button 
                      key={bed} 
                      onClick={() => setFilters({ ...filters, minBedrooms: bed })}
                      className={`px-3 py-2 text-sm border rounded ${
                        filters.minBedrooms === bed
                          ? 'border-primary-600 text-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-600 hover:text-primary-600'
                      }`}
                    >
                      {bed}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Land Size */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Land Size (m²)</h4>
                <div className="space-y-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minSizeSqm}
                    onChange={(e) => setFilters({ ...filters, minSizeSqm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxSizeSqm}
                    onChange={(e) => setFilters({ ...filters, maxSizeSqm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={handleSearch}
                  className="w-full py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 font-medium"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleResetFilters}
                  className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Property Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    <span className="font-semibold">{totalCount}</span> properties found
                  </>
                )}
              </p>
              <select 
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No properties found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your filters or search criteria</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Property Cards Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <Link 
                      key={property.id} 
                      href={`/buy-property/${property.id}`} 
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                        {property.images && property.images.length > 0 && property.images[0].imageUrl ? (
                          <img
                            src={`http://localhost:4000${property.images[0].imageUrl}`}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white text-5xl">
                            🏠
                          </div>
                        )}
                        <div className="absolute top-4 right-4 space-y-2">
                          {property.isVerified && (
                            <span className="block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                              ✓ Verified
                            </span>
                          )}
                          <span className="block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                            {property.propertyType}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                            {property.title}
                          </h3>
                          <p className="text-xl font-bold text-primary-600 whitespace-nowrap">
                            ${parseFloat(property.price).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          📍 {property.locationCity}{property.locationArea ? `, ${property.locationArea}` : ''}
                        </p>
                        {(property.bedrooms || property.bathrooms || property.sizeSqm) && (
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
                            {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
                            {property.sizeSqm && <span>📐 {property.sizeSqm} m²</span>}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {property.owner.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-medium">
                                {property.owner.firstName} {property.owner.lastName}
                              </p>
                              <p className="text-xs text-gray-500">Property Owner</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(property.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-md ${
                              pageNum === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="px-2">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-4 py-2 rounded-md ${
                              totalPages === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
