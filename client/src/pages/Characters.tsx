/**
 * Characters Database Page
 * Design: Searchable character index with card appearances
 * - Search functionality
 * - Character cards with hover effects
 * - Links to individual character pages
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface CharacterAppearance {
  set: string;
  number: number;
  image: string;
}

interface Character {
  name: string;
  appearances: CharacterAppearance[];
}

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load character data
    fetch('/data/characters.json')
      .then(res => res.json())
      .then(data => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load characters:', err);
        setLoading(false);
      });
  }, []);

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSetBadgeColor = (set: string) => {
    switch (set) {
      case 'chrome': return 'bg-primary/20 text-primary border-primary/50';
      case 'cbh': return 'bg-secondary/20 text-secondary border-secondary/50';
      case 'mint': return 'bg-accent/20 text-accent border-accent/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSetName = (set: string) => {
    switch (set) {
      case 'chrome': return 'Chrome';
      case 'cbh': return 'CBH';
      case 'mint': return 'Mint';
      default: return set;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/banners/marvel_heroes_leaders_banner.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              CHARACTER DATABASE
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Browse <span className="text-primary font-semibold">{characters.length} unique Marvel characters</span> and discover which cards feature your favorite heroes and villains.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search characters... (e.g., Spider-Man, Wolverine, Iron Man)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card/50 backdrop-blur border-2 border-primary/30 focus:border-primary"
              />
            </div>
            
            {searchQuery && (
              <p className="mt-4 text-muted-foreground">
                Found {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Characters Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-2xl text-muted-foreground">
                No characters found matching "{searchQuery}"
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((character) => (
                <Card 
                  key={character.name}
                  className="group relative overflow-hidden bg-card/50 backdrop-blur border-2 border-border hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {character.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Appears in {character.appearances.length} card{character.appearances.length !== 1 ? 's' : ''}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {character.appearances.map((app, i) => (
                          <span 
                            key={i}
                            className={`text-xs px-2 py-1 rounded border ${getSetBadgeColor(app.set)}`}
                          >
                            {getSetName(app.set)} #{app.number}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Link href={`/character/${encodeURIComponent(character.name)}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full group-hover:bg-primary/10 group-hover:text-primary"
                      >
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">{characters.length}</div>
              <div className="text-muted-foreground">Unique Characters</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">387</div>
              <div className="text-muted-foreground">Total Cards</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">3</div>
              <div className="text-muted-foreground">Card Sets</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
