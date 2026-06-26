'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { suppliersAPI } from '@/lib/api-client'
import { getFirstMediaUrl } from '@/lib/media'
import { getWhatsAppUrl } from '@/lib/utils'

type Product = {
  id: string
  name: string
  description?: string
  category?: string
  price?: number | string
  stockQuantity?: number
  unit?: string
  minOrderQuantity?: number
  status?: string
  images?: string[]
  imageUrls?: string[]
  specifications?: Record<string, string>
  supplier?: {
    id: string
    companyName?: string
    city?: string
    address?: string
    locationCity?: string
    locationAddress?: string
    isVerified?: boolean
    phone?: string
    user?: {
      phone?: string
    }
  }
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        const response = await suppliersAPI.getProductById(params.id as string)
        const data = response.data?.data || response.data
        setProduct(data)
      } catch (productError: any) {
        setError(productError.response?.data?.message || 'Product not found')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full rounded-2xl bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product unavailable</h1>
          <p className="mt-2 text-gray-600">{error || 'We could not load this product.'}</p>
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

  const price = typeof product.price === 'number' ? product.price : Number(product.price || 0)
  const primaryImage = getFirstMediaUrl(product.imageUrls || product.images)
  const supplierLocation = [
    product.supplier?.locationAddress || product.supplier?.address,
    product.supplier?.locationCity || product.supplier?.city,
  ].filter(Boolean).join(', ')
  const supplierPhone = product.supplier?.user?.phone || product.supplier?.phone
  const supplierWhatsAppUrl = getWhatsAppUrl(
    supplierPhone,
    `Hello ${product.supplier?.companyName || 'supplier'}, I am interested in ${product.name} on ILifa.`
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Product details</p>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>
          <Link href="/marketplace" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-white">
            Back to marketplace
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
            <div className="overflow-hidden rounded-xl bg-gray-100">
              {primaryImage ? (
                <img src={primaryImage} alt={product.name} className="h-[28rem] w-full object-cover" />
              ) : (
                <div className="flex h-[28rem] items-center justify-center text-gray-400">
                  No product image available
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {product.category || 'Uncategorized'}
                </span>
                {product.status && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    {product.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              <p className="mt-4 text-gray-700 whitespace-pre-line">{product.description || 'No description provided.'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-4xl font-bold text-blue-700">${price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="text-lg font-semibold text-gray-900">{product.stockQuantity ?? 0} {product.unit || ''}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-gray-500">Minimum order</p>
                  <p className="mt-1 font-semibold text-gray-900">{product.minOrderQuantity || 1} {product.unit || ''}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-gray-500">Category</p>
                  <p className="mt-1 font-semibold text-gray-900">{product.category || 'N/A'}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 col-span-2">
                  <p className="text-gray-500">Supplier location</p>
                  <p className="mt-1 font-semibold text-gray-900">{supplierLocation || 'Location not provided'}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={product.supplier?.id ? `/suppliers/${product.supplier.id}` : '/marketplace'}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700"
                >
                  View Supplier
                </Link>
                <Link
                  href="/marketplace"
                  className="rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-700 hover:bg-gray-50"
                >
                  Browse More
                </Link>
              </div>
              {supplierWhatsAppUrl && (
                <a
                  href={supplierWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white hover:bg-green-700"
                >
                  Chat with Supplier on WhatsApp
                </a>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Supplier</h2>
              {product.supplier ? (
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{product.supplier.companyName || 'Supplier company'}</p>
                  <p>{supplierLocation || 'Location not provided'}</p>
                  {supplierPhone && <p>{supplierPhone}</p>}
                  <p>{product.supplier.isVerified ? 'Verified supplier' : 'Unverified supplier'}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-600">Supplier information is not available for this item.</p>
              )}
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                <dl className="mt-4 space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="text-sm font-medium text-gray-900 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
