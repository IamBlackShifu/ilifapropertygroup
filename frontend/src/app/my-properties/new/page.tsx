'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PropertyForm from '@/components/properties/PropertyForm'

export default function NewPropertyPage() {
  return (
    <ProtectedRoute allowedRoles={['OWNER', 'AGENT', 'ADMIN']}>
      <NewPropertyContent />
    </ProtectedRoute>
  )
}

function NewPropertyContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/my-properties"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">List New Property</h1>
          <p className="mt-2 text-gray-600">Fill in the details to list your property. Your property will be saved as a draft until you submit it for verification.</p>
        </div>

        <PropertyForm />
      </div>
    </div>
  )
}
