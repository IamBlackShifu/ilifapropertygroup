'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ThemeSwitcher } from './ThemeSwitcher'

interface NavItem {
  label: string
  href?: string
  submenu?: NavItem[]
  roles?: string[] // If specified, only show for these roles. If not specified, show to all
  excludeRoles?: string[] // If specified, hide for these roles
}

const navigationItems: NavItem[] = [
  {
    label: 'Buy Property',
    href: '/buy-property',
    // Public - visible to everyone
  },
  {
    label: 'Build Home',
    href: '/build-home',
    excludeRoles: ['OWNER'], // Hidden for property owners
  },
  {
    label: 'My Properties',
    href: '/my-properties',
    roles: ['OWNER', 'AGENT', 'ADMIN'], // Only for property managers
  },
  {
    label: 'Professionals',
    href: '/professionals',
    excludeRoles: ['OWNER'], // Hidden for property owners
  },
  {
    label: 'Suppliers',
    href: '/suppliers',
    excludeRoles: ['OWNER'], // Hidden for property owners
  },
  {
    label: 'Diaspora',
    href: '/diaspora',
    // Public - visible to everyone
  },
  {
    label: 'Insights',
    href: '/market-insights',
    // Public - visible to everyone
  },
  // {
  //   label: 'Verify',
  //   href: '#',
  //   roles: ['OWNER', 'AGENT', 'CONTRACTOR', 'ADMIN'], // Verification for sellers & professionals
  //   submenu: [
  //     { label: 'Verify Property', href: '/verify/property', roles: ['OWNER', 'AGENT', 'ADMIN'] },
  //     { label: 'Verify Professional', href: '/verify/agent', roles: ['CONTRACTOR', 'AGENT', 'ADMIN'] },
  //   ],
  // },
  {
    label: 'Learn',
    href: '/learn',
    // Public - visible to everyone
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // Debug: Log auth state in Header
  useEffect(() => {
    console.log('🔵 [Header] Auth state:', {
      isAuthenticated,
      hasUser: !!user,
      userName: user?.name,
      userRole: user?.role,
    })
  }, [user, isAuthenticated])

  const handleLogout = () => {
    console.log('🔵 [Header] Logout button clicked')
    logout()
    console.log('🔵 [Header] Redirecting to home page')
    router.push('/')
    setUserDropdownOpen(false)
  }

  const getUserInitials = (name: string | undefined) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  // Filter navigation items based on user role
  const getVisibleNavItems = () => {
    if (!isAuthenticated || !user) {
      // Show all items without role restrictions when not authenticated
      return navigationItems.filter(item => !item.roles)
    }

    return navigationItems.filter(item => {
      // Check if user's role is excluded
      if (item.excludeRoles && item.excludeRoles.includes(user.role)) {
        return false
      }
      
      // If item has no role restriction, show it
      if (!item.roles || item.roles.length === 0) return true
      
      // Otherwise, check if user's role is in the allowed roles
      return item.roles.includes(user.role)
    }).map(item => {
      // Filter submenu items based on role
      if (item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter(subitem => {
            if (!subitem.roles || subitem.roles.length === 0) return true
            return subitem.roles.includes(user.role)
          })
        }
      }
      return item
    })
  }

  const visibleNavItems = getVisibleNavItems()

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
              <a href="mailto:info@ilifapropertygroup.com" className="flex items-center hover:text-primary-100 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden md:inline">info@ilifapropertygroup.com</span>
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
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.png" alt="ILifa Property Group" className="h-10 w-auto" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent hidden sm:block">
                ILifa Property Group
              </span>
            </Link>

            {/* Desktop Navigation - Horizontal Collapsible */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              {visibleNavItems.map((item) => (
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
                      {item.submenu.length > 0 && (
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
                      )}
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

            {/* Auth Button / User Menu */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* Theme Switcher */}
              {/* <ThemeSwitcher /> */}
              
              {isAuthenticated && user ? (
                <>
                  {/* User Info Card */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                      ) : (
                        getUserInitials(user.name)
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{user.name?.split(' ')[0] || 'User'}</span>
                      <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full inline-block w-fit">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Account Menu"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                        <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{user.email || ''}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            My Profile
                          </Link>
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Dashboard
                          </Link>
                          <Link
                            href="/settings"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                          </Link>
                        </div>
                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prominent Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    onMouseEnter={() => setAuthDropdownOpen(true)}
                    onMouseLeave={() => setAuthDropdownOpen(false)}
                    className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Account</span>
                    <svg className={`w-3 h-3 transition-transform ${authDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {authDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                      onMouseEnter={() => setAuthDropdownOpen(true)}
                      onMouseLeave={() => setAuthDropdownOpen(false)}
                    >
                      <div className="py-2">
                        <Link
                          href="/auth/login"
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setAuthDropdownOpen(false)}
                        >
                          <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Sign In
                          <p className="text-xs text-gray-500 mt-0.5 ml-6">Already have an account</p>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setAuthDropdownOpen(false)}
                        >
                          <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Get Started
                          <p className="text-xs text-gray-500 mt-0.5 ml-6">Create a new account</p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              {visibleNavItems.map((item) => (
                <div key={item.label} className="py-1">
                  {item.submenu ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-900">{item.label}</div>
                      {item.submenu.length > 0 && (
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
                      )}
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
              <div className="mt-4 pt-4 border-t space-y-3 px-4">
                {isAuthenticated && user ? (
                  <>
                    {/* Mobile User Info Card */}
                    <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200 mb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            getUserInitials(user.name)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-600">{user.email || ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary-200">
                        <span className="text-xs font-medium text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500">Logged in</span>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-center hover:shadow-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
