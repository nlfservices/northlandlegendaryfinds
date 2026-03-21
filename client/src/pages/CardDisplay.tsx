/**
 * Card Display Tool — Premium single-page card display with 7 switchable cosmic themes.
 * Features: space nebula backgrounds, corner ornaments, shimmer strip, scanline overlay,
 * floating particles, file upload with fade-in, download as image, and theme-matched accent colors.
 *
 * Supports URL params:
 *   ?img=<encoded_url>  — pre-load a card image
 *   ?theme=<theme_id>   — auto-select a theme (gold-amber, blue-silver, emerald-green, etc.)
 *   ?name=<card_name>   — display card name below the frame
 */

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
// Canvas-based download (html2canvas doesn't support OKLCH colors from Tailwind 4)

// ─── Theme Definitions ───────────────────────────────────────────────────────

interface Theme {
  id: string;
  label: string;
  accent: string;
  bright: string;
  dim: string;
  glow: string;
  particle: string;
  borderDark: string;
  bgUrl: string;
}

const THEMES: Theme[] = [
  {
    id: "gold-amber",
    label: "1975 ERA\u2122 \u00b7 Gold / Amber",
    accent: "#e8a020",
    bright: "#ffb930",
    dim: "#8b5e0a",
    glow: "rgba(232,160,32,0.6)",
    particle: "#e8a020",
    borderDark: "rgba(232,160,32,0.15)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-1975-gold-amber_4a450d14.png",
  },
  {
    id: "blue-silver",
    label: "1976 ERA\u2122 \u00b7 Blue / Silver",
    accent: "#4a9eff",
    bright: "#88c4ff",
    dim: "#1a4a8a",
    glow: "rgba(74,158,255,0.55)",
    particle: "#4a9eff",
    borderDark: "rgba(74,158,255,0.15)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-1976-blue-silver_6b1bd586.png",
  },
  {
    id: "emerald-green",
    label: "2025 ERA\u2122 \u00b7 Emerald Green",
    accent: "#00e5a0",
    bright: "#40ffbe",
    dim: "#006644",
    glow: "rgba(0,229,160,0.5)",
    particle: "#00e5a0",
    borderDark: "rgba(0,229,160,0.12)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-2025-emerald-green_6d5f07b4.png",
  },
  {
    id: "mint-bronze",
    label: "MARVEL MINT\u2122 \u00b7 Bronze",
    accent: "#cd7f32",
    bright: "#e8a060",
    dim: "#7a3d10",
    glow: "rgba(205,127,50,0.55)",
    particle: "#cd7f32",
    borderDark: "rgba(205,127,50,0.15)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-bronze_ab7d9bd7.png",
  },
  {
    id: "mint-gold",
    label: "MARVEL MINT\u2122 \u00b7 Gold",
    accent: "#ffd700",
    bright: "#ffe94d",
    dim: "#8a6800",
    glow: "rgba(255,215,0,0.55)",
    particle: "#ffd700",
    borderDark: "rgba(255,215,0,0.12)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-gold_d9dc1d49.png",
  },
  {
    id: "mint-platinum",
    label: "MARVEL MINT\u2122 \u00b7 Platinum",
    accent: "#e5e4e2",
    bright: "#ffffff",
    dim: "#888888",
    glow: "rgba(229,228,226,0.45)",
    particle: "#e5e4e2",
    borderDark: "rgba(229,228,226,0.12)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-platinum_0fe0fc77.png",
  },
  {
    id: "mint-silver",
    label: "MARVEL MINT\u2122 \u00b7 Silver",
    accent: "#c0c0c0",
    bright: "#e8e8e8",
    dim: "#606060",
    glow: "rgba(192,192,192,0.45)",
    particle: "#c0c0c0",
    borderDark: "rgba(192,192,192,0.12)",
    bgUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/space-bg-mint-silver_4a175856.png",
  },
];

// Map card types from the database to theme IDs
const CARD_TYPE_TO_THEME: Record<string, string> = {
  "COMIC BOOK HEROES 1975": "gold-amber",
  "COMIC BOOK HEROES 1976": "blue-silver",
  "COMIC BOOK HEROES 2025": "emerald-green",
  "BASE CARDS \u2013 BRONZE": "mint-bronze",
  "BASE CARDS \u2013 SILVER": "mint-silver",
  "BASE CARDS \u2013 GOLD": "mint-gold",
  "BASE CARDS \u2013 PLATINUM": "mint-platinum",
};

// ─── Particle Data ───────────────────────────────────────────────────────────

interface ParticleData {
  id: number;
  left: string;
  duration: string;
  delay: string;
  size: string;
}

function generateParticles(): ParticleData[] {
  return Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    duration: `${10 + Math.random() * 20}s`,
    delay: `${Math.random() * 20}s`,
    size: `${1 + Math.random() * 2}px`,
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CardDisplay() {
  // Read URL params for pre-loaded card
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const preloadImg = urlParams.get("img");
  const preloadTheme = urlParams.get("theme");
  const preloadName = urlParams.get("name");
  const fromDatabase = urlParams.get("from") === "database";

  const [activeTheme, setActiveTheme] = useState<string>(preloadTheme || "gold-amber");
  const [cardSrc, setCardSrc] = useState<string | null>(preloadImg);
  const [cardVisible, setCardVisible] = useState(!!preloadImg);
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  // Server-side card image processing mutation
  const processImage = trpc.public.cardDisplay.processImage.useMutation();

  // Regenerate particles on theme change for fresh animation
  const [particles, setParticles] = useState<ParticleData[]>(() => generateParticles());

  const theme = useMemo(
    () => THEMES.find((t) => t.id === activeTheme) || THEMES[0],
    [activeTheme]
  );

  const handleThemeChange = useCallback((id: string) => {
    setActiveTheme(id);
    setParticles(generateParticles());
  }, []);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("Image too large. Please use an image under 16MB.");
      return;
    }

    // Show the raw image immediately as a preview while processing
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;

      // Show raw preview immediately
      setCardSrc(dataUrl);
      setCardVisible(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setCardVisible(true));
      });

      // Now send to server for auto-crop processing
      setIsProcessing(true);
      toast.info("Auto-detecting & cropping card...", { id: "card-process", duration: 30000 });

      try {
        // Extract base64 data (remove the data:image/...;base64, prefix)
        const base64 = dataUrl.split(",")[1];
        const result = await processImage.mutateAsync({
          imageData: base64,
          contentType: file.type || "image/jpeg",
          transparent: true, // Just crop the card, no background
        });

        if (result.success && result.url) {
          // Replace preview with the processed image
          setCardVisible(false);
          setTimeout(() => {
            setCardSrc(result.url);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setCardVisible(true));
            });
          }, 200);

          if (result.mode === "raw") {
            toast.success("Card uploaded (auto-crop unavailable, using original)", { id: "card-process" });
          } else {
            toast.success("Card auto-cropped & ready!", { id: "card-process" });
          }
        }
      } catch (err: any) {
        console.error("Card processing failed:", err);
        toast.warning("Auto-crop failed, using original image", { id: "card-process" });
        // Keep the raw preview that's already showing
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [processImage]);

  const handleReset = useCallback(() => {
    setCardSrc(null);
    setCardVisible(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Download card as image using manual canvas drawing (avoids html2canvas OKLCH issue)
  const handleDownload = useCallback(async () => {
    if (!cardSrc) return;
    setIsDownloading(true);
    try {
      const theme = THEMES.find(t => t.id === activeTheme) || THEMES[0];
      const scale = 2;
      const w = 320 * scale;
      const h = 440 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Draw background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        bgImg.onload = () => resolve();
        bgImg.onerror = reject;
        bgImg.src = theme.bgUrl;
      });
      ctx.drawImage(bgImg, 0, 0, w, h);

      // Draw card border glow
      const frameX = (w - 280 * scale) / 2;
      const frameY = (h - 392 * scale) / 2;
      const frameW = 280 * scale;
      const frameH = 392 * scale;
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 20 * scale;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(frameX, frameY, frameW, frameH);
      ctx.shadowBlur = 0;

      // Draw card image
      const cardImg = new Image();
      cardImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        cardImg.onload = () => resolve();
        cardImg.onerror = reject;
        cardImg.src = cardSrc;
      });
      ctx.drawImage(cardImg, frameX + 3 * scale, frameY + 3 * scale, frameW - 6 * scale, frameH - 6 * scale);

      // Draw corner ornaments
      const cornerLen = 18 * scale;
      const cornerThick = 2 * scale;
      ctx.fillStyle = theme.bright;
      // Top-left
      ctx.fillRect(frameX - cornerThick, frameY - cornerThick, cornerLen, cornerThick);
      ctx.fillRect(frameX - cornerThick, frameY - cornerThick, cornerThick, cornerLen);
      // Top-right
      ctx.fillRect(frameX + frameW - cornerLen + cornerThick, frameY - cornerThick, cornerLen, cornerThick);
      ctx.fillRect(frameX + frameW, frameY - cornerThick, cornerThick, cornerLen);
      // Bottom-left
      ctx.fillRect(frameX - cornerThick, frameY + frameH, cornerLen, cornerThick);
      ctx.fillRect(frameX - cornerThick, frameY + frameH - cornerLen + cornerThick, cornerThick, cornerLen);
      // Bottom-right
      ctx.fillRect(frameX + frameW - cornerLen + cornerThick, frameY + frameH, cornerLen, cornerThick);
      ctx.fillRect(frameX + frameW, frameY + frameH - cornerLen + cornerThick, cornerThick, cornerLen);

      // Draw card name if present
      if (preloadName) {
        ctx.font = `bold ${14 * scale}px 'Cinzel', serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = theme.bright;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4 * scale;
        ctx.fillText(preloadName.toUpperCase(), w / 2, frameY - 12 * scale);
        ctx.shadowBlur = 0;
      }

      const link = document.createElement("a");
      const cardName = preloadName || "card";
      const safeName = cardName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      link.download = `NLF_${safeName}_${activeTheme}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [cardSrc, activeTheme, preloadName]);

  // Preload all background images
  useEffect(() => {
    THEMES.forEach((t) => {
      const img = new Image();
      img.src = t.bgUrl;
    });
  }, []);

  // If pre-loaded image from URL, trigger fade-in after mount
  useEffect(() => {
    if (preloadImg) {
      setCardVisible(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setCardVisible(true));
      });
    }
  }, [preloadImg]);

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-x-hidden"
      style={{
        minHeight: "100vh",
        background: "#050505",
        fontFamily: "'Cinzel', serif",
      }}
    >
      {/* ── Space Background ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${theme.bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.75,
          transition: "background-image 0.8s ease, opacity 0.8s ease",
        }}
      />

      {/* ── Radial Overlay ── */}
      <div
        className="fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ── Floating Particles ── */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        {particles.map((p) => (
          <div
            key={`${activeTheme}-${p.id}`}
            className="absolute rounded-full"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: theme.particle,
              animationName: "cardDisplayFloatUp",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-5 py-8 px-5">
        {/* ── Back to Database link ── */}
        {fromDatabase && (
          <button
            onClick={() => window.history.back()}
            className="self-start mb-1"
            style={{
              fontFamily: "'Crimson Text', serif",
              fontStyle: "italic",
              fontSize: 13,
              letterSpacing: "0.05em",
              color: theme.dim,
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = theme.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = theme.dim;
            }}
          >
            &larr; Back to Card Database
          </button>
        )}

        {/* ── Theme Selector Dots ── */}
        <div className="flex gap-3 items-center">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className="relative group"
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: t.accent,
                border:
                  activeTheme === t.id
                    ? "2px solid white"
                    : "2px solid transparent",
                transform: activeTheme === t.id ? "scale(1.4)" : "scale(1)",
                boxShadow:
                  activeTheme === t.id ? `0 0 12px ${t.accent}` : "none",
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (activeTheme !== t.id)
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.3)";
              }}
              onMouseLeave={(e) => {
                if (activeTheme !== t.id)
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              {/* Tooltip */}
              <span
                className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
                  bg-black/85 text-white text-[11px] px-2.5 py-1 rounded pointer-events-none
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontStyle: "italic",
                  letterSpacing: "0.05em",
                }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Card Name (if pre-loaded) ── */}
        {preloadName && (
          <div
            className="text-center"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: theme.accent,
              textShadow: `0 0 20px ${theme.glow}`,
              transition: "color 0.6s, text-shadow 0.6s",
            }}
          >
            {preloadName}
          </div>
        )}

        {/* ── Capture Area (for download) ── */}
        <div
          ref={captureRef}
          className="relative flex items-center justify-center"
          style={{
            width: 320,
            height: 440,
            backgroundImage: `url(${theme.bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* ── Card Frame ── */}
          <div
            className="relative cursor-pointer"
            style={{ width: 280, height: 392 }}
            onClick={triggerUpload}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Corner Ornaments */}
            {/* Top-left */}
            <div
              className="absolute z-20"
              style={{
                top: -2,
                left: -2,
                width: 22,
                height: 22,
                borderTop: `3px solid ${theme.bright}`,
                borderLeft: `3px solid ${theme.bright}`,
                opacity: 0.9,
                transition: "border-color 0.6s",
              }}
            />
            {/* Top-right */}
            <div
              className="absolute z-20"
              style={{
                top: -2,
                right: -2,
                width: 22,
                height: 22,
                borderTop: `3px solid ${theme.bright}`,
                borderRight: `3px solid ${theme.bright}`,
                opacity: 0.9,
                transition: "border-color 0.6s",
              }}
            />
            {/* Bottom-left */}
            <div
              className="absolute z-20"
              style={{
                bottom: -2,
                left: -2,
                width: 22,
                height: 22,
                borderBottom: `3px solid ${theme.bright}`,
                borderLeft: `3px solid ${theme.bright}`,
                opacity: 0.9,
                transition: "border-color 0.6s",
              }}
            />
            {/* Bottom-right */}
            <div
              className="absolute z-20"
              style={{
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderBottom: `3px solid ${theme.bright}`,
                borderRight: `3px solid ${theme.bright}`,
                opacity: 0.9,
                transition: "border-color 0.6s",
              }}
            />

            {/* Card Frame Inner */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                border: `1.5px solid ${theme.accent}`,
                background: "rgba(5,2,0,0.5)",
                boxShadow: isHovered
                  ? `0 0 0 1px ${theme.accent}, inset 0 0 60px rgba(0,0,0,0.2), 0 0 70px ${theme.glow}, 0 0 120px ${theme.glow}, 0 8px 60px rgba(0,0,0,0.7)`
                  : `0 0 0 1px ${theme.borderDark}, inset 0 0 60px rgba(0,0,0,0.3), 0 0 40px ${theme.glow}, 0 0 80px rgba(0,0,0,0.2), 0 8px 60px rgba(0,0,0,0.7)`,
                transition: "box-shadow 0.4s, border-color 0.6s",
              }}
            >
              {/* Scanline Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)",
                }}
              />

              {/* Empty State */}
              {!cardSrc && (
                <div
                  className="flex flex-col items-center gap-3 pointer-events-none z-10"
                  style={{ transition: "color 0.6s" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      border: `2px solid ${theme.dim}`,
                      color: theme.dim,
                      fontSize: 22,
                      animation: "cardDisplayPulseRing 2.5s ease-in-out infinite",
                      transition: "border-color 0.6s, color 0.6s",
                      // @ts-ignore
                      "--cd-glow": theme.glow,
                    }}
                  >
                    +
                  </div>
                  <div
                    className="text-center uppercase leading-relaxed"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      color: theme.dim,
                      transition: "color 0.6s",
                    }}
                  >
                    Tap to insert
                    <br />
                    your card
                  </div>
                </div>
              )}

              {/* Card Image */}
              {cardSrc && (
                <img
                  src={cardSrc}
                  alt={preloadName || "Card"}
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover z-[8]"
                  style={{
                    opacity: cardVisible ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                />
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}>
                  <div className="w-8 h-8 border-2 rounded-full animate-spin mb-3"
                    style={{ borderColor: `${theme.dim} transparent ${theme.accent} transparent` }} />
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: theme.accent,
                    textTransform: "uppercase",
                  }}>Auto-Cropping</div>
                </div>
              )}
            </div>

            {/* Shimmer Strip */}
            <div
              className="absolute bottom-0 left-0 right-0 z-[25]"
              style={{
                height: 2,
                background: `linear-gradient(90deg, transparent, ${theme.bright}, transparent)`,
                animation: "cardDisplayShimmer 3s ease-in-out infinite",
                transition: "background 0.6s",
              }}
            />
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-4">
          {/* Upload Button */}
          <button
            onClick={triggerUpload}
            className="relative overflow-hidden uppercase"
            style={{
              background: "transparent",
              border: `1px solid ${theme.dim}`,
              color: theme.accent,
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              padding: "10px 28px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = theme.bright;
              el.style.color = theme.bright;
              el.style.boxShadow = `0 0 20px ${theme.glow}`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = theme.dim;
              el.style.color = theme.accent;
              el.style.boxShadow = "none";
            }}
          >
            {isProcessing ? "\u29D7 Processing..." : "\u2B06 Upload Card"}
          </button>

          {/* Download Button (only when card is loaded) */}
          {cardSrc && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="relative overflow-hidden uppercase"
              style={{
                background: "transparent",
                border: `1px solid ${theme.dim}`,
                color: theme.accent,
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                letterSpacing: "0.25em",
                padding: "10px 28px",
                cursor: isDownloading ? "wait" : "pointer",
                transition: "all 0.3s ease",
                opacity: isDownloading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isDownloading) {
                  const el = e.currentTarget;
                  el.style.borderColor = theme.bright;
                  el.style.color = theme.bright;
                  el.style.boxShadow = `0 0 20px ${theme.glow}`;
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = theme.dim;
                el.style.color = theme.accent;
                el.style.boxShadow = "none";
              }}
            >
              {isDownloading ? "\u29D7 Saving..." : "\u2B07 Download"}
            </button>
          )}
        </div>

        {/* Reset Link */}
        {cardSrc && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="bg-transparent border-none cursor-pointer"
            style={{
              fontFamily: "'Crimson Text', serif",
              fontStyle: "italic",
              color: theme.dim,
              fontSize: 13,
              letterSpacing: "0.05em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = theme.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = theme.dim;
            }}
          >
            Remove card
          </button>
        )}
      </div>

      {/* ── Keyframe Animations (injected via style tag) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital@0;1&display=swap');

        @keyframes cardDisplayFloatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
        }

        @keyframes cardDisplayShimmer {
          0%, 100% { opacity: 0.3; transform: scaleX(0.3); }
          50% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes cardDisplayPulseRing {
          0%, 100% { box-shadow: 0 0 0 0 var(--cd-glow, rgba(232,160,32,0.6)); }
          50% { box-shadow: 0 0 0 10px transparent; }
        }
      `}</style>
    </div>
  );
}

// Export the theme mapping so CardDatabase can use it
export { CARD_TYPE_TO_THEME };
