'use client'

import { useEffect, useState } from 'react'
import { propertiesAPI } from '@/lib/api-client'
import Link from 'next/link'

export default function MyViewingsPage() {
  const [viewings, setViewings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchViewings()
  }, [])

  const fetchViewings = async () => {
    try {
      const response = await propertiesAPI.getViewingRequests()
      setViewings(response.data.data)
    } catch (error) {
      console.error('Error fetching viewings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Viewing Requests</h1>
          <p className="mt-2 text-gray-600">Track your property viewing appointments</p>
        </div>

        {viewings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No viewing requests</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't scheduled any property viewings yet</p>
            <div className="mt-6">
              <Link href="/buy-property" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                Browse Properties
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {viewings.map((viewing) => (
              <div key={viewing.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Link href={`/buy-property/${viewing.property.id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600">
                        {viewing.property.title}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(viewing.status)}`}>
                        {getStatusLabel(viewing.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Viewing Details</p>
                        <p>📅 {new Date(viewing.preferredDate).toLocaleDateString()}</p>
                        <p>🕐 {viewing.preferredTime}</p>
                        {viewing.confirmedDate && (
                          <p className="text-green-600 font-medium mt-2">
                            Confirmed: {new Date(viewing.confirmedDate).toLocaleDateString()} at {viewing.confirmedTime}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900 mb-2">Contact Information</p>
                        <p>👤 {viewing.contactName}</p>
                        <p>📧 {viewing.contactEmail}</p>
                        <p>📱 {viewing.contactPhone}</p>
                      </div>
                    </div>

                    {viewing.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600"><strong>Message:</strong> {viewing.message}</p>
                      </div>
                    )}

                    {viewing.ownerNotes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800"><strong>Owner's Response:</strong> {viewing.ownerNotes}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      Requested on {new Date(viewing.requestedAt).toLocaleString()}
                    </p>
                  </div>

                  {viewing.property.images?.[0]?.imageUrl && (
                    <img
                      src={`http://localhost:4000${viewing.property.images[0].imageUrl}`}
                      alt={viewing.property.title}
                      className="w-32 h-32 object-cover rounded ml-4"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
