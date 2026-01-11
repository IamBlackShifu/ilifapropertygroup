import Link from 'next/link'

const professionalCategories = [
  { id: 'estate-agents', name: 'Estate Agents', icon: '🏠', count: 156, description: 'Licensed estate agents with Estate Agents Council registration' },
  { id: 'developers', name: 'Developers', icon: '🏗️', count: 89, description: 'Property developers with completed projects and references' },
  { id: 'architects', name: 'Architects', icon: '📐', count: 124, description: 'Registered architects with portfolio of approved designs' },
  { id: 'engineers', name: 'Engineers', icon: '⚙️', count: 98, description: 'Structural and civil engineers with professional registration' },
  { id: 'builders', name: 'Builders', icon: '👷', count: 234, description: 'Verified builders with completed construction projects' },
  { id: 'lawyers', name: 'Lawyers', icon: '⚖️', count: 67, description: 'Conveyancing lawyers with property law expertise' },
  { id: 'quantity-surveyors', name: 'Quantity Surveyors', icon: '📊', count: 45, description: 'Professional quantity surveyors for cost management' },
  { id: 'project-managers', name: 'Project Managers', icon: '📋', count: 78, description: 'Experienced project managers for construction oversight' },
  { id: 'surveyors', name: 'Surveyors', icon: '📏', count: 52, description: 'Land surveyors for site measurements and boundaries' },
]

export default function ProfessionalsPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Verified Professionals</h1>
          <p className="text-xl text-primary-100 mb-8">
            Every professional is verified with registration checks, portfolio reviews, and client references
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 flex">
              <input
                type="text"
                placeholder="Search by name, company, or location..."
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              />
              <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionalCategories.map((category) => (
            <Link
              key={category.id}
              href={`/professionals/${category.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-600">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600">
                      {category.count} verified professionals
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verification Process */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Verification Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Registration Check', description: 'Verify professional registration with relevant councils and bodies' },
              { step: 2, title: 'Document Review', description: 'Review company documents, licenses, and insurance certificates' },
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
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Top Rated Professionals</h2>
          <Link href="/professionals/all" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">ABC Construction Ltd</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Verified</span>
                  </div>
                  <p className="text-sm text-gray-600">Builder</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                    <span className="text-sm text-gray-600 ml-2">(48 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Specialized in residential construction with 15+ years experience.
              </p>
              <div className="flex space-x-2">
                <Link href={`/professionals/builders/${i}`} className="flex-1 text-center py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700">
                  View Profile
                </Link>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
