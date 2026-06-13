import { useCallback, useRef } from 'react'
import { SWIPE_THRESHOLD_PX } from '@/lib/stories'

type UseSwipeGestureOptions = {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeGestureOptions) {
  const touchStartX = useRef<number | null>(null)

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (touchStartX.current === null) {
        return
      }

      const deltaX = event.changedTouches[0].clientX - touchStartX.current

      if (deltaX < -SWIPE_THRESHOLD_PX) {
        onSwipeLeft()
      } else if (deltaX > SWIPE_THRESHOLD_PX) {
        onSwipeRight()
      }

      touchStartX.current = null
    },
    [onSwipeLeft, onSwipeRight],
  )

  return {
    onTouchStart,
    onTouchEnd,
  }
}
