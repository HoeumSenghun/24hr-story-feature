import { useCallback, useState } from 'react'

type UseStoryViewerOptions = {
  totalStories: number
  initialIndex: number
  onClose: () => void
}

export function useStoryViewer({
  totalStories,
  initialIndex,
  onClose,
}: UseStoryViewerOptions) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goNext = useCallback(() => {
    setCurrentIndex((index) => {
      if (index >= totalStories - 1) {
        onClose()
        return index
      }

      return index + 1
    })
  }, [onClose, totalStories])

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(0, index - 1))
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowRight') {
        goNext()
        return
      }

      if (event.key === 'ArrowLeft') {
        goPrev()
      }
    },
    [goNext, goPrev, onClose],
  )

  return {
    currentIndex,
    goNext,
    goPrev,
    handleKeyDown,
    canGoPrev: currentIndex > 0,
    canGoNext: currentIndex < totalStories - 1,
  }
}
