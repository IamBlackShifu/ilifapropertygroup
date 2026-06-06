'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { propertiesAPI } from '@/lib/api-client'
import { resolveMediaUrl } from '@/lib/media'

type Inquiry = {
  id: string
  propertyId: string
  message: string
  status: string
  ownerResponse: string | null
  createdAt: string
  respondedAt: string | null
  property: {
    id: string
    title: string
    propertyType?: string
    locationCity?: string | null
    price?: string | number | null
    images?: Array<{ imageUrl?: string | null }>
  }
  owner?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
  }
  inquirer?: {
    id: string
    firstName: string
    lastName: string
    email: string
    profileImageUrl?: string | null
  }
  name?: string
  email?: string
  phone?: string
}

type InquiryTab = 'sent' | 'received'

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <MessagesContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function MessagesContent() {
  const { user } = useAuth()
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([])
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<InquiryTab>('sent')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [composePropertyId, setComposePropertyId] = useState('')
  const [composeMessage, setComposeMessage] = useState('')
  const [composeName, setComposeName] = useState('')
  const [composeEmail, setComposeEmail] = useState('')
  const [composePhone, setComposePhone] = useState('')
  const [replyDraft, setReplyDraft] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user) return

    setComposeName(`${user.firstName || ''} ${user.lastName || ''}`.trim())
    setComposeEmail(user.email || '')
    setComposePhone(user.phone || '')
    loadInquiries()
  }, [user])

  const loadInquiries = async () => {
    try {
      setLoading(true)
      const [sentResponse, receivedResponse] = await Promise.all([
        propertiesAPI.getMyInquiries(),
        propertiesAPI.getReceivedInquiries(),
      ])

      setSentInquiries(sentResponse.data.data || [])
      setReceivedInquiries(receivedResponse.data.data || [])
    } catch (error) {
      console.error('Failed to load inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentInquiries = activeTab === 'sent' ? sentInquiries : receivedInquiries

  useEffect(() => {
    if (currentInquiries.length > 0 && !currentInquiries.find(inquiry => inquiry.id === selectedId)) {
      setSelectedId(currentInquiries[0].id)
    }
    if (currentInquiries.length === 0) {
      setSelectedId(null)
    }
  }, [activeTab, currentInquiries, selectedId])

  const selectedInquiry = useMemo(
    () => currentInquiries.find(inquiry => inquiry.id === selectedId) || null,
    [currentInquiries, selectedId],
  )

  const unreadCount = sentInquiries.filter(inquiry => inquiry.status !== 'CLOSED').length +
    receivedInquiries.filter(inquiry => inquiry.status !== 'CLOSED').length

  const handleSendInquiry = async () => {
    if (!composePropertyId.trim() || !composeMessage.trim() || !composeName.trim() || !composeEmail.trim() || !composePhone.trim()) {
      alert('Please complete all message fields')
      return
    }

    try {
      setSending(true)
      await propertiesAPI.contactOwner({
        propertyId: composePropertyId.trim(),
        name: composeName.trim(),
        email: composeEmail.trim(),
        phone: composePhone.trim(),
        message: composeMessage.trim(),
      })

      setComposePropertyId('')
      setComposeMessage('')
      await loadInquiries()
      setActiveTab('sent')
      alert('Your message has been sent')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleReply = async () => {
    if (!selectedInquiry || !replyDraft.trim()) return

    try {
      setSending(true)
      await propertiesAPI.respondToInquiry(selectedInquiry.id, replyDraft.trim())
      setReplyDraft('')
      await loadInquiries()
      alert('Reply sent successfully')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Property inquiries</p>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="mt-2 text-gray-600">
                {unreadCount} active conversation{unreadCount === 1 ? '' : 's'} across your sent and received inquiries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/buy-property" className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                Browse properties
              </Link>
              <Link href="/properties" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                My properties
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sent
                </button>
                <button
                  onClick={() => setActiveTab('received')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === 'received' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Received
                </button>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="py-12 text-center text-gray-500">Loading conversations...</div>
                ) : currentInquiries.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    No {activeTab === 'sent' ? 'sent' : 'received'} inquiries yet.
                  </div>
                ) : (
                  currentInquiries.map((inquiry) => {
                    const otherParty = activeTab === 'sent' ? inquiry.owner : inquiry.inquirer
                    const title = otherParty
                      ? `${otherParty.firstName} ${otherParty.lastName}`.trim()
                      : inquiry.name || 'Property owner'

                    return (
                      <button
                        key={inquiry.id}
                        onClick={() => setSelectedId(inquiry.id)}
                        className={`w-full text-left rounded-xl border p-4 transition ${
                          selectedInquiry?.id === inquiry.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{title}</p>
                            <p className="text-sm text-gray-500 truncate">{inquiry.property.title}</p>
                          </div>
                          <span className="text-xs rounded-full px-2 py-1 bg-gray-100 text-gray-600">
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                        <p className="mt-3 text-xs text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</p>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Send a new inquiry</p>
                <p className="text-sm text-gray-500">Contact a property owner directly from here.</p>
              </div>
              <input
                type="text"
                value={composePropertyId}
                onChange={(e) => setComposePropertyId(e.target.value)}
                placeholder="Property ID"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={composeName}
                onChange={(e) => setComposeName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="email"
                value={composeEmail}
                onChange={(e) => setComposeEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={composePhone}
                onChange={(e) => setComposePhone(e.target.value)}
                placeholder="Your phone"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
              <textarea
                value={composeMessage}
                onChange={(e) => setComposeMessage(e.target.value)}
                rows={5}
                placeholder="Write your message"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={handleSendInquiry}
                disabled={sending}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 p-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
                      {selectedInquiry.property.images?.[0]?.imageUrl ? (
                        <img
                          src={resolveMediaUrl(selectedInquiry.property.images[0].imageUrl)}
                          alt={selectedInquiry.property.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">Prop</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">{selectedInquiry.property.propertyType}</p>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedInquiry.property.title}</h2>
                      <p className="text-sm text-gray-500">
                        {selectedInquiry.property.locationCity || 'Location not set'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{selectedInquiry.status}</div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</p>
                    <p className="mt-2 text-gray-800 whitespace-pre-line">{selectedInquiry.message}</p>
                  </div>

                  {selectedInquiry.ownerResponse && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Owner response</p>
                      <p className="mt-2 text-gray-800 whitespace-pre-line">{selectedInquiry.ownerResponse}</p>
                      {selectedInquiry.respondedAt && (
                        <p className="mt-3 text-xs text-green-700">
                          Responded {new Date(selectedInquiry.respondedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900 mb-2">Other party</p>
                      {activeTab === 'sent' ? (
                        <>
                          <p>{selectedInquiry.owner ? `${selectedInquiry.owner.firstName} ${selectedInquiry.owner.lastName}`.trim() : 'Property owner'}</p>
                          <p>{selectedInquiry.owner?.email}</p>
                          <p>{selectedInquiry.owner?.phone || 'No phone provided'}</p>
                        </>
                      ) : (
                        <>
                          <p>{selectedInquiry.inquirer ? `${selectedInquiry.inquirer.firstName} ${selectedInquiry.inquirer.lastName}`.trim() : selectedInquiry.name || 'Guest'}</p>
                          <p>{selectedInquiry.inquirer?.email || selectedInquiry.email}</p>
                          <p>{selectedInquiry.phone || 'No phone provided'}</p>
                        </>
                      )}
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900 mb-2">Details</p>
                      <p>Inquiry ID: {selectedInquiry.id}</p>
                      <p>Created: {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                      <p>Status: {selectedInquiry.status}</p>
                    </div>
                  </div>

                  {activeTab === 'received' && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Reply to this inquiry</p>
                        <p className="text-sm text-gray-500">Your response will be sent back to the inquirer.</p>
                      </div>
                      <textarea
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        rows={5}
                        placeholder="Write your response"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleReply}
                          disabled={sending || !replyDraft.trim()}
                          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {sending ? 'Sending...' : 'Send reply'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[480px] flex items-center justify-center p-12 text-center">
                <div>
                  <p className="text-lg font-medium text-gray-900">Select a conversation</p>
                  <p className="mt-2 text-gray-500">Your inquiry threads and owner replies appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
