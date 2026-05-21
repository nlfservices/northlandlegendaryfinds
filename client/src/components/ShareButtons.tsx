/**
 * Social media sharing buttons for articles.
 * Displays Facebook share, Instagram story share prompt, and copy link.
 * Used at the top and bottom of every MCU News article.
 */

import { Facebook, Instagram, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  /** The full URL to share */
  url: string;
  /** The article title for share text */
  title: string;
  /** Visual variant: 'dark' for dark-themed pages, 'light' for patriotic/white pages */
  variant?: "dark" | "light";
  /** Compact mode for header placement */
  compact?: boolean;
}

export default function ShareButtons({ url, title, variant = "dark", compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(fbUrl, "_blank", "width=600,height=400,scrollbars=yes");
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have a direct web share URL for feed posts,
    // but we can copy the link and prompt the user to share via story/DM
    navigator.clipboard.writeText(url);
    toast.success("Link copied! Paste it in your Instagram Story or DM to share.", {
      duration: 4000,
      icon: "📸",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const isDark = variant === "dark";

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>
          Share:
        </span>
        <button
          onClick={shareOnFacebook}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
            isDark
              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40'
              : 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/20'
          }`}
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          onClick={shareOnInstagram}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
            isDark
              ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/40'
              : 'bg-pink-500/10 text-pink-600 hover:bg-pink-500/20'
          }`}
          title="Share on Instagram"
          aria-label="Share on Instagram"
        >
          <Instagram className="w-4 h-4" />
        </button>
        <button
          onClick={copyLink}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
            isDark
              ? 'bg-muted text-muted-foreground hover:bg-muted/80'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title="Copy link"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 py-4 ${isDark ? '' : ''}`}>
      <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-muted-foreground' : 'text-gray-500'}`}>
        Share this article:
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={shareOnFacebook}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-[1.03] ${
            isDark
              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20'
          }`}
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </button>
        <button
          onClick={shareOnInstagram}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-[1.03] ${
            isDark
              ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 text-pink-400 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-orange-500/30 border border-pink-500/30'
              : 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 shadow-md shadow-pink-500/20'
          }`}
          title="Share on Instagram"
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </button>
        <button
          onClick={copyLink}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-[1.03] ${
            isDark
              ? 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
