'use client'

import { useCallback, useRef, useState } from 'react'
import EmojiPicker, { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'
import { TwemojiImg } from './twemoji-img'
import { getRankedReactions } from '@/lib/stories/reaction-utils'
import type { StoryReactions } from '@/lib/stories'

type ReactionBurst = {
  id: string
  emoji: string
  offsetX: number
}

type StoryReactionsProps = {
  storyId: string
  reactions?: StoryReactions
  onReact: (storyId: string, emoji: string) => void
}

const BURST_DURATION_MS = 900

export function StoryReactions({ storyId, reactions, onReact }: StoryReactionsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [bursts, setBursts] = useState<ReactionBurst[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)

  const rankedReactions = getRankedReactions(reactions)
  const totalReactions = rankedReactions.reduce((sum, [, count]) => sum + count, 0)

  const sendReaction = useCallback(
    (emoji: string) => {
      onReact(storyId, emoji)

      const burstId = crypto.randomUUID()
      const offsetX = Math.round(Math.random() * 80 - 40)

      setBursts((current) => [...current, { id: burstId, emoji, offsetX }])

      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== burstId))
      }, BURST_DURATION_MS)
    },
    [onReact, storyId],
  )

  function handleEmojiClick(emojiData: EmojiClickData) {
    sendReaction(emojiData.emoji)
    setIsPickerOpen(false)
  }

  function togglePicker() {
    setIsPickerOpen((open) => !open)
  }

  return (
    <div className="absolute inset-x-0 bottom-16 z-20 flex flex-col items-center gap-3 px-4">
      <div className="pointer-events-none absolute bottom-28 flex size-32 items-end justify-center">
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className="story-reaction-burst absolute"
            style={{ left: `calc(50% + ${burst.offsetX}px)` }}
            aria-hidden="true"
          >
            <TwemojiImg emoji={burst.emoji} className="size-10 drop-shadow-lg" />
          </span>
        ))}
      </div>

      {isPickerOpen && (
        <>
          <button
            type="button"
            aria-label="Close emoji picker"
            className="fixed inset-0 z-30 bg-transparent"
            onClick={() => setIsPickerOpen(false)}
          />
          <div
            ref={pickerRef}
            className="absolute bottom-full z-40 mb-3 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.TWITTER}
              width={320}
              height={400}
              searchPlaceholder="Search emoji..."
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
            />
          </div>
        </>
      )}

      <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/80 p-2 shadow-xl backdrop-blur-md">
        {rankedReactions.map(([emoji, count]) => (
          <button
            key={emoji}
            type="button"
            aria-label={`React with ${emoji}, ${count} times`}
            onClick={() => sendReaction(emoji)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white/5 px-2.5 py-1.5 transition hover:bg-white/15 active:scale-95"
          >
            <TwemojiImg emoji={emoji} className="size-6" />
            <span className="text-xs font-semibold text-white">{count}</span>
          </button>
        ))}

        <button
          type="button"
          aria-label="Open emoji picker"
          aria-expanded={isPickerOpen}
          onClick={togglePicker}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/90 text-white transition hover:bg-pink-500 active:scale-95"
        >
          <TwemojiImg emoji="😊" className="size-6" />
        </button>
      </div>

      {totalReactions > 0 && (
        <p className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          {totalReactions} reaction{totalReactions === 1 ? '' : 's'}
        </p>
      )}
    </div>
  )
}
