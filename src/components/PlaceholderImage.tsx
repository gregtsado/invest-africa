interface PlaceholderImageProps {
  src?: string
  alt: string
  className?: string
}

export function PlaceholderImage({ src, alt, className = '' }: PlaceholderImageProps) {
  if (!src) {
    return (
      <div 
        className={`bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-indigo-400 text-sm font-medium">{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  )
}