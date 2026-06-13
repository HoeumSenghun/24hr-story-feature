'use client'

import { StoryImage } from './story-image'
import { TwemojiImg } from './twemoji-img'
import { getStoryReactionSummary, type Story } from '@/lib/stories'

type StoryThumbnailProps = {
  story: Story
  onSelect: () => void
}

export function StoryThumbnail({ story, onSelect }: StoryThumbnailProps) {
  const reactionSummary = getStoryReactionSummary(story.reactions)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label="View story"
      className="group flex shrink-0 flex-col items-center gap-1.5"
    >
      <span className="relative rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 transition group-hover:scale-105 group-active:scale-95">
        <span className="block rounded-full bg-white p-0.5 dark:bg-zinc-950">
          <StoryImage
            src={story.imageData}
            alt="Story preview"
            className="size-[3.75rem] rounded-full object-cover sm:size-[4.25rem]"
          />
        </span>

        {reactionSummary && (
          <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-zinc-900 shadow-md dark:border-zinc-950">
            <TwemojiImg emoji={reactionSummary.emoji} className="size-3.5" />
            <span className="sr-only">{reactionSummary.total} reactions</span>
          </span>
        )}
      </span>

      <span className="max-w-16 truncate text-xs text-zinc-600 dark:text-zinc-400">
        Your story
      </span>
    </button>
  )
}
