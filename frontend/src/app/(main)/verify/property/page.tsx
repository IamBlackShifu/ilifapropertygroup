import Link from 'next/link'

export default function VerifyPropertyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Verify a Property</h1>
          <p className="text-xl text-gray-600">
            Check property documentation status and legal standing
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address or Stand Number
              </label>
              <input
                type="text"
                placeholder="e.g., Stand 123 Borrowdale, Harare"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suburb
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Select Suburb</option>
                <option>Borrowdale</option>
                <option>Mt Pleasant</option>
                <option>Glen Lorne</option>
                <option>Avondale</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option>Harare</option>
                <option>Bulawayo</option>
                <option>Mutare</option>
                <option>Gweru</option>
                <option>Kwekwe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller/Agent Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Name of seller or agent"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="pt-4">
              <button className="w-full py-4 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors">
                Start Verification Check
              </button>
            </div>
          </div>
        </div>

        {/* What We Check */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What We Verify</h2>
          
          <div className="space-y-4">
            {[
              {
                title: 'Title Deed Status',
                description: 'Confirm existence and validity of title deeds at Deeds Office'
              },
              {
                title: 'Council Cession',
                description: 'Verify council cession and rates clearance status'
              },
              {
                title: 'Building Plans',
                description: 'Check if building plans are approved and match actual structure'
              },
              {
                title: 'Rates Arrears',
                description: 'Confirm no outstanding rates and taxes owed to council'
              },
              {
                title: 'Legal Disputes',
                description: 'Check for any pending legal cases or ownership disputes'
              },
              {
                title: 'Development Status',
                description: 'Verify stand is legally subdivided if part of a development'
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-primary-600 text-white rounded-lg shadow-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Verification Report - $50 USD</h2>
          <p className="text-primary-100 mb-6">
            Comprehensive property verification report delivered within 5-7 working days
          </p>
          <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Full title deed verification
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Council records check
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Legal dispute search
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Detailed PDF report
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/verify/agent" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Verify an Agent</h3>
            <p className="text-gray-600 text-sm">Check estate agent registration and credentials</p>
          </Link>
          <Link href="/learn/property-documents" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Understanding Documents</h3>
            <p className="text-gray-600 text-sm">Learn about property documentation in Zimbabwe</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
