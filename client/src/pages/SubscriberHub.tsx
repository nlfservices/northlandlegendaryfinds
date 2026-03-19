/**
 * Subscriber Hub — Premium gated content for subscribers
 * Features: Early access repacks, exclusive checklists, subscriber benefits
 * Non-subscribers see a blurred preview with upgrade CTA
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  Crown,
  Lock,
  Clock,
  Tag,
  ListChecks,
  Bell,
  Shield,
  Gift,
  ChevronRight,
  Star,
  Sparkles,
  Eye,
  Calendar,
  Package,
  ArrowRight,
  Zap,
  CheckCircle,
} from "lucide-react";

// ─── Icon map for benefits ───
const iconMap: Record<string, React.ElementType> = {
  clock: Clock,
  tag: Tag,
  list: ListChecks,
  bell: Bell,
  shield: Shield,
  gift: Gift,
};

export default function SubscriberHub() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const isSubscriber = user?.role === "subscriber" || user?.role === "admin";

  const { data: hubData, isLoading: hubLoading } = trpc.subscriber.hubOverview.useQuery();
  const { data: earlyAccess } = trpc.subscriber.earlyAccessProducts.useQuery(undefined, {
    enabled: isSubscriber,
  });
  const { data: checklists } = trpc.subscriber.exclusiveChecklists.useQuery(undefined, {
    enabled: isSubscriber,
  });
  const { data: benefitsData } = trpc.subscriber.benefits.useQuery();

  const isLoading = authLoading || hubLoading;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Subscriber Hub | Northland Legendary Finds"
        description="Exclusive subscriber content — early access to repacks, exclusive checklists with estimated values, subscriber-only pricing, and priority drop alerts."
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.20_0.08_285)] via-background to-[oklch(0.15_0.06_195)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.30_0.15_285/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.25_0.12_145/0.2),transparent_60%)]" />

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[oklch(0.75_0.15_85/0.15)] border border-[oklch(0.75_0.15_85/0.3)] rounded-full mb-6">
              <Crown className="w-4 h-4 text-[oklch(0.75_0.15_85)]" />
              <span className="text-[oklch(0.75_0.15_85)] text-sm font-bold tracking-wide">SUBSCRIBER EXCLUSIVE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-[oklch(0.75_0.15_85)]">THE </span>
              <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.18_195)] to-[oklch(0.55_0.20_285)] bg-clip-text text-transparent">
                VAULT
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isSubscriber
                ? "Welcome back. Your exclusive content is ready — early access drops, detailed checklists, and subscriber-only pricing await."
                : "Unlock early access to repack drops, exclusive checklists with estimated values, subscriber-only pricing, and priority notifications."}
            </p>

            {!isSubscriber && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link href="/subscribe">
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Subscriber
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      <Crown className="w-5 h-5 mr-2" />
                      Sign In to Subscribe
                    </Button>
                  </a>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-black text-primary">{hubData?.earlyAccessCount ?? "—"}</div>
                <div className="text-sm text-muted-foreground mt-1">Early Access Drops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[oklch(0.65_0.18_195)]">{hubData?.exclusiveChecklistCount ?? "—"}</div>
                <div className="text-sm text-muted-foreground mt-1">Exclusive Checklists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[oklch(0.75_0.15_85)]">$20</div>
                <div className="text-sm text-muted-foreground mt-1">Saved Per Drop</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[oklch(0.55_0.20_285)]">48hr</div>
                <div className="text-sm text-muted-foreground mt-1">Early Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EARLY ACCESS REPACKS ===== */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6 text-[oklch(0.75_0.15_85)]" />
            <h2 className="text-3xl font-black">Early Access Drops</h2>
            {!isSubscriber && <Lock className="w-5 h-5 text-muted-foreground" />}
          </div>

          {isSubscriber && earlyAccess ? (
            <div className="grid md:grid-cols-2 gap-6">
              {earlyAccess.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-[oklch(0.75_0.15_85/0.5)] transition-all duration-300"
                >
                  {/* Subscriber badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-[oklch(0.75_0.15_85)] text-black font-bold">
                      <Crown className="w-3 h-3 mr-1" />
                      SUBSCRIBER EXCLUSIVE
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row">
                    {/* Product image */}
                    <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[oklch(0.20_0.05_285)] to-[oklch(0.15_0.03_195)]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.subtitle}</p>

                      {/* Pricing */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-black text-primary">${product.subscriberPrice}</span>
                        <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                        <Badge variant="outline" className="border-primary text-primary">
                          Save ${product.savings}
                        </Badge>
                      </div>

                      {/* Launch dates */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[oklch(0.75_0.15_85)]" />
                          <span className="text-[oklch(0.75_0.15_85)] font-semibold">
                            Subscriber Access: {new Date(product.subscriberLaunchDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Public Launch: {new Date(product.publicLaunchDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5">
                        {product.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button className="mt-4 bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold">
                        <Bell className="w-4 h-4 mr-2" />
                        Notify Me When Live
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Non-subscriber: blurred preview */
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-6 blur-sm pointer-events-none select-none">
                {(hubData?.earlyAccessPreview ?? []).map((product) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border/50 rounded-xl overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[oklch(0.20_0.05_285)] to-[oklch(0.15_0.03_195)]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                        <div className="mt-4 space-y-2">
                          <div className="h-4 bg-muted/50 rounded w-3/4" />
                          <div className="h-4 bg-muted/50 rounded w-1/2" />
                          <div className="h-4 bg-muted/50 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm border border-[oklch(0.75_0.15_85/0.3)] rounded-2xl p-8 text-center max-w-md shadow-2xl">
                  <Lock className="w-12 h-12 text-[oklch(0.75_0.15_85)] mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2">Subscriber Only</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 48-hour early access to every repack drop with exclusive subscriber pricing. Save $20 per purchase.
                  </p>
                  {isAuthenticated ? (
                    <Link href="/subscribe">
                      <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold">
                        Sign In to Subscribe
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== EXCLUSIVE CHECKLISTS ===== */}
      <section className="py-16 border-t border-border/50 bg-[oklch(0.14_0.03_285)]">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <ListChecks className="w-6 h-6 text-[oklch(0.65_0.18_195)]" />
            <h2 className="text-3xl font-black">Exclusive Checklists</h2>
            {!isSubscriber && <Lock className="w-5 h-5 text-muted-foreground" />}
          </div>

          {isSubscriber && checklists ? (
            <div className="grid md:grid-cols-2 gap-6">
              {checklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="group bg-card border border-border/50 rounded-xl p-6 hover:border-[oklch(0.65_0.18_195/0.5)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {checklist.isNew && (
                        <Badge className="bg-primary text-primary-foreground mb-2">
                          <Sparkles className="w-3 h-3 mr-1" />
                          NEW
                        </Badge>
                      )}
                      <h3 className="text-lg font-bold">{checklist.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[oklch(0.65_0.18_195)]">{checklist.cardCount}</div>
                      <div className="text-xs text-muted-foreground">cards</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{checklist.description}</p>

                  {/* Tier breakdown */}
                  <div className="space-y-2 mb-4">
                    {checklist.tiers.map((tier, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: [
                                "oklch(0.75 0.20 145)",
                                "oklch(0.65 0.18 195)",
                                "oklch(0.55 0.20 285)",
                                "oklch(0.75 0.15 85)",
                                "oklch(0.65 0.15 30)",
                              ][i % 5],
                            }}
                          />
                          <span className="text-foreground">{tier.name}</span>
                        </div>
                        <span className="text-muted-foreground">{tier.count} cards</span>
                      </div>
                    ))}
                  </div>

                  {/* Value and hit ratio */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div>
                      <div className="text-xs text-muted-foreground">Est. Value Range</div>
                      <div className="text-sm font-bold text-[oklch(0.75_0.15_85)]">{checklist.estimatedValueRange}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Hit Ratio</div>
                      <div className="text-sm font-bold text-primary">{checklist.hitRatio}</div>
                    </div>
                  </div>

                  {/* Release date */}
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Release: {new Date(checklist.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Non-subscriber: blurred preview */
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-6 blur-sm pointer-events-none select-none">
                {(hubData?.checklistPreview ?? []).map((checklist) => (
                  <div key={checklist.id} className="bg-card border border-border/50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {checklist.isNew && (
                          <Badge className="bg-primary text-primary-foreground mb-2">NEW</Badge>
                        )}
                        <h3 className="text-lg font-bold">{checklist.title}</h3>
                      </div>
                      <div className="text-2xl font-black text-[oklch(0.65_0.18_195)]">{checklist.cardCount}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/50 rounded w-full" />
                      <div className="h-3 bg-muted/50 rounded w-4/5" />
                      <div className="h-3 bg-muted/50 rounded w-3/5" />
                      <div className="h-3 bg-muted/50 rounded w-4/5" />
                      <div className="h-3 bg-muted/50 rounded w-2/5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm border border-[oklch(0.65_0.18_195/0.3)] rounded-2xl p-8 text-center max-w-md shadow-2xl">
                  <Eye className="w-12 h-12 text-[oklch(0.65_0.18_195)] mx-auto mb-4" />
                  <h3 className="text-2xl font-black mb-2">Exclusive Checklists</h3>
                  <p className="text-muted-foreground mb-6">
                    Get full card-by-card breakdowns with estimated values, hit ratios, and tier details before anyone else.
                  </p>
                  {isAuthenticated ? (
                    <Link href="/subscribe">
                      <Button size="lg" className="bg-[oklch(0.65_0.18_195)] hover:bg-[oklch(0.60_0.18_195)] text-black font-bold">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  ) : (
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="bg-[oklch(0.65_0.18_195)] hover:bg-[oklch(0.60_0.18_195)] text-black font-bold">
                        Sign In to Subscribe
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== SUBSCRIBER BENEFITS ===== */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">Why Subscribe?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join the inner circle of Marvel card collectors. Here's what you unlock.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(benefitsData?.benefits ?? []).map((benefit, i) => {
              const Icon = iconMap[benefit.icon] || Star;
              return (
                <div
                  key={i}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          {!isSubscriber && (
            <div className="mt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-[oklch(0.75_0.15_85/0.1)] via-[oklch(0.55_0.20_285/0.1)] to-[oklch(0.65_0.18_195/0.1)] border border-[oklch(0.75_0.15_85/0.3)] rounded-2xl p-8 max-w-lg">
                <Crown className="w-10 h-10 text-[oklch(0.75_0.15_85)] mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">Ready to Join?</h3>
                <p className="text-muted-foreground mb-6">
                  Unlock everything above — early access, exclusive checklists, subscriber pricing, and more.
                </p>
                {isAuthenticated ? (
                  <Link href="/subscribe">
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      <Crown className="w-5 h-5 mr-2" />
                      Become a Subscriber
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.70_0.15_85)] text-black font-bold text-lg px-8">
                      Sign In to Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
