import type { StoryReactions } from './types'

export function getStoryReactionSummary(reactions?: StoryReactions) {
  if (!reactions) {
    return null
  }

  const ranked = Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  const topEntry = ranked[0]
  if (!topEntry) {
    return null
  }

  const total = ranked.reduce((sum, [, count]) => sum + count, 0)

  return {
    emoji: topEntry[0],
    total,
  }
}

export function getRankedReactions(reactions?: StoryReactions) {
  if (!reactions) {
    return []
  }

  return Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
}
