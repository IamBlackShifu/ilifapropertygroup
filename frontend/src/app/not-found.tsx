export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm uppercase tracking-widest text-gray-500">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Return home
        </a>
      </div>
    </div>
  )
}
