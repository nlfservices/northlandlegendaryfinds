import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Navigation from "./components/Navigation";
import GlobalTicker from "./components/GlobalTicker";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import LegendaryListPopup from "./components/LegendaryListPopup";
import { DOOM_GALLERY_HASH, DOOM_HISTORY_PATH } from "./data/doomComicCuts";

// Critical path - loaded eagerly (homepage)
import Home from "./pages/Home";

// Everything else - lazy loaded on demand
const Shop = lazy(() => import("./pages/Shop"));
const Breaks = lazy(() => import("./pages/Breaks"));
const BreakRun = lazy(() => import("./pages/BreakRun"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Marvel = lazy(() => import("./pages/Marvel"));
const StarWars = lazy(() => import("./pages/StarWars"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const MarvelChecklist = lazy(() => import("./pages/MarvelChecklist"));
const StarWarsChecklist = lazy(() => import("./pages/StarWarsChecklist"));
const AdminPinGate = lazy(() => import("./pages/AdminPinGate"));
const Checklists = lazy(() => import("./pages/Checklists"));
const ChecklistDetail = lazy(() => import("./pages/ChecklistDetail"));
const Whatnot = lazy(() => import("./pages/Whatnot"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const CardDatabase = lazy(() => import("./pages/CardDatabase"));
const EbayComps = lazy(() => import("./pages/EbayComps"));
const Transparency = lazy(() => import("./pages/Transparency"));
const CardDisplay = lazy(() => import("./pages/CardDisplay"));
const Characters = lazy(() => import("./pages/Characters"));
const CharacterPage = lazy(() => import("./pages/CharacterPage"));
const CardDetailPage = lazy(() => import("./pages/CardDetailPage"));
const JarvisProtocol = lazy(() => import("./pages/JarvisProtocol"));
const MCUNews = lazy(() => import("./pages/MCUNews"));
const NerdGossip = lazy(() => import("./pages/NerdGossip"));
const MCUNewsArticle = lazy(() => import("./pages/MCUNewsArticle"));
const SubscriberHub = lazy(() => import("./pages/SubscriberHub"));
const CardShows = lazy(() => import("./pages/CardShows"));
const SubmitShow = lazy(() => import("./pages/SubmitShow"));
const MarketIntel = lazy(() => import("./pages/MarketIntel"));
const MarketIntel2024vs2025 = lazy(() => import("./pages/MarketIntel2024vs2025"));
const MarketIntelToppsVsUpperDeck = lazy(() => import("./pages/MarketIntelToppsVsUpperDeck"));
const MarketIntelMarvelVsPokemon = lazy(() => import("./pages/MarketIntelMarvelVsPokemon"));
const MarketIntelFanatics = lazy(() => import("./pages/MarketIntelFanatics"));
const MarketIntelBestCards = lazy(() => import("./pages/MarketIntelBestCards"));
const MarvelCardHub = lazy(() => import("./pages/MarvelCardHub"));
const OurProcess = lazy(() => import("./pages/OurProcess"));
const TheCollector = lazy(() => import("./pages/TheCollector"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const WhatnotDeal = lazy(() => import("./pages/WhatnotDeal"));
const SiteMap = lazy(() => import("./pages/SiteMap"));
const Rewards = lazy(() => import("./pages/Rewards"));
const Giveaway = lazy(() => import("./pages/Giveaway"));
const TrendingCards = lazy(() => import("./pages/TrendingCards"));
const TrendingCharacterPage = lazy(() => import("./pages/TrendingCharacterPage"));
const MCUSpotlight = lazy(() => import("./pages/MCUSpotlight"));
const GambitDeck = lazy(() => import("./pages/GambitDeck"));
const TheLittleThings = lazy(() => import("./pages/TheLittleThings"));
const VotingGrounds = lazy(() => import("./pages/VotingGrounds"));
const TemplateShowcase = lazy(() => import("./pages/TemplateShowcase"));
const AdminAffiliateLinks = lazy(() => import("./pages/AdminAffiliateLinks"));
const MCUMediaHub = lazy(() => import("./pages/MCUMediaHub"));
const MCUMediaDetail = lazy(() => import("./pages/MCUMediaDetail"));
const NLFSeries1Checklist = lazy(() => import("./pages/NLFSeries1Checklist"));
const NLFInfinitySeries1Checklist = lazy(() => import("./pages/NLFInfinitySeries1Checklist"));
const Artists = lazy(() => import("./pages/Artists"));
const ArtistProfile = lazy(() => import("./pages/ArtistProfile"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const SellCards = lazy(() => import("./pages/SellCards"));
const DoomsdayCountdown = lazy(() => import("./pages/DoomsdayCountdown"));
const ChasingDoom = lazy(() => import("./pages/ChasingDoom"));
const CardOfTheDayPage = lazy(() => import("./pages/CardOfTheDay"));
const Battleworld = lazy(() => import("./pages/Battleworld"));
const BuildYourRepack = lazy(() => import("./pages/BuildYourRepack"));
const Videos = lazy(() => import("./pages/Videos"));
const VideoDetail = lazy(() => import("./pages/VideoDetail"));
const DoomComicCutHistory = lazy(() => import("./pages/DoomComicCutHistory"));
const OneWorldUnderDoom = lazy(() => import("./pages/OneWorldUnderDoom"));

// Minimal loading spinner for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Routes that render as full-screen standalone experiences (no nav/footer)
const STANDALONE_ROUTES = ["/card-display", "/matrix", "/free-credit"];

function AppRouter() {
  const [location] = useLocation();
  const isStandalone = STANDALONE_ROUTES.some((r) => location === r || location.startsWith(r + "/"));

  // Full-screen standalone routes — no Navigation, CartDrawer, or Footer
  if (isStandalone) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/card-display" component={CardDisplay} />
          <Route path="/matrix" component={AdminPinGate} />
          <Route path="/free-credit" component={WhatnotDeal} />
        </Switch>
      </Suspense>
    );
  }

  // Standard layout routes
  return (
    <>
      <Navigation />
      <GlobalTicker />
      <CartDrawer />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/shop" component={Shop} />
            <Route path="/breaks/:slug" component={BreakRun} />
            <Route path="/breaks" component={Breaks} />
            <Route path="/product/:slug" component={ProductDetail} />
            <Route path="/cart" component={Cart} />
            <Route path="/marvel" component={Marvel} />
            <Route path="/star-wars" component={StarWars} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/subscribe" component={Subscribe} />
            <Route path="/faq" component={FAQ} />
            <Route path="/shipping" component={Shipping} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/refund-policy" component={RefundPolicy} />
            <Route path="/marvel/:productId/checklist" component={MarvelChecklist} />
            <Route path="/starwars/:productId/checklist" component={StarWarsChecklist} />
            <Route path="/checklists" component={Checklists} />
            <Route path="/checklist/:slug" component={ChecklistDetail} />
            <Route path="/whatnot" component={Whatnot} />
            <Route path="/order-success" component={OrderSuccess} />
            <Route path="/cards" component={CardDatabase} />
            <Route path="/cards/:setSlug/:cardNumber" component={CardDetailPage} />
            <Route path="/cards/:slug" component={CardDatabase} />
            <Route path="/characters" component={Characters} />
            <Route path="/characters/:slug" component={CharacterPage} />
            <Route path="/admin" component={AdminPinGate} />
            <Route path="/admin/templates" component={TemplateShowcase} />
            <Route path="/admin/ebay-comps" component={EbayComps} />
            <Route path="/admin/affiliate-links" component={AdminAffiliateLinks} />
            <Route path="/transparency" component={Transparency} />
            <Route path="/mcu-news" component={MCUNews} />
            <Route path="/videos/:slug" component={VideoDetail} />
            <Route path="/videos" component={Videos} />
            <Route path="/comic-cuts/doctor-doom-history" component={DoomComicCutHistory} />
            <Route path="/comic-cuts/doom">{() => { window.location.replace(`${DOOM_HISTORY_PATH}#${DOOM_GALLERY_HASH}`); return null; }}</Route>
            <Route path="/chrome/one-world-under-doom" component={OneWorldUnderDoom} />
            <Route path="/nerd-gossip" component={NerdGossip} />
            <Route path="/mcu-news/:slug" component={MCUNewsArticle} />
            {/* Redirects from old /mcu-intel URLs */}
            <Route path="/mcu-intel">{() => { window.location.replace("/mcu-news"); return null; }}</Route>
            <Route path="/mcu-intel/:slug">{(params: any) => { window.location.replace(`/mcu-news/${params.slug}`); return null; }}</Route>
            <Route path="/subscribers" component={SubscriberHub} />
            <Route path="/card-shows" component={CardShows} />
            <Route path="/submit-show" component={SubmitShow} />
            <Route path="/market-intel" component={MarketIntel} />
            <Route path="/market-intel/2024-vs-2025-topps-marvel" component={MarketIntel2024vs2025} />
            <Route path="/market-intel/topps-vs-upper-deck-marvel" component={MarketIntelToppsVsUpperDeck} />
            <Route path="/market-intel/marvel-vs-pokemon-cards" component={MarketIntelMarvelVsPokemon} />
            <Route path="/market-intel/why-fanatics-trading-cards" component={MarketIntelFanatics} />
            <Route path="/market-intel/best-topps-marvel-cards" component={MarketIntelBestCards} />
            <Route path="/marvel-card-hub" component={MarvelCardHub} />
            <Route path="/our-process" component={OurProcess} />
            <Route path="/the-collector" component={TheCollector} />
            <Route path="/the-collector/:slug" component={BlogPost} />
            <Route path="/free-credit" component={WhatnotDeal} />
            <Route path="/sitemap" component={SiteMap} />
            <Route path="/rewards" component={Rewards} />
            <Route path="/giveaway" component={Giveaway} />
            <Route path="/trending" component={TrendingCards} />
            <Route path="/trending/:slug" component={TrendingCharacterPage} />
            <Route path="/gambit-deck" component={GambitDeck} />
            <Route path="/the-little-things" component={TheLittleThings} />
            <Route path="/movies-series" component={MCUMediaHub} />
            <Route path="/movies-series/:slug" component={MCUMediaDetail} />
            <Route path="/nlf-series-1" component={NLFSeries1Checklist} />
            <Route path="/nlf-infinity-series-1" component={NLFInfinitySeries1Checklist} />
            <Route path="/voting-grounds" component={VotingGrounds} />
            <Route path="/mcu-spotlight" component={MCUSpotlight} />
            <Route path="/artists" component={Artists} />
            <Route path="/artists/:slug" component={ArtistProfile} />
            <Route path="/api-docs" component={ApiDocs} />
            <Route path="/sell-cards" component={SellCards} />
            <Route path="/doomsday" component={DoomsdayCountdown} />
            <Route path="/chasing-doom" component={ChasingDoom} />
            <Route path="/battleworld" component={Battleworld} />
            <Route path="/build-your-repack" component={BuildYourRepack} />
            <Route path="/card-of-the-day/:date" component={CardOfTheDayPage} />
            <Route path="/card-of-the-day" component={CardOfTheDayPage} />
            <Route path="/login" component={JarvisProtocol} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <LegendaryListPopup />
            <AppRouter />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
