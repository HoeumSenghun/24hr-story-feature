type StoryImageProps = {
  src: string
  alt: string
  className?: string
}

export function StoryImage({ src, alt, className }: StoryImageProps) {
  return (
    // Base64 data URLs from validated uploads only  not remote URLs.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} draggable={false} />
  )
}
