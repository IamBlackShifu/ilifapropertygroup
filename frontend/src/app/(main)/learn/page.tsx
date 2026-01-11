import Link from 'next/link'

const learningCategories = [
  {
    title: 'Getting Started',
    icon: '🏁',
    articles: [
      { title: 'First-Time Buyer Guide', slug: 'first-time-buyer-guide', readTime: '10 min' },
      { title: 'How Much Does It Cost to Build in Zimbabwe?', slug: 'cost-to-build-zimbabwe', readTime: '8 min' },
      { title: 'Land vs House: Which Should You Buy?', slug: 'land-vs-house', readTime: '6 min' },
      { title: 'Understanding Property Documents', slug: 'property-documents', readTime: '12 min' },
    ]
  },
  {
    title: 'Legal & Compliance',
    icon: '⚖️',
    articles: [
      { title: 'Complete Guide to Title Deeds', slug: 'guide-to-title-deeds', readTime: '15 min' },
      { title: 'Council Cession Explained', slug: 'council-cession-explained', readTime: '10 min' },
      { title: 'EMA Clearance Process', slug: 'ema-clearance-process', readTime: '8 min' },
      { title: 'Rates and Taxes for Property Owners', slug: 'rates-and-taxes', readTime: '12 min' },
    ]
  },
  {
    title: 'Building Process',
    icon: '🏗️',
    articles: [
      { title: 'Step-by-Step Building Timeline', slug: 'building-timeline', readTime: '20 min' },
      { title: 'Choosing the Right Architect', slug: 'choosing-architect', readTime: '10 min' },
      { title: 'Understanding Building Materials', slug: 'building-materials', readTime: '15 min' },
      { title: 'Foundation Types and When to Use Them', slug: 'foundation-types', readTime: '12 min' },
    ]
  },
  {
    title: 'Budget & Finance',
    icon: '💰',
    articles: [
      { title: 'Creating Your Building Budget', slug: 'building-budget', readTime: '10 min' },
      { title: 'How to Avoid Cost Overruns', slug: 'avoid-cost-overruns', readTime: '8 min' },
      { title: 'Payment Schedules for Contractors', slug: 'payment-schedules', readTime: '7 min' },
      { title: 'Getting Quotes: What to Look For', slug: 'getting-quotes', readTime: '9 min' },
    ]
  },
  {
    title: 'Services & Utilities',
    icon: '⚡',
    articles: [
      { title: 'Solar vs ZESA: Complete Guide', slug: 'solar-vs-zesa', readTime: '15 min' },
      { title: 'Borehole Drilling: Everything You Need to Know', slug: 'borehole-drilling', readTime: '12 min' },
      { title: 'Plumbing Systems Explained', slug: 'plumbing-systems', readTime: '10 min' },
      { title: 'Septic Tanks vs Council Sewer', slug: 'septic-vs-sewer', readTime: '8 min' },
    ]
  },
  {
    title: 'Diaspora Buyers',
    icon: '🌍',
    articles: [
      { title: 'Building from Abroad: Complete Guide', slug: 'building-from-abroad', readTime: '18 min' },
      { title: 'How to Find Trustworthy Contractors', slug: 'trustworthy-contractors', readTime: '10 min' },
      { title: 'Remote Project Management Tips', slug: 'remote-project-management', readTime: '12 min' },
      { title: 'Money Transfer and Payment Methods', slug: 'money-transfer', readTime: '9 min' },
    ]
  },
]

export default function LearnPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Hub</h1>
          <p className="text-xl text-primary-100 mb-8">
            Everything you need to know about buying, building, and owning property in Zimbabwe
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 flex">
              <input
                type="text"
                placeholder="Search guides and articles..."
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              />
              <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['New to Building', 'Legal Checklist', 'Cost Calculator', 'FAQs'].map((link) => (
            <Link key={link} href={`/learn/${link.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition-shadow">
              <p className="font-medium text-gray-900">{link}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {learningCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{category.icon}</span>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
                  >
                    <h3 className="font-medium mb-2 group-hover:text-primary-600">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{article.readTime} read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Guide */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-4">
                Most Popular
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Complete Guide to Building Your Home in Zimbabwe (2026)
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                A comprehensive 50-page guide covering everything from land purchase to final handover
              </p>
              <Link href="/learn/complete-building-guide" className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50">
                Download Free Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Video Tutorials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'How to Verify Land Documents', duration: '12:34' },
            { title: 'Understanding Building Approvals', duration: '18:22' },
            { title: 'Choosing Quality Materials', duration: '15:45' },
          ].map((video) => (
            <div key={video.title} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-white bg-primary-600 rounded-full p-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <Link href="/learn/faq" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              'How long does it take to build a house in Zimbabwe?',
              'What documents do I need to buy land?',
              'How much does it cost per square meter to build?',
              'Can I build while living abroad?',
            ].map((question) => (
              <details key={question} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100">
                <summary className="font-medium">{question}</summary>
                <p className="mt-3 text-gray-600">
                  Click to expand and read the full answer...
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
