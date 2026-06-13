export type StoryReactions = Record<string, number>

export type Story = {
  id: string
  imageData: string
  createdAt: number
  reactions?: StoryReactions
}

export type StoryRepository = {
  read: () => Story[]
  write: (stories: Story[]) => void
}
