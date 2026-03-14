'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api-client'

export default function CreateContractorProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    description: '',
    servicesOffered: [] as string[],
    yearsExperience: 0,
    employeesCount: 0,
    locationCity: '',
    locationAddress: '',
  })

  const [serviceInput, setServiceInput] = useState('')

  const handleAddService = () => {
    if (serviceInput.trim() && !formData.servicesOffered.includes(serviceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        servicesOffered: [...prev.servicesOffered, serviceInput.trim()]
      }))
      setServiceInput('')
    }
  }

  const handleRemoveService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter(s => s !== service)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.post('/contractors/my-profile', formData)
      alert('Profile created successfully! Your profile is pending verification.')
      router.push('/contractors/dashboard')
    } catch (error: any) {
      console.error('Failed to create profile:', error)
      alert(error.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'CONTRACTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p>Only contractors can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Contractor Profile</h1>
          <p className="text-gray-600 mb-8">
            Complete your profile to start receiving project opportunities
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Company Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="REG-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe your company, expertise, and what sets you apart..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.employeesCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeesCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Services Offered *</h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., New Construction, Renovation, etc."
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {formData.servicesOffered.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.servicesOffered.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                      >
                        <span>{service}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.servicesOffered.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Add at least one service to continue
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.locationCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationCity: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>
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
                disabled={loading || formData.servicesOffered.length === 0}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
