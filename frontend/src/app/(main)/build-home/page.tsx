import Link from 'next/link'

const journeyOptions = [
  {
    title: 'I Have Land',
    description: 'Start with verified contractors, designers, and service providers who can help you plan the build.',
    href: '/professionals',
    action: 'Find professionals',
    accent: 'emerald',
  },
  {
    title: 'I Need Land',
    description: 'Browse available property and land listings before you move into design, approvals, and construction.',
    href: '/buy-property',
    action: 'Browse property',
    accent: 'blue',
  },
  {
    title: 'I Need Materials',
    description: 'Compare suppliers for cement, bricks, roofing, plumbing, electrical, finishes, and other build inputs.',
    href: '/suppliers',
    action: 'View suppliers',
    accent: 'amber',
  },
  {
    title: 'I Am Abroad',
    description: 'Use the diaspora flow for remote buying, supplier coordination, contractor selection, and WhatsApp support.',
    href: '/diaspora',
    action: 'See diaspora support',
    accent: 'slate',
  },
]

const buildStages = [
  {
    title: 'Verify the land',
    description: 'Confirm ownership, title, access, services, and council requirements before spending on construction.',
    href: '/verify/property',
    action: 'Verify property',
  },
  {
    title: 'Choose professionals',
    description: 'Review verified contractors and service providers, then request service from the right profile.',
    href: '/professionals',
    action: 'Find contractors',
  },
  {
    title: 'Source materials',
    description: 'Shortlist suppliers by category and location so your build has a clearer procurement path.',
    href: '/suppliers',
    action: 'Compare suppliers',
  },
  {
    title: 'Track your next steps',
    description: 'Use your account dashboard for saved items, requests, viewings, and project-related activity.',
    href: '/auth/register',
    action: 'Create account',
  },
]

const supportLinks = [
  { label: 'Browse verified property', href: '/buy-property' },
  { label: 'Find contractors', href: '/professionals' },
  { label: 'Request a contractor service', href: '/professionals' },
  { label: 'Compare material suppliers', href: '/suppliers' },
  { label: 'Read market insights', href: '/market-insights' },
]

const accentClasses: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  slate: 'bg-slate-100 text-slate-800 ring-slate-200',
}

export default function BuildHomePage() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">Build your home</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Move from property idea to build-ready next steps.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-200">
              Choose the path that matches where you are today. Every action below goes to an existing part of the platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/professionals" className="rounded-md bg-primary-600 px-6 py-3 text-center font-semibold text-white hover:bg-primary-700">
                Find Contractors
              </Link>
              <Link href="/buy-property" className="rounded-md bg-white px-6 py-3 text-center font-semibold text-gray-950 hover:bg-amber-50">
                Browse Land
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {supportLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/10 bg-white/8 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/14"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Choose your route</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950">No dead ends, just real next steps.</h2>
          <p className="mt-3 text-gray-600">
            The old journey links pointed to pages that do not exist. These options now route into live platform flows.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {journeyOptions.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold ring-1 ${accentClasses[option.accent]}`}>
                {option.title.slice(2, 3)}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-950">{option.title}</h3>
              <p className="mt-3 min-h-24 text-sm leading-6 text-gray-600">{option.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
                {option.action}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Build sequence</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950">A practical order for your build.</h2>
              <p className="mt-4 text-gray-600">
                Use these stages as a guide, then move into the existing tools when you need property checks, contractors, suppliers, or an account.
              </p>
            </div>

            <div className="space-y-4">
              {buildStages.map((stage, index) => (
                <div key={stage.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex gap-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-950">{stage.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">{stage.description}</p>
                      <Link href={stage.href} className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
                        {stage.action}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-primary-700 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Ready to make the next move?</h2>
              <p className="mt-2 max-w-2xl text-primary-100">
                Start by choosing a contractor or browsing verified property. If you are outside Zimbabwe, use the diaspora support page.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/professionals" className="rounded-md bg-white px-5 py-3 text-center text-sm font-semibold text-primary-700 hover:bg-primary-50">
                Find Professionals
              </Link>
              <Link href="/diaspora" className="rounded-md border border-white/60 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">
                Diaspora Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
