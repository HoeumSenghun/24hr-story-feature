import { STORIES_STORAGE_KEY } from './constants'
import { storyService } from './story-service'
import type { Story } from './types'

type Listener = () => void

const listeners = new Set<Listener>()
let snapshot: Story[] = []
let expiryTimer: ReturnType<typeof setTimeout> | null = null
let isInitialized = false

function notify() {
  listeners.forEach((listener) => listener())
}

function clearExpiryTimer() {
  if (expiryTimer !== null) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

function scheduleNextExpiry() {
  clearExpiryTimer()

  if (snapshot.length === 0) {
    return
  }

  const nextExpiryMs = Math.min(
    ...snapshot.map((story) => storyService.getRemainingMs(story.createdAt)),
  )

  expiryTimer = setTimeout(refresh, nextExpiryMs + 100)
}

function refresh() {
  snapshot = storyService.list()
  notify()
  scheduleNextExpiry()
}

function initStore() {
  if (isInitialized || typeof window === 'undefined') {
    return
  }

  isInitialized = true
  refresh()

  window.addEventListener('storage', (event) => {
    if (event.key === STORIES_STORAGE_KEY) {
      refresh()
    }
  })

  window.addEventListener('focus', refresh)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refresh()
    }
  })
}

export const storiesStore = {
  subscribe(listener: Listener) {
    initStore()
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  },

  getSnapshot() {
    return snapshot
  },

  getServerSnapshot() {
    return [] as Story[]
  },

  refresh,

  addStory(imageData: string) {
    storyService.create(imageData)
    refresh()
  },
}
