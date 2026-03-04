/**
 * CardGradeAnimation - Interactive 3D card flip animation
 * Shows a raw card transforming into a CGC graded slab
 * Supports: auto-play, hover, click interactions
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, RotateCcw, Sparkles } from "lucide-react";

interface CardImages {
  rawFront: string;
  rawBack: string;
  gradedFront: string;
  gradedBack: string;
}

interface CardGradeAnimationProps {
  images: CardImages;
  cardName?: string;
  setName?: string;
  grade?: string;
  gradeLabel?: string;
  gradingCompany?: string;
  serialNumber?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
}

type AnimationPhase = "raw-front" | "flipping-to-raw-back" | "raw-back" | "transforming" | "graded-front" | "flipping-to-graded-back" | "graded-back";

export default function CardGradeAnimation({
  images,
  cardName = "Hulk",
  setName = "Marvel Mint (2025)",
  grade = "10",
  gradeLabel = "GEM MINT",
  gradingCompany = "CGC",
  serialNumber = "#109 · Black Refractor /10",
  autoPlay = true,
  autoPlayDelay = 3000,
  className = "",
}: CardGradeAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>("raw-front");
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-play cycle
  useEffect(() => {
    if (!autoPlay || hasInteracted) return;

    const cycle = () => {
      timerRef.current = setTimeout(() => {
        setPhase("transforming");
        setTimeout(() => {
          setPhase("graded-front");
          timerRef.current = setTimeout(() => {
            setPhase("raw-front");
            cycle();
          }, autoPlayDelay);
        }, 1200);
      }, autoPlayDelay);
    };

    cycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoPlay, autoPlayDelay, hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    switch (phase) {
      case "raw-front":
        setPhase("flipping-to-raw-back");
        setTimeout(() => setPhase("raw-back"), 600);
        break;
      case "raw-back":
        setPhase("transforming");
        setTimeout(() => setPhase("graded-front"), 1200);
        break;
      case "graded-front":
        setPhase("flipping-to-graded-back");
        setTimeout(() => setPhase("graded-back"), 600);
        break;
      case "graded-back":
        setPhase("raw-front");
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setPhase("raw-front");
    setHasInteracted(false);
  };

  const isRaw = phase === "raw-front" || phase === "raw-back" || phase === "flipping-to-raw-back";
  const isGraded = phase === "graded-front" || phase === "graded-back" || phase === "flipping-to-graded-back";
  const isTransforming = phase === "transforming";

  // Determine rotation for 3D flip
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

  // Determine which image to show on front face
  const getFrontImage = () => {
    if (isGraded || isTransforming) return images.gradedFront;
    return images.rawFront;
  };

  // Determine which image to show on back face
  const getBackImage = () => {
    if (isGraded) return images.gradedBack;
    return images.rawBack;
  };

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {isRaw && (
            <motion.div
              key="raw-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full"
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
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-purple-400 text-sm font-bold tracking-wider uppercase">Grading...</span>
            </motion.div>
          )}
          {isGraded && (
            <motion.div
              key="graded-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-bold tracking-wider uppercase">{gradingCompany} {gradeLabel} {grade}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Container */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: "1200px", width: "320px", height: "450px" }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl blur-2xl -z-10"
          animate={{
            background: isTransforming
              ? "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)"
              : isGraded
              ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0.15) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(234,88,12,0.1) 50%, transparent 70%)",
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Sparkle particles during transformation */}
        {isTransforming && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
                initial={{
                  x: 160,
                  y: 225,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: 160 + Math.cos((i * 30 * Math.PI) / 180) * 200,
                  y: 225 + Math.sin((i * 30 * Math.PI) / 180) * 250,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}

        {/* 3D Card */}
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: getRotateY(),
            scale: isTransforming ? [1, 0.9, 1.05, 1] : isHovered ? 1.03 : 1,
          }}
          transition={{
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
              alt={`${cardName} - ${isGraded ? "Graded" : "Raw"} Front`}
              className="w-full h-full object-cover"
            />
            {/* Chrome shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)",
              }}
              animate={{
                x: isHovered ? ["-100%", "200%"] : "0%",
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.5,
              }}
            />
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <img
              src={getBackImage()}
              alt={`${cardName} - ${isGraded ? "Graded" : "Raw"} Back`}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Card Info */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-foreground">{cardName}</h3>
        <p className="text-sm text-muted-foreground">{setName}</p>
        <p className="text-xs text-muted-foreground/70">{serialNumber}</p>
      </div>

      {/* Interaction Hint */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-muted-foreground/50">
          {phase === "raw-front" && "Click to flip · Auto-cycles raw → graded"}
          {phase === "raw-back" && "Click to grade this card"}
          {phase === "transforming" && "Grading in progress..."}
          {phase === "graded-front" && "Click to see the back of the slab"}
          {phase === "graded-back" && "Click to reset to raw"}
        </p>
        {hasInteracted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// Default Hulk card images for showcase
export const HULK_CARD_IMAGES: CardImages = {
  rawFront: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-raw-front_44893b76.jpg",
  rawBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-raw-back_5cb01b4c.jpg",
  gradedFront: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-graded-front_aab29f02.jpg",
  gradedBack: "https://d2xsxph8kpxj0f.cloudfront.net/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/hulk-graded-back_d2fb1b7c.jpg",
};
