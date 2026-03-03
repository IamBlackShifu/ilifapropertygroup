import Link from 'next/link'

export default function BuildHomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Build Your Dream Home</h1>
          <p className="text-xl text-primary-100 mb-8">
            Step-by-step guidance from land purchase to move-in day
          </p>
        </div>
      </section>

      {/* Journey Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Building Journey</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* I Have Land */}
          <Link href="/build-home/journey?type=have-land" className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">I Have Land</h3>
            <p className="text-gray-600 mb-6">
              You already own a plot? Get step-by-step guidance to build your home.
            </p>
            <span className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700">
              Start Building →
            </span>
          </Link>

          {/* Looking for Land */}
          <Link href="/build-home/journey?type=need-land" className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">I Need Land</h3>
            <p className="text-gray-600 mb-6">
              Find verified land, complete legal checks, then build with confidence.
            </p>
            <span className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700">
              Find Land →
            </span>
          </Link>

          {/* Diaspora Buyer */}
          <Link href="/diaspora" className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center border-2 border-primary-300">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Diaspora Buyer</h3>
            <p className="text-gray-600 mb-6">
              Building from abroad? Get verified professionals and milestone tracking.
            </p>
            <span className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700">
              Learn More →
            </span>
          </Link>
        </div>
      </section>

      {/* Building Stages Overview */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Your Building Journey</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We guide you through every stage with verified professionals, checklists, and milestone tracking
          </p>

          <div className="space-y-6">
            {[
              { stage: 1, title: 'Land Verification & Legal', description: 'Verify land ownership, engage lawyers, complete legal due diligence', duration: '2-4 weeks' },
              { stage: 2, title: 'Design & Planning', description: 'Architect designs, engineering approvals, council submissions', duration: '4-8 weeks' },
              { stage: 3, title: 'Approvals & Permits', description: 'Council approval, EMA clearance, ZESA connection approval', duration: '6-12 weeks' },
              { stage: 4, title: 'Foundation & Structure', description: 'Site preparation, foundations, brickwork, roofing', duration: '12-16 weeks' },
              { stage: 5, title: 'Services Installation', description: 'Plumbing, electrical, solar, borehole installation', duration: '6-8 weeks' },
              { stage: 6, title: 'Finishes', description: 'Plastering, tiling, painting, kitchen, built-in cupboards', duration: '8-10 weeks' },
              { stage: 7, title: 'External Works', description: 'Paving, fencing, landscaping, perimeter wall', duration: '4-6 weeks' },
              { stage: 8, title: 'Final Inspection & Handover', description: 'Council inspection, occupation certificate, handover', duration: '2-4 weeks' },
            ].map((item) => (
              <div key={item.stage} className="flex items-start space-x-6 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.stage}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <span className="text-sm text-primary-600 font-medium">⏱️ {item.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/build-home/journey" className="btn btn-primary text-lg px-8 py-3">
              Start Your Project →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Build With Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Build With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✓', title: 'Verified Professionals Only', description: 'All contractors, architects, and suppliers are verified with registration checks and references' },
              { icon: '📊', title: 'Project Dashboard', description: 'Track every milestone with photos, reports, and budget tracking in real-time' },
              { icon: '🛡️', title: 'Legal Protection', description: 'Complete legal guidance and documentation support throughout your build' },
              { icon: '💰', title: 'Cost Transparency', description: 'Clear pricing, detailed quotes, and milestone-based payments' },
              { icon: '📱', title: 'Remote Monitoring', description: 'Perfect for diaspora buyers - monitor your build from anywhere' },
              { icon: '🎓', title: 'Expert Guidance', description: 'Step-by-step guides, checklists, and support at every stage' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
