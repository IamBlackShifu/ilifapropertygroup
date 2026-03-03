'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  hasAttachment: boolean
}

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    sender: { id: '1', name: 'John Buyer' },
    subject: 'Inquiry about Property in Borrowdale',
    preview: "Hi, I'm interested in viewing the property you listed...",
    timestamp: '2 hours ago',
    isRead: false,
    hasAttachment: false,
  },
  {
    id: '2',
    sender: { id: '2', name: 'Sarah Agent' },
    subject: 'Property Verification Update',
    preview: 'Your property has been successfully verified...',
    timestamp: '5 hours ago',
    isRead: true,
    hasAttachment: true,
  },
  {
    id: '3',
    sender: { id: '3', name: 'Mike Contractor' },
    subject: 'Project Quote',
    preview: 'I would like to submit a quote for your building project...',
    timestamp: 'Yesterday',
    isRead: false,
    hasAttachment: true,
  },
]

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
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMessages = messages.filter(msg => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !msg.isRead :
      msg.isRead

    const matchesSearch = 
      msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const unreadCount = messages.filter(m => !m.isRead).length

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
  }

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
    setSelectedMessage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              {/* Search and Filter */}
              <div className="p-4 border-b">
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition ${
                      filter === 'unread'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition ${
                      filter === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Read
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.isRead) handleMarkAsRead(message.id)
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        !message.isRead ? 'bg-blue-50' : ''
                      } ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {message.sender.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-semibold truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.sender.name}
                            </p>
                            {!message.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className={`text-sm mb-1 truncate ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                            {message.hasAttachment && (
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                        {selectedMessage.sender.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedMessage.sender.name}</p>
                        <p className="text-sm text-gray-500">{selectedMessage.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                </div>

                {/* Message Body */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">
                      {selectedMessage.preview}
                    </p>
                    <p className="text-gray-700 mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="text-gray-700">
                      Please let me know if you're available for a viewing this week. I'm flexible with timing and can adjust to your schedule.
                    </p>
                  </div>

                  {selectedMessage.hasAttachment && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">Attachments:</p>
                      <div className="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">document.pdf</p>
                          <p className="text-xs text-gray-500">245 KB</p>
                        </div>
                        <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply */}
                <div className="p-6 border-t bg-gray-50">
                  <textarea
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition">
                      Attach File
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow h-full flex items-center justify-center p-12">
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
