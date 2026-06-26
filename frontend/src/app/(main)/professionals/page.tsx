'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api-client'

interface Contractor {
  id: string
  companyName: string
  description?: string
  servicesOffered?: string[]
  locationCity?: string
  isVerified: boolean
  ratingAverage?: string | number
  ratingCount?: number
  yearsExperience?: number
  status?: string
  user?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

const ALL_SERVICES = 'All services'
const ALL_CITIES = 'All cities'

const formatService = (service: string) =>
  service
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const getRating = (contractor: Contractor) => Number(contractor.ratingAverage || 0)

const isContractorVerified = (contractor: Contractor) =>
  contractor.isVerified || contractor.status === 'VERIFIED'

export default function ProfessionalsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [serviceFilter, setServiceFilter] = useState(ALL_SERVICES)
  const [cityFilter, setCityFilter] = useState(ALL_CITIES)

  useEffect(() => {
    loadContractors()
  }, [])

  const loadContractors = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiClient.get('/contractors', {
        params: { status: 'VERIFIED', limit: 50 },
      })
      setContractors(response.data?.data || response.data || [])
    } catch (loadError: any) {
      console.error('Error loading contractors:', loadError)
      setError(loadError.response?.data?.message || 'Could not load professionals right now.')
    } finally {
      setLoading(false)
    }
  }

  const services = useMemo(() => {
    const serviceValues = contractors.flatMap((contractor) => contractor.servicesOffered || [])
    return [ALL_SERVICES, ...Array.from(new Set(serviceValues)).sort()]
  }, [contractors])

  const cities = useMemo(() => {
    const cityValues = contractors
      .map((contractor) => contractor.locationCity)
      .filter((city): city is string => Boolean(city))
    return [ALL_CITIES, ...Array.from(new Set(cityValues)).sort()]
  }, [contractors])

  const filteredContractors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return contractors.filter((contractor) => {
      const servicesOffered = contractor.servicesOffered || []
      const matchesSearch =
        !query ||
        contractor.companyName.toLowerCase().includes(query) ||
        contractor.description?.toLowerCase().includes(query) ||
        contractor.locationCity?.toLowerCase().includes(query) ||
        servicesOffered.some((service) => formatService(service).toLowerCase().includes(query))

      const matchesService =
        serviceFilter === ALL_SERVICES || servicesOffered.includes(serviceFilter)

      const matchesCity =
        cityFilter === ALL_CITIES || contractor.locationCity?.toLowerCase() === cityFilter.toLowerCase()

      return matchesSearch && matchesService && matchesCity
    })
  }, [cityFilter, contractors, searchTerm, serviceFilter])

  const stats = useMemo(() => {
    const verifiedCount = contractors.filter(isContractorVerified).length
    const cityCount = new Set(contractors.map((contractor) => contractor.locationCity).filter(Boolean)).size
    const reviewedCount = contractors.filter((contractor) => (contractor.ratingCount || 0) > 0).length
    const serviceCount = new Set(contractors.flatMap((contractor) => contractor.servicesOffered || [])).size

    return { verifiedCount, cityCount, reviewedCount, serviceCount }
  }, [contractors])

  const highlightedContractors = useMemo(() => {
    return [...contractors]
      .filter((contractor) => getRating(contractor) > 0 || (contractor.ratingCount || 0) > 0)
      .sort((a, b) => getRating(b) - getRating(a))
      .slice(0, 3)
  }, [contractors])

  const resetFilters = () => {
    setSearchTerm('')
    setServiceFilter(ALL_SERVICES)
    setCityFilter(ALL_CITIES)
  }

  return (
    <div className="bg-gray-50">
      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">Professionals</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Find verified contractors and builders.</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-200">
                Search by trade, company, or city, then open a contractor profile before sending a service request.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.verifiedCount}</p>
                <p className="mt-1 text-sm text-gray-300">Verified</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.serviceCount}</p>
                <p className="mt-1 text-sm text-gray-300">Service types</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.cityCount}</p>
                <p className="mt-1 text-sm text-gray-300">Cities</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.reviewedCount}</p>
                <p className="mt-1 text-sm text-gray-300">With reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px_auto]">
            <input
              type="search"
              placeholder="Search company, service, description, or city"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              value={serviceFilter}
              onChange={(event) => setServiceFilter(event.target.value)}
              aria-label="Filter by service"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service === ALL_SERVICES ? service : formatService(service)}
                </option>
              ))}
            </select>
            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              aria-label="Filter by city"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>
              <button type="button" onClick={loadContractors} className="font-semibold text-red-800 hover:underline">
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-950">Contractor Directory</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {loading ? 'Loading contractors...' : `${filteredContractors.length} matching professional${filteredContractors.length === 1 ? '' : 's'}`}
                </p>
              </div>
              <Link href="/build-home" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                Build-home guide
              </Link>
            </div>

            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-600 shadow-sm">
                Loading verified professionals...
              </div>
            ) : filteredContractors.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-gray-950">No professionals match those filters</h3>
                <p className="mt-2 text-sm text-gray-600">Try another city, service, or search term.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContractors.map((contractor) => {
                  const servicesOffered = contractor.servicesOffered || []
                  const rating = getRating(contractor)
                  const ratingCount = contractor.ratingCount || 0

                  return (
                    <article key={contractor.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-950">{contractor.companyName}</h3>
                            {isContractorVerified(contractor) && (
                              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{contractor.locationCity || 'Zimbabwe'}</p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                            {contractor.description || 'No professional description has been provided yet.'}
                          </p>

                          {servicesOffered.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {servicesOffered.slice(0, 5).map((service) => (
                                <span key={service} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                  {formatService(service)}
                                </span>
                              ))}
                              {servicesOffered.length > 5 && (
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                                  +{servicesOffered.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="grid min-w-[190px] grid-cols-2 gap-3 text-sm md:text-right">
                          <div>
                            <p className="text-gray-500">Rating</p>
                            <p className="font-semibold text-gray-950">
                              {rating > 0 ? rating.toFixed(1) : 'New'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Reviews</p>
                            <p className="font-semibold text-gray-950">{ratingCount}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Experience</p>
                            <p className="font-semibold text-gray-950">
                              {contractor.yearsExperience ? `${contractor.yearsExperience} years` : 'Not listed'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/contractor/${contractor.id}`}
                          className="rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700"
                        >
                          View Profile
                        </Link>
                        <Link
                          href={`/services/request?contractorId=${contractor.id}`}
                          className="rounded-md border border-primary-600 px-4 py-2 text-center text-sm font-semibold text-primary-700 hover:bg-primary-50"
                        >
                          Request Service
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-950">How to choose</h2>
              <div className="mt-4 space-y-4">
                {[
                  'Open the profile and review services, city, and experience.',
                  'Use Request Service only after choosing a contractor.',
                  'Keep project scope, location, budget, and timing ready.',
                  'For diaspora work, prefer written WhatsApp follow-up after the request.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-gray-600">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {highlightedContractors.length > 0 && (
              <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-950">Reviewed professionals</h2>
                <div className="mt-4 space-y-4">
                  {highlightedContractors.map((contractor) => (
                    <Link
                      key={contractor.id}
                      href={`/contractor/${contractor.id}`}
                      className="block rounded-md border border-gray-100 p-4 hover:border-primary-200 hover:bg-primary-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-950">{contractor.companyName}</p>
                          <p className="mt-1 text-xs text-gray-500">{contractor.locationCity || 'Zimbabwe'}</p>
                        </div>
                        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                          {getRating(contractor).toFixed(1)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-lg bg-gray-950 p-5 text-white shadow-sm">
              <h2 className="text-lg font-semibold">Not ready to pick a contractor?</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Start with the build-home guide to understand whether you need land, professionals, suppliers, or diaspora support first.
              </p>
              <Link href="/build-home" className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-amber-50">
                Open Build Guide
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
