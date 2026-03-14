/**
 * Topps Chrome Marvel Set Page
 * Design: Gallery view of all 120 Chrome cards
 * - Staggered grid layout
 * - Card hover effects with zoom
 * - Filterable by character name
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";

interface ChromeCard {
  number: number;
  character: string;
  set: string;
  image: string;
}

export default function ChromeSet() {
  const [cards, setCards] = useState<ChromeCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/chrome_cards.json')
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Chrome cards:', err);
        setLoading(false);
      });
  }, []);

  const filteredCards = cards.filter(card =>
    card.character.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Chrome cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              TOPPS CHROME MARVEL
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Premium chrome finish cards featuring <span className="text-primary font-semibold">120 modern Marvel characters</span> with stunning refractor technology. Cards numbered 81-200.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search cards... (e.g., Spider-Man, Wolverine)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card/50 backdrop-blur border-2 border-primary/30 focus:border-primary"
              />
            </div>

            {searchQuery && (
              <p className="text-muted-foreground">
                Found {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{cards.length}</div>
                <div className="text-sm text-muted-foreground">Total Cards</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">81-200</div>
                <div className="text-sm text-muted-foreground">Card Range</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">Chrome</div>
                <div className="text-sm text-muted-foreground">Finish</div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 lg:gap-6">
              {filteredCards.map((card) => (
                <Card 
                  key={card.number}
                  className="group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-border hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2"
                >
                  <CardContent className="p-0">
                    {/* Card Image */}
                    <div className="relative aspect-[2.5/3.5] overflow-hidden bg-muted">
                      <img
                        src={card.image}
                        alt={`${card.character} - Chrome #${card.number}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        width={250}
                        height={350}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div>
                          <p className="text-sm font-bold text-primary">CHROME-{card.number.toString().padStart(3, '0')}</p>
                          <p className="text-xs text-foreground">{card.character}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-3">
                      <p className="text-xs font-bold text-primary mb-1">
                        #{card.number}
                      </p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {card.character}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
