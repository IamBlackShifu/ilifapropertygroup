'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface PropertyImage {
  id: string
  imageUrl: string
  isPrimary: boolean
}

interface Owner {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
}

interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  price: string
  locationCity: string
  locationArea?: string
  locationAddress?: string
  latitude?: string
  longitude?: string
  landSizeSqm?: string
  bedrooms?: number
  bathrooms?: number
  features?: string[]
  status: string
  viewCount: number
  images: PropertyImage[]
  owner: Owner
  createdAt: string
  updatedAt: string
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const propertyId = params?.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [sendingInquiry, setSendingInquiry] = useState(false)

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/properties/${propertyId}`)
      
      if (response.ok) {
        const data = await response.json()
        setProperty(data.data)
      } else {
        setError('Property not found')
      }
    } catch (error) {
      setError('Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProperty = () => {
    // TODO: Implement save functionality
    alert('Save property feature coming soon!')
  }

  const handleScheduleTour = () => {
    // TODO: Implement tour scheduling
    alert('Schedule tour feature coming soon!')
  }

  const handleSendInquiry = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!inquiryMessage.trim()) {
      alert('Please enter a message')
      return
    }

    setSendingInquiry(true)
    // TODO: Implement inquiry API
    setTimeout(() => {
      setSendingInquiry(false)
      setShowContactModal(false)
      setInquiryMessage('')
      alert('Your inquiry has been sent to the property owner!')
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Property Not Found</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link href="/buy-property" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]
  const hasMultipleImages = property.images.length > 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-blue-500 to-purple-600">
                {property.images.length > 0 && property.images[currentImageIndex]?.imageUrl ? (
                  <img
                    src={property.images[currentImageIndex].imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-6xl">
                    🏠
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    property.status === 'VERIFIED' ? 'bg-green-500 text-white' :
                    property.status === 'PENDING_VERIFICATION' ? 'bg-yellow-500 text-white' :
                    property.status === 'SOLD' ? 'bg-red-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {property.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Image Navigation */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {hasMultipleImages && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={image.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <p className="mt-2 text-lg text-gray-600">
                    {property.locationCity}
                    {property.locationArea && `, ${property.locationArea}`}
                  </p>
                </div>
                <button
                  onClick={handleSaveProperty}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {property.viewCount} views
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-blue-600">
                  ${parseFloat(property.price).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Property Type: {property.propertyType}</p>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                )}
                {property.landSizeSqm && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{parseFloat(property.landSizeSqm).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">sqm</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.propertyType}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {property.locationAddress && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
                  <p className="text-gray-700">{property.locationAddress}</p>
                  <p className="text-gray-600 mt-1">
                    {property.locationCity}
                    {property.locationArea && `, ${property.locationArea}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Contact Owner Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Property Owner</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {property.owner.firstName[0]}{property.owner.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {property.owner.firstName} {property.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Property Owner</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold mb-3"
                >
                  Contact Owner
                </button>

                <button
                  onClick={handleScheduleTour}
                  className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                >
                  Schedule Tour
                </button>
              </div>

              {/* Property Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Property Information</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID</span>
                    <span className="font-medium text-gray-900">#{property.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-gray-900">{property.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed</span>
                    <span className="font-medium text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span className="font-medium text-gray-900">
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Share Property</h3>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Facebook
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Property Owner</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="I'm interested in this property..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSendInquiry}
                disabled={sendingInquiry}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {sendingInquiry ? 'Sending...' : 'Send Inquiry'}
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
