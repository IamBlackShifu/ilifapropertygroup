import { ReactNode } from 'react'
import { Header, Footer } from '@/components/layout'
import DashboardNav from '@/components/layout/DashboardNav'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <DashboardNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
