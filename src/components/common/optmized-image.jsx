/**
 * OptimizedImage — FIX SUMMARY:
 * 1. Added `fetchpriority="high"` only for priority images (LCP fix)
 * 2. decoding="async" for all non-priority images (main thread relief)
 * 3. srcSet builds query params only if URL supports it; falls back cleanly
 * 4. width + height required to prevent CLS (layout shift)
 */
const OptimizedImage = ({
  src,
  alt = "",
  className = "",
  style = {},
  priority = false,
  width,
  height,
  sizes = "100vw",
  onError,
  ...rest
}) => {
  if (!src) return null;

  const WIDTHS = [320, 640, 960, 1280, 1600];
  const QUALITY = 75;

  const buildUrl = (originalSrc, w, q) => {
    try {
      const url = new URL(originalSrc);
      url.searchParams.set("w", w);
      url.searchParams.set("q", q);
      return url.toString();
    } catch {
      return originalSrc;
    }
  };

  const srcSet = WIDTHS.map((w) => `${buildUrl(src, w, QUALITY)} ${w}w`).join(", ");

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      // FIX: loading="eager" + fetchpriority="high" for LCP image (first hero slide)
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      // FIX: sync decoding only for priority (others stay async — saves main thread)
      decoding={priority ? "sync" : "async"}
      onError={onError}
      {...rest}
    />
  );
};

export default OptimizedImage;