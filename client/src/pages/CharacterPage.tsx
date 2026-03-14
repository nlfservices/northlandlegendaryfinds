/**
 * Individual Character Page
 * Design: Detailed character page with card appearances
 * - Character name and basic info
 * - Base cards section showing all appearances
 * - Placeholder sections for refractors/autos (future)
 */

import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

interface CharacterAppearance {
  set: string;
  number: number;
  image: string;
}

interface Character {
  name: string;
  appearances: CharacterAppearance[];
}

export default function CharacterPage() {
  const [, params] = useRoute("/character/:name");
  const characterName = params?.name ? decodeURIComponent(params.name) : "";
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!characterName) return;
    
    fetch('/data/characters.json')
      .then(res => res.json())
      .then((data: Character[]) => {
        const found = data.find(c => c.name === characterName);
        setCharacter(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load character:', err);
        setLoading(false);
      });
  }, [characterName]);

  const getSetInfo = (set: string) => {
    switch (set) {
      case 'chrome':
        return { name: 'Topps Chrome Marvel', color: 'text-primary', bgColor: 'bg-primary/20', borderColor: 'border-primary/50' };
      case 'cbh':
        return { name: '2025 Comic Book Heroes', color: 'text-secondary', bgColor: 'bg-secondary/20', borderColor: 'border-secondary/50' };
      case 'mint':
        return { name: 'Marvel Mint', color: 'text-accent', bgColor: 'bg-accent/20', borderColor: 'border-accent/50' };
      default:
        return { name: set, color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading character...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Character Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The character "{characterName}" could not be found in our database.
          </p>
          <Link href="/characters">
            <Button>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Characters
            </Button>
          </Link>
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
          <Link href="/characters">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Characters
            </Button>
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              {character.name}
            </h1>
            
            <div className="flex items-center justify-center space-x-4 text-muted-foreground">
              <span>Marvel Character</span>
              <span>•</span>
              <span>{character.appearances.length} Card{character.appearances.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Base Cards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-bold">BASE CARDS</h2>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              {character.name} appears in <span className="text-primary font-semibold">{character.appearances.length} base card{character.appearances.length !== 1 ? 's' : ''}</span> across our Marvel trading card sets.
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
              {character.appearances.map((appearance, index) => {
                const setInfo = getSetInfo(appearance.set);
                
                return (
                  <Card 
                    key={index}
                    className={`group relative overflow-hidden bg-card/50 backdrop-blur border-2 ${setInfo.borderColor} hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all`}
                  >
                    <CardContent className="p-0">
                      {/* Card Image */}
                      <div className="relative aspect-[2.5/3.5] overflow-hidden bg-muted">
                        <img
                          src={appearance.image}
                          alt={`${character.name} - ${setInfo.name} #${appearance.number}`}
                          loading="lazy"
                          decoding="async"
                          width={250}
                          height={350}
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Set Badge */}
                        <div className={`absolute top-3 right-3 ${setInfo.bgColor} backdrop-blur px-3 py-1 rounded border ${setInfo.borderColor}`}>
                          <span className={`text-xs font-bold ${setInfo.color}`}>
                            {appearance.set.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-6">
                        <p className={`text-sm font-bold ${setInfo.color} mb-2`}>
                          {setInfo.name}
                        </p>
                        <p className="text-2xl font-bold text-foreground mb-1">
                          #{appearance.number}
                        </p>
                        <p className="text-muted-foreground">
                          {character.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder Sections */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              {/* Refractors Placeholder */}
              <Card className="bg-card/50 backdrop-blur border-2 border-primary/30">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">REFRACTORS</h3>
                  <p className="text-muted-foreground">
                    Refractor and parallel variations coming soon. Check back for rare chrome variants and numbered parallels.
                  </p>
                </CardContent>
              </Card>

              {/* Autographs Placeholder */}
              <Card className="bg-card/50 backdrop-blur border-2 border-secondary/30">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">AUTOGRAPHS</h3>
                  <p className="text-muted-foreground">
                    Autographed cards and special inserts coming soon. Track artist signatures and exclusive variants.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Characters CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 border-2 border-primary/50">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                EXPLORE MORE CHARACTERS
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Browse our complete database of 208 unique Marvel characters and discover their card appearances.
              </p>
              <Link href="/characters">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  View All Characters
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
