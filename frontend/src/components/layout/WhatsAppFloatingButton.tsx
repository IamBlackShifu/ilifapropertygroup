'use client'

const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '263712345678'
const message = encodeURIComponent('Hello ILifa Property Group, I would like help with property or building services.')

export function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact ILifa on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl ring-1 ring-white/30 transition-transform hover:scale-105 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-6 sm:right-6"
    >
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm0 18.16h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 01-1.25-4.4c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 012.41 5.82c0 4.53-3.69 8.22-8.23 8.22zm4.51-6.15c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
      </svg>
    </a>
  )
}
