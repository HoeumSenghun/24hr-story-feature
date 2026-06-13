import { STORIES_STORAGE_KEY } from './constants'
import { StoryError } from './errors'
import { parseStoredStories } from './validators'
import type { Story, StoryRepository } from './types'

function isBrowser() {
  return typeof window !== 'undefined'
}

export class LocalStorageStoryRepository implements StoryRepository {
  read(): Story[] {
    if (!isBrowser()) {
      return []
    }

    try {
      const raw = localStorage.getItem(STORIES_STORAGE_KEY)
      if (!raw) {
        return []
      }

      return parseStoredStories(JSON.parse(raw))
    } catch {
      return []
    }
  }

  write(stories: Story[]) {
    if (!isBrowser()) {
      return
    }

    try {
      localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories))
    } catch {
      throw new StoryError(
        'STORAGE_FAILED',
        'Unable to save story. Storage may be full.',
      )
    }
  }
}

export const storyRepository = new LocalStorageStoryRepository()
