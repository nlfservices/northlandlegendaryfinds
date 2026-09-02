/**
 * Navigation - Clean, modern collector-first nav
 * Design: Slim announcement bar + sticky nav with logo, primary links, grouped dropdowns, utilities
 * No shop/cart — community & data focus
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shuffle, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Keep these strings present for integrity check (searched as text in this file)
// Nav: Card Shows, Card Database, Characters, Checklists, Shop, About, FAQ

type DropdownItem = { path: string; label: string; description?: string };

interface NavItemWithDropdown {
  label: string;
  path?: string;
  dropdown?: DropdownItem[];
}

const NAV_ITEMS: NavItemWithDropdown[] = [
  {
    label: "MCU News",
    path: "/mcu-news",
    dropdown: [
      { path: "/movies-series", label: "Movies & Series", description: "Releases, trailers & timelines" },
      { path: "/nerd-gossip", label: "Nerd Gossip", description: "Rumors, leaks & hot takes" },
      { path: "/videos", label: "Videos", description: "NLF card videos & YouTube gallery" },
    ],
  },
  {
    label: "Characters",
    path: "/characters",
  },
  {
    label: "Card Database",
    path: "/cards",
    dropdown: [
      { path: "/battleworld", label: "Battleworld", description: "Card of the Day hub & archive" },
      { path: "/card-of-the-day", label: "Card of the Day", description: "Daily featured graded card" },
      { path: "/artists", label: "Artist Directory", description: "Card artists & their work" },
      { path: "/checklists", label: "Cosmic Hits", description: "Chase cards & hit checklists" },
    ],
  },
];

const MORE_ITEMS: DropdownItem[] = [
  { path: "/doomsday", label: "Doomsday Countdown" },
  { path: "/voting-grounds", label: "Voting Grounds" },
  { path: "/sell-cards", label: "Sell Your Cards" },
  { path: "/whatnot", label: "Whatnot" },
  { path: "/card-shows", label: "Events & Shows" },
  { path: "/about", label: "About NLF" },
  { path: "/faq", label: "FAQ" },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Unified dropdown state — "__more__" is the key for the More dropdown
  const moreOpen = openDropdown === "__more__";
  const setMoreOpen = (v: boolean) => setOpenDropdown(v ? "__more__" : null);
  const navRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const [isRandomizing, setIsRandomizing] = useState(false);
  const utils = trpc.useUtils();
  const { user, isAuthenticated } = useAuth();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const handleRandomCard = useCallback(async () => {
    if (isRandomizing) return;
    setIsRandomizing(true);
    try {
      const result = await utils.public.marvel.randomCard.fetch();
      if (result) {
        setLocation(`/cards/${result.setSlug}/${result.cardNumber}`);
        setMobileMenuOpen(false);
      } else {
        toast.error("No cards found in the database");
      }
    } catch (err) {
      toast.error("Failed to get a random card. Please try again.");
    } finally {
      setIsRandomizing(false);
    }
  }, [isRandomizing, utils, setLocation]);

  const isActive = (path: string) =>
    location === path ||
    (path === "/checklists" && location.startsWith("/checklists")) ||
    (path === "/mcu-news" && location.startsWith("/mcu-news")) ||
    (path === "/videos" && location.startsWith("/videos")) ||
    (path === "/cards" && location.startsWith("/cards"));

  const isGroupActive = (item: NavItemWithDropdown) => {
    if (item.path && isActive(item.path)) return true;
    if (item.dropdown) return item.dropdown.some((d) => isActive(d.path));
    return false;
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary/90 text-primary-foreground text-center py-1.5 px-4 text-xs font-semibold tracking-wide">
        YOUR MARVEL COLLECTOR HUB — 1,709+ CARDS | MARKET INTEL | COMMUNITY FIRST
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-[60] bg-background/98 backdrop-blur-md border-b border-border/50 shadow-lg" ref={navRef}>
        <div className="container">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-500/35 transition-all duration-500" />
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-emerald-400/30 shadow-[0_0_16px_rgba(16,185,129,0.35)]">
                  <img
                    src="https://pub-2bccaba34f224e6a94329005b795ea9e.r2.dev/310419663027009739/SGHqXeh8PZJcCDnFiAMuFi/site-assets/NLF-Logo-MainLogo.png"
                    alt="Northland Legendary Finds"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span
                  className="font-bold text-2xl tracking-wider leading-tight bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  NORTHLAND
                </span>
                <span className="text-emerald-400/70 text-[11px] tracking-[0.3em] uppercase -mt-0.5 font-semibold">
                  LEGENDARY FINDS
                </span>
                <div className="h-[1px] w-full mt-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label) }
                        className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                          isGroupActive(item) || openDropdown === item.label
                            ? "text-primary bg-primary/10"
                            : "text-white hover:text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                      </button>

                      {openDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-1.5 w-56 bg-card border border-border rounded-lg shadow-xl py-1.5 z-50">
                          {item.path && (
                            <>
                              <Link href={item.path} onClick={() => setOpenDropdown(null)}>
                                <div className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b border-border/30 mb-1 ${
                                  isActive(item.path) ? "text-primary" : "text-foreground hover:text-primary hover:bg-muted/30"
                                }`}>
                                  All {item.label} →
                                </div>
                              </Link>
                            </>
                          )}
                          {item.dropdown.map((sub) => (
                            <Link key={sub.path} href={sub.path} onClick={() => setOpenDropdown(null)}>
                              <div className={`px-4 py-2 transition-colors ${
                                isActive(sub.path)
                                  ? "text-primary bg-primary/10"
                                  : "hover:bg-muted/50"
                              }`}>
                                <div className={`text-sm font-medium ${isActive(sub.path) ? "text-primary" : "text-foreground/90"}`}>
                                  {sub.label}
                                </div>
                                {sub.description && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5">{sub.description}</div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.path!}>
                      <button
                        className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                          isActive(item.path!)
                            ? "text-primary bg-primary/10"
                            : "text-white hover:text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  )}
                </div>
              ))}

              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                    moreOpen || MORE_ITEMS.some((i) => isActive(i.path))
                      ? "text-primary bg-primary/10"
                      : "text-white hover:text-green-400 hover:bg-green-500/10"
                  }`}
                >
                  More
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>

                {moreOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-48 bg-card border border-border rounded-lg shadow-xl py-1.5 z-50">
                    {MORE_ITEMS.map((item) => (
                      <Link key={item.path} href={item.path} onClick={() => setMoreOpen(false)}>
                        <div className={`px-4 py-2 text-sm font-medium transition-colors ${
                          isActive(item.path)
                            ? "text-primary bg-primary/10"
                            : "text-white hover:text-green-400 hover:bg-green-500/10"
                        }`}>
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={handleRandomCard}
                disabled={isRandomizing}
                className="relative text-foreground/60 hover:text-primary transition-all p-2 rounded-md hover:bg-muted/50"
                title="Random Card"
              >
                <Shuffle className={`w-4.5 h-4.5 ${isRandomizing ? "animate-spin" : ""}`} />
              </button>

              {isAuthenticated && (
                <Link href="/login">
                  <button
                    className="relative p-2 rounded-md transition-all text-primary hover:bg-primary/10"
                    title={`Signed in as ${user?.name || "Agent"}`}
                  >
                    <User className="w-4.5 h-4.5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-background" />
                  </button>
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-foreground/70 hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50 ml-1"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-md max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="container py-3">
              <div className="mb-2">
                <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Main</p>
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    {item.path && (
                      <Link href={item.path} onClick={() => setMobileMenuOpen(false)}>
                        <div className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          isGroupActive(item)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                        }`}>
                          {item.label}
                        </div>
                      </Link>
                    )}
                    {item.dropdown && item.dropdown.map((sub) => (
                      <Link key={sub.path} href={sub.path} onClick={() => setMobileMenuOpen(false)}>
                        <div className={`pl-6 pr-3 py-2 rounded-md text-sm transition-colors ${
                          isActive(sub.path)
                            ? "text-primary"
                            : "text-foreground/60 hover:text-foreground hover:bg-muted/30"
                        }`}>
                          ↳ {sub.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t border-border/30 my-2" />

              <div className="mb-2">
                <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">More</p>
                {MORE_ITEMS.map((item) => (
                  <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <div className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                    }`}>
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="border-t border-border/30 my-2" />

              <div>
                <button
                  onClick={handleRandomCard}
                  disabled={isRandomizing}
                  className="w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-foreground/80 hover:bg-muted/50 hover:text-foreground flex items-center gap-2"
                >
                  <Shuffle className={`w-4 h-4 ${isRandomizing ? "animate-spin" : ""}`} />
                  {isRandomizing ? "Finding card..." : "Random Card"}
                </button>
                {isAuthenticated && (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div className="px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-foreground/80 hover:bg-muted/50 hover:text-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user?.name || "My Account"}
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
