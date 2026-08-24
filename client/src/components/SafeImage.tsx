import { type ImgHTMLAttributes, type ReactNode, useState } from "react";
import { mediaUrl } from "@/lib/mediaUrl";

/** Working R2 Hulk stand-in used when an older article image is missing or 404s. */
export const HULK_PLACEHOLDER =
  "https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk_9ebdacfa.png";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  /** Optional stand-in if src is empty or the first load fails. Hidden if this also fails. */
  fallbackSrc?: string | null;
  wrapperClassName?: string;
  children?: ReactNode;
};

/** <img> that runs URLs through mediaUrl() and hides (no broken-image icon) on load failure. */
export function SafeImage({
  src,
  fallbackSrc,
  alt = "",
  className,
  wrapperClassName,
  children,
  onError,
  ...rest
}: SafeImageProps) {
  const primary = mediaUrl(typeof src === "string" ? src.trim() : "");
  const fallback = fallbackSrc ? mediaUrl(fallbackSrc) : "";
  const [useFallback, setUseFallback] = useState(!primary && !!fallback);
  const [dead, setDead] = useState(false);

  const current = useFallback ? fallback : primary;
  if (!current || dead) return null;

  const img = (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={(event) => {
        if (!useFallback && fallback && fallback !== current) {
          setUseFallback(true);
        } else {
          setDead(true);
        }
        onError?.(event);
      }}
      {...rest}
    />
  );

  if (wrapperClassName || children) {
    return (
      <div className={wrapperClassName}>
        {img}
        {children}
      </div>
    );
  }

  return img;
}

export default SafeImage;
