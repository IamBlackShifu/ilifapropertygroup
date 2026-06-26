'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { useAuth } from '@/contexts/AuthContext'

type Review = {
  id: string
  rating: number
  comment?: string
  createdAt: string
  reviewer?: {
    firstName?: string
    lastName?: string
  }
}

type ReviewSectionProps = {
  entityName: string
  reviewsUrl: string
  submitUrl: string
  initialReviews?: Review[]
  initialRatingAverage?: number | string
  initialRatingCount?: number
}

function Stars({ rating, onSelect }: { rating: number; onSelect?: (rating: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating
        const className = active ? 'text-amber-500' : 'text-gray-300'

        if (onSelect) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelect(star)}
              className={`text-2xl leading-none ${className} hover:text-amber-500`}
              aria-label={`Rate ${star} out of 5`}
            >
              *
            </button>
          )
        }

        return (
          <span key={star} className={`text-lg leading-none ${className}`} aria-hidden="true">
            *
          </span>
        )
      })}
    </div>
  )
}

export function ReviewSection({
  entityName,
  reviewsUrl,
  submitUrl,
  initialReviews = [],
  initialRatingAverage,
  initialRatingCount = 0,
}: ReviewSectionProps) {
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [ratingAverage, setRatingAverage] = useState(Number(initialRatingAverage || 0))
  const [ratingCount, setRatingCount] = useState(initialRatingCount || initialReviews.length)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadReviews = async () => {
    try {
      setLoadingReviews(true)
      const response = await apiClient.get(reviewsUrl)
      const payload = response.data?.data || response.data || []
      const reviewData = Array.isArray(payload) ? payload : payload.data || []
      const metaTotal = response.data?.meta?.total || payload.meta?.total

      setReviews(reviewData)
      setRatingCount(metaTotal ?? reviewData.length)

      if (reviewData.length > 0) {
        const average = reviewData.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviewData.length
        setRatingAverage(average)
      } else {
        setRatingAverage(0)
      }
    } catch (reviewError) {
      console.error('Error loading reviews:', reviewError)
    } finally {
      setLoadingReviews(false)
    }
  }

  useEffect(() => {
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewsUrl])

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!comment.trim()) {
      setError('Please add a short comment with your rating.')
      return
    }

    if (typeof window === 'undefined' || !localStorage.getItem('accessToken')) {
      setError('Please sign in again before submitting your review.')
      return
    }

    try {
      setSubmitting(true)
      await apiClient.post(submitUrl, {
        rating,
        comment: comment.trim(),
      })
      setComment('')
      setRating(5)
      setMessage('Thanks, your review has been submitted.')
      await loadReviews()
    } catch (submitError: any) {
      const status = submitError.response?.status
      if (status === 401) {
        setError('Please sign in again before submitting your review.')
      } else {
        setError(submitError.response?.data?.message || 'Could not submit your review.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-950">Reviews</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Stars rating={Math.round(ratingAverage)} />
            <span className="text-sm font-medium text-gray-700">
              {ratingAverage > 0 ? ratingAverage.toFixed(1) : 'No rating yet'}
            </span>
            <span className="text-sm text-gray-500">
              {ratingCount} review{ratingCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        {loadingReviews && <span className="text-sm text-gray-500">Refreshing...</span>}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        {authLoading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Checking your sign-in status...</p>
          </div>
        ) : isAuthenticated && user ? (
          <form onSubmit={submitReview} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-950">Leave a review for {entityName}</h3>
            <div className="mt-3">
              <Stars rating={rating} onSelect={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Share what went well, communication quality, delivery, workmanship, or anything future clients should know."
            />
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-700">Sign in as a client to leave a review.</p>
            <Link href="/auth/login" className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800">
              Sign in to review
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-950">
                    {review.reviewer?.firstName || 'Client'} {review.reviewer?.lastName || ''}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.comment && <p className="mt-3 text-sm leading-6 text-gray-700">{review.comment}</p>}
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </div>
    </section>
  )
}
