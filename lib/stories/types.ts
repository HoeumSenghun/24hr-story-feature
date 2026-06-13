export type Story = {
  id: string
  imageData: string
  createdAt: number
}

export type StoryRepository = {
  read: () => Story[]
  write: (stories: Story[]) => void
}
