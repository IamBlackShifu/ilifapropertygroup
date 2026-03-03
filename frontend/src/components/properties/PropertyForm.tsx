'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PropertyFormProps {
  initialData?: any
  isEdit?: boolean
}

const PROPERTY_TYPES = [
  { value: 'LAND', label: 'Land' },
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

export default function PropertyForm({ initialData, isEdit = false }: PropertyFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images?.map((img: any) => img.imageUrl) || [])
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    propertyType: initialData?.propertyType || 'HOUSE',
    price: initialData?.price || '',
    currency: initialData?.currency || 'USD',
    locationCity: initialData?.locationCity || '',
    locationArea: initialData?.locationArea || '',
    locationAddress: initialData?.locationAddress || '',
    coordinatesLat: initialData?.coordinatesLat || '',
    coordinatesLng: initialData?.coordinatesLng || '',
    sizeSqm: initialData?.sizeSqm || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (files.length > 10) {
      setError('Maximum 10 images allowed')
      return
    }

    setUploadingImages(true)
    setError('')

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        console.log('📎 Appending file:', file.name, file.type, file.size)
        formData.append('files', file)
      })

      console.log('📤 Sending upload request to backend...')
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:4000/api/files/upload/property-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      console.log('📥 Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Upload successful:', data)
        setImageUrls([...imageUrls, ...data.data.imageUrls])
      } else {
        const errorData = await response.json()
        console.error('❌ Upload failed:', errorData)
        setError(errorData.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      setError('An error occurred while uploading images')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || !formData.locationCity) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Prepare data
      const propertyData: any = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        price: parseFloat(formData.price),
        currency: formData.currency,
        locationCity: formData.locationCity,
        images: imageUrls,
      }

      // Add optional fields if provided
      if (formData.locationArea) propertyData.locationArea = formData.locationArea
      if (formData.locationAddress) propertyData.locationAddress = formData.locationAddress
      if (formData.coordinatesLat) propertyData.coordinatesLat = parseFloat(formData.coordinatesLat)
      if (formData.coordinatesLng) propertyData.coordinatesLng = parseFloat(formData.coordinatesLng)
      if (formData.sizeSqm) propertyData.sizeSqm = parseFloat(formData.sizeSqm)
      if (formData.bedrooms) propertyData.bedrooms = parseInt(formData.bedrooms)
      if (formData.bathrooms) propertyData.bathrooms = parseInt(formData.bathrooms)

      const token = localStorage.getItem('accessToken')
      const url = isEdit 
        ? `http://localhost:4000/api/properties/${initialData.id}`
        : 'http://localhost:4000/api/properties'
      
      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      })

      if (response.ok) {
        router.push('/my-properties')
      } else {
        const errorData = await response.json()
        setError(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} property`)
      }
    } catch (error) {
      setError(`An error occurred while ${isEdit ? 'updating' : 'creating'} the property`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Beautiful 3 Bedroom House in Borrowdale"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your property in detail (minimum 50 characters)..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/50 characters minimum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="ZWL">ZWL</option>
                </select>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="250000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (sqm)
            </label>
            <input
              type="number"
              name="sizeSqm"
              value={formData.sizeSqm}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locationCity"
                value={formData.locationCity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Harare"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area/Suburb
              </label>
              <input
                type="text"
                name="locationArea"
                value={formData.locationArea}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Borrowdale"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>
            <input
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                name="coordinatesLat"
                value={formData.coordinatesLat}
                onChange={handleChange}
                step="0.000001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="-17.8252"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                name="coordinatesLng"
                value={formData.coordinatesLng}
                onChange={handleChange}
                step="0.000001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="31.0335"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Images</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload up to 10 images. First image will be used as the primary image.
        </p>

        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImages || imageUrls.length >= 10}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploadingImages ? 'Uploading...' : '+ Add Images'}
          </button>
        </div>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={`http://localhost:4000${url}`}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
