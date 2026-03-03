'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  size: number
  bedrooms: number
  bathrooms: number
  images: string[]
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND'
  status: 'ACTIVE' | 'VERIFIED' | 'PENDING_VERIFICATION' | 'SOLD' | 'DRAFT'
  savedAt: string
}

// Mock data
const mockSavedProperties: Property[] = [
  {
    id: '1',
    title: '4-Bedroom House in Borrowdale',
    description: 'Spacious family home with modern amenities',
    price: 250000,
    location: 'Borrowdale, Harare',
    size: 350,
    bedrooms: 4,
    bathrooms: 3,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    type: 'RESIDENTIAL',
    status: 'VERIFIED',
    savedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Commercial Office Space',
    description: 'Prime office location in CBD',
    price: 500000,
    location: 'CBD, Harare',
    size: 200,
    bedrooms: 0,
    bathrooms: 2,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    type: 'COMMERCIAL',
    status: 'ACTIVE',
    savedAt: '2024-01-14',
  },
]

export default function SavedPropertiesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SavedPropertiesContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function SavedPropertiesContent() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>(mockSavedProperties)
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent')
  const [filterType, setFilterType] = useState<'all' | 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND'>('all')

  const handleRemove = (propertyId: string) => {
    if (confirm('Remove this property from your saved list?')) {
      setProperties(properties.filter(p => p.id !== propertyId))
      // TODO: Call API to remove from saved
      // await fetch(`/api/properties/${propertyId}/unsave`, { method: 'DELETE' })
    }
  }

  const filteredAndSorted = properties
    .filter(p => filterType === 'all' || p.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">
            You have saved {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('RESIDENTIAL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'RESIDENTIAL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Residential
              </button>
              <button
                onClick={() => setFilterType('COMMERCIAL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'COMMERCIAL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Commercial
              </button>
              <button
                onClick={() => setFilterType('LAND')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'LAND'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Land
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Recently Saved</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredAndSorted.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties</h3>
            <p className="text-gray-600 mb-6">
              {filterType === 'all'
                ? 'Start saving properties to view them here'
                : `No ${filterType.toLowerCase()} properties saved`}
            </p>
            <Link
              href="/buy-property"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Browse Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        property.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'ACTIVE'
                          ? 'bg-blue-100 text-blue-800'
                          : property.status === 'SOLD'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {property.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleRemove(property.id)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-red-50 transition group/btn"
                      title="Remove from saved"
                    >
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    {property.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/buy-property/${property.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition">
                      {property.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} beds
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        {property.bathrooms} baths
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {property.size}m²
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${property.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Saved {new Date(property.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/buy-property/${property.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      View Details
                    </Link>
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
