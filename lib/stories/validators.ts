import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_FILE_BYTES,
  STORY_TTL_MS,
} from './constants'
import { StoryError } from './errors'
import type { Story } from './types'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const IMAGE_DATA_URL_PATTERN =
  /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i

export function isStoryExpired(createdAt: number, now = Date.now()) {
  return now - createdAt >= STORY_TTL_MS
}

export function isValidStoryId(id: string) {
  return UUID_PATTERN.test(id)
}

export function isValidImageDataUrl(value: string) {
  return IMAGE_DATA_URL_PATTERN.test(value)
}

export function isValidStoryRecord(value: unknown): value is Story {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.id === 'string' &&
    isValidStoryId(record.id) &&
    typeof record.imageData === 'string' &&
    isValidImageDataUrl(record.imageData) &&
    typeof record.createdAt === 'number' &&
    Number.isFinite(record.createdAt) &&
    record.createdAt > 0
  )
}

export function parseStoredStories(raw: unknown): Story[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.filter(isValidStoryRecord)
}

export function validateUploadFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    throw new StoryError('INVALID_FILE', 'Please upload a JPEG, PNG, or WebP image')
  }

  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    throw new StoryError('FILE_TOO_LARGE', 'Image must be smaller than 10MB')
  }
}
