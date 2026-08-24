/**
 * RichContent — Enhanced markdown renderer with embedded media support
 * 
 * Wraps Streamdown to add support for:
 * - YouTube embeds: {{youtube:VIDEO_ID}} or {{youtube:VIDEO_ID|Title Text}}
 * - Future: Twitter embeds, product cards, etc.
 * 
 * Drop-in replacement for <Streamdown>{content}</Streamdown>
 */

import { useMemo } from "react";
import { Streamdown } from "streamdown";
import { YouTubeEmbed, parseContentWithEmbeds } from "./YouTubeEmbed";
import { SafeImage, HULK_PLACEHOLDER } from "@/components/SafeImage";
import { mediaUrl } from "@/lib/mediaUrl";

interface RichContentProps {
  children: string;
  className?: string;
}

/** Remap HTML src= and markdown ](url) so raw <img src="/manus-storage/..."> hits R2. */
function rewriteBodyUrls(content: string) {
  return content
    .replace(/\bsrc=(["'])([^"']+)\1/gi, (_full, quote: string, url: string) => `src=${quote}${mediaUrl(url)}${quote}`)
    .replace(/\]\(([^)]+)\)/g, (_full, url: string) => `](${mediaUrl(url)})`);
}

const markdownImages = {
  img: ({ src, alt, className, node: _node, ...props }: any) => (
    <SafeImage src={src} alt={alt ?? ""} className={className} fallbackSrc={HULK_PLACEHOLDER} {...props} />
  ),
};

export function RichContent({ children, className }: RichContentProps) {
  const rewritten = useMemo(() => rewriteBodyUrls(children || ""), [children]);
  const segments = useMemo(() => parseContentWithEmbeds(rewritten), [rewritten]);

  // If no embeds found, just render normally (fast path)
  if (segments.length === 1 && segments[0].type === "markdown") {
    return (
      <div className={className}>
        <Streamdown components={markdownImages}>{rewritten}</Streamdown>
      </div>
    );
  }

  return (
    <div className={className}>
      {segments.map((segment, i) => {
        if (segment.type === "youtube") {
          return (
            <YouTubeEmbed
              key={`yt-${i}`}
              videoId={segment.videoId}
              title={segment.title}
            />
          );
        }
        // Markdown segment
        return (
          <Streamdown key={`md-${i}`} components={markdownImages}>{segment.content}</Streamdown>
        );
      })}
    </div>
  );
}

export default RichContent;
