'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api-client'

interface Contractor {
  id: string
  companyName: string
  description: string
  servicesOffered: string[]
  locationCity: string
  isVerified: boolean
  ratingAverage: string
  ratingCount: number
  yearsExperience: number
  status: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function ProfessionalsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadContractors()
  }, [])

  const loadContractors = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/contractors', {
        params: { status: 'VERIFIED', limit: 50 }
      })
      setContractors(response.data.data || [])
    } catch (error) {
      console.error('Error loading contractors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContractors = contractors.filter(c => 
    searchTerm === '' || 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.locationCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.servicesOffered.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const topRatedContractors = [...contractors]
    .sort((a, b) => {
      const ratingA = parseFloat(a.ratingAverage) || 0
      const ratingB = parseFloat(b.ratingAverage) || 0
      return ratingB - ratingA
    })
    .slice(0, 6)
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Verified Contractors & Builders</h1>
          <p className="text-xl text-primary-100 mb-8">
            {loading ? 'Loading...' : `${contractors.length} verified professionals ready to help build your dream`}
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 flex">
              <input
                type="text"
                placeholder="Search by name, company, service, or location..."
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Contractors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {searchTerm ? `Search Results (${filteredContractors.length})` : 'All Contractors'}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading contractors...</p>
          </div>
        ) : filteredContractors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No contractors found matching your search.' : 'No contractors available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContractors.map((contractor) => (
              <div key={contractor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{contractor.companyName}</h3>
                    <p className="text-sm text-gray-600">{contractor.locationCity || 'Zimbabwe'}</p>
                  </div>
                  {contractor.isVerified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex-shrink-0">
                      ✓ Verified
                    </span>
                  )}
                </div>
                
                {contractor.ratingCount > 0 && (
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {parseFloat(contractor.ratingAverage).toFixed(1)} ({contractor.ratingCount} reviews)
                    </span>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {contractor.description}
                </p>
                
                {contractor.servicesOffered.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {contractor.servicesOffered.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                      {contractor.servicesOffered.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{contractor.servicesOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {contractor.yearsExperience > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    {contractor.yearsExperience} years experience
                  </p>
                )}
                
                <div className="flex gap-2">
                  <Link 
                    href={`/contractor/${contractor.id}`}
                    className="flex-1 text-center py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/services/request?contractorId=${contractor.id}`}
                    className="px-4 py-2 border border-primary-600 text-primary-600 text-sm font-medium rounded hover:bg-primary-50"
                  >
                    Request Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Rated */}
      {!searchTerm && topRatedContractors.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Top Rated Contractors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topRatedContractors.map((contractor) => (
                <div key={contractor.id} className="bg-gray-50 rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{contractor.companyName}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {parseFloat(contractor.ratingAverage).toFixed(1)} ({contractor.ratingCount})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{contractor.description}</p>
                  <Link
                    href={`/contractor/${contractor.id}`}
                    className="block text-center py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Verification Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Verification Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: 1, title: 'Registration Check', description: 'Verify professional registration and company documents' },
            { step: 2, title: 'Document Review', description: 'Review licenses, insurance certificates, and credentials' },
            { step: 3, title: 'Portfolio Assessment', description: 'Evaluate completed projects and work quality' },
            { step: 4, title: 'Reference Verification', description: 'Contact previous clients and verify references' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
