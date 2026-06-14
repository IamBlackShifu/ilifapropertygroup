import Link from 'next/link'
import { learnArticles } from '@/lib/learn-articles'

const learningCategories = [
  {
    title: 'Property & Building Guides',
    icon: 'Guide',
    articles: learnArticles,
  },
]

export default function LearnPage() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Hub</h1>
          <p className="text-xl text-primary-100 mb-8">
            Practical guides for buying, building, and owning property in Zimbabwe
          </p>

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {learningCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <span className="mr-4 rounded-md bg-primary-100 px-3 py-2 text-sm font-semibold text-primary-700">{category.icon}</span>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
                  >
                    <p className="text-sm font-medium text-primary-600 mb-2">{article.category}</p>
                    <h3 className="font-medium mb-2 group-hover:text-primary-600">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{article.excerpt}</p>
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
    </div>
  )
}
