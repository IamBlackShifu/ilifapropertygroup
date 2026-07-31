export default function ContactPage() {
  return <div className="bg-gray-50">
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 text-white"><div className="mx-auto max-w-5xl px-4"><p className="text-sm uppercase tracking-widest text-primary-100">Contact</p><h1 className="mt-2 text-4xl font-bold">How can we help?</h1><p className="mt-4 text-lg text-primary-100">Contact the Ilifa team about properties, construction services, supplier listings, verification or diaspora support.</p></div></section>
    <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-3">
      <a href="tel:+263712345678" className="rounded-xl bg-white p-7 shadow transition hover:-translate-y-1"><span className="text-sm font-semibold uppercase tracking-wide text-primary-700">Phone / WhatsApp</span><strong className="mt-3 block text-lg text-gray-900">+263 71 234 5678</strong><p className="mt-2 text-sm text-gray-600">Monday–Friday, 8:00–17:00 CAT</p></a>
      <a href="mailto:info@ilifapropertygroup.com" className="rounded-xl bg-white p-7 shadow transition hover:-translate-y-1"><span className="text-sm font-semibold uppercase tracking-wide text-primary-700">Email</span><strong className="mt-3 block break-all text-lg text-gray-900">info@ilifapropertygroup.com</strong><p className="mt-2 text-sm text-gray-600">We aim to acknowledge enquiries promptly.</p></a>
      <div className="rounded-xl bg-white p-7 shadow"><span className="text-sm font-semibold uppercase tracking-wide text-primary-700">Support</span><strong className="mt-3 block text-lg text-gray-900">Zimbabwe & diaspora</strong><p className="mt-2 text-sm text-gray-600">Please include your name, location and the property or service concerned.</p></div>
    </section>
  </div>
}
