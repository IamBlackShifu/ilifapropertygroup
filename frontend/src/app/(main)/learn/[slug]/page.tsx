import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLearnArticle, learnArticles } from '@/lib/learn-articles'

type ArticlePageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return learnArticles.map((article) => ({ slug: article.slug }))
}

export function generateMetadata({ params }: ArticlePageProps) {
  const article = getLearnArticle(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | Learning Hub`,
    description: article.excerpt,
  }
}

export default function LearnArticlePage({ params }: ArticlePageProps) {
  const article = getLearnArticle(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/learn" className="inline-flex text-primary-100 hover:text-white mb-6">
            Back to Learning Hub
          </Link>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-100 mb-3">{article.category}</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{article.title}</h1>
          <p className="text-lg text-primary-100 mb-4">{article.excerpt}</p>
          <div className="text-sm text-primary-100">{article.readTime} read</div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
          <div className="space-y-9">
            {article.sections.map((section, index) => (
              <section key={`${section.heading || 'intro'}-${index}`} className="space-y-4">
                {section.heading && <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="leading-7 text-gray-700">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-disc space-y-2 pl-6 text-gray-700">
                    {section.list.map((item) => (
                      <li key={item} className="leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
