/**
 * Shop Page - Placeholder for Shopify integration
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Shop() {
  const handleComingSoon = () => {
    toast.info("Shop coming soon! Shopify integration in progress.");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/banners/marvel_villains_banner.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            SHOP
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Premium Marvel trading card repacks and individual cards. Shopify integration coming soon!
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-2 border-primary/30">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-primary" />
                </div>
                
                <h2 className="text-4xl font-bold mb-4">
                  SHOP COMING SOON
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  We're integrating with Shopify to bring you the best shopping experience for Marvel trading cards. Check back soon!
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Package className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Curated Repacks</h3>
                    <p className="text-sm text-muted-foreground">
                      Premium repack boxes with guaranteed hits
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Sparkles className="w-10 h-10 text-secondary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Individual Cards</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete your collection card by card
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <ShoppingCart className="w-10 h-10 text-accent mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Secure Checkout</h3>
                    <p className="text-sm text-muted-foreground">
                      Safe and secure Shopify payments
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleComingSoon}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Notify Me When Available
                  </Button>
                  <Link href="/characters">
                    <Button size="lg" variant="outline">
                      Browse Characters
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
