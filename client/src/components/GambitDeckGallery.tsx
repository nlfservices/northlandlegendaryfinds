/**
 * Gambit Deck Card Gallery - Interactive slideshow of all 52 cards organized by suit
 */
import { useState } from "react";

type CardData = {
  position: string;
  character: string;
  path: string;
  value?: string;
};

type SuitData = {
  name: string;
  symbol: string;
  color: string;
  bgColor: string;
  cards: CardData[];
};

const SUITS: SuitData[] = [
  {
    name: "Hearts",
    symbol: "\u2665",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
    cards: [
      { position: "Ace", character: "Spider-Man", path: "/manus-storage/AceHearts-Front_abf3d3e0.jpg", value: "$2,000" },
      { position: "King", character: "Professor X", path: "/manus-storage/KingHearts-Front_efba65b4.jpg", value: "$350+" },
      { position: "Queen", character: "Rogue", path: "/manus-storage/QueenHearts-Front_e3ef7f58.jpg", value: "$482" },
      { position: "Jack", character: "Bishop", path: "/manus-storage/JackHearts-Front_46c8b68b.jpg", value: "$250+" },
      { position: "10", character: "Iron Man", path: "/manus-storage/10Hearts-Front_b95e05a1.jpg", value: "$807" },
      { position: "9", character: "Doctor Strange", path: "/manus-storage/9Hearts-Front_c2fee5f8.jpg", value: "$400" },
      { position: "8", character: "Thanos", path: "/manus-storage/8Hearts-Front_e967cc7d.jpg", value: "$487" },
      { position: "7", character: "Ant-Man", path: "/manus-storage/7Hearts-Front_a481d5b3.jpg", value: "$300+" },
      { position: "6", character: "Phoenix", path: "/manus-storage/6Hearts-Front_a9609f96.jpg", value: "$350+" },
      { position: "5", character: "Angel", path: "/manus-storage/5Hearts-Front_c1530d10.jpg", value: "$250+" },
      { position: "4", character: "Human Torch", path: "/manus-storage/4Hearts-Front_4ea6e54d.jpg", value: "$875" },
      { position: "3", character: "Ghost Rider", path: "/manus-storage/3Hearts-Front_52cce29e.jpg", value: "$413" },
      { position: "2", character: "Jubilee", path: "/manus-storage/2Hearts-Front_278f901a.jpg", value: "$200+" },
    ],
  },
  {
    name: "Diamonds",
    symbol: "\u2666",
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/30",
    cards: [
      { position: "Ace", character: "Magneto", path: "/manus-storage/AceDiamonds-Front_e17e22e9.jpg", value: "$412" },
      { position: "King", character: "Cyclops", path: "/manus-storage/KingDiamonds-Front_9fdfc494.jpg", value: "$495" },
      { position: "Queen", character: "Emma Frost", path: "/manus-storage/QueenDiamonds-Front_5e7630bd.jpg", value: "$350+" },
      { position: "Jack", character: "Cable", path: "/manus-storage/JackDiamonds-Front_3e4a715e.jpg", value: "$275+" },
      { position: "10", character: "Black Widow", path: "/manus-storage/10Diamonds-Front_8e514fae.jpg", value: "$350+" },
      { position: "9", character: "Blade", path: "/manus-storage/9Diamonds-Front_0d515d58.jpg", value: "$300+" },
      { position: "8", character: "Scarlet Witch", path: "/manus-storage/8Diamonds-Front_afe9e7ca.jpg", value: "$400+" },
      { position: "7", character: "Vision", path: "/manus-storage/7Diamonds-Front_14da3b91.jpg", value: "$458" },
      { position: "6", character: "Psylocke", path: "/manus-storage/6Diamonds-Front_8cbcb02f.jpg", value: "$475" },
      { position: "5", character: "Iceman", path: "/manus-storage/5Diamonds-Front_fb8d6781.jpg", value: "$250+" },
      { position: "4", character: "The Thing", path: "/manus-storage/4Diamonds-Front_9c73f8a8.jpg", value: "$410" },
      { position: "3", character: "Legion", path: "/manus-storage/3Diamonds-Front_7e3bd456.jpg", value: "$250+" },
      { position: "2", character: "Captain Marvel", path: "/manus-storage/2Diamonds-Front_acf11556.jpg", value: "$250+" },
    ],
  },
  {
    name: "Clubs",
    symbol: "\u2663",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/30",
    cards: [
      { position: "Ace", character: "Wolverine", path: "/manus-storage/AceClubs-Front_c571aa8a.jpg", value: "$1,975" },
      { position: "King", character: "Doctor Doom", path: "/manus-storage/KingClubs-Front_715d788d.jpg", value: "$1,122" },
      { position: "Queen", character: "Storm", path: "/manus-storage/QueenClubs-Front_59a3b914.jpg", value: "$482" },
      { position: "Jack", character: "Beast", path: "/manus-storage/JackClubs-Front_a1ab75bc.jpg", value: "$210+" },
      { position: "10", character: "Thor", path: "/manus-storage/10Clubs-Front_e7fc9370.jpg", value: "$400+" },
      { position: "9", character: "Hulk", path: "/manus-storage/9Clubs-Front_01742380.jpg", value: "$400+" },
      { position: "8", character: "Loki", path: "/manus-storage/8Clubs-Front_e2d5a067.jpg", value: "$454" },
      { position: "7", character: "Venom", path: "/manus-storage/7Clubs-Front_edde85e0.jpg", value: "$900" },
      { position: "6", character: "War Machine", path: "/manus-storage/6Clubs-Front_360dfea4.jpg", value: "$300+" },
      { position: "5", character: "Kitty Pryde", path: "/manus-storage/5Clubs-Front_b1e91de8.jpg", value: "$275+" },
      { position: "4", character: "Invisible Woman", path: "/manus-storage/4Clubs-Front_af139ee6.jpg", value: "$250+" },
      { position: "3", character: "Quicksilver", path: "/manus-storage/3Clubs-Front_58257367.jpg", value: "$525" },
      { position: "2", character: "Sabretooth", path: "/manus-storage/2Clubs-Front_e4f8fd3c.jpg", value: "$250+" },
    ],
  },
  {
    name: "Spades",
    symbol: "\u2660",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/30",
    cards: [
      { position: "Ace", character: "Gambit", path: "/manus-storage/AceSpades-Front_c1103ae6.jpg", value: "$2,043" },
      { position: "King", character: "Black Panther", path: "/manus-storage/KingSpades-Front_aff10449.jpg", value: "$453" },
      { position: "Queen", character: "Jean Grey", path: "/manus-storage/QueenSpades-Front_e681ab19.jpg", value: "$400+" },
      { position: "Jack", character: "Mystique", path: "/manus-storage/JackSpades-Front_bc60d987.jpg", value: "$300+" },
      { position: "10", character: "Captain America", path: "/manus-storage/10Spades-Front_15ad91c5.jpg", value: "$599" },
      { position: "9", character: "Silver Surfer", path: "/manus-storage/9Spades-Front_67258a9e.jpg", value: "$494" },
      { position: "8", character: "Daredevil", path: "/manus-storage/8Spades-Front_126c39a6.jpg", value: "$400" },
      { position: "7", character: "Apocalypse", path: "/manus-storage/7Spades-Front_79bad7a2.jpg", value: "$430" },
      { position: "6", character: "Juggernaut", path: "/manus-storage/6Spades-Front_5a98caa1.jpg", value: "$300+" },
      { position: "5", character: "Colossus", path: "/manus-storage/5Spades-Front_354bc34f.jpg", value: "$419" },
      { position: "4", character: "Mister Fantastic", path: "/manus-storage/4Spades-Front_ae544286.jpg", value: "$300+" },
      { position: "3", character: "Nightcrawler", path: "/manus-storage/3Spades-Front_89ff5b9b.jpg", value: "$350+" },
      { position: "2", character: "X-23", path: "/manus-storage/2Spades-Front_85b26188.jpg", value: "$275+" },
    ],
  },
];

export default function GambitDeckGallery() {
  const [activeSuit, setActiveSuit] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentSuit = SUITS[activeSuit];
  const currentCard = currentSuit.cards[activeCard];

  const handlePrev = () => {
    if (activeCard > 0) {
      setActiveCard(activeCard - 1);
    } else if (activeSuit > 0) {
      setActiveSuit(activeSuit - 1);
      setActiveCard(SUITS[activeSuit - 1].cards.length - 1);
    }
  };

  const handleNext = () => {
    if (activeCard < currentSuit.cards.length - 1) {
      setActiveCard(activeCard + 1);
    } else if (activeSuit < SUITS.length - 1) {
      setActiveSuit(activeSuit + 1);
      setActiveCard(0);
    }
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        The Complete Gambit Deck — 52 Cards by Suit
      </h2>

      {/* Suit Tabs */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6">
        {SUITS.map((suit, idx) => (
          <button
            key={suit.name}
            onClick={() => { setActiveSuit(idx); setActiveCard(0); }}
            className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all border ${
              activeSuit === idx
                ? `${suit.bgColor} ${suit.color} scale-105`
                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className={`text-lg sm:text-xl ${activeSuit === idx ? suit.color : ""}`}>
              {suit.symbol}
            </span>
            <span className="hidden sm:inline">{suit.name}</span>
          </button>
        ))}
      </div>

      {/* Main Card Display */}
      <div className="relative bg-gradient-to-b from-muted/30 to-background border border-border rounded-2xl p-4 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          {/* Card Image */}
          <div className="relative flex-shrink-0">
            <div
              className="w-[260px] sm:w-[320px] cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={currentCard.path}
                alt={`${currentCard.character} - ${currentCard.position} of ${currentSuit.name}`}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
            {/* Navigation arrows */}
            <button
              onClick={handlePrev}
              disabled={activeSuit === 0 && activeCard === 0}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={handleNext}
              disabled={activeSuit === SUITS.length - 1 && activeCard === currentSuit.cards.length - 1}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Card Info */}
          <div className="text-center lg:text-left flex-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-3 ${currentSuit.bgColor} ${currentSuit.color} border`}>
              <span className="text-lg">{currentSuit.symbol}</span>
              {currentCard.position} of {currentSuit.name}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">{currentCard.character}</h3>
            {currentCard.value && (
              <p className="text-lg text-muted-foreground mb-4">
                Recent Sale: <span className="text-primary font-bold">{currentCard.value}</span>
                <span className="text-sm ml-1">(base /99)</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Card {activeCard + 1} of {currentSuit.cards.length} in {currentSuit.name} • Click image to enlarge
            </p>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2 px-1">
            {currentSuit.cards.map((card, idx) => (
              <button
                key={card.character}
                onClick={() => setActiveCard(idx)}
                className={`flex-shrink-0 w-14 sm:w-16 rounded-md overflow-hidden border-2 transition-all ${
                  activeCard === idx
                    ? "border-primary scale-105 shadow-lg shadow-primary/20"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={card.path}
                  alt={card.character}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img
            src={currentCard.path}
            alt={`${currentCard.character} - ${currentCard.position} of ${currentSuit.name}`}
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm font-medium">
            {currentCard.character} — {currentCard.position} of {currentSuit.name} — {currentCard.value}
          </div>
        </div>
      )}
    </div>
  );
}
