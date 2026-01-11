import Link from 'next/link'

export default function BuyPropertyPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Verified Property</h1>
          <p className="text-xl text-primary-100 mb-8">
            Search through verified properties with complete legal documentation
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Borrowdale, Harare"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option>All Types</option>
                  <option>Residential Land</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Commercial</option>
                  <option>Off-Plan Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option>Any Price</option>
                  <option>Under $50,000</option>
                  <option>$50,000 - $100,000</option>
                  <option>$100,000 - $200,000</option>
                  <option>Over $200,000</option>
                </select>
              </div>
            </div>
            <button className="mt-4 w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors">
              Search Properties
            </button>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Legal Status */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Legal Status</h4>
                <div className="space-y-2">
                  {['All Properties', 'Title Deeds Available', 'Council Cession', 'Developer Agreement', 'Lease Agreement'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verification Badge */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Verification</h4>
                <div className="space-y-2">
                  {['Verified Agent', 'Verified Property', 'Verified Developer'].map((badge) => (
                    <label key={badge} className="flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">{badge}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Bedrooms</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['1+', '2+', '3+', '4+', '5+'].map((bed) => (
                    <button key={bed} className="px-3 py-2 text-sm border border-gray-300 rounded hover:border-primary-600 hover:text-primary-600">
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Land Size */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Land Size (m²)</h4>
                <div className="space-y-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500" />
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </div>

              <button className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Property Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">247</span> properties found
              </p>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Verified</option>
              </select>
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample Property Card */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Link key={i} href={`/buy-property/${i}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    <div className="absolute top-4 right-4 space-y-2">
                      <span className="block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                      <span className="block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        Title Deeds
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Modern Family Home
                      </h3>
                      <p className="text-xl font-bold text-primary-600">
                        $120,000
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      📍 Borrowdale, Harare
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span>🛏️ 4 Beds</span>
                      <span>🚿 3 Baths</span>
                      <span>📐 1200 m²</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="text-xs font-medium">Verified Agent</p>
                          <p className="text-xs text-gray-500">ABC Properties</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-md ${
                      page === 1
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
