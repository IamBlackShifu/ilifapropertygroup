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
  services?: Array<{
    service: {
      id: string
      name: string
      description?: string
      icon?: string
    }
  }>
  stages?: Array<{
    id: string
    stageName: string
    description?: string
    status: string
    startedAt?: string
    completedAt?: string
    project: {
      id: string
      projectName: string
      projectType: string
      description: string
      status: string
      startDate?: string
      expectedEndDate?: string
      actualEndDate?: string
      property?: {
        title?: string
        locationCity?: string
        locationArea?: string
      }
    }
  }>
  serviceRequests?: Array<{
    id: string
    serviceType: string
    description: string
    status: string
    urgency: string
    startDate?: string
    completedDate?: string
    requestedAt: string
    locationCity?: string
    property?: {
      title?: string
      locationCity?: string
      locationArea?: string
    }
  }>
  _count?: {
    stages?: number
    serviceRequests?: number
  }
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

  const formatStatus = (status?: string) =>
    (status || 'UNKNOWN').toLowerCase().replace(/_/g, ' ')

  const formatProjectType = (projectType?: string) =>
    (projectType || 'PROJECT').toLowerCase().replace(/_/g, ' ')

  const formatDate = (date?: string) => {
    if (!date) return null
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getWorkStatusClass = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'INSPECTION_PASSED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
      case 'INSPECTION_REQUIRED':
        return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

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

  const structuredServices = contractor.services?.map((item) => item.service).filter(Boolean) || []
  const portfolioStages = contractor.stages || []
  const portfolioRequests = contractor.serviceRequests || []
  const hasPortfolio = portfolioStages.length > 0 || portfolioRequests.length > 0

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
              {contractor.servicesOffered.length > 0 || structuredServices.length > 0 ? (
                <div className="space-y-4">
                  {contractor.servicesOffered.length > 0 && (
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
                  )}

                  {structuredServices.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {structuredServices.map((service) => (
                        <div key={service.id} className="rounded-lg border border-gray-200 p-4">
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          {service.description && (
                            <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No services listed yet</p>
              )}
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Portfolio & Current Work</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Projects and services this contractor is working on or has completed.
                  </p>
                </div>
                {hasPortfolio && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    {portfolioStages.length + portfolioRequests.length} items
                  </span>
                )}
              </div>

              {hasPortfolio ? (
                <div className="space-y-4">
                  {portfolioStages.map((stage) => {
                    const completedDate = formatDate(stage.completedAt || stage.project.actualEndDate)
                    const startedDate = formatDate(stage.startedAt || stage.project.startDate)
                    const location = [
                      stage.project.property?.locationArea,
                      stage.project.property?.locationCity,
                    ].filter(Boolean).join(', ')

                    return (
                      <div key={stage.id} className="rounded-lg border border-gray-200 p-5">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium capitalize text-primary-600">
                              {formatProjectType(stage.project.projectType)}
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900">{stage.project.projectName}</h3>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getWorkStatusClass(stage.status)}`}>
                            {formatStatus(stage.status)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{stage.stageName}</p>
                        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                          {stage.description || stage.project.description}
                        </p>
                        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-3">
                          <div>
                            <span className="font-medium text-gray-900">Project status:</span> <span className="capitalize">{formatStatus(stage.project.status)}</span>
                          </div>
                          {location && (
                            <div>
                              <span className="font-medium text-gray-900">Location:</span> {location}
                            </div>
                          )}
                          {(completedDate || startedDate) && (
                            <div>
                              <span className="font-medium text-gray-900">{completedDate ? 'Completed:' : 'Started:'}</span> {completedDate || startedDate}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {portfolioRequests.map((request) => {
                    const completedDate = formatDate(request.completedDate)
                    const startedDate = formatDate(request.startDate)
                    const location = [
                      request.property?.locationArea,
                      request.locationCity || request.property?.locationCity,
                    ].filter(Boolean).join(', ')

                    return (
                      <div key={request.id} className="rounded-lg border border-gray-200 p-5">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-primary-600">Service request</p>
                            <h3 className="text-lg font-semibold text-gray-900">{request.serviceType}</h3>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getWorkStatusClass(request.status)}`}>
                            {formatStatus(request.status)}
                          </span>
                        </div>
                        <p className="line-clamp-3 text-sm text-gray-600">{request.description}</p>
                        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-3">
                          <div>
                            <span className="font-medium text-gray-900">Urgency:</span> <span className="capitalize">{request.urgency.toLowerCase()}</span>
                          </div>
                          {location && (
                            <div>
                              <span className="font-medium text-gray-900">Location:</span> {location}
                            </div>
                          )}
                          {(completedDate || startedDate) && (
                            <div>
                              <span className="font-medium text-gray-900">{completedDate ? 'Completed:' : 'Started:'}</span> {completedDate || startedDate}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <p className="text-gray-700">No public portfolio items yet.</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Accepted, active, and completed work will appear here once available.
                  </p>
                </div>
              )}
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
