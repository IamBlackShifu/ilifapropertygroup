'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api-client'

export default function EditContractorProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileId, setProfileId] = useState('')
  const [servicesInput, setServicesInput] = useState('')
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

  useEffect(() => {
    if (user && user.role !== 'CONTRACTOR') {
      router.push('/dashboard')
      return
    }

    const loadProfile = async () => {
      try {
        const response = await apiClient.get('/contractors/my-profile')
        const profile = response.data?.data || response.data
        setProfileId(profile.id)
        setFormData({
          companyName: profile.companyName || '',
          registrationNumber: profile.registrationNumber || '',
          description: profile.description || '',
          servicesOffered: profile.servicesOffered || [],
          yearsExperience: profile.yearsExperience || 0,
          employeesCount: profile.employeesCount || 0,
          locationCity: profile.locationCity || '',
          locationAddress: profile.locationAddress || '',
        })
      } catch (profileError: any) {
        if (profileError.response?.status === 404) {
          router.push('/contractors/profile/new')
          return
        }

        setError('Failed to load contractor profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, router])

  const addService = () => {
    const service = servicesInput.trim()
    if (!service || formData.servicesOffered.includes(service)) return

    setFormData((previous) => ({
      ...previous,
      servicesOffered: [...previous.servicesOffered, service],
    }))
    setServicesInput('')
  }

  const removeService = (service: string) => {
    setFormData((previous) => ({
      ...previous,
      servicesOffered: previous.servicesOffered.filter((item) => item !== service),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await apiClient.patch(`/contractors/${profileId}`, {
        ...formData,
        yearsExperience: Number(formData.yearsExperience) || 0,
        employeesCount: Number(formData.employeesCount) || 0,
      })

      setSuccess('Profile updated successfully')
      setTimeout(() => {
        router.push('/contractors/dashboard')
      }, 1000)
    } catch (submitError: any) {
      setError(submitError.response?.data?.message || 'Failed to update contractor profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Contractor profile</p>
            <h1 className="text-3xl font-bold text-gray-900">Edit Company Profile</h1>
            <p className="mt-2 text-gray-600">Keep your company details current so clients can find and trust your business.</p>
          </div>
          <Link href="/contractors/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-white">
            Back to dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
          {success && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(event) => setFormData({ ...formData, companyName: event.target.value })}
                  placeholder="BuildRight Contractors"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(event) => setFormData({ ...formData, registrationNumber: event.target.value })}
                  placeholder="REG-2026-001"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                placeholder="Describe your business, specialties, and service area"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <label className="block text-sm font-medium text-gray-700">Services Offered *</label>
                <span className="text-xs text-gray-500">Add every service you regularly offer.</span>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(event) => setServicesInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addService()
                    }
                  }}
                  placeholder="e.g. Roofing, Renovations, Plumbing"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button type="button" onClick={addService} className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.servicesOffered.length === 0 ? (
                  <p className="text-sm text-gray-500">Add at least one service to continue.</p>
                ) : (
                  formData.servicesOffered.map((service) => (
                    <span key={service} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                      {service}
                      <button type="button" onClick={() => removeService(service)} className="text-blue-500 hover:text-blue-700">
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(event) => setFormData({ ...formData, yearsExperience: Number(event.target.value) || 0 })}
                  placeholder="10"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees</label>
                <input
                  type="number"
                  min="0"
                  value={formData.employeesCount}
                  onChange={(event) => setFormData({ ...formData, employeesCount: Number(event.target.value) || 0 })}
                  placeholder="25"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.locationCity}
                  onChange={(event) => setFormData({ ...formData, locationCity: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Harare"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.locationAddress}
                  onChange={(event) => setFormData({ ...formData, locationAddress: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push('/contractors/dashboard')}
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}