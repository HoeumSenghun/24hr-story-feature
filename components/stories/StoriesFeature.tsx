'use client'

import { useState } from 'react'
import { AddStoryButton } from './AddStoryButton'
import { StoryThumbnail } from './StoryThumbnail'
import { StoryViewer } from './StoryViewer'
import { useStories } from '@/hooks/use-stories'
import { MAX_STORIES } from '@/lib/stories'

export function StoriesFeature() {
  const { stories, addStory, addReaction } = useStories()
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const isAtStoryLimit = stories.length >= MAX_STORIES

  return (
    <section className="w-full" aria-label="Stories">
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-min items-start gap-4 px-1 py-2">
          <AddStoryButton
            onStoryAdded={addStory}
            disabled={isAtStoryLimit}
          />

          {stories.map((story, index) => (
            <StoryThumbnail
              key={story.id}
              story={story}
              onSelect={() => setViewerIndex(index)}
            />
          ))}
        </div>
      </div>

      {isAtStoryLimit && (
        <p className="px-1 text-xs text-amber-600 dark:text-amber-400">
          Story limit reached ({MAX_STORIES}). Older stories expire after 24 hours.
        </p>
      )}

      {viewerIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onReact={addReaction}
        />
      )}
    </section>
  )
}
