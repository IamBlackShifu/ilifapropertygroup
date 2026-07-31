import Link from 'next/link'
import { getWhatsAppUrl } from '@/lib/utils'

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447471414983'
const whatsappUrl = getWhatsAppUrl(
  whatsappNumber,
  'Hello ILifa Property Group, I am outside Zimbabwe and would like help with property or building services.'
)

const supportAreas = [
  {
    title: 'Property search',
    description: 'Browse verified property listings and compare options before asking someone locally to inspect.',
    href: '/buy-property',
    action: 'Browse property',
  },
  {
    title: 'Contractor selection',
    description: 'Review verified professionals and request service from a contractor profile when you are ready.',
    href: '/professionals',
    action: 'Find professionals',
  },
  {
    title: 'Supplier coordination',
    description: 'Find suppliers by category, city, delivery capability, and public supplier information.',
    href: '/suppliers',
    action: 'View suppliers',
  },
  {
    title: 'Market context',
    description: 'Use market insights to understand locations, demand, and the buying environment.',
    href: '/market-insights',
    action: 'Read insights',
  },
]

const remoteChecklist = [
  'Confirm the property, supplier, or contractor is visible on the platform.',
  'Use WhatsApp for quick low-cost communication before committing to calls.',
  'Ask for documents, addresses, profile details, and written scope before payments.',
  'Keep your account details current so suppliers and contractors can reach you.',
]

const processSteps = [
  {
    title: 'Shortlist options',
    description: 'Start with listings, professionals, or suppliers already available on ILifa.',
  },
  {
    title: 'Verify details',
    description: 'Check location, public profile information, and supporting documents before moving forward.',
  },
  {
    title: 'Contact by WhatsApp',
    description: 'Use WhatsApp as the first contact channel so diaspora clients avoid expensive international calls.',
  },
  {
    title: 'Move into the right workflow',
    description: 'Create an account, save property, request contractor service, or coordinate with suppliers.',
  },
]

export default function DiasporaPage() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">Diaspora support</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Manage Zimbabwe property decisions from abroad with clearer next steps.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-200">
              Use ILifa to browse property, compare verified professionals, find suppliers, and contact the right people through practical low-cost channels.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-700"
                >
                  WhatsApp ILifa
                </a>
              )}
              <Link href="/buy-property" className="rounded-md bg-white px-6 py-3 text-center font-semibold text-gray-950 hover:bg-amber-50">
                Browse Property
              </Link>
              <Link href="/professionals" className="rounded-md border border-white/50 px-6 py-3 text-center font-semibold text-white hover:bg-white/10">
                Find Professionals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Use what exists now</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950">Functional routes for remote buyers and builders.</h2>
          <p className="mt-3 text-gray-600">
            This page now points to live platform sections instead of dashboard previews or placeholder consultation actions.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {supportAreas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-950">{area.title}</h3>
              <p className="mt-3 min-h-24 text-sm leading-6 text-gray-600">{area.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
                {area.action}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950">A clean remote workflow.</h2>
            <p className="mt-4 text-gray-600">
              Diaspora users need fewer vague promises and more direct paths. This flow keeps the page grounded in working platform features.
            </p>
          </div>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-950">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-950">Remote buyer checklist</h2>
            <ul className="mt-6 space-y-4">
              {remoteChecklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-primary-700 p-6 text-white shadow-sm">
            <h2 className="text-2xl font-bold">Need help choosing the right path?</h2>
            <p className="mt-3 text-primary-100">
              Start with WhatsApp for quick coordination, then move into the right platform page when you know whether you are buying, building, or sourcing materials.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white px-5 py-3 text-center text-sm font-semibold text-primary-700 hover:bg-primary-50"
                >
                  WhatsApp Support
                </a>
              )}
              <Link href="/auth/register" className="rounded-md border border-white/60 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
