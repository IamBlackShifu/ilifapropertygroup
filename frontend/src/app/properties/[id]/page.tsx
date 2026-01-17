'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { propertiesAPI } from '@/lib/api/properties';
import { Property, PropertyStatus } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await propertiesAPI.getProperty(params.id);
      setProperty(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch property details');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      setActionLoading(true);
      await propertiesAPI.deleteProperty(params.id);
      alert('Property deleted successfully');
      router.push('/my-properties');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForVerification = async () => {
    try {
      setActionLoading(true);
      await propertiesAPI.submitForVerification(params.id);
      alert('Property submitted for verification');
      fetchProperty();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setActionLoading(true);
      await propertiesAPI.verifyProperty(params.id);
      alert('Property verified successfully');
      fetchProperty();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsReserved = async () => {
    try {
      setActionLoading(true);
      await propertiesAPI.markAsReserved(params.id);
      alert('Property marked as reserved');
      fetchProperty();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark as reserved');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      setActionLoading(true);
      await propertiesAPI.markAsSold(params.id);
      alert('Property marked as sold');
      fetchProperty();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark as sold');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const getStatusBadge = (status: PropertyStatus) => {
    const badges = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      RESERVED: 'bg-blue-100 text-blue-800',
      SOLD: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded ${badges[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const previousImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This property does not exist'}</p>
          <Link href="/properties" className="btn-primary px-6 py-3 rounded-lg">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.userId === property.ownerId;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/properties" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Properties
        </Link>

        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 mb-2">
                📍 {property.locationCity}{property.locationArea ? `, ${property.locationArea}` : ''}
              </p>
              {property.locationAddress && (
                <p className="text-gray-500 text-sm">{property.locationAddress}</p>
              )}
            </div>
            <div className="text-right">
              {getStatusBadge(property.status)}
              <p className="text-3xl font-bold text-primary-600 mt-2">{formatPrice(property.price)}</p>
              <p className="text-gray-500 text-sm">{property.viewCount || 0} views</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={property.images[currentImageIndex].imageUrl}
                    alt={property.title}
                    className="w-full h-96 object-cover"
                  />
                  
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        →
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {property.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="font-semibold text-gray-900">{property.propertyType}</p>
                </div>
                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Bedrooms</p>
                    <p className="font-semibold text-gray-900">🛏️ {property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Bathrooms</p>
                    <p className="font-semibold text-gray-900">🚿 {property.bathrooms}</p>
                  </div>
                )}
                {property.sizeSqm && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Size</p>
                    <p className="font-semibold text-gray-900">📐 {property.sizeSqm}m²</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Owner</h3>
              <div className="flex items-center gap-3 mb-4">
                {property.owner?.profileImageUrl ? (
                  <img
                    src={property.owner.profileImageUrl}
                    alt={`${property.owner.firstName} ${property.owner.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    {property.owner?.firstName?.[0]}{property.owner?.lastName?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {property.owner?.firstName} {property.owner?.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">{property.owner?.email}</p>
                </div>
              </div>
              {property.owner?.phone && (
                <p className="text-gray-600">📞 {property.owner.phone}</p>
              )}
            </div>

            {/* Action Buttons */}
            {(isOwner || isAdmin) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  {isOwner && (
                    <>
                      <Link
                        href={`/properties/edit/${property.id}`}
                        className="block w-full text-center btn-primary px-4 py-2 rounded-lg"
                      >
                        Edit Property
                      </Link>

                      {property.status === PropertyStatus.DRAFT && (
                        <button
                          onClick={handleSubmitForVerification}
                          disabled={actionLoading}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Submit for Verification
                        </button>
                      )}

                      <button
                        onClick={handleDelete}
                        disabled={actionLoading}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete Property
                      </button>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      {property.status === PropertyStatus.PENDING_VERIFICATION && (
                        <button
                          onClick={handleVerify}
                          disabled={actionLoading}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Verify Property
                        </button>
                      )}

                      {property.status === PropertyStatus.VERIFIED && (
                        <>
                          <button
                            onClick={handleMarkAsReserved}
                            disabled={actionLoading}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            Mark as Reserved
                          </button>
                          <button
                            onClick={handleMarkAsSold}
                            disabled={actionLoading}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                          >
                            Mark as Sold
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            {!isOwner && property.status === PropertyStatus.VERIFIED && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Interested?</h3>
                <button className="w-full btn-primary px-4 py-3 rounded-lg">
                  Contact Owner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
