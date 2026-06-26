'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { suppliersAPI } from '@/lib/api-client'
import { getWhatsAppUrl } from '@/lib/utils'

const PRODUCT_CATEGORIES = [
  { value: 'ALL', label: 'All categories' },
  { value: 'CEMENT', label: 'Cement' },
  { value: 'BRICKS', label: 'Bricks' },
  { value: 'STEEL', label: 'Steel' },
  { value: 'TIMBER', label: 'Timber' },
  { value: 'ROOFING', label: 'Roofing' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PAINT', label: 'Paint' },
  { value: 'TILES', label: 'Tiles' },
  { value: 'DOORS_WINDOWS', label: 'Doors & Windows' },
  { value: 'HARDWARE', label: 'Hardware' },
  { value: 'TOOLS', label: 'Tools' },
  { value: 'OTHER', label: 'Other' },
]

const ZIMBABWE_CITIES = [
  'All cities',
  'Harare',
  'Bulawayo',
  'Chitungwiza',
  'Mutare',
  'Gweru',
  'Kwekwe',
  'Kadoma',
  'Masvingo',
  'Chinhoyi',
  'Norton',
]

interface Supplier {
  id: string
  companyName: string
  description?: string
  categories?: string[]
  locationCity?: string
  phone?: string
  isVerified: boolean
  status?: string
  ratingAverage?: number | string
  ratingCount?: number
  deliveryAvailable?: boolean
  minOrderAmount?: number | string
  _count?: {
    products?: number
    orders?: number
    reviews?: number
  }
  user?: {
    phone?: string
  }
}

interface Product {
  id: string
  category?: string
  price?: number | string
  status?: string
  supplier?: {
    id?: string
    companyName?: string
    locationCity?: string
    isVerified?: boolean
  }
}

const getCategoryLabel = (value: string) =>
  PRODUCT_CATEGORIES.find((category) => category.value === value)?.label || value.replace(/_/g, ' ')

const formatMoney = (value?: number | string) => {
  const amount = Number(value || 0)
  return amount > 0 ? `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'Not set'
}

const isSupplierVerified = (supplier: Pick<Supplier, 'isVerified' | 'status'>) =>
  supplier.isVerified || supplier.status === 'VERIFIED'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [cityFilter, setCityFilter] = useState('All cities')
  const [verifiedOnly, setVerifiedOnly] = useState(true)
  const [deliveryOnly, setDeliveryOnly] = useState(false)

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      setError('')
      const [suppliersResponse, productsResponse] = await Promise.all([
        suppliersAPI.getAllSuppliers(),
        suppliersAPI.searchProducts({}),
      ])

      setSuppliers(suppliersResponse.data || [])
      setProducts(productsResponse.data || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load supplier data')
    } finally {
      setLoading(false)
    }
  }

  const cities = useMemo(() => {
    const dataCities = suppliers
      .map((supplier) => supplier.locationCity)
      .filter((city): city is string => Boolean(city))

    return Array.from(new Set([...ZIMBABWE_CITIES, ...dataCities]))
  }, [suppliers])

  const filteredSuppliers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        supplier.companyName.toLowerCase().includes(query) ||
        supplier.description?.toLowerCase().includes(query) ||
        supplier.categories?.some((category) => getCategoryLabel(category).toLowerCase().includes(query))

      const matchesCategory =
        categoryFilter === 'ALL' || supplier.categories?.includes(categoryFilter)

      const matchesCity =
        cityFilter === 'All cities' || supplier.locationCity?.toLowerCase() === cityFilter.toLowerCase()

      const matchesVerified = !verifiedOnly || isSupplierVerified(supplier)
      const matchesDelivery = !deliveryOnly || supplier.deliveryAvailable

      return matchesSearch && matchesCategory && matchesCity && matchesVerified && matchesDelivery
    })
  }, [categoryFilter, cityFilter, deliveryOnly, searchTerm, suppliers, verifiedOnly])

  const categoryInsights = useMemo(() => {
    return PRODUCT_CATEGORIES.filter((category) => category.value !== 'ALL')
      .map((category) => {
        const suppliersInCategory = suppliers.filter((supplier) => supplier.categories?.includes(category.value))
        const productsInCategory = products.filter((product) => product.category === category.value)
        const prices = productsInCategory.map((product) => Number(product.price)).filter((price) => price > 0)
        const averagePrice = prices.length
          ? prices.reduce((sum, price) => sum + price, 0) / prices.length
          : 0

        return {
          ...category,
          supplierCount: suppliersInCategory.length,
          productCount: productsInCategory.length,
          averagePrice,
        }
      })
      .filter((category) => category.supplierCount > 0 || category.productCount > 0)
      .sort((a, b) => b.productCount + b.supplierCount - (a.productCount + a.supplierCount))
  }, [products, suppliers])

  const stats = useMemo(() => {
    const verifiedCount = suppliers.filter((supplier) => isSupplierVerified(supplier)).length
    const deliveryCount = suppliers.filter((supplier) => supplier.deliveryAvailable).length
    const productCount = products.length || suppliers.reduce((sum, supplier) => sum + (supplier._count?.products || 0), 0)
    const activeCities = new Set(suppliers.map((supplier) => supplier.locationCity).filter(Boolean)).size

    return { verifiedCount, deliveryCount, productCount, activeCities }
  }, [products.length, suppliers])

  const maxInsightValue = Math.max(
    1,
    ...categoryInsights.map((category) => category.productCount + category.supplierCount)
  )

  const resetSupplierFilters = () => {
    setSearchTerm('')
    setCategoryFilter('ALL')
    setCityFilter('All cities')
    setVerifiedOnly(true)
    setDeliveryOnly(false)
  }

  const showVerifiedSuppliers = () => {
    setSearchTerm('')
    setCategoryFilter('ALL')
    setCityFilter('All cities')
    setVerifiedOnly(true)
    setDeliveryOnly(false)
  }

  const showDeliverySuppliers = () => {
    setSearchTerm('')
    setCategoryFilter('ALL')
    setCityFilter('All cities')
    setVerifiedOnly(false)
    setDeliveryOnly(true)
  }

  const showAllCities = () => {
    setSearchTerm('')
    setCategoryFilter('ALL')
    setCityFilter('All cities')
    setVerifiedOnly(false)
    setDeliveryOnly(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-primary-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-100">Supplier network</p>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Find building suppliers without the card clutter</h1>
            <p className="text-lg text-primary-100">
              Search verified material suppliers, compare category coverage, and jump straight to useful supplier details.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <button
            type="button"
            onClick={showVerifiedSuppliers}
            className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.verifiedCount}</p>
            <p className="mt-1 text-sm text-gray-600">Verified suppliers</p>
          </button>
          <Link
            href="/marketplace"
            className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.productCount}</p>
            <p className="mt-1 text-sm text-gray-600">Products listed</p>
          </Link>
          <button
            type="button"
            onClick={showDeliverySuppliers}
            className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.deliveryCount}</p>
            <p className="mt-1 text-sm text-gray-600">Delivery enabled</p>
          </button>
          <button
            type="button"
            onClick={showAllCities}
            className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.activeCities}</p>
            <p className="mt-1 text-sm text-gray-600">Cities covered</p>
          </button>
        </section>

        <section className="mb-8 rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_auto]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search company, category, or description"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
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
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(event) => setVerifiedOnly(event.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Verified
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={deliveryOnly}
                  onChange={(event) => setDeliveryOnly(event.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Delivery
              </label>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Category coverage</h2>
                <Link href="/marketplace" className="text-sm font-medium text-primary-700 hover:text-primary-800">
                  Marketplace
                </Link>
              </div>
              {loading ? (
                <p className="text-sm text-gray-600">Loading category data...</p>
              ) : categoryInsights.length === 0 ? (
                <p className="text-sm text-gray-600">No category data available yet.</p>
              ) : (
                <div className="space-y-4">
                  {categoryInsights.slice(0, 8).map((category) => {
                    const total = category.productCount + category.supplierCount
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setCategoryFilter(category.value)}
                        className="block w-full text-left"
                      >
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-800">{category.label}</span>
                          <span className="text-gray-500">{category.productCount} products</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-primary-600"
                            style={{ width: `${Math.max(8, (total / maxInsightValue) * 100)}%` }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick category pricing</h2>
              <div className="space-y-3">
                {categoryInsights.slice(0, 6).map((category) => (
                  <div key={category.value} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.label}</p>
                      <p className="text-xs text-gray-500">{category.supplierCount} supplier{category.supplierCount === 1 ? '' : 's'}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatMoney(category.averagePrice)}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <section className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Suppliers</h2>
                <p className="text-sm text-gray-600">{filteredSuppliers.length} matching supplier{filteredSuppliers.length === 1 ? '' : 's'}</p>
              </div>
              <button
                type="button"
                onClick={resetSupplierFilters}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset filters
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-gray-600">Loading suppliers...</div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-sm font-semibold text-gray-900">No suppliers match those filters</h3>
                <p className="mt-1 text-sm text-gray-600">Try another city or category.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredSuppliers.map((supplier) => {
                  const supplierPhone = supplier.user?.phone || supplier.phone
                  const supplierWhatsAppUrl = getWhatsAppUrl(
                    supplierPhone,
                    `Hello ${supplier.companyName}, I found your supplier profile on ILifa and would like to chat.`
                  )

                  return (
                    <article key={supplier.id} className="p-5 hover:bg-gray-50">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{supplier.companyName}</h3>
                            {isSupplierVerified(supplier) && (
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Verified</span>
                            )}
                            {supplier.deliveryAvailable && (
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">Delivery</span>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm text-gray-600">{supplier.description || 'No supplier description provided yet.'}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(supplier.categories || []).slice(0, 4).map((category) => (
                              <span key={category} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                {getCategoryLabel(category)}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid min-w-[260px] grid-cols-2 gap-3 text-sm lg:text-right">
                          <div>
                            <p className="text-gray-500">City</p>
                            <p className="font-medium text-gray-900">{supplier.locationCity || 'Not listed'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Products</p>
                            <p className="font-medium text-gray-900">{supplier._count?.products || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rating</p>
                            <p className="font-medium text-gray-900">
                              {Number(supplier.ratingAverage) > 0 ? Number(supplier.ratingAverage).toFixed(1) : 'New'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Minimum</p>
                            <p className="font-medium text-gray-900">{formatMoney(supplier.minOrderAmount)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                        >
                          View supplier
                        </Link>
                        <Link
                          href={`/marketplace?supplier=${supplier.id}`}
                          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
                        >
                          View products
                        </Link>
                        {supplierWhatsAppUrl && (
                          <a
                            href={supplierWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            WhatsApp supplier
                          </a>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
