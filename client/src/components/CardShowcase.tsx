/**
 * CardShowcase - Premium full-width card slideshow/carousel
 * The highlight section of the homepage featuring cards with 3D flip animations
 * on a branded NLF cosmic background. Supports auto-play and manual navigation.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, Sparkles, RotateCcw } from "lucide-react";

const SHOWCASE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-card-display-bg-wide-JyJzdcpVFDErRCx8bggUWH.webp";

export interface ShowcaseCard {
  id: string;
  rawFront: string;
  rawBack: string;
  gradedFront: string;
  gradedBack: string;
  cardName: string;
  setName: string;
  serialNumber: string;
  grade?: string;
  gradeLabel?: string;
  gradingCompany?: string;
}

type CardPhase = "raw-front" | "flipping-to-raw-back" | "raw-back" | "transforming" | "graded-front" | "flipping-to-graded-back" | "graded-back";

interface CardShowcaseProps {
  cards: ShowcaseCard[];
  autoPlayInterval?: number;
  className?: string;
}

export default function CardShowcase({
  cards,
  autoPlayInterval = 6000,
  className = "",
}: CardShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<CardPhase>("raw-front");
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCard = cards[activeIndex];
  if (!activeCard) return null;

  const clearAllTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  };

  // Navigate to next card
  const goToNext = useCallback(() => {
    clearAllTimers();
    setSlideDirection("right");
    setPhase("raw-front");
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  // Navigate to previous card
  const goToPrev = useCallback(() => {
    clearAllTimers();
    setSlideDirection("left");
    setPhase("raw-front");
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Go to specific card
  const goToCard = useCallback((index: number) => {
    clearAllTimers();
    setSlideDirection(index > activeIndex ? "right" : "left");
    setPhase("raw-front");
    setActiveIndex(index);
  }, [activeIndex]);

  // Auto-play: show raw → transform → graded → next card
  useEffect(() => {
    if (isPaused || cards.length === 0) return;

    const runCycle = () => {
      // Phase 1: Show raw front
      timerRef.current = setTimeout(() => {
        // Phase 2: Transform to graded
        setPhase("transforming");
        phaseTimerRef.current = setTimeout(() => {
          setPhase("graded-front");
          // Phase 3: Show graded, then move to next
          timerRef.current = setTimeout(() => {
            setSlideDirection("right");
            setPhase("raw-front");
            setActiveIndex((prev) => (prev + 1) % cards.length);
          }, autoPlayInterval * 0.5);
        }, 1200);
      }, autoPlayInterval * 0.5);
    };

    runCycle();

    return () => clearAllTimers();
  }, [activeIndex, isPaused, cards.length, autoPlayInterval]);

  // Handle card click for manual flip
  const handleCardClick = () => {
    setIsPaused(true);
    clearAllTimers();

    switch (phase) {
      case "raw-front":
        setPhase("flipping-to-raw-back");
        phaseTimerRef.current = setTimeout(() => setPhase("raw-back"), 600);
        break;
      case "raw-back":
        setPhase("transforming");
        phaseTimerRef.current = setTimeout(() => setPhase("graded-front"), 1200);
        break;
      case "graded-front":
        setPhase("flipping-to-graded-back");
        phaseTimerRef.current = setTimeout(() => setPhase("graded-back"), 600);
        break;
      case "graded-back":
        setPhase("raw-front");
        break;
      default:
        break;
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setPhase("raw-front");
  };

  const isRaw = phase === "raw-front" || phase === "raw-back" || phase === "flipping-to-raw-back";
  const isGraded = phase === "graded-front" || phase === "graded-back" || phase === "flipping-to-graded-back";
  const isTransforming = phase === "transforming";

  const getRotateY = () => {
    switch (phase) {
      case "raw-front": return 0;
      case "flipping-to-raw-back": return 180;
      case "raw-back": return 180;
      case "transforming": return 360;
      case "graded-front": return 0;
      case "flipping-to-graded-back": return 180;
      case "graded-back": return 180;
      default: return 0;
    }
  };

  const getFrontImage = () => {
    if (isGraded || isTransforming) return activeCard.gradedFront;
    return activeCard.rawFront;
  };

  const getBackImage = () => {
    if (isGraded) return activeCard.gradedBack;
    return activeCard.rawBack;
  };

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src={SHOWCASE_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 py-16 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-14 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full mb-5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-bold tracking-wide">GRADING READY</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            FROM <span className="text-amber-400">RAW</span> TO{" "}
            <span className="text-emerald-400">GRADED</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every card in our repacks has slab potential. Click any card to watch the transformation.
          </p>
        </div>

        {/* Main Carousel Area */}
        <div className="container max-w-6xl">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Left Arrow */}
            <button
              onClick={goToPrev}
              className="hidden md:flex shrink-0 w-12 h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Card Display */}
            <div className="flex-1 flex flex-col items-center">
              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-6 h-10">
                <AnimatePresence mode="wait">
                  {isRaw && (
                    <motion.div
                      key="raw-badge"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 border border-amber-500/40 rounded-full"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-400 text-sm font-bold tracking-wider uppercase">Raw Card</span>
                    </motion.div>
                  )}
                  {isTransforming && (
                    <motion.div
                      key="transform-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-500/40 rounded-full"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                      <span className="text-purple-400 text-sm font-bold tracking-wider uppercase">Grading in Progress...</span>
                    </motion.div>
                  )}
                  {isGraded && (
                    <motion.div
                      key="graded-badge"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-bold tracking-wider uppercase">
                        {activeCard.gradingCompany || "CGC"} {activeCard.gradeLabel || "GEM MINT"} {activeCard.grade || "10"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card + Info */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
                {/* The 3D Card */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative cursor-pointer select-none"
                    style={{ perspective: "1200px", width: "300px", height: "420px" }}
                    onClick={handleCardClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {/* Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl blur-3xl -z-10"
                      animate={{
                        background: isTransforming
                          ? "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(59,130,246,0.25) 50%, transparent 70%)"
                          : isGraded
                          ? "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)"
                          : "radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(234,88,12,0.12) 50%, transparent 70%)",
                        scale: isHovered ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Sparkle particles */}
                    {isTransforming && (
                      <>
                        {[...Array(16)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
                            initial={{ x: 150, y: 210, opacity: 0, scale: 0 }}
                            animate={{
                              x: 150 + Math.cos((i * 22.5 * Math.PI) / 180) * 220,
                              y: 210 + Math.sin((i * 22.5 * Math.PI) / 180) * 260,
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                            }}
                            transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
                          />
                        ))}
                      </>
                    )}

                    {/* 3D Card */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCard.id}
                        className="w-full h-full relative"
                        style={{ transformStyle: "preserve-3d" }}
                        initial={{ opacity: 0, x: slideDirection === "right" ? 80 : -80 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          rotateY: getRotateY(),
                          scale: isTransforming ? [1, 0.9, 1.05, 1] : isHovered ? 1.03 : 1,
                        }}
                        exit={{ opacity: 0, x: slideDirection === "right" ? -80 : 80 }}
                        transition={{
                          opacity: { duration: 0.4 },
                          x: { duration: 0.4, ease: "easeOut" },
                          rotateY: { duration: isTransforming ? 1.2 : 0.6, ease: "easeInOut" },
                          scale: { duration: isTransforming ? 1.2 : 0.3 },
                        }}
                      >
                        {/* Front Face */}
                        <div
                          className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <img
                            src={getFrontImage()}
                            alt={`${activeCard.cardName} - Front`}
                            className="w-full h-full object-cover"
                          />
                          {/* Shimmer */}
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)",
                            }}
                            animate={{ x: isHovered ? ["-100%", "200%"] : "0%" }}
                            transition={{ duration: 1.5, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }}
                          />
                        </div>

                        {/* Back Face */}
                        <div
                          className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl"
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <img
                            src={getBackImage()}
                            alt={`${activeCard.cardName} - Back`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Card Name */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCard.id + "-info"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center mt-5 space-y-1"
                    >
                      <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {activeCard.cardName}
                      </h3>
                      <p className="text-sm text-gray-300">{activeCard.setName}</p>
                      <p className="text-xs text-gray-500">{activeCard.serialNumber}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right side: card counter + info */}
                <div className="hidden lg:flex flex-col items-start gap-6 max-w-sm">
                  <div className="space-y-4">
                    <p className="text-gray-300 text-base leading-relaxed">
                      Our top hits are investment-grade cards worthy of professional grading. Watch the transformation from raw pull to certified gem.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Premium cards from Topps Chrome, Marvel Mint & more
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        CGC, PSA & BGS grading-ready condition
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        Numbered parallels, autos & 1-of-1s in every series
                      </div>
                    </div>
                  </div>

                  {/* Card Counter */}
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="text-white font-bold text-lg">{String(activeIndex + 1).padStart(2, "0")}</span>
                    <div className="w-12 h-px bg-gray-600" />
                    <span>{String(cards.length).padStart(2, "0")}</span>
                  </div>

                  {/* Resume button if paused */}
                  {isPaused && (
                    <button
                      onClick={handleResume}
                      className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Resume auto-play
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className="hidden md:flex shrink-0 w-12 h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <button
              onClick={goToPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => goToCard(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-emerald-400"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to card ${index + 1}: ${card.cardName}`}
              />
            ))}
          </div>

          {/* Interaction hint */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Click the card to flip it · Arrows to browse · Auto-cycles through the collection
          </p>
        </div>
      </div>
    </section>
  );
}
