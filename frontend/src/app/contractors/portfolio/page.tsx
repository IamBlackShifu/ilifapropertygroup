'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface PortfolioStage {
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
    actualEndDate?: string
    property?: {
      title?: string
      locationCity?: string
      locationArea?: string
    }
  }
}

interface PortfolioRequest {
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
}

interface ContractorProfile {
  id: string
  companyName: string
  servicesOffered?: string[]
  stages?: PortfolioStage[]
  serviceRequests?: PortfolioRequest[]
  _count?: {
    stages?: number
    serviceRequests?: number
  }
}

export default function ContractorPortfolioPage() {
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await apiClient.get('/contractors/my-profile')
        setProfile(response.data?.data || response.data)
      } catch (portfolioError: any) {
        if (portfolioError.response?.status === 404) {
          setError('Create your contractor profile before viewing portfolio work.')
        } else {
          setError('Failed to load contractor portfolio.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  const formatStatus = (status?: string) => (status || 'UNKNOWN').toLowerCase().replace(/_/g, ' ')
  const formatProjectType = (projectType?: string) => (projectType || 'PROJECT').toLowerCase().replace(/_/g, ' ')
  const formatDate = (date?: string) => {
    if (!date) return null
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusClass = (status?: string) => {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  const stages = profile?.stages || []
  const serviceRequests = profile?.serviceRequests || []
  const hasPortfolio = stages.length > 0 || serviceRequests.length > 0

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Contractor portfolio</p>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.companyName || 'Portfolio'}</h1>
              <p className="mt-2 text-gray-600">Review the services and public work shown on your contractor profile.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/contractors/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-white">
                Back to dashboard
              </Link>
              {profile && (
                <Link href={`/contractor/${profile.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  View public profile
                </Link>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          )}

          {profile && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Portfolio Work</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {stages.length + serviceRequests.length} items
                    </span>
                  </div>

                  {hasPortfolio ? (
                    <div className="space-y-4">
                      {stages.map((stage) => {
                        const date = formatDate(stage.completedAt || stage.project.actualEndDate || stage.startedAt || stage.project.startDate)
                        const location = [
                          stage.project.property?.locationArea,
                          stage.project.property?.locationCity,
                        ].filter(Boolean).join(', ')

                        return (
                          <div key={stage.id} className="rounded-lg border border-gray-200 p-5">
                            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium capitalize text-blue-600">{formatProjectType(stage.project.projectType)}</p>
                                <h3 className="text-lg font-semibold text-gray-900">{stage.project.projectName}</h3>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(stage.status)}`}>
                                {formatStatus(stage.status)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-800">{stage.stageName}</p>
                            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{stage.description || stage.project.description}</p>
                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                              <span><span className="font-medium text-gray-900">Project:</span> <span className="capitalize">{formatStatus(stage.project.status)}</span></span>
                              {location && <span><span className="font-medium text-gray-900">Location:</span> {location}</span>}
                              {date && <span><span className="font-medium text-gray-900">Date:</span> {date}</span>}
                            </div>
                          </div>
                        )
                      })}

                      {serviceRequests.map((request) => {
                        const date = formatDate(request.completedDate || request.startDate || request.requestedAt)
                        const location = [
                          request.property?.locationArea,
                          request.locationCity || request.property?.locationCity,
                        ].filter(Boolean).join(', ')

                        return (
                          <div key={request.id} className="rounded-lg border border-gray-200 p-5">
                            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-blue-600">Service request</p>
                                <h3 className="text-lg font-semibold text-gray-900">{request.serviceType}</h3>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(request.status)}`}>
                                {formatStatus(request.status)}
                              </span>
                            </div>
                            <p className="line-clamp-3 text-sm text-gray-600">{request.description}</p>
                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                              <span><span className="font-medium text-gray-900">Urgency:</span> <span className="capitalize">{request.urgency.toLowerCase()}</span></span>
                              {location && <span><span className="font-medium text-gray-900">Location:</span> {location}</span>}
                              {date && <span><span className="font-medium text-gray-900">Date:</span> {date}</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                      <p className="text-gray-700">No portfolio items are public yet.</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Accepted, active, and completed work will appear here when available.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Services</h2>
                  {(profile.servicesOffered || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.servicesOffered?.map((service) => (
                        <span key={service} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                          {service}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No services listed yet.</p>
                  )}
                  <Link href="/contractors/profile/edit" className="mt-5 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Edit services
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned project stages</span>
                      <span className="font-semibold">{profile._count?.stages || stages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service requests</span>
                      <span className="font-semibold">{profile._count?.serviceRequests || serviceRequests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Public items shown</span>
                      <span className="font-semibold">{stages.length + serviceRequests.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
