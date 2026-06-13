'use client'

import { getTwemojiUrl } from '@/lib/stories/emoji-utils'

type TwemojiImgProps = {
  emoji: string
  className?: string
}

export function TwemojiImg({ emoji, className }: TwemojiImgProps) {
  return (
    // Twemoji CDN SVG — consistent cross-platform emoji rendering.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getTwemojiUrl(emoji)}
      alt={emoji}
      className={className}
      draggable={false}
    />
  )
}
