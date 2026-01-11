import Link from 'next/link'

export default function DiasporaPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Building from Abroad? We've Got You Covered</h1>
          <p className="text-xl text-primary-100 mb-8">
            Complete peace of mind for diaspora buyers with verified professionals and remote project tracking
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Diaspora Buyers Choose ZimBuildHub</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { 
              icon: '✓',
              title: 'Verified Professionals Only',
              description: 'Every contractor, architect, and supplier is thoroughly vetted with registration checks, portfolio reviews, and client references'
            },
            {
              icon: '📱',
              title: 'Real-Time Project Tracking',
              description: 'Monitor your build 24/7 with milestone photos, progress reports, and budget tracking from anywhere in the world'
            },
            {
              icon: '🛡️',
              title: 'Legal Protection',
              description: 'Complete legal documentation support including title deed verification, conveyancing, and approval tracking'
            },
            {
              icon: '💰',
              title: 'Milestone-Based Payments',
              description: 'Pay only when verified milestones are completed - never pay for work not done'
            },
            {
              icon: '📞',
              title: 'Dedicated Support',
              description: 'Your personal project coordinator available via WhatsApp, email, or video call'
            },
            {
              icon: '🎓',
              title: 'Expert Guidance',
              description: 'Step-by-step checklists for every stage from land purchase to occupation certificate'
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Set Up Your Project',
                description: 'Tell us your requirements, budget, and timeline. We help you select verified professionals.',
                details: ['Define project scope', 'Set your budget', 'Choose location', 'Select professionals']
              },
              {
                step: 2,
                title: 'Legal & Land Verification',
                description: 'Complete land verification and legal due diligence with our verified lawyers.',
                details: ['Title deed verification', 'Council cession check', 'Rates clearance', 'Legal documentation']
              },
              {
                step: 3,
                title: 'Design & Approvals',
                description: 'Work with architects and engineers. Track council and EMA approvals online.',
                details: ['Architectural designs', 'Engineering approvals', 'Council submission', 'EMA clearance']
              },
              {
                step: 4,
                title: 'Construction with Live Tracking',
                description: 'Monitor every stage with photos, reports, and video calls. Pay per milestone.',
                details: ['Weekly photo updates', 'Milestone inspections', 'Budget tracking', 'Direct communication']
              },
              {
                step: 5,
                title: 'Completion & Handover',
                description: 'Final inspections, occupation certificate, and full property handover.',
                details: ['Final inspection', 'Snag list completion', 'Occupation certificate', 'Keys handover']
              },
            ].map((item) => (
              <div key={item.step} className="flex space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {item.details.map((detail) => (
                      <div key={detail} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Dashboard Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Your Project Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-primary-50 rounded-lg">
              <h3 className="font-semibold mb-2">Live Progress Updates</h3>
              <p className="text-sm text-gray-600">Photos and reports uploaded weekly</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">Budget Tracking</h3>
              <p className="text-sm text-gray-600">See exactly where every dollar goes</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Document Storage</h3>
              <p className="text-sm text-gray-600">All contracts and approvals in one place</p>
            </div>
          </div>

          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Dashboard Screenshot Preview</p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'John M.',
                location: 'UK → Harare',
                project: '4-Bedroom Home',
                quote: 'Built my entire home from London. The weekly updates and milestone inspections gave me complete confidence.'
              },
              {
                name: 'Sarah K.',
                location: 'USA → Bulawayo',
                project: 'Investment Property',
                quote: 'The verified professionals and transparent pricing meant no surprises. Would absolutely recommend.'
              },
            ].map((story) => (
              <div key={story.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.location}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{story.project}</p>
                <p className="text-gray-700 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Book a free consultation with our diaspora project team
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register" className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50">
              Get Started
            </Link>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-primary-700">
              Schedule Call
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
