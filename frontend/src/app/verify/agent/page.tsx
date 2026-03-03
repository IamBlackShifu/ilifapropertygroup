'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyAgentPage() {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR', 'AGENT', 'ADMIN']}>
      <VerifyAgentContent />
    </ProtectedRoute>
  )
}

function VerifyAgentContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    registrationNumber: '',
    yearsOfExperience: '',
    specializations: '',
    certifications: '',
    description: '',
    idDocument: '',
    businessLicense: '',
    insuranceCertificate: '',
    portfolioImages: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement API call
    setTimeout(() => {
      setLoading(false)
      alert('Verification request submitted successfully! We will review your application within 3-5 business days.')
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Professional Verification</h1>
          <p className="mt-2 text-gray-600">
            Get verified as a professional {user?.role === 'AGENT' ? 'agent' : 'contractor'} to build trust with clients
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">Why get verified?</h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Build trust and credibility with potential clients</li>
                <li>• Get a verified badge on your profile</li>
                <li>• Rank higher in search results</li>
                <li>• Access exclusive features and opportunities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          {/* Business Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ABC Construction Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="BR1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Residential Construction, Commercial Buildings, Renovations"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter specializations separated by commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about your business, services, and what makes you unique..."
                />
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications & Licenses
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="List your professional certifications, licenses, and qualifications"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please provide links to your verification documents. You can upload them to cloud storage and share the links.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID / Passport <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="idDocument"
                  value={formData.idDocument}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License / Registration Certificate <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Insurance Certificate
                </label>
                <input
                  type="url"
                  name="insuranceCertificate"
                  value={formData.insuranceCertificate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://drive.google.com/... (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio / Past Projects (Image Links)
                </label>
                <textarea
                  name="portfolioImages"
                  value={formData.portfolioImages}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://image1.jpg, https://image2.jpg (comma-separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide links to images of your completed projects
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-3 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  I confirm that all information provided is accurate and I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:underline">verification terms and conditions</a>
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Footer */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Verification Process</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-xs mr-3 mt-0.5">1</span>
              <div>
                <p className="font-medium text-gray-900">Submit Application</p>
                <p>Complete the form and submit required documents</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-xs mr-3 mt-0.5">2</span>
              <div>
                <p className="font-medium text-gray-900">Document Review</p>
                <p>Our team will verify your credentials (3-5 business days)</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-semibold text-xs mr-3 mt-0.5">3</span>
              <div>
                <p className="font-medium text-gray-900">Get Verified</p>
                <p>Receive your verified badge and enhanced profile features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
