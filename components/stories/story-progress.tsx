type StoryProgressProps = {
  total: number
  currentIndex: number
}

export function StoryProgress({ total, currentIndex }: StoryProgressProps) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex gap-1 px-3 pt-3">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
        >
          <div
            className={`h-full bg-white transition-all duration-300 ${
              index <= currentIndex ? 'w-full' : 'w-0'
            }`}
          />
        </div>
      ))}
    </div>
  )
}
