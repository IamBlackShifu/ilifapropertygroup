'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavItem {
  label: string
  href?: string
  submenu?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    label: 'Buy Property',
    href: '/buy-property',
  },
  {
    label: 'Build Home',
    href: '/build-home',
  },
  {
    label: 'Professionals',
    href: '/professionals',
  },
  {
    label: 'Suppliers',
    href: '/suppliers',
  },
  {
    label: 'Diaspora',
    href: '/diaspora',
  },
  {
    label: 'Market Insights',
    href: '/market-insights',
  },
  {
    label: 'Verify',
    href: '#',
    submenu: [
      { label: 'Verify Property', href: '/verify/property' },
      { label: 'Verify Professional', href: '/verify/agent' },
    ],
  },
  {
    label: 'Learn',
    href: '/learn',
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-xs sm:text-sm">
            <div className="flex items-center space-x-4">
              <a href="tel:+263712345678" className="flex items-center hover:text-primary-100 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden sm:inline">+263 71 234 5678</span>
              </a>
              <a href="mailto:info@zimbuildshub.com" className="flex items-center hover:text-primary-100 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden md:inline">info@zimbuildshub.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Mon-Fri: 8AM-5PM</span>
              <span className="sm:hidden">8AM-5PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent hidden sm:block">
                ZimBuildHub
              </span>
            </Link>

            {/* Desktop Navigation - Horizontal Collapsible */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.submenu ? (
                    <>
                      <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors relative group"
                        onMouseEnter={() => setOpenSubmenu(item.label)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                      >
                        {item.label}
                        <svg className="inline-block ml-1 w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div 
                        className={`absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                          openSubmenu === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                        }`}
                        onMouseEnter={() => setOpenSubmenu(item.label)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                      >
                        <div className="py-2">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href!}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            >
                              {subitem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              <Link 
                href="#" 
                className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t animate-slideDown">
              {navigationItems.map((item) => (
                <div key={item.label} className="py-1">
                  {item.submenu ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-900">{item.label}</div>
                      <div className="pl-6 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href!}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t space-y-2 px-4">
                <Link
                  href="#"
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="#"
                  className="block px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-center hover:shadow-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
