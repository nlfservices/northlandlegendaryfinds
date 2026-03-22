/**
 * DemoReveal - Public demo of the Digital Slab Pack reveal experience
 * No login required, no database calls — uses hardcoded sample cards
 * Plays the professional 3D animated reveal video, then shows card details.
 */
import { useState, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowRight, Crown, Star, Layers, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// ==================== CDN ASSETS ====================
const REVEAL_VIDEO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/digital-reveal-1_de6299ea.mp4";

// ==================== DEMO CARD DATA ====================
const DEMO_CARDS = [
  {
    id: 1,
    cardName: "Doctor Doom",
    cardSet: "2025 Topps Marvel Mint",
    cardNumber: "",
    parallel: "1/1 Comic Cut",
    gradingCompany: "",
    grade: "",
    tier: "grail" as const,
    serialNumber: "",
    frontImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-56-updated_5fea1913.webp",
    backImageUrl: null,
    estimatedValueCents: 50000,
  },
  {
    id: 2,
    cardName: "Doctor Doom",
    cardSet: "2025 Topps Marvel Mint",
    cardNumber: "",
    parallel: "1/1 Comic Cut",
    gradingCompany: "",
    grade: "",
    tier: "chase" as const,
    serialNumber: "",
    frontImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-56-updated_5fea1913.webp",
    backImageUrl: null,
    estimatedValueCents: 15000,
  },
  {
    id: 3,
    cardName: "Doctor Doom",
    cardSet: "2025 Topps Marvel Mint",
    cardNumber: "",
    parallel: "1/1 Comic Cut",
    gradingCompany: "",
    grade: "",
    tier: "lineup" as const,
    serialNumber: "",
    frontImageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/doom-56-updated_5fea1913.webp",
    backImageUrl: null,
    estimatedValueCents: 5000,
  },
];

// ==================== COSMIC VORTEX BACKGROUND ====================
function CosmicVortex() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border opacity-20"
            style={{
              width: `${(i + 1) * 250}px`,
              height: `${(i + 1) * 250}px`,
              borderColor: i % 2 === 0 ? "rgba(147, 51, 234, 0.3)" : "rgba(59, 130, 246, 0.2)",
              borderWidth: `${2 - i * 0.2}px`,
              animation: `spin ${8 + i * 4}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
              filter: `blur(${i * 0.5}px)`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#3b82f6" : "#f59e0b",
              opacity: Math.random() * 0.6 + 0.1,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN DEMO REVEAL PAGE ====================
export default function DemoReveal() {
  // Randomly shuffle cards for each visit
  const shuffledCards = useMemo(() => [...DEMO_CARDS].sort(() => Math.random() - 0.5), []);

  const [phase, setPhase] = useState<"ready" | "playing" | "revealed">("ready");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentCard = shuffledCards[currentCardIndex];
  const totalCards = shuffledCards.length;
  const isLastCard = currentCardIndex >= totalCards - 1;

  const handleOpenPack = useCallback(() => {
    setPhase("playing");
    // Small delay to let the video element mount, then play
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay blocked — show revealed state directly
          setPhase("revealed");
        });
      }
    }, 100);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setPhase("revealed");
  }, []);

  const handleNext = useCallback(() => {
    if (isLastCard) {
      // Reset the whole demo
      setCurrentCardIndex(0);
      setPhase("ready");
      return;
    }
    setCurrentCardIndex(prev => prev + 1);
    setPhase("ready");
  }, [isLastCard]);

  const handleShare = useCallback(() => {
    if (!currentCard) return;
    const text = `I just pulled ${currentCard.cardName} from an NLF Digital Slab Pack! ${currentCard.grade ? `${currentCard.gradingCompany || ''} ${currentCard.grade}` : ''} #NLF #MarvelCards`;
    if (navigator.share) {
      navigator.share({ title: "NLF Slab Pack Reveal", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  }, [currentCard]);

  const handleRestart = useCallback(() => {
    setCurrentCardIndex(0);
    setPhase("ready");
  }, []);

  const rarityGlow = currentCard
    ? currentCard.tier === "grail"
      ? "0 0 60px rgba(239, 68, 68, 0.6), 0 0 120px rgba(239, 68, 68, 0.3)"
      : currentCard.tier === "chase"
      ? "0 0 40px rgba(245, 158, 11, 0.5), 0 0 80px rgba(245, 158, 11, 0.2)"
      : "0 0 20px rgba(59, 130, 246, 0.4)"
    : "none";

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6), 0 0 80px rgba(59, 130, 246, 0.3); }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="fixed inset-0 flex flex-col items-center justify-center select-none">
        {/* Background: cosmic vortex for ready/revealed, black for video */}
        {phase !== "playing" && <CosmicVortex />}
        {phase === "playing" && <div className="fixed inset-0 bg-black" />}

        {/* Card counter */}
        <div className="absolute top-6 right-6 z-20">
          <Badge variant="outline" className="bg-black/50 border-white/20 text-white text-sm px-3 py-1">
            Card {currentCardIndex + 1} / {totalCards}
          </Badge>
        </div>

        {/* Pack name + demo badge */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
          <p className="text-white/60 text-sm font-medium">NLF Silver Slab Pack</p>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
            DEMO
          </Badge>
        </div>

        {/* Restart button */}
        <div className="absolute bottom-6 left-6 z-20">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white/60 hover:text-white hover:bg-white/10"
            onClick={handleRestart}
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Restart Demo
          </Button>
        </div>

        {/* Back to shop */}
        <div className="absolute bottom-6 right-6 z-20">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => window.location.href = "/shop"}
          >
            Back to Shop
          </Button>
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-4">
          {/* ===== READY PHASE ===== */}
          {phase === "ready" && (
            <div className="flex flex-col items-center gap-8" style={{ animation: "slideUp 0.6s ease-out" }}>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-400/20"
                style={{ animation: "pulseGlow 2s ease-in-out infinite" }}>
                <Sparkles className="w-16 h-16 text-purple-300" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
                  ARE YOU READY TO
                </h1>
                <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 tracking-tight">
                  REVEAL YOUR SLAB?
                </h1>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-10 py-6 rounded-xl font-bold shadow-lg shadow-green-500/25 transition-all hover:scale-105"
                onClick={handleOpenPack}
              >
                Open Slab Pack
              </Button>
              <p className="text-white/30 text-xs mt-2">Demo mode — no cards are claimed</p>
            </div>
          )}

          {/* ===== VIDEO PLAYING PHASE ===== */}
          {phase === "playing" && (
            <div className="flex flex-col items-center" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <video
                ref={videoRef}
                src={REVEAL_VIDEO_URL}
                className="w-full max-w-[360px] sm:max-w-[400px] rounded-xl"
                style={{ maxHeight: "80vh" }}
                playsInline
                muted={false}
                onEnded={handleVideoEnd}
                onClick={() => {
                  // Tap to skip to revealed state
                  if (videoRef.current) {
                    videoRef.current.pause();
                  }
                  setPhase("revealed");
                }}
              />
              <p className="text-white/30 text-xs mt-4">Tap video to skip</p>
            </div>
          )}

          {/* ===== REVEALED PHASE ===== */}
          {phase === "revealed" && currentCard && (
            <div className="flex flex-col items-center gap-5" style={{ animation: "scaleIn 0.5s ease-out" }}>
              {/* Card image with rarity glow */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ boxShadow: rarityGlow }}
              >
                {currentCard.frontImageUrl ? (
                  <img
                    src={currentCard.frontImageUrl}
                    alt={currentCard.cardName}
                    className="w-[280px] h-[400px] sm:w-[320px] sm:h-[460px] object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-[280px] h-[400px] sm:w-[320px] sm:h-[460px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex flex-col items-center justify-center p-6 border border-zinc-700">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      {currentCard.tier === "grail" ? <Crown className="w-10 h-10 text-red-400" /> :
                       currentCard.tier === "chase" ? <Star className="w-10 h-10 text-amber-400" /> :
                       <Layers className="w-10 h-10 text-blue-400" />}
                    </div>
                    <p className="text-xl font-bold text-white text-center">{currentCard.cardName}</p>
                    <p className="text-sm text-zinc-400 text-center mt-1">{currentCard.cardSet}</p>
                  </div>
                )}
              </div>

              {/* Card details */}
              <div className="text-center" style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge variant="outline" className={
                    currentCard.tier === "grail" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                    currentCard.tier === "chase" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                    "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  }>
                    {currentCard.tier === "grail" && <Crown className="w-3 h-3 mr-1" />}
                    {currentCard.tier === "chase" && <Star className="w-3 h-3 mr-1" />}
                    {currentCard.tier === "lineup" && <Layers className="w-3 h-3 mr-1" />}
                    {currentCard.tier.toUpperCase()}
                  </Badge>
                  {currentCard.grade && (
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                      {currentCard.gradingCompany} {currentCard.grade}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{currentCard.cardName}</h2>
                <p className="text-white/60 mt-1">
                  {currentCard.cardSet || ''} {currentCard.cardNumber ? `#${currentCard.cardNumber}` : ''}
                  {currentCard.parallel ? ` · ${currentCard.parallel}` : ""}
                  {currentCard.serialNumber ? ` · ${currentCard.serialNumber}` : ""}
                </p>
                {currentCard.estimatedValueCents && (
                  <p className="text-green-400 font-bold mt-2 text-lg">
                    ${(currentCard.estimatedValueCents / 100).toFixed(2)}
                  </p>
                )}

                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share Reveal
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6"
                    onClick={handleNext}
                  >
                    {isLastCard ? (
                      <><RotateCcw className="w-4 h-4 mr-2" /> Restart Demo</>
                    ) : (
                      <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
