import { useCallback, useSyncExternalStore } from 'react'
import { storiesStore } from '@/lib/stories/stories-store'

export function useStories() {
  const stories = useSyncExternalStore(
    storiesStore.subscribe,
    storiesStore.getSnapshot,
    storiesStore.getServerSnapshot,
  )

  const addStory = useCallback((imageData: string) => {
    storiesStore.addStory(imageData)
  }, [])

  return {
    stories,
    addStory,
    refresh: storiesStore.refresh,
  }
}
