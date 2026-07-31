'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Consent = { necessary: true; analytics: boolean; marketing: boolean; updatedAt: string; version: 1 }
const STORAGE_KEY = 'ilifa-cookie-consent'

export function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [customise, setCustomise] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const consent = JSON.parse(stored) as Consent
        setAnalytics(consent.analytics === true)
        setMarketing(consent.marketing === true)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        setOpen(true)
      }
    } else {
      setOpen(true)
    }
    const showSettings = () => {
      try {
        const consent = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Consent | null
        setAnalytics(consent?.analytics === true)
        setMarketing(consent?.marketing === true)
      } catch { /* display privacy-safe defaults */ }
      setCustomise(true)
      setOpen(true)
    }
    window.addEventListener('ilifa:cookie-settings', showSettings)
    return () => window.removeEventListener('ilifa:cookie-settings', showSettings)
  }, [])

  const save = (analyticsValue: boolean, marketingValue: boolean) => {
    const value: Consent = { necessary: true, analytics: analyticsValue, marketing: marketingValue, updatedAt: new Date().toISOString(), version: 1 }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    if (!analyticsValue) {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim()
        if (name.startsWith('_ga')) {
          document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
        }
      })
    }
    window.dispatchEvent(new Event('ilifa:consent-changed'))
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
        <h2 id="cookie-title" className="text-lg font-bold text-gray-900">Your privacy choices</h2>
        <p className="mt-2 text-sm text-gray-600">
          We use necessary cookies to operate and secure Ilifa. With your permission, we also use analytics and marketing cookies. You can refuse optional cookies without losing access. Read our <Link href="/cookie-policy" className="font-medium text-primary-700 underline">Cookie Policy</Link>.
        </p>
        {customise && (
          <div className="mt-4 space-y-3 border-y border-gray-200 py-4">
            <label className="flex items-center justify-between gap-4"><span><strong className="block text-sm text-gray-900">Necessary</strong><span className="text-xs text-gray-600">Authentication, security and saved privacy choices.</span></span><input type="checkbox" checked disabled aria-label="Necessary cookies always enabled" /></label>
            <label className="flex items-center justify-between gap-4"><span><strong className="block text-sm text-gray-900">Analytics</strong><span className="text-xs text-gray-600">Helps us understand aggregate site usage.</span></span><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /></label>
            <label className="flex items-center justify-between gap-4"><span><strong className="block text-sm text-gray-900">Marketing</strong><span className="text-xs text-gray-600">Allows relevant campaign measurement and advertising.</span></span><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} /></label>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => save(true, true)} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white">Accept all</button>
          <button onClick={() => save(false, false)} className="rounded-lg border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-800">Reject optional</button>
          {customise ? <button onClick={() => save(analytics, marketing)} className="rounded-lg border border-primary-700 px-4 py-2 text-sm font-semibold text-primary-700">Save choices</button> : <button onClick={() => setCustomise(true)} className="rounded-lg px-4 py-2 text-sm font-semibold text-primary-700 underline">Customise</button>}
        </div>
      </div>
    </div>
  )
}
