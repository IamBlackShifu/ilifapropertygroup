import Link from 'next/link'

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/buy-property" className="text-gray-500 hover:text-gray-700">Buy Property</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Property Details</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
                <div className="absolute top-4 left-4 space-y-2">
                  <span className="block px-4 py-2 bg-green-500 text-white font-semibold rounded-full">
                    ✓ Verified Property
                  </span>
                  <span className="block px-4 py-2 bg-blue-500 text-white font-semibold rounded-full">
                    ✓ Title Deeds Available
                  </span>
                </div>
                <button className="absolute bottom-4 right-4 px-4 py-2 bg-white text-gray-900 font-medium rounded-md shadow hover:bg-gray-50">
                  View All Photos (24)
                </button>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Modern Family Home in Prime Location
                  </h1>
                  <p className="text-lg text-gray-600">
                    📍 123 Borrowdale Road, Borrowdale, Harare
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">$120,000</p>
                  <p className="text-sm text-gray-500">USD</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-6 border-y">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                  <p className="text-2xl font-semibold">4</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                  <p className="text-2xl font-semibold">3</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Land Size</p>
                  <p className="text-2xl font-semibold">1200m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Build Size</p>
                  <p className="text-2xl font-semibold">350m²</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  Beautiful modern family home situated in the sought-after suburb of Borrowdale. 
                  This property offers spacious living areas, modern finishes, and a well-maintained garden. 
                  Perfect for families looking for quality and convenience in a prime location.
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Key Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Modern Kitchen', 'Borehole', 'Solar System', 'Electric Fence', 'Double Garage', 'Staff Quarters', 'Swimming Pool', 'DSTV Ready'].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Documentation */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Legal Documentation Status</h2>
              <div className="space-y-3">
                {[
                  { label: 'Title Deeds', status: 'Available', color: 'green' },
                  { label: 'Council Cession', status: 'Verified', color: 'green' },
                  { label: 'Rates Clearance', status: 'Up to Date', color: 'green' },
                  { label: 'Building Plans', status: 'Approved', color: 'green' },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{doc.label}</span>
                    <span className={`px-3 py-1 bg-${doc.color}-100 text-${doc.color}-800 text-sm font-medium rounded-full`}>
                      ✓ {doc.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-md hover:bg-primary-50 transition-colors">
                Request Documentation Review
              </button>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map View</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-lg">ABC Properties</h3>
                  <p className="text-sm text-gray-600">✓ Verified Agent</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-sm text-gray-600 ml-2">(124 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors">
                  Contact Agent
                </button>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors">
                  Schedule Viewing
                </button>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors">
                  Save Property
                </button>
              </div>

              <div className="pt-6 border-t space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">+263 77 123 4567</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">info@abcproperties.co.zw</span>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Similar Properties</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link key={i} href={`/buy-property/${i}`} className="block group">
                    <div className="flex space-x-3">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 mb-1">
                          Family Home
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">Borrowdale</p>
                        <p className="text-lg font-semibold text-primary-600">$115,000</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
