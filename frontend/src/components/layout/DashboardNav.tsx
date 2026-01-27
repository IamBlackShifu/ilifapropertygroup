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
          { href: '/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/buy-property', label: 'Browse Properties', icon: '🏠' },
          { href: '/saved-properties', label: 'Saved Properties', icon: '❤️' },
          { href: '/my-viewings', label: 'My Viewings', icon: '📅' },
          { href: '/profile', label: 'Profile', icon: '👤' },
        ]
      case 'OWNER':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/my-properties', label: 'My Properties', icon: '🏘️' },
          { href: '/my-properties/create', label: 'List Property', icon: '➕' },
          { href: '/property-viewings', label: 'Viewing Requests', icon: '📅' },
          { href: '/profile', label: 'Profile', icon: '👤' },
        ]
      case 'CONTRACTOR':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/contractor/profile', label: 'My Profile', icon: '🏢' },
          { href: '/contractor/projects', label: 'Projects', icon: '🔨' },
          { href: '/contractor/services', label: 'Services', icon: '⚙️' },
          { href: '/profile', label: 'Account', icon: '👤' },
        ]
      case 'SUPPLIER':
        return [
          { href: '/suppliers/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/suppliers/profile', label: 'Company Profile', icon: '🏢' },
          { href: '/suppliers/products', label: 'Products', icon: '📦' },
          { href: '/suppliers/products/new', label: 'Add Product', icon: '➕' },
          { href: '/suppliers/orders', label: 'Orders', icon: '🛒' },
          { href: '/profile', label: 'Account', icon: '👤' },
        ]
      case 'ADMIN':
        return [
          { href: '/admin', label: 'Dashboard', icon: '📊' },
          { href: '/admin/properties', label: 'Properties', icon: '🏠' },
          { href: '/admin/users', label: 'Users', icon: '👥' },
          { href: '/admin/verifications', label: 'Verifications', icon: '✅' },
          { href: '/admin/contractors', label: 'Contractors', icon: '🔨' },
          { href: '/profile', label: 'Profile', icon: '👤' },
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
