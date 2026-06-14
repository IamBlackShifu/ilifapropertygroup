'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api-client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface ContractorProfile {
  id: string
  companyName?: string
  servicesOffered?: string[]
}

export default function ContractorServicesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [services, setServices] = useState<string[]>([])
  const [serviceInput, setServiceInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user && user.role !== 'CONTRACTOR') {
      router.push('/dashboard')
      return
    }

    const loadProfile = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/contractors/my-profile')
        const contractorProfile = response.data?.data || response.data
        setProfile(contractorProfile)
        setServices(contractorProfile.servicesOffered || [])
      } catch (servicesError: any) {
        if (servicesError.response?.status === 404) {
          setError('Create your contractor profile before adding services.')
        } else {
          setError('Failed to load contractor services.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, user])

  const addService = () => {
    const nextService = serviceInput.trim()
    if (!nextService) return

    const alreadyAdded = services.some((service) => service.toLowerCase() === nextService.toLowerCase())
    if (alreadyAdded) {
      setServiceInput('')
      return
    }

    setServices((current) => [...current, nextService])
    setServiceInput('')
  }

  const removeService = (serviceToRemove: string) => {
    setServices((current) => current.filter((service) => service !== serviceToRemove))
  }

  const saveServices = async () => {
    if (!profile?.id) return

    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await apiClient.patch(`/contractors/${profile.id}`, {
        servicesOffered: services,
      })
      setSuccess('Services saved successfully.')
    } catch (saveError: any) {
      setError(saveError.response?.data?.message || 'Failed to save services.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Contractor services</p>
            <h1 className="break-words text-3xl font-bold text-gray-900">Services</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Manage the services clients see on your contractor profile.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/contractors/portfolio" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white">
              Portfolio
            </Link>
            <Link href="/contractors/profile/edit" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white">
              Edit profile
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
            </div>
          ) : error && !profile ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
              <p className="font-medium text-amber-900">{error}</p>
              <Link href="/contractors/profile/new" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Create contractor profile
              </Link>
            </div>
          ) : (
            <div className="min-w-0 space-y-6">
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
              {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>}

              <div>
                <label htmlFor="service-name" className="mb-2 block text-sm font-medium text-gray-700">
                  Add a service
                </label>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                  <input
                    id="service-name"
                    type="text"
                    value={serviceInput}
                    onChange={(event) => setServiceInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addService()
                      }
                    }}
                    placeholder="e.g. Roofing, plumbing, renovations"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button type="button" onClick={addService} className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 sm:shrink-0">
                    Add
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Services offered</h2>
                  <span className="text-sm text-gray-500">{services.length} listed</span>
                </div>

                {services.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    Add at least one service so clients know what work you can take on.
                  </div>
                ) : (
                  <div className="flex min-w-0 flex-wrap gap-2">
                    {services.map((service) => (
                      <span key={service} className="inline-flex max-w-full items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                        <span className="min-w-0 break-words">{service}</span>
                        <button
                          type="button"
                          onClick={() => removeService(service)}
                          className="shrink-0 rounded-full px-1 text-blue-500 hover:bg-blue-100 hover:text-blue-800"
                          aria-label={`Remove ${service}`}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={saveServices}
                  disabled={saving || !profile}
                  className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? 'Saving...' : 'Save services'}
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
