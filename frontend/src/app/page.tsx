'use client'

import Link from 'next/link'
import { Header, Footer } from '@/components/layout'

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
              Build with Confidence
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Zimbabwe's trusted platform for verified properties, contractors, and construction projects.
              Every listing is verified. Every contractor is vetted. Every project is tracked.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/buy-property" className="btn btn-primary text-lg px-8 py-3">
                Browse Properties
              </Link>
              <Link href="/build-home" className="btn btn-secondary text-lg px-8 py-3">
                Build Your Home
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                Every property and contractor goes through our rigorous verification process
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
              <p className="text-gray-600">
                Monitor your construction project from foundation to completion
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Milestone-based payments with Stripe and Paynow integration
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 bg-primary-600 rounded-2xl py-12 px-8 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-100">Verified Properties</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-primary-100">Trusted Contractors</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">150+</div>
                <div className="text-primary-100">Completed Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-primary-100">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
