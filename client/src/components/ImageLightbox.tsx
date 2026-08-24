/**
 * ImageLightbox — Click-to-zoom lightbox for card images in articles.
 * Renders a clickable image that opens a full-screen overlay with the image at full resolution.
 */

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";
import { mediaUrl } from "@/lib/mediaUrl";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export default function ImageLightbox({ src, alt, className = "", caption }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const resolved = mediaUrl(src);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // If the image fails to load, hide it entirely
  if (hasError || !resolved) return null;

  // Determine if the image needs absolute positioning (used in lc-art containers)
  const isAbsolute = className.includes('absolute');
  // Strip absolute/inset from the img className since the wrapper handles positioning
  const imgClassName = isAbsolute
    ? className.replace(/absolute/g, '').replace(/inset-0/g, '').trim()
    : className;

  return (
    <>
      {/* Clickable image with zoom indicator */}
      <div
        className={`group cursor-pointer ${isAbsolute ? 'absolute inset-0' : 'relative'}`}
        onClick={open}
      >
        <img src={resolved} alt={alt} className={`${imgClassName} ${isAbsolute ? 'w-full h-full' : ''}`} loading="lazy" onError={() => setHasError(true)} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-full p-3">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
        </div>
        {caption && (
          <p className="absolute bottom-2 left-0 right-0 text-xs text-gray-400 text-center italic">{caption}</p>
        )}
      </div>

      {/* Lightbox overlay — portaled to body to escape overflow:hidden containers */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          style={{ animation: "fadeIn 200ms ease-out" }}
          onClick={close}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
            onClick={close}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolved}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          onError={() => setHasError(true)}
        />
            {(caption || alt) && (
              <p className="text-white/80 text-sm mt-3 text-center font-medium max-w-md">
                {caption || alt}
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
