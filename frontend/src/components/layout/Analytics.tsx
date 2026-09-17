'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function Analytics() {
  const [allowed, setAllowed] = useState(false)
  const pathname = usePathname()
  const lastTracked = useRef('')

  useEffect(() => {
    const syncConsent = () => {
      try {
        const consent = JSON.parse(localStorage.getItem('ilifa-cookie-consent') || 'null')
        const analyticsAllowed = consent?.analytics === true
        setAllowed(analyticsAllowed)
        if (measurementId) Object.assign(window, { [`ga-disable-${measurementId}`]: !analyticsAllowed })
      } catch {
        setAllowed(false)
        if (measurementId) Object.assign(window, { [`ga-disable-${measurementId}`]: true })
      }
    }
    syncConsent()
    window.addEventListener('ilifa:consent-changed', syncConsent)
    return () => window.removeEventListener('ilifa:consent-changed', syncConsent)
  }, [])

  useEffect(() => {
    if (!allowed || pathname.startsWith('/admin')) return

    // Deliberately omit query strings: they can contain search terms or other user data.
    const path = pathname
    if (lastTracked.current === path) return
    lastTracked.current = path

    const getAnonymousId = (storage: Storage, key: string) => {
      let id = storage.getItem(key)
      if (!id) {
        id = crypto.randomUUID()
        storage.setItem(key, id)
      }
      return id
    }

    const width = window.innerWidth
    const deviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
    let referrer: string | undefined
    try {
      const referrerUrl = new URL(document.referrer)
      referrer = `${referrerUrl.origin}${referrerUrl.pathname}`.slice(0, 500)
    } catch { /* No valid referrer is available. */ }
    const payload = {
      id: crypto.randomUUID(),
      visitorId: getAnonymousId(localStorage, 'ilifa-analytics-visitor'),
      sessionId: getAnonymousId(sessionStorage, 'ilifa-analytics-session'),
      path,
      title: document.title.slice(0, 200),
      referrer,
      deviceType,
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    fetch(`${apiUrl}/api/analytics/page-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => { /* Analytics must never interrupt navigation. */ })

    const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
    if (measurementId && typeof gtag === 'function') {
      gtag('config', measurementId, { page_path: path })
    }
  }, [allowed, pathname])

  if (!measurementId || !allowed) {
    return null
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
