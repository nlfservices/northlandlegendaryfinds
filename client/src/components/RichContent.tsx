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

interface RichContentProps {
  children: string;
  className?: string;
}

export function RichContent({ children, className }: RichContentProps) {
  const segments = useMemo(() => parseContentWithEmbeds(children), [children]);

  // If no embeds found, just render normally (fast path)
  if (segments.length === 1 && segments[0].type === "markdown") {
    return (
      <div className={className}>
        <Streamdown>{children}</Streamdown>
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
          <Streamdown key={`md-${i}`}>{segment.content}</Streamdown>
        );
      })}
    </div>
  );
}

export default RichContent;
