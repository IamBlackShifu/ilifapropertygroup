'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { useAuth } from '@/contexts/AuthContext'

interface Contractor {
  id: string
  companyName: string
  description: string
  servicesOffered: string[]
  locationCity: string
  locationAddress: string
  isVerified: boolean
  ratingAverage: string
  ratingCount: number
  yearsExperience: number
  employeesCount: number
  registrationNumber: string
  status: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  reviews: Array<{
    id: string
    rating: number
    comment: string
    createdAt: string
    reviewer: {
      firstName: string
      lastName: string
    }
  }>
}

export default function ContractorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const contractorId = params.id as string

  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't try to load if the ID is actually a route segment like "profile"
    if (contractorId && contractorId !== 'profile') {
      loadContractor()
    } else if (contractorId === 'profile') {
      // Redirect to proper route
      router.push('/professionals')
    }
  }, [contractorId, router])

  const loadContractor = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/contractors/${contractorId}`)
      setContractor(response.data.data)
    } catch (error) {
      console.error('Error loading contractor:', error)
      alert('Failed to load contractor profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!contractor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Contractor Not Found</h1>
          <Link href="/professionals" className="text-primary-600 hover:underline">
            ← Back to Professionals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/professionals" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Professionals
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{contractor.companyName}</h1>
                {contractor.isVerified && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600">{contractor.locationCity || 'Zimbabwe'}</p>
              {contractor.ratingCount > 0 && (
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400 text-lg">★★★★★</span>
                  <span className="text-gray-700 ml-2 font-medium">
                    {parseFloat(contractor.ratingAverage).toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-2">({contractor.ratingCount} reviews)</span>
                </div>
              )}
            </div>
            
            <Link
              href={`/services/request?contractorId=${contractor.id}`}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Request Service
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{contractor.description}</p>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {contractor.servicesOffered.map((service, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-100 text-primary-800 rounded-lg font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Reviews {contractor.ratingCount > 0 && `(${contractor.ratingCount})`}
              </h2>
              
              {contractor.reviews && contractor.reviews.length > 0 ? (
                <div className="space-y-4">
                  {contractor.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            {review.reviewer.firstName} {review.reviewer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">Company Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium">{contractor.registrationNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Years of Experience</p>
                  <p className="font-medium">{contractor.yearsExperience || 0} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employees</p>
                  <p className="font-medium">{contractor.employeesCount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {contractor.locationCity || 'N/A'}
                    {contractor.locationAddress && (
                      <><br /><span className="text-sm">{contractor.locationAddress}</span></>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium">
                    {contractor.user.firstName} {contractor.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${contractor.user.email}`} className="text-primary-600 hover:underline">
                    {contractor.user.email}
                  </a>
                </div>
                {contractor.user.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${contractor.user.phone}`} className="text-primary-600 hover:underline">
                      {contractor.user.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/services/request?contractorId=${contractor.id}`}
              className="block w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              Request Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
