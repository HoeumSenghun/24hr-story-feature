'use client'

import { StoryImage } from './story-image'
import type { Story } from '@/lib/stories'

type StoryThumbnailProps = {
  story: Story
  onSelect: () => void
}

export function StoryThumbnail({ story, onSelect }: StoryThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label="View story"
      className="group flex shrink-0 flex-col items-center gap-1.5"
    >
      <span className="rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 transition group-hover:scale-105 group-active:scale-95">
        <span className="block rounded-full bg-white p-0.5 dark:bg-zinc-950">
          <StoryImage
            src={story.imageData}
            alt="Story preview"
            className="size-[3.75rem] rounded-full object-cover sm:size-[4.25rem]"
          />
        </span>
      </span>

      <span className="max-w-16 truncate text-xs text-zinc-600 dark:text-zinc-400">
        Your story
      </span>
    </button>
  )
}
