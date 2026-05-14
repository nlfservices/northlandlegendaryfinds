/**
 * YouTube Embed Component
 * Renders a responsive YouTube video player with privacy-enhanced mode
 */

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = "Video" }: YouTubeEmbedProps) {
  return (
    <div className="my-8">
      <div className="relative w-full overflow-hidden rounded-xl border border-border shadow-lg" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {title && title !== "Video" && (
        <p className="text-center text-sm text-muted-foreground mt-3 italic">
          ▶ {title}
        </p>
      )}
    </div>
  );
}

/**
 * Processes article markdown content and replaces YouTube tags with embed components.
 * Supports the syntax: {{youtube:VIDEO_ID}} or {{youtube:VIDEO_ID|Title Text}}
 * 
 * Returns an array of content segments (strings for markdown, objects for embeds)
 */
export type ContentSegment = 
  | { type: "markdown"; content: string }
  | { type: "youtube"; videoId: string; title: string };

export function parseContentWithEmbeds(content: string): ContentSegment[] {
  const youtubeRegex = /\{\{youtube:([a-zA-Z0-9_-]+)(?:\|([^}]+))?\}\}/g;
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = youtubeRegex.exec(content)) !== null) {
    // Add markdown content before this embed
    if (match.index > lastIndex) {
      segments.push({
        type: "markdown",
        content: content.slice(lastIndex, match.index),
      });
    }
    // Add the YouTube embed
    segments.push({
      type: "youtube",
      videoId: match[1],
      title: match[2] || "Video",
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown content
  if (lastIndex < content.length) {
    segments.push({
      type: "markdown",
      content: content.slice(lastIndex),
    });
  }

  return segments;
}
