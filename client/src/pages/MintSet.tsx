/**
 * Marvel Mint Set Page
 * Design: Gallery view of all 120 Mint cards
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface MintCard {
  number: number;
  character: string;
  set: string;
  image: string;
}

export default function MintSet() {
  const [cards, setCards] = useState<MintCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/mint_cards.json')
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Mint cards:', err);
        setLoading(false);
      });
  }, []);

  const filteredCards = cards.filter(card =>
    card.character.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadge = (number: number) => {
    if (number <= 50) return { name: 'Bronze', color: 'text-orange-400' };
    if (number <= 75) return { name: 'Silver', color: 'text-gray-300' };
    if (number <= 100) return { name: 'Gold', color: 'text-accent' };
    return { name: 'Platinum', color: 'text-primary' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Marvel Mint cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-accent/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              MARVEL MINT
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Pristine cards organized by <span className="text-accent font-semibold">four rarity tiers</span>: Bronze, Silver, Gold, and Platinum. <span className="text-accent font-semibold">120 cards</span> featuring Marvel's most iconic characters.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search cards... (e.g., Spider-Man, Wolverine)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card/50 backdrop-blur border-2 border-accent/30 focus:border-accent"
              />
            </div>

            {searchQuery && (
              <p className="text-muted-foreground">
                Found {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">50</div>
                <div className="text-sm text-muted-foreground">Bronze</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-300">25</div>
                <div className="text-sm text-muted-foreground">Silver</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">25</div>
                <div className="text-sm text-muted-foreground">Gold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">20</div>
                <div className="text-sm text-muted-foreground">Platinum</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCards.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-2xl text-muted-foreground">
                No cards found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredCards.map((card) => {
                const tier = getTierBadge(card.number);
                
                return (
                  <Card 
                    key={card.number}
                    className="group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-border hover:border-accent transition-all hover:shadow-2xl hover:shadow-accent/30 hover:-translate-y-2"
                  >
                    <CardContent className="p-0">
                      {/* Card Image */}
                      <div className="relative aspect-[2.5/3.5] overflow-hidden bg-muted">
                        <img
                          src={card.image}
                          alt={`${card.character} - Mint #${card.number}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        
                        {/* Tier Badge */}
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                          <span className={tier.color}>{tier.name}</span>
                        </div>
                        
                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div>
                            <p className="text-sm font-bold text-accent">MINT-{card.number.toString().padStart(3, '0')}</p>
                            <p className="text-xs text-foreground">{card.character}</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-3">
                        <p className="text-xs font-bold text-accent mb-1">
                          #{card.number}
                        </p>
                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                          {card.character}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
