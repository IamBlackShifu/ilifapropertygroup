const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export function resolveMediaUrl(url?: string | null) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

type MediaItem = string | {
  imageUrl?: string | null
  url?: string | null
  src?: string | null
}

export function getFirstMediaUrl(media?: MediaItem[] | null) {
  if (!media || media.length === 0) return ''

  for (const item of media) {
    if (typeof item === 'string') {
      const resolved = resolveMediaUrl(item)
      if (resolved) return resolved
      continue
    }

    const resolved = resolveMediaUrl(item.imageUrl || item.url || item.src || '')
    if (resolved) return resolved
  }

  return ''
}
