import { StoriesFeature } from '@/components/stories/StoriesFeature'

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Stories
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload images that disappear after 24 hours
        </p>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <StoriesFeature />

        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tap the plus button to add a story. Stories are stored locally in
            your browser and automatically removed after 24 hours.
          </p>
        </div>
      </main>
    </div>
  )
}
