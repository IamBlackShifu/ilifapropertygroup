'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api-client'

function ServiceRequestPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const contractorId = searchParams.get('contractorId')
  const propertyId = searchParams.get('propertyId')

  const [loading, setLoading] = useState(false)
  const [contractor, setContractor] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])

  const [formData, setFormData] = useState({
    contractorId: contractorId || '',
    propertyId: propertyId || '',
    serviceType: '',
    description: '',
    urgency: 'NORMAL',
    preferredDate: '',
    locationCity: '',
    locationAddress: '',
    estimatedBudget: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (contractorId) {
      loadContractor()
    }

    if (user.role === 'OWNER') {
      loadProperties()
    }
  }, [user, contractorId])

  const loadContractor = async () => {
    try {
      const response = await apiClient.get(`/contractors/${contractorId}`)
      setContractor(response.data.data)
    } catch (error) {
      console.error('Error loading contractor:', error)
    }
  }

  const loadProperties = async () => {
    try {
      const response = await apiClient.get('/properties/my-properties')
      setProperties(response.data.data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : undefined,
        propertyId: formData.propertyId || undefined,
        preferredDate: formData.preferredDate || undefined,
      }

      await apiClient.post('/services/requests', payload)
      alert('Service request submitted successfully!')
      router.push('/services/my-requests')
    } catch (error: any) {
      console.error('Error submitting request:', error)
      alert(error.response?.data?.message || 'Failed to submit service request')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Request Service</h1>
          <p className="text-gray-600 mb-8">
            {contractor
              ? `Submit a service request to ${contractor.companyName}`
              : 'Submit a service request to a contractor'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contractor Selection */}
            {!contractorId && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contractor ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contractorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractorId: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter contractor ID or select from professionals page"
                />
              </div>
            )}

            {/* Property Selection */}
            {user.role === 'OWNER' && properties.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Related Property (Optional)
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyId: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- No Property --</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} - {property.locationCity}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Service Type *
              </label>
              <input
                type="text"
                required
                value={formData.serviceType}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., New Construction, Renovation, Extension"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={6}
                placeholder="Describe your project requirements, specifications, and any important details..."
              />
            </div>

            {/* Urgency & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  City/Location
                </label>
                <input
                  type="text"
                  value={formData.locationCity}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationCity: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Harare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.locationAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationAddress: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Budget (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="10000.00"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ServiceRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading service request form...</div>
        </div>
      }
    >
      <ServiceRequestPageContent />
    </Suspense>
  )
}
