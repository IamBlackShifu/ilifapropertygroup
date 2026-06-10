'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { propertiesAPI, suppliersAPI } from '@/lib/api-client'

interface PropertyListing {
  id: string
  price?: number | string
  propertyType?: string
  locationCity?: string
  locationArea?: string
  sizeSqm?: number | string
  viewCount?: number
  status?: string
  isVerified?: boolean
}

interface Product {
  id: string
  name?: string
  category?: string
  price?: number | string
  unit?: string
  stockQuantity?: number
  supplier?: {
    id?: string
    companyName?: string
    locationCity?: string
    isVerified?: boolean
  }
}

interface Supplier {
  id: string
  categories?: string[]
  locationCity?: string
  isVerified?: boolean
  deliveryAvailable?: boolean
  _count?: {
    products?: number
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  CEMENT: 'Cement',
  BRICKS: 'Bricks',
  STEEL: 'Steel',
  TIMBER: 'Timber',
  ROOFING: 'Roofing',
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  PAINT: 'Paint',
  TILES: 'Tiles',
  DOORS_WINDOWS: 'Doors & Windows',
  HARDWARE: 'Hardware',
  TOOLS: 'Tools',
  OTHER: 'Other',
}

const formatMoney = (value?: number | string, options?: Intl.NumberFormatOptions) => {
  const amount = Number(value || 0)
  if (!Number.isFinite(amount) || amount <= 0) return 'No data'

  return `$${amount.toLocaleString(undefined, {
    maximumFractionDigits: 0,
    ...options,
  })}`
}

const getAverage = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

export default function MarketInsightsPage() {
  const [properties, setProperties] = useState<PropertyListing[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMarketData()
  }, [])

  const loadMarketData = async () => {
    try {
      setLoading(true)
      setError('')

      const [propertiesResponse, productsResponse, suppliersResponse] = await Promise.all([
        propertiesAPI.getAll({ limit: 100 }),
        suppliersAPI.searchProducts({}),
        suppliersAPI.getAllSuppliers({ isVerified: true }),
      ])

      const propertyPayload = propertiesResponse.data as any
      setProperties(Array.isArray(propertyPayload) ? propertyPayload : propertyPayload?.data || [])
      setProducts(productsResponse.data || [])
      setSuppliers(suppliersResponse.data || [])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load market insights')
    } finally {
      setLoading(false)
    }
  }

  const insights = useMemo(() => {
    const propertyPrices = properties.map((property) => Number(property.price)).filter((price) => price > 0)
    const landPrices = properties
      .filter((property) => property.propertyType === 'LAND')
      .map((property) => Number(property.price))
      .filter((price) => price > 0)

    const buildProducts = products.map((product) => Number(product.price)).filter((price) => price > 0)
    const verifiedProperties = properties.filter((property) => property.isVerified).length
    const deliverySuppliers = suppliers.filter((supplier) => supplier.deliveryAvailable).length

    const propertyByCity = Object.values(
      properties.reduce<Record<string, { city: string; count: number; prices: number[]; views: number }>>((acc, property) => {
        const city = property.locationCity || 'Unlisted'
        const price = Number(property.price)
        if (!acc[city]) acc[city] = { city, count: 0, prices: [], views: 0 }
        acc[city].count += 1
        acc[city].views += property.viewCount || 0
        if (price > 0) acc[city].prices.push(price)
        return acc
      }, {})
    )
      .map((item) => ({
        ...item,
        averagePrice: getAverage(item.prices),
      }))
      .sort((a, b) => b.count + b.views - (a.count + a.views))

    const materialIndex = Object.values(
      products.reduce<Record<string, { category: string; count: number; prices: number[]; stock: number }>>((acc, product) => {
        const category = product.category || 'OTHER'
        const price = Number(product.price)
        if (!acc[category]) acc[category] = { category, count: 0, prices: [], stock: 0 }
        acc[category].count += 1
        acc[category].stock += product.stockQuantity || 0
        if (price > 0) acc[category].prices.push(price)
        return acc
      }, {})
    )
      .map((item) => ({
        category: item.category,
        label: CATEGORY_LABELS[item.category] || item.category.replace(/_/g, ' '),
        count: item.count,
        stock: item.stock,
        averagePrice: getAverage(item.prices),
      }))
      .sort((a, b) => b.count - a.count)

    const supplierByCity = Object.values(
      suppliers.reduce<Record<string, { city: string; count: number; delivery: number }>>((acc, supplier) => {
        const city = supplier.locationCity || 'Unlisted'
        if (!acc[city]) acc[city] = { city, count: 0, delivery: 0 }
        acc[city].count += 1
        if (supplier.deliveryAvailable) acc[city].delivery += 1
        return acc
      }, {})
    ).sort((a, b) => b.count - a.count)

    const totalProducts = products.length || suppliers.reduce((sum, supplier) => sum + (supplier._count?.products || 0), 0)

    return {
      averagePropertyPrice: getAverage(propertyPrices),
      averageLandPrice: getAverage(landPrices),
      averageMaterialPrice: getAverage(buildProducts),
      verifiedProperties,
      deliverySuppliers,
      propertyByCity,
      materialIndex,
      supplierByCity,
      totalProducts,
    }
  }, [products, properties, suppliers])

  const maxCityCount = Math.max(1, ...insights.propertyByCity.map((city) => city.count + city.views))
  const maxMaterialCount = Math.max(1, ...insights.materialIndex.map((material) => material.count))
  const maxSupplierCityCount = Math.max(1, ...insights.supplierByCity.map((city) => city.count))

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-primary-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-100">Live marketplace data</p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Market Insights & Analytics</h1>
          <p className="max-w-3xl text-lg text-primary-100">
            Property, supplier, and material signals calculated from listings already in ZimBuild Hub.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: 'Average property price', value: formatMoney(insights.averagePropertyPrice), detail: `${properties.length} listings sampled` },
            { label: 'Average land price', value: formatMoney(insights.averageLandPrice), detail: 'LAND listings only' },
            { label: 'Average material price', value: formatMoney(insights.averageMaterialPrice), detail: `${insights.totalProducts} products sampled` },
            { label: 'Delivery suppliers', value: loading ? '...' : insights.deliverySuppliers, detail: `${suppliers.length} verified suppliers` },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm text-gray-600">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{loading ? '...' : metric.value}</p>
              <p className="mt-1 text-xs text-gray-500">{metric.detail}</p>
            </div>
          ))}
        </section>

        <section className="mb-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Property demand by city</h2>
                <p className="mt-1 text-sm text-gray-600">Listing volume plus recorded view activity.</p>
              </div>
              <Link href="/buy-property" className="text-sm font-medium text-primary-700 hover:text-primary-800">
                Listings
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-gray-600">Loading property chart...</p>
            ) : insights.propertyByCity.length === 0 ? (
              <p className="text-sm text-gray-600">No property listings available yet.</p>
            ) : (
              <div className="space-y-4">
                {insights.propertyByCity.slice(0, 8).map((city) => {
                  const signal = city.count + city.views
                  return (
                    <div key={city.city}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-gray-900">{city.city}</span>
                        <span className="text-gray-600">{city.count} listings, avg {formatMoney(city.averagePrice)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100">
                        <div
                          className="h-3 rounded-full bg-primary-600"
                          style={{ width: `${Math.max(6, (signal / maxCityCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Material category index</h2>
                <p className="mt-1 text-sm text-gray-600">Product depth and average listed unit price.</p>
              </div>
              <Link href="/marketplace" className="text-sm font-medium text-primary-700 hover:text-primary-800">
                Marketplace
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-gray-600">Loading material chart...</p>
            ) : insights.materialIndex.length === 0 ? (
              <p className="text-sm text-gray-600">No product data available yet.</p>
            ) : (
              <div className="space-y-4">
                {insights.materialIndex.slice(0, 8).map((material) => (
                  <div key={material.category}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-gray-900">{material.label}</span>
                      <span className="text-gray-600">{material.count} items, avg {formatMoney(material.averagePrice)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100">
                      <div
                        className="h-3 rounded-full bg-emerald-600"
                        style={{ width: `${Math.max(6, (material.count / maxMaterialCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Supplier coverage by city</h2>
            {loading ? (
              <p className="text-sm text-gray-600">Loading supplier coverage...</p>
            ) : insights.supplierByCity.length === 0 ? (
              <p className="text-sm text-gray-600">No supplier coverage data available yet.</p>
            ) : (
              <div className="space-y-4">
                {insights.supplierByCity.slice(0, 8).map((city) => (
                  <div key={city.city}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{city.city}</span>
                      <span className="text-gray-600">{city.count} suppliers, {city.delivery} deliver</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100">
                      <div
                        className="h-3 rounded-full bg-amber-500"
                        style={{ width: `${Math.max(6, (city.count / maxSupplierCityCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">Data health</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Verified property listings</span>
                <span className="font-semibold text-gray-900">{loading ? '...' : insights.verifiedProperties}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Supplier records</span>
                <span className="font-semibold text-gray-900">{loading ? '...' : suppliers.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Product records</span>
                <span className="font-semibold text-gray-900">{loading ? '...' : products.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Property records</span>
                <span className="font-semibold text-gray-900">{loading ? '...' : properties.length}</span>
              </div>
            </div>
            <p className="mt-6 text-xs leading-5 text-gray-500">
              These figures are calculated from available platform listings. They will become more representative as more suppliers, products, and properties are added.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
