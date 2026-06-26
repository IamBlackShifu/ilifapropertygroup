'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Footer, Header } from '@/components/layout'
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton'

const servicePaths = [
  {
    title: 'Buy Property',
    description: 'Browse verified homes, stands, and investment-ready properties with clear ownership and listing details.',
    href: '/buy-property',
    cta: 'View properties',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5L12 3l9 7.5M5 10v10h14V10M9 20v-6h6v6" />
    ),
  },
  {
    title: 'Build Your Home',
    description: 'Plan a build, request vetted contractors, source materials, and track work from foundation to handover.',
    href: '/build-home',
    cta: 'Start building',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21h16M6 21V9l6-4 6 4v12M9 21v-7h6v7M9 10h.01M15 10h.01" />
    ),
  },
  {
    title: 'Invest in Property',
    description: 'Compare opportunities with verification, market context, and support for diaspora and local investors.',
    href: '/diaspora',
    cta: 'Explore investing',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.5 0-4.5 1.12-4.5 2.5S9.5 13 12 13s4.5 1.12 4.5 2.5S14.5 18 12 18m0-10V6m0 12v-2m8-4a8 8 0 11-16 0 8 8 0 0116 0z" />
    ),
  },
]

const onboardingSteps = [
  'Create an account',
  'Select your service',
  'Choose a package',
  'Make payment',
  'Access opportunities',
  'Begin your journey',
]

const packages = [
  {
    name: 'Property Buyer',
    cost: 'Free to start',
    features: ['Verified listing access', 'Saved properties', 'Viewing requests'],
    href: '/buy-property',
  },
  {
    name: 'Build Support',
    cost: 'Consultation based',
    features: ['Contractor matching', 'Service requests', 'Project guidance'],
    href: '/services/request',
  },
  {
    name: 'Investor Access',
    cost: 'Package pricing',
    features: ['Opportunity shortlists', 'Diaspora support', 'Market insights'],
    href: '/diaspora',
  },
]

const testimonials = [
  {
    name: 'Tariro M.',
    role: 'Diaspora investor',
    quote: 'ILifa helped me compare verified options in Harare without relying on guesswork from overseas.',
    rating: '5.0',
  },
  {
    name: 'Brian N.',
    role: 'Home builder',
    quote: 'The service request flow made it easier to find a contractor and understand the next step.',
    rating: '4.9',
  },
  {
    name: 'Rudo K.',
    role: 'Property buyer',
    quote: 'Clear property details and verification cues gave me more confidence before booking a viewing.',
    rating: '5.0',
  },
]

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <section className="relative isolate min-h-[calc(100vh-104px)] overflow-hidden bg-gray-950">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1920"
            aria-hidden="true"
          >
            <source src="https://videos.pexels.com/video-files/7578545/7578545-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/72 to-gray-900/30" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50 to-transparent" />

          <main className="relative z-10 mx-auto flex min-h-[calc(100vh-104px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-amber-100 ring-1 ring-white/20 backdrop-blur">
                Verified property, trusted building support, clearer investment decisions
              </p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build with Confidence
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-100 sm:text-xl">
                ILifa connects Zimbabwe property buyers, home builders, investors, contractors, and suppliers through verified listings and guided service flows.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/buy-property" className="btn btn-primary px-8 py-4 text-center text-base font-semibold shadow-xl">
                  Browse Properties
                </Link>
                <Link href="/build-home" className="rounded-md bg-white px-8 py-4 text-center text-base font-semibold text-gray-950 shadow-xl transition-colors hover:bg-amber-50">
                  Build Your Home
                </Link>
                <Link href="/services/request" className="rounded-md border border-white/50 px-8 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-white/10">
                  Request Consultation
                </Link>
              </div>
            </div>
          </main>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">What we do</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">One platform for buying, building, and investing in property.</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                The platform separates each journey clearly so visitors can choose the right path within seconds.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {servicePaths.map((service) => (
                <article key={service.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <IconFrame>{service.icon}</IconFrame>
                  <h3 className="mt-5 text-xl font-semibold text-gray-950">{service.title}</h3>
                  <p className="mt-3 min-h-24 text-sm leading-6 text-gray-600">{service.description}</p>
                  <Link href={service.href} className="mt-5 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-600">
                    {service.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">How it works</p>
                <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">A simple onboarding path from account to action.</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  New users can move from registration to property opportunities, service requests, or investment guidance without guessing what comes next.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {onboardingSteps.map((step, index) => (
                  <div key={step} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-semibold text-gray-950">{step}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Packages</p>
                <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">Choose the support that matches your goal.</h2>
              </div>
              <Link href="/auth/register" className="btn btn-primary w-full px-6 py-3 text-center sm:w-auto">
                Create Account
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {packages.map((item) => (
                <article key={item.name} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-950">{item.name}</h3>
                  <p className="mt-3 text-2xl font-bold text-primary-700">{item.cost}</p>
                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={item.href} className="mt-8 block rounded-md border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:border-primary-600 hover:text-primary-700">
                    View option
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="mt-2 text-gray-300">Verified Properties</div>
              </div>
              <div>
                <div className="text-4xl font-bold">200+</div>
                <div className="mt-2 text-gray-300">Trusted Contractors</div>
              </div>
              <div>
                <div className="text-4xl font-bold">150+</div>
                <div className="mt-2 text-gray-300">Completed Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold">98%</div>
                <div className="mt-2 text-gray-300">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Trust signals</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">People use ILifa when clarity matters.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <figcaption className="font-semibold text-gray-950">{testimonial.name}</figcaption>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">{testimonial.rating}</span>
                  </div>
                  <blockquote className="mt-5 text-sm leading-7 text-gray-600">&quot;{testimonial.quote}&quot;</blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </div>
      <WhatsAppFloatingButton />
      <Footer />
    </>
  )
}
