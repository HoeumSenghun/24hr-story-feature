'use client'

import { useCallback } from 'react'
import { StoryImage } from './story-image'
import { StoryProgress } from './story-progress'
import { StoryReactions } from './story-reactions'
import { useStoryViewer } from '@/hooks/use-story-viewer'
import { useSwipeGesture } from '@/hooks/use-swipe-gesture'
import type { Story } from '@/lib/stories'

type StoryViewerProps = {
  stories: Story[]
  initialIndex: number
  onClose: () => void
  onReact: (storyId: string, emoji: string) => void
}

export function StoryViewer({
  stories,
  initialIndex,
  onClose,
  onReact,
}: StoryViewerProps) {
  const { currentIndex, goNext, goPrev, handleKeyDown, canGoPrev } = useStoryViewer({
    totalStories: stories.length,
    initialIndex,
    onClose,
  })

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  })

  const setDialogRef = useCallback((node: HTMLDialogElement | null) => {
    if (!node) {
      return
    }

    if (!node.open) {
      node.showModal()
    }

    node.focus()

    return () => {
      node.close()
    }
  }, [])

  if (stories.length === 0) {
    return null
  }

  const currentStory = stories[currentIndex]

  return (
    <dialog
      ref={setDialogRef}
      aria-label="Story viewer"
      onKeyDown={handleKeyDown}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="fixed inset-0 z-50 m-0 flex size-full max-h-none max-w-none items-center justify-center border-0 bg-black/95 p-0 backdrop:bg-black/95 open:flex"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close story viewer"
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-6"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>

      <StoryProgress total={stories.length} currentIndex={currentIndex} />

      <div
        className="relative flex h-full w-full max-w-lg items-center justify-center px-2 py-12 sm:max-w-md"
        {...swipeHandlers}
      >
        <StoryImage
          src={currentStory.imageData}
          alt={`Story ${currentIndex + 1} of ${stories.length}`}
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        <button
          type="button"
          aria-label="Previous story"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="absolute inset-y-0 left-0 w-1/3 disabled:cursor-default"
        />
        <button
          type="button"
          aria-label="Next story"
          onClick={goNext}
          className="absolute inset-y-0 right-0 w-1/3"
        />
      </div>

      <StoryReactions
        storyId={currentStory.id}
        reactions={currentStory.reactions}
        onReact={onReact}
      />

      <p className="absolute bottom-6 text-sm text-white/60">
        {currentIndex + 1} / {stories.length} · Swipe or tap sides to navigate
      </p>
    </dialog>
  )
}
