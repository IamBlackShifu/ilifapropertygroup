'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const getNavItems = () => {
    switch (user.role) {
      case 'BUYER':
        return [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/buy-property', label: 'Browse Properties' },
          { href: '/saved-properties', label: 'Saved Properties' },
          { href: '/my-viewings', label: 'My Viewings' },
          { href: '/profile', label: 'Profile' },
        ]
      case 'OWNER':
        return [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/my-properties', label: 'My Properties' },
          { href: '/my-properties/create', label: 'List Property' },
          { href: '/property-viewings', label: 'Viewing Requests' },
          { href: '/profile', label: 'Profile' },
        ]
      case 'CONTRACTOR':
        return [
          { href: '/contractors/dashboard', label: 'Dashboard' },
          { href: '/contractors/profile/edit', label: 'Company Profile' },
          { href: '/contractors/service-requests', label: 'Service Requests' },
          { href: '/contractors/services', label: 'Services' },
          { href: '/contractors/portfolio', label: 'Portfolio' },
          { href: '/profile', label: 'Account' },
        ]
      case 'SUPPLIER':
        return [
          { href: '/suppliers/dashboard', label: 'Dashboard' },
          { href: '/suppliers/profile', label: 'Company Profile' },
          { href: '/suppliers/products', label: 'Products' },
          { href: '/suppliers/products/new', label: 'Add Product' },
          { href: '/suppliers/orders', label: 'Orders' },
          { href: '/profile', label: 'Account' },
        ]
      case 'ADMIN':
        return [
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/properties', label: 'Properties' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/verifications', label: 'Verifications' },
          { href: '/admin/contractors', label: 'Contractors' },
          { href: '/profile', label: 'Profile' },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 py-4 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
