import { MAX_REACTIONS_PER_STORY, MAX_STORIES, STORY_TTL_MS } from './constants'
import { isRenderableEmoji } from './emoji-utils'
import { StoryError } from './errors'
import { isStoryExpired, isValidImageDataUrl } from './validators'
import { storyRepository } from './repository'
import type { Story } from './types'

function sortStories(stories: Story[]) {
  return [...stories].sort((a, b) => a.createdAt - b.createdAt)
}

function purgeExpired(stories: Story[]) {
  return stories.filter((story) => !isStoryExpired(story.createdAt))
}

function persistActiveStories(stories: Story[]) {
  const activeStories = purgeExpired(stories)
  storyRepository.write(activeStories)
  return activeStories
}

export const storyService = {
  list(): Story[] {
    return sortStories(persistActiveStories(storyRepository.read()))
  },

  create(imageData: string): Story {
    if (!isValidImageDataUrl(imageData)) {
      throw new StoryError('INVALID_IMAGE', 'Image data is invalid')
    }

    const activeStories = persistActiveStories(storyRepository.read())

    if (activeStories.length >= MAX_STORIES) {
      throw new StoryError(
        'STORY_LIMIT_REACHED',
        `You can only keep ${MAX_STORIES} active stories`,
      )
    }

    const story: Story = {
      id: crypto.randomUUID(),
      imageData,
      createdAt: Date.now(),
    }

    storyRepository.write([...activeStories, story])

    return story
  },

  addReaction(storyId: string, emoji: string): Story {
    if (!isRenderableEmoji(emoji)) {
      throw new StoryError('INVALID_IMAGE', 'Invalid emoji reaction')
    }

    const activeStories = persistActiveStories(storyRepository.read())
    const storyIndex = activeStories.findIndex((story) => story.id === storyId)

    if (storyIndex === -1) {
      throw new StoryError('STORY_NOT_FOUND', 'Story not found')
    }

    const story = activeStories[storyIndex]
    const reactions = { ...story.reactions }

    if (!reactions[emoji] && Object.keys(reactions).length >= MAX_REACTIONS_PER_STORY) {
      throw new StoryError(
        'STORY_LIMIT_REACHED',
        `You can only add ${MAX_REACTIONS_PER_STORY} different reactions per story`,
      )
    }

    reactions[emoji] = (reactions[emoji] ?? 0) + 1

    const updatedStory: Story = {
      ...story,
      reactions,
    }

    activeStories[storyIndex] = updatedStory
    storyRepository.write(activeStories)

    return updatedStory
  },

  getRemainingMs(createdAt: number) {
    return Math.max(0, STORY_TTL_MS - (Date.now() - createdAt))
  },
}
