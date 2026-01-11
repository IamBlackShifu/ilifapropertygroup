import { ReactNode } from 'react'
import { Header, Footer } from '@/components/layout'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
