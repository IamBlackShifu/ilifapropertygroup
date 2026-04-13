'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function ProfilePage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const buyerQuickLinks = [
    {
      title: 'Dashboard',
      description: 'See your buyer activity and recommendations',
      href: '/dashboard',
    },
    {
      title: 'Browse Properties',
      description: 'Find verified properties that match your needs',
      href: '/buy-property',
    },
    {
      title: 'Saved Properties',
      description: 'Review homes and listings you bookmarked',
      href: '/saved-properties',
    },
    {
      title: 'My Viewings',
      description: 'Track and manage all viewing appointments',
      href: '/my-viewings',
    },
    {
      title: 'Messages',
      description: 'Chat with sellers and property professionals',
      href: '/messages',
    },
    {
      title: 'Settings',
      description: 'Update account preferences and security',
      href: '/settings',
    },
  ]

  useEffect(() => {
    if (user) {
      // Split the name back into first and last
      const nameParts = user.name ? user.name.split(' ') : ['', '']
      const [firstName, ...lastNameParts] = nameParts
      setFormData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Profile updated successfully')
        setIsEditing(false)
        // Reload user data
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setMessage(data.message || 'Failed to update profile')
      }
    } catch (error) {
      setMessage('An error occurred while updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-2 text-gray-600">Manage your personal information</p>
            </div>

            {user?.role === 'BUYER' && (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Buyer Navigation</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Use the same dashboard shortcuts available across other user experiences.
                  </p>
                </div>
                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyerQuickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:bg-primary-50 transition"
                    >
                      <h3 className="font-semibold text-gray-900">{link.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{link.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              {/* Profile Header */}
              <div className="px-6 py-8 border-b border-gray-200">
                <div className="flex items-center space-x-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="px-6 py-8">
                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setMessage('')
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
