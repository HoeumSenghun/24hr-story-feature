'use client'

import { useRef } from 'react'
import { useStoryUpload } from '@/hooks/use-story-upload'
import { ALLOWED_IMAGE_TYPES } from '@/lib/stories/constants'

type AddStoryButtonProps = {
  onStoryAdded: (imageData: string) => void
  disabled?: boolean
}

export function AddStoryButton({ onStoryAdded, disabled = false }: AddStoryButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, isProcessing, error } = useStoryUpload(onStoryAdded)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    await upload(file)
  }

  const isDisabled = disabled || isProcessing

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isDisabled}
        aria-label="Add story"
        className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-zinc-400 bg-zinc-100 transition hover:border-pink-500 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-pink-400 dark:hover:bg-zinc-700 sm:size-[4.5rem]"
      >
        {isProcessing ? (
          <span className="size-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-7 text-zinc-600 dark:text-zinc-300"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <span className="max-w-16 truncate text-xs text-zinc-600 dark:text-zinc-400">
        Add story
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="max-w-24 text-center text-[10px] text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
