'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { propertiesAPI } from '@/lib/api-client'
import { Property } from '@/types'
import ContactOwnerModal, { ContactOwnerFormData } from '@/components/properties/ContactOwnerModal'
import ScheduleViewingModal, { ScheduleViewingFormData } from '@/components/properties/ScheduleViewingModal'

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [savingProperty, setSavingProperty] = useState(false)
  
  // Modal states
  const [showContactModal, setShowContactModal] = useState(false)
  const [showViewingModal, setShowViewingModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchProperty()
    checkIfSaved()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await propertiesAPI.getById(params.id)
      setProperty(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch property details')
      console.error('Error fetching property:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkIfSaved = async () => {
    try {
      const response = await propertiesAPI.checkIfSaved(params.id)
      setIsSaved(response.data.data.isSaved)
    } catch (error) {
      // User might not be logged in
      console.log('Could not check if property is saved')
    }
  }

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(Number(price))
  }

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const previousImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const handleSaveProperty = async () => {
    setSavingProperty(true)
    try {
      if (isSaved) {
        await propertiesAPI.unsaveProperty(params.id)
        setIsSaved(false)
        setSuccessMessage('Property removed from saved list')
      } else {
        await propertiesAPI.saveProperty(params.id)
        setIsSaved(true)
        setSuccessMessage('Property saved successfully')
      }
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save property. Please login to continue.')
    } finally {
      setSavingProperty(false)
    }
  }

  const handleContactOwner = async (data: ContactOwnerFormData) => {
    try {
      await propertiesAPI.contactOwner({
        propertyId: params.id,
        ...data,
      })
      setSuccessMessage('Message sent to property owner successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to send message')
    }
  }

  const handleScheduleViewing = async (data: ScheduleViewingFormData) => {
    try {
      await propertiesAPI.scheduleViewing({
        propertyId: params.id,
        ...data,
      })
      setSuccessMessage('Viewing request sent successfully! The owner will contact you soon.')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to schedule viewing')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This property does not exist'}</p>
          <Link href="/buy-property" className="btn-primary px-6 py-3 rounded-lg">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/buy-property" className="text-gray-500 hover:text-gray-700">Buy Property</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Property Details</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              {property.images && property.images.length > 0 ? (
                <div className="relative h-96">
                  <img
                    src={`http://localhost:4000${property.images[currentImageIndex].imageUrl}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 space-y-2">
                    {property.isVerified && (
                      <span className="block px-4 py-2 bg-green-500 text-white font-semibold rounded-full">
                        ✓ Verified Property
                      </span>
                    )}
                    {property.status === 'VERIFIED' && (
                      <span className="block px-4 py-2 bg-blue-500 text-white font-semibold rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        →
                      </button>
                      <button className="absolute bottom-4 right-4 px-4 py-2 bg-white text-gray-900 font-medium rounded-md shadow hover:bg-gray-50">
                        View All Photos ({property.images.length})
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative h-96 bg-gray-200 flex items-center justify-center">
                  <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    📍 {[property.locationAddress, property.locationArea, property.locationCity].filter(Boolean).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</p>
                  <p className="text-sm text-gray-500">{property.currency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                {property.bedrooms && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                    <p className="text-2xl font-semibold">🛏️ {property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                    <p className="text-2xl font-semibold">🚿 {property.bathrooms}</p>
                  </div>
                )}
                {property.sizeSqm && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Size</p>
                    <p className="text-2xl font-semibold">📐 {property.sizeSqm}m²</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Property Type</p>
                  <p className="text-2xl font-semibold">{property.propertyType}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="text-gray-600 mb-4">
                {[property.locationAddress, property.locationArea, property.locationCity].filter(Boolean).join(', ')}
              </p>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map View - Coordinates: {property.coordinatesLat}, {property.coordinatesLng}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner/Agent Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
              {property.owner && (
                <>
                  <div className="flex items-center mb-4">
                    {property.owner.profileImageUrl ? (
                      <img
                        src={`http://localhost:4000${property.owner.profileImageUrl}`}
                        alt={`${property.owner.firstName} ${property.owner.lastName}`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-primary-100 rounded-full mr-4 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-600">
                          {property.owner.firstName[0]}{property.owner.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {property.owner.firstName} {property.owner.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Property Owner</p>
                      {property.isVerified && (
                        <p className="text-xs text-green-600 mt-1">✓ Verified Property</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="w-full py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Contact Owner
                    </button>
                    <button 
                      onClick={() => setShowViewingModal(true)}
                      className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Schedule Viewing
                    </button>
                    <button 
                      onClick={handleSaveProperty}
                      disabled={savingProperty}
                      className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg 
                        className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : ''}`} 
                        fill={isSaved ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isSaved ? 'Saved' : 'Save Property'}
                    </button>
                  </div>

                  {(property.owner.phone || property.owner.email) && (
                    <div className="pt-6 border-t space-y-3">
                      {property.owner.phone && (
                        <div className="flex items-center text-sm">
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${property.owner.phone}`} className="text-gray-700 hover:text-primary-600">
                            {property.owner.phone}
                          </a>
                        </div>
                      )}
                      {property.owner.email && (
                        <div className="flex items-center text-sm">
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${property.owner.email}`} className="text-gray-700 hover:text-primary-600">
                            {property.owner.email}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Similar Properties - Can be populated with API data later */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Similar Properties</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center py-4">
                  Similar properties will be shown here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage('')}
                  className="ml-3 text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <ContactOwnerModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleContactOwner}
          propertyTitle={property?.title || ''}
        />

        <ScheduleViewingModal
          isOpen={showViewingModal}
          onClose={() => setShowViewingModal(false)}
          onSubmit={handleScheduleViewing}
          propertyTitle={property?.title || ''}
        />
      </div>
    </div>
  )
}
