'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Project {
  id: string
  title: string
  description: string
  budget: number
  location: string
  projectType: 'NEW_BUILD' | 'RENOVATION' | 'EXTENSION' | 'COMMERCIAL'
  status: 'DRAFT' | 'PENDING' | 'QUOTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  startDate?: string
  endDate?: string
  createdAt: string
  quoteCount: number
  contractor?: {
    id: string
    name: string
  }
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: '4-Bedroom House Construction',
    description: 'Build a modern 4-bedroom house with double garage and garden',
    budget: 150000,
    location: 'Borrowdale, Harare',
    projectType: 'NEW_BUILD',
    status: 'IN_PROGRESS',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    createdAt: '2023-12-01',
    quoteCount: 5,
    contractor: { id: '1', name: 'BuildRight Contractors' },
  },
  {
    id: '2',
    title: 'Office Renovation',
    description: 'Complete renovation of 200m² office space including flooring, painting, and electrical',
    budget: 50000,
    location: 'CBD, Harare',
    projectType: 'RENOVATION',
    status: 'QUOTED',
    createdAt: '2024-01-10',
    quoteCount: 3,
  },
]

export default function ProjectsPage() {
  return (
    <ProtectedRoute allowedRoles={['BUYER', 'OWNER', 'ADMIN']}>
      <DashboardLayout>
        <ProjectsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function ProjectsContent() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [statusFilter, setStatusFilter] = useState<'all' | Project['status']>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | Project['projectType']>('all')

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.projectType === typeFilter
    return matchesStatus && matchesType
  })

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'QUOTED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-purple-100 text-purple-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectTypeLabel = (type: Project['projectType']) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Building Projects</h1>
            <p className="text-gray-600">
              Manage your construction and renovation projects
            </p>
          </div>
          <Link
            href="/projects/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending Quotes</option>
                <option value="QUOTED">Quoted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="NEW_BUILD">New Build</option>
                <option value="RENOVATION">Renovation</option>
                <option value="EXTENSION">Extension</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start a new building project to get quotes from contractors'}
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Create Project
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link href={`/projects/${project.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                            {project.title}
                          </h3>
                        </Link>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {getProjectTypeLabel(project.projectType)}
                        </div>
                        {project.startDate && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <p className="text-sm text-gray-500 mb-1">Budget</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${project.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {project.contractor && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Contractor: <span className="font-semibold">{project.contractor.name}</span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {project.quoteCount} quote{project.quoteCount !== 1 ? 's' : ''} received
                    </div>

                    <div className="flex gap-2">
                      {project.status === 'QUOTED' && (
                        <Link
                          href={`/projects/${project.id}/quotes`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                        >
                          View Quotes
                        </Link>
                      )}
                      {project.status === 'IN_PROGRESS' && (
                        <Link
                          href={`/projects/${project.id}/progress`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                        >
                          View Progress
                        </Link>
                      )}
                      <Link
                        href={`/projects/${project.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                      >
                        View Details
                      </Link>
                      {project.status === 'DRAFT' && (
                        <Link
                          href={`/projects/${project.id}/edit`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
