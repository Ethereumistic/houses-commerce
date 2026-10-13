function ProductImage({
  name,
  alt,
  priority = false,
  wide = false,
  className = "",
}: {
  name: string
  alt: string
  priority?: boolean
  wide?: boolean
  className?: string
}) {
  return (
    <img
      className={className}
      src={`/images/${name}.webp`}
      srcSet={`/images/${name}-800.webp 800w, /images/${name}.webp 1672w`}
      sizes={
        wide
          ? "100vw"
          : "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 40vw"
      }
      width={1672}
      height={941}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  )
}

export { ProductImage }
