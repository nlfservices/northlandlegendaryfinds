/**
 * SlabPackReveal - Immersive 3D card reveal experience
 * Inspired by Arena Club's reveal flow with NLF's cosmic Marvel theme
 * Flow: "Are You Ready?" → 3D Card Flip (back → front) → Card Details → Next/Share
 */
import { useState, useCallback } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Share2, ArrowRight, Crown, Star, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";

// ==================== COSMIC VORTEX BACKGROUND ====================
function CosmicVortex({ intensity = 1 }: { intensity?: number }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border opacity-20"
            style={{
              width: `${(i + 1) * 250 * intensity}px`,
              height: `${(i + 1) * 250 * intensity}px`,
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

// ==================== 3D CARD COMPONENT ====================
function Card3D({
  frontImage,
  backImage,
  characterName,
  cardSet,
  grade,
  gradingCompany,
  rarity,
  isFlipping,
  isRevealed,
}: {
  frontImage?: string | null;
  backImage?: string | null;
  characterName: string;
  cardSet: string;
  grade?: string | null;
  gradingCompany?: string;
  rarity: string;
  isFlipping: boolean;
  isRevealed: boolean;
}) {
  const rarityGlow = rarity === "grail"
    ? "0 0 60px rgba(239, 68, 68, 0.6), 0 0 120px rgba(239, 68, 68, 0.3)"
    : rarity === "chase"
    ? "0 0 40px rgba(245, 158, 11, 0.5), 0 0 80px rgba(245, 158, 11, 0.2)"
    : "0 0 20px rgba(59, 130, 246, 0.4)";

  return (
    <div className="relative w-[280px] h-[400px] sm:w-[320px] sm:h-[460px]" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full h-full transition-transform duration-1000 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateY(0deg)" : isFlipping ? "rotateY(1080deg)" : "rotateY(180deg)",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", boxShadow: isRevealed ? rarityGlow : "none" }}
        >
          {frontImage ? (
            <img src={frontImage} alt={characterName} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex flex-col items-center justify-center p-6 border border-zinc-700">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                {rarity === "grail" ? <Crown className="w-10 h-10 text-red-400" /> :
                 rarity === "chase" ? <Star className="w-10 h-10 text-amber-400" /> :
                 <Layers className="w-10 h-10 text-blue-400" />}
              </div>
              <p className="text-xl font-bold text-white text-center">{characterName}</p>
              <p className="text-sm text-zinc-400 text-center mt-1">{cardSet}</p>
              {grade && (
                <div className="mt-3 px-3 py-1 bg-zinc-700/50 rounded-full">
                  <span className="text-sm font-bold text-white">{gradingCompany} {grade}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {backImage ? (
            <img src={backImage} alt="Card back" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl flex items-center justify-center border border-purple-500/30">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-purple-400/20">
                  <Sparkles className="w-12 h-12 text-purple-300" />
                </div>
                <p className="text-2xl font-bold text-white tracking-wider">NLF</p>
                <p className="text-xs text-purple-300 tracking-[0.3em] mt-1">SLAB PACK</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== RARITY EXPLOSION ====================
function RarityExplosion({ rarity }: { rarity: string }) {
  if (rarity !== "grail") return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: ["#ef4444", "#f59e0b", "#a855f7", "#3b82f6", "#ffffff"][i % 5],
            borderRadius: "50%",
            animation: `explode-${i} ${Math.random() * 1.5 + 0.5}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

// ==================== MAIN REVEAL PAGE ====================
export default function SlabPackReveal() {
  const { orderId } = useParams<{ orderId: string }>();
  const [phase, setPhase] = useState<"ready" | "flipping" | "revealed">("ready");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  const markRevealed = trpc.slabPacks.markRevealed.useMutation();

  const { data, isLoading, error } = trpc.slabPacks.getReveal.useQuery(
    { orderId: parseInt(orderId || "0") },
    { enabled: !!orderId }
  );

  const currentCard = data?.cards?.[currentCardIndex];
  const totalCards = data?.cards?.length ?? 0;
  const isLastCard = currentCardIndex >= totalCards - 1;

  const handleOpenPack = useCallback(() => {
    setPhase("flipping");
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      setIsRevealed(true);
      setPhase("revealed");
      if (currentCard?.card?.tier === "grail") {
        setShowExplosion(true);
        setTimeout(() => setShowExplosion(false), 2000);
      }
      if (currentCard) {
        markRevealed.mutate({
          orderId: parseInt(orderId || "0"),
          cardId: currentCard.card.id,
        });
      }
    }, 1200);
  }, [currentCard, orderId, markRevealed]);

  const handleNext = useCallback(() => {
    if (isLastCard) {
      window.location.href = "/shop";
      return;
    }
    setCurrentCardIndex(prev => prev + 1);
    setPhase("ready");
    setIsFlipping(false);
    setIsRevealed(false);
    setShowExplosion(false);
  }, [isLastCard]);

  const handleShare = useCallback(() => {
    if (!currentCard) return;
    const text = `I just pulled ${currentCard.card.cardName} from an NLF Digital Slab Pack! ${currentCard.card.grade ? `${currentCard.card.gradingCompany || ''} ${currentCard.card.grade}` : ''} #NLF #MarvelCards`;
    if (navigator.share) {
      navigator.share({ title: "NLF Slab Pack Reveal", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  }, [currentCard]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Reveal not found</p>
          <Button onClick={() => window.location.href = "/shop"}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const card = currentCard?.card;

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
        ${[...Array(20)].map((_, i) => `
          @keyframes explode-${i} {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(calc(-50% + ${(Math.random() - 0.5) * 600}px), calc(-50% + ${(Math.random() - 0.5) * 600}px)) scale(1); opacity: 0; }
          }
        `).join("")}
      `}</style>

      <div className="fixed inset-0 flex flex-col items-center justify-center select-none">
        <CosmicVortex intensity={phase === "flipping" ? 1.5 : 1} />
        {showExplosion && card && <RarityExplosion rarity={card.tier} />}

        {totalCards > 1 && (
          <div className="absolute top-6 right-6 z-20">
            <Badge variant="outline" className="bg-black/50 border-white/20 text-white text-sm px-3 py-1">
              Card {currentCardIndex + 1} / {totalCards}
            </Badge>
          </div>
        )}

        <div className="absolute top-6 left-6 z-20">
          <p className="text-white/60 text-sm font-medium">{data.pack?.name}</p>
        </div>

        <div className="relative z-10 flex flex-col items-center">
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
            </div>
          )}

          {/* ===== FLIPPING / REVEALED PHASE ===== */}
          {(phase === "flipping" || phase === "revealed") && card && (
            <div className="flex flex-col items-center gap-6">
              <Card3D
                frontImage={card.frontImageUrl}
                backImage={card.backImageUrl}
                characterName={card.cardName}
                cardSet={card.cardSet || ''}
                grade={card.grade}
                gradingCompany={card.gradingCompany || undefined}
                rarity={card.tier}
                isFlipping={isFlipping}
                isRevealed={isRevealed}
              />

              {phase === "revealed" && (
                <div className="text-center" style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="outline" className={
                      card.tier === "grail" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                      card.tier === "chase" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                      "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }>
                      {card.tier === "grail" && <Crown className="w-3 h-3 mr-1" />}
                      {card.tier === "chase" && <Star className="w-3 h-3 mr-1" />}
                      {card.tier === "lineup" && <Layers className="w-3 h-3 mr-1" />}
                      {card.tier.toUpperCase()}
                    </Badge>
                    {card.grade && (
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                        {card.gradingCompany} {card.grade}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{card.cardName}</h2>
                  <p className="text-white/60 mt-1">
                    {card.cardSet || ''} {card.cardNumber ? `#${card.cardNumber}` : ''}
                    {card.parallel ? ` · ${card.parallel}` : ""}
                    {card.serialNumber ? ` · ${card.serialNumber}` : ""}
                  </p>

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
                      {isLastCard ? "Back to Shop" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
