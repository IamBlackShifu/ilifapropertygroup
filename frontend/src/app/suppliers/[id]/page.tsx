'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { suppliersAPI } from '@/lib/api-client'
import { getFirstMediaUrl } from '@/lib/media'
import { getWhatsAppUrl } from '@/lib/utils'
import { ReviewSection } from '@/components/ReviewSection'

type Supplier = {
  id: string
  companyName?: string
  description?: string
  categories?: string[]
  city?: string
  address?: string
  locationCity?: string
  locationAddress?: string
  phone?: string
  email?: string
  website?: string
  websiteUrl?: string
  isVerified?: boolean
  rating?: number
  ratingAverage?: number | string
  ratingCount?: number
  user?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    reviewer?: {
      firstName?: string
      lastName?: string
    }
  }>
  products?: Array<{
    id: string
    name: string
    category?: string
    price: number | string
    images?: string[]
    imageUrls?: string[]
    unit?: string
  }>
}

export default function SupplierDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [supplier, setSupplier] = useState<Supplier | null>(null)

  useEffect(() => {
    const loadSupplier = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        const response = await suppliersAPI.getSupplierById(params.id as string)
        const data = response.data?.data || response.data
        setSupplier(data)
      } catch (supplierError: any) {
        setError(supplierError.response?.data?.message || 'Supplier not found')
      } finally {
        setLoading(false)
      }
    }

    loadSupplier()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full rounded-2xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900">Supplier unavailable</h1>
          <p className="mt-2 text-gray-600">{error || 'We could not load this supplier profile.'}</p>
          <button
            onClick={() => router.push('/marketplace')}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Back to marketplace
          </button>
        </div>
      </div>
    )
  }

  const supplierCity = supplier.locationCity || supplier.city
  const supplierPhone = supplier.user?.phone || supplier.phone
  const supplierEmail = supplier.user?.email || supplier.email
  const supplierWebsite = supplier.websiteUrl || supplier.website
  const supplierRating = supplier.ratingAverage ?? supplier.rating
  const supplierWhatsAppUrl = getWhatsAppUrl(
    supplierPhone,
    `Hello ${supplier.companyName || 'supplier'}, I found your profile on ILifa and would like to chat.`
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Supplier profile</p>
              <h1 className="text-3xl font-bold text-gray-900">{supplier.companyName}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {supplier.isVerified && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">Verified supplier</span>
                )}
                {supplierRating !== undefined && Number(supplierRating) > 0 && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    Rating {Number(supplierRating).toFixed(1)}
                    {supplier.ratingCount ? ` (${supplier.ratingCount})` : ''}
                  </span>
                )}
              </div>
            </div>
            <Link href="/marketplace" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              Back to marketplace
            </Link>
          </div>

          <p className="mt-6 max-w-3xl text-gray-700 whitespace-pre-line">{supplier.description || 'No description provided.'}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">City</p>
              <p className="mt-1 font-semibold text-gray-900">{supplierCity || 'N/A'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Phone</p>
              {supplierWhatsAppUrl ? (
                <a
                  href={supplierWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex font-semibold text-green-700 hover:text-green-800 hover:underline"
                >
                  {supplierPhone}
                </a>
              ) : (
                <p className="mt-1 font-semibold text-gray-900">N/A</p>
              )}
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-semibold text-gray-900 break-words">{supplierEmail || 'N/A'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Website</p>
              <p className="mt-1 font-semibold text-gray-900 break-words">{supplierWebsite || 'N/A'}</p>
            </div>
          </div>
          {supplierWhatsAppUrl && (
            <a
              href={supplierWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>

        <ReviewSection
          entityName={supplier.companyName || 'this supplier'}
          reviewsUrl={`/suppliers/${supplier.id}/reviews`}
          submitUrl={`/suppliers/${supplier.id}/rate`}
          initialReviews={supplier.reviews || []}
          initialRatingAverage={supplierRating}
          initialRatingCount={supplier.ratingCount}
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {supplier.categories && supplier.categories.length > 0 ? (
                supplier.categories.map((category) => (
                  <span key={category} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    {category}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-600">No categories listed.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <span className="text-sm text-gray-500">{supplier.products?.length || 0} listed</span>
            </div>

            <div className="mt-4 space-y-4">
              {supplier.products && supplier.products.length > 0 ? (
                supplier.products.map((product) => {
                  const productImageUrl = getFirstMediaUrl(product.imageUrls || product.images)

                  return (
                    <div key={product.id} className="flex items-center gap-4 rounded-xl border border-gray-200 p-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-blue-50 flex-shrink-0">
                        {productImageUrl ? (
                          <img src={productImageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center px-2 text-center">
                            <span className="text-lg font-bold text-blue-700">{product.name.charAt(0).toUpperCase()}</span>
                            <span className="mt-0.5 max-w-full truncate text-[10px] font-medium uppercase text-blue-500">
                              {product.category?.replace('_', ' ') || 'Product'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500">${Number(product.price).toFixed(2)} {product.unit ? `per ${product.unit}` : ''}</p>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-gray-600">This supplier has not listed any products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
