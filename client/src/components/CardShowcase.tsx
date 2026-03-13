/**
 * CardShowcase - Premium full-width card slideshow/carousel
 * Simple front-only card display with auto-play and manual navigation.
 * Shows real raw/graded card photos from the NLF collection.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";

const SHOWCASE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/nlf-card-display-bg-wide-JyJzdcpVFDErRCx8bggUWH.webp";

export interface ShowcaseCard {
  id: string;
  rawFront: string;
  rawBack?: string;
  gradedFront?: string;
  gradedBack?: string;
  cardName: string;
  setName: string;
  serialNumber: string;
  grade?: string;
  gradeLabel?: string;
  gradingCompany?: string;
}

interface CardShowcaseProps {
  cards: ShowcaseCard[];
  autoPlayInterval?: number;
  className?: string;
}

export default function CardShowcase({
  cards,
  autoPlayInterval = 5000,
  className = "",
}: CardShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCard = cards[activeIndex];
  if (!activeCard) return null;

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Navigate to next card
  const goToNext = useCallback(() => {
    clearTimer();
    setSlideDirection("right");
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  // Navigate to previous card
  const goToPrev = useCallback(() => {
    clearTimer();
    setSlideDirection("left");
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Go to specific card
  const goToCard = useCallback((index: number) => {
    clearTimer();
    setSlideDirection(index > activeIndex ? "right" : "left");
    setActiveIndex(index);
  }, [activeIndex]);

  // Auto-play: cycle through cards
  useEffect(() => {
    if (cards.length <= 1) return;

    timerRef.current = setTimeout(() => {
      setSlideDirection("right");
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, autoPlayInterval);

    return () => clearTimer();
  }, [activeIndex, cards.length, autoPlayInterval]);

  // Determine if this card has a graded version to show
  const isGraded = !!(activeCard.gradedFront);
  const displayImage = isGraded ? activeCard.gradedFront! : activeCard.rawFront;

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
            <span className="text-emerald-400 text-sm font-bold tracking-wide">OUR COLLECTION</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            <span className="text-amber-400">RAW</span> &{" "}
            <span className="text-emerald-400">GRADED</span> HITS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real cards from our collection — every repack is loaded with hits like these.
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
                {isGraded ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-bold tracking-wider uppercase">
                      {activeCard.gradingCompany || "CGC"} {activeCard.gradeLabel || "GEM MINT"} {activeCard.grade || "10"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 border border-amber-500/40 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-400 text-sm font-bold tracking-wider uppercase">Raw Card</span>
                  </div>
                )}
              </div>

              {/* Card + Info */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
                {/* The Card Image */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative select-none"
                    style={{ width: "300px", height: "420px" }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {/* Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl blur-3xl -z-10"
                      animate={{
                        background: isGraded
                          ? "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)"
                          : "radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(234,88,12,0.12) 50%, transparent 70%)",
                        scale: isHovered ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Card Image */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCard.id}
                        className="w-full h-full relative rounded-lg overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, x: slideDirection === "right" ? 80 : -80 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: isHovered ? 1.03 : 1,
                        }}
                        exit={{ opacity: 0, x: slideDirection === "right" ? -80 : 80 }}
                        transition={{
                          opacity: { duration: 0.4 },
                          x: { duration: 0.4, ease: "easeOut" },
                          scale: { duration: 0.3 },
                        }}
                      >
                        <img
                          src={displayImage}
                          alt={`${activeCard.cardName} - ${isGraded ? "Graded" : "Raw"}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Shimmer on hover */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)",
                          }}
                          animate={{ x: isHovered ? ["-100%", "200%"] : "0%" }}
                          transition={{ duration: 1.5, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }}
                        />
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
                      Our top hits are investment-grade cards worthy of professional grading. Every repack is loaded with real value.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Premium cards from Topps Chrome, Marvel Mint & more
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        AGS, CGC, PSA & more grading-ready condition
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
            Arrows to browse · Auto-cycles through the collection
          </p>
        </div>
      </div>
    </section>
  );
}
