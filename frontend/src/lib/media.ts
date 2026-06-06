const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export function resolveMediaUrl(url?: string | null) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export function getFirstMediaUrl(media?: Array<string | { imageUrl?: string | null }> | null) {
  if (!media || media.length === 0) return ''

  const first = media[0]
  if (typeof first === 'string') {
    return resolveMediaUrl(first)
  }

  return resolveMediaUrl(first.imageUrl || '')
}