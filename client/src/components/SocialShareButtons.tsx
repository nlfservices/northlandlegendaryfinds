/**
 * SocialShareButtons — Reusable social media sharing component
 * Supports: X/Twitter, Facebook, LinkedIn, Reddit, Email, Copy Link
 * Two display modes: inline (in article header) and floating sidebar
 */

import { useState, useEffect } from "react";
import { Share2, Check, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
  excerpt?: string;
  /** "inline" for header row, "floating" for sticky sidebar */
  variant?: "inline" | "floating";
}

// Custom SVG icons for platforms not in lucide
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

const SHARE_PLATFORMS = [
  {
    key: "x",
    label: "Share on X",
    icon: XIcon,
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: "hover:bg-zinc-700 hover:text-white",
    floatingColor: "hover:bg-zinc-700",
  },
  {
    key: "facebook",
    label: "Share on Facebook",
    icon: FacebookIcon,
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: "hover:bg-[#1877F2]/20 hover:text-[#1877F2]",
    floatingColor: "hover:bg-[#1877F2]/20",
  },
  {
    key: "linkedin",
    label: "Share on LinkedIn",
    icon: LinkedInIcon,
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: "hover:bg-[#0A66C2]/20 hover:text-[#0A66C2]",
    floatingColor: "hover:bg-[#0A66C2]/20",
  },
  {
    key: "reddit",
    label: "Share on Reddit",
    icon: RedditIcon,
    getUrl: (url: string, title: string) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    color: "hover:bg-[#FF4500]/20 hover:text-[#FF4500]",
    floatingColor: "hover:bg-[#FF4500]/20",
  },
  {
    key: "email",
    label: "Share via Email",
    icon: Mail,
    getUrl: (url: string, title: string, excerpt?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${excerpt ? excerpt + "\n\n" : ""}Read more: ${url}`)}`,
    color: "hover:bg-emerald-500/20 hover:text-emerald-400",
    floatingColor: "hover:bg-emerald-500/20",
  },
];

export function SocialShareInline({ url, title, excerpt }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        {SHARE_PLATFORMS.map((platform) => (
          <Tooltip key={platform.key}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 w-8 p-0 border-border/50 transition-all duration-200 ${platform.color}`}
                onClick={() =>
                  window.open(
                    platform.getUrl(url, title, excerpt),
                    platform.key === "email" ? "_self" : "_blank",
                    platform.key !== "email" ? "noopener,noreferrer" : undefined
                  )
                }
              >
                <platform.icon className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {platform.label}
            </TooltipContent>
          </Tooltip>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 border-border/50 transition-all duration-200 ${
                copied
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "hover:bg-primary/20 hover:text-primary"
              }`}
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {copied ? "Copied!" : "Copy link"}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export function SocialShareFloating({ url, title, excerpt }: SocialShareProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating bar after scrolling past the article header (~400px)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 transition-all duration-300 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
        }`}
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-2 flex flex-col gap-1.5 shadow-lg">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center mb-1">
            Share
          </div>

          {SHARE_PLATFORMS.map((platform) => (
            <Tooltip key={platform.key}>
              <TooltipTrigger asChild>
                <button
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground transition-all duration-200 ${platform.floatingColor}`}
                  onClick={() =>
                    window.open(
                      platform.getUrl(url, title, excerpt),
                      platform.key === "email" ? "_self" : "_blank",
                      platform.key !== "email" ? "noopener,noreferrer" : undefined
                    )
                  }
                >
                  <platform.icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {platform.label}
              </TooltipContent>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  copied
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-primary/20 hover:text-primary"
                }`}
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {copied ? "Copied!" : "Copy link"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

/** Bottom share bar for mobile — appears after article content */
export function SocialShareBottomBar({ url, title, excerpt }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <Share2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Share this article</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {SHARE_PLATFORMS.map((platform) => (
          <Button
            key={platform.key}
            variant="outline"
            size="sm"
            className={`gap-2 border-border/50 transition-all duration-200 ${platform.color}`}
            onClick={() =>
              window.open(
                platform.getUrl(url, title, excerpt),
                platform.key === "email" ? "_self" : "_blank",
                platform.key !== "email" ? "noopener,noreferrer" : undefined
              )
            }
          >
            <platform.icon className="w-3.5 h-3.5" />
            <span className="text-xs">{platform.label.replace("Share on ", "").replace("Share via ", "")}</span>
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 border-border/50 transition-all duration-200 ${
            copied
              ? "bg-primary/20 text-primary border-primary/30"
              : "hover:bg-primary/20 hover:text-primary"
          }`}
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          <span className="text-xs">{copied ? "Copied!" : "Copy Link"}</span>
        </Button>
      </div>
    </div>
  );
}
