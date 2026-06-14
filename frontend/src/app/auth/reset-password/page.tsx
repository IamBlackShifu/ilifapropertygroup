'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { authAPI } from '@/lib/api-client'

export default function ResetPasswordPage() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') || '')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('This password reset link is missing a reset token.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await authAPI.resetPassword(token, password)
      setSuccess(true)
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to reset password. Please request a new link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="ILifa Property Group" className="h-12 w-auto" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              ILifa Property Group
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Set New Password</h1>
          <p className="text-gray-600 mt-2">Choose a new password for your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password updated</h3>
              <p className="text-gray-600 mb-6">
                Your password has been reset. You can now sign in with your new password.
              </p>
              <Link href="/auth/login" className="btn btn-primary inline-flex px-6 py-3">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {!token && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                  This reset link is incomplete. Please request a new password reset email.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="label">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="Enter a new password"
                    disabled={loading || !token}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    placeholder="Confirm your new password"
                    disabled={loading || !token}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full btn btn-primary py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
