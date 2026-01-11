import Link from 'next/link'

const supplierCategories = [
  {
    phase: 'Pre-Construction',
    categories: [
      { name: 'Architects', count: 124 },
      { name: 'Surveyors', count: 52 },
      { name: 'Soil Testing', count: 18 },
      { name: 'Geotechnical Services', count: 12 },
    ]
  },
  {
    phase: 'Legal & Compliance',
    categories: [
      { name: 'Conveyancing Lawyers', count: 67 },
      { name: 'Council Approvals', count: 8 },
      { name: 'EMA Clearance', count: 5 },
      { name: 'ZESA Connections', count: 3 },
    ]
  },
  {
    phase: 'Foundation & Structure',
    categories: [
      { name: 'Cement Suppliers', count: 45 },
      { name: 'Bricks & Blocks', count: 78 },
      { name: 'Steel & Reinforcement', count: 56 },
      { name: 'Aggregates (Sand, Stone)', count: 34 },
      { name: 'Roofing Materials', count: 92 },
      { name: 'Timber', count: 41 },
    ]
  },
  {
    phase: 'Windows & Doors',
    categories: [
      { name: 'Aluminum Windows', count: 38 },
      { name: 'Wooden Doors', count: 29 },
      { name: 'Security Doors', count: 47 },
      { name: 'Garage Doors', count: 23 },
    ]
  },
  {
    phase: 'Finishes',
    categories: [
      { name: 'Kitchen Cupboards', count: 56 },
      { name: 'Built-in Cupboards', count: 43 },
      { name: 'Tiles & Flooring', count: 89 },
      { name: 'Ceilings', count: 31 },
      { name: 'Paint & Painting', count: 67 },
      { name: 'Sanitary Ware', count: 52 },
    ]
  },
  {
    phase: 'Services',
    categories: [
      { name: 'Plumbing', count: 123 },
      { name: 'Electrical', count: 145 },
      { name: 'Solar Systems', count: 78 },
      { name: 'Borehole Drilling', count: 34 },
      { name: 'Water Tanks', count: 29 },
      { name: 'Septic Tanks', count: 18 },
    ]
  },
  {
    phase: 'Exterior & Security',
    categories: [
      { name: 'Paving', count: 56 },
      { name: 'Fencing & Gates', count: 71 },
      { name: 'CCTV Systems', count: 45 },
      { name: 'Electric Fencing', count: 39 },
      { name: 'Smart Home Systems', count: 22 },
      { name: 'Landscaping', count: 34 },
    ]
  },
]

export default function SuppliersPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Suppliers & Materials Directory</h1>
          <p className="text-xl text-primary-100 mb-8">
            A-Z of everything you need to build a house in Zimbabwe
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 flex">
              <input
                type="text"
                placeholder="Search suppliers, materials, or services..."
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              />
              <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">1,247</p>
            <p className="text-sm text-gray-600">Verified Suppliers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">87</p>
            <p className="text-sm text-gray-600">Product Categories</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">5,892</p>
            <p className="text-sm text-gray-600">Products Listed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl font-bold text-primary-600 mb-2">24/7</p>
            <p className="text-sm text-gray-600">Support Available</p>
          </div>
        </div>
      </section>

      {/* Categories by Building Phase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {supplierCategories.map((phase) => (
            <div key={phase.phase} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b">{phase.phase}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {phase.categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/suppliers/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium mb-2 group-hover:text-primary-600">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} suppliers</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Suppliers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Verified</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Building Supplies</h3>
                <p className="text-sm text-gray-600 mb-4">Cement, Bricks, Roofing Materials</p>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                  <span className="text-sm text-gray-600 ml-2">(142 reviews)</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 Harare, Bulawayo, Mutare</p>
                  <p>📦 Delivery Available</p>
                  <p>💳 Payment Plans Offered</p>
                </div>
                <Link href={`/suppliers/${i}`} className="block mt-4 text-center py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700">
                  View Supplier
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a supplier?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our verified supplier network and reach thousands of builders
          </p>
          <Link href="/for-professionals" className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50">
            List Your Business
          </Link>
        </div>
      </section>
    </div>
  )
}
