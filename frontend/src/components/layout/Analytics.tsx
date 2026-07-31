'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function Analytics() {
  const [allowed, setAllowed] = useState(false)

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
