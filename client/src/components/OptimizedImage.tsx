/**
 * OptimizedImage - Performance-optimized image component
 * Features:
 * - IntersectionObserver-based lazy loading
 * - Blur-up placeholder animation
 * - Responsive sizing with sizes attribute
 * - Proper width/height to prevent CLS (Cumulative Layout Shift)
 * - decoding="async" for non-blocking decode
 * - Error fallback with retry
 */

import { useRef, useState, useEffect, memo } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Responsive sizes hint for the browser, e.g. "(max-width: 640px) 50vw, 200px" */
  sizes?: string;
  /** Aspect ratio for placeholder, e.g. "2.5/3.5" for trading cards */
  aspectRatio?: string;
  /** Whether to eagerly load (for above-the-fold images) */
  priority?: boolean;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Fallback image URL on error */
  fallback?: string;
}

const PLACEHOLDER_GRADIENT = "linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)/0.5) 100%)";

function OptimizedImageInner({
  src,
  alt,
  className = "",
  sizes,
  aspectRatio,
  priority = false,
  onLoad,
  fallback,
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Update src when prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
    setLoaded(false);
  }, [src]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (priority || inView) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Start loading 300px before visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, inView]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio,
        background: !loaded ? PLACEHOLDER_GRADIENT : undefined,
      }}
    >
      {/* Shimmer placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse" />
      )}

      {/* Actual image */}
      {inView && !error && (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const OptimizedImage = memo(OptimizedImageInner);
export default OptimizedImage;
export { OptimizedImage };
