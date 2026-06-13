import twemoji from 'twemoji'

const TWEMOJI_CDN = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg'

export function getTwemojiUrl(emoji: string) {
  const codePoint = twemoji.convert.toCodePoint(emoji)
  return `${TWEMOJI_CDN}/${codePoint}.svg`
}

export function isRenderableEmoji(value: string) {
  if (!value || value.length > 32) {
    return false
  }

  try {
    getTwemojiUrl(value)
    return true
  } catch {
    return false
  }
}
