import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Marvel from "./pages/Marvel";
import StarWars from "./pages/StarWars";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Subscribe from "./pages/Subscribe";
import FAQ from "./pages/FAQ";
import Shipping from "./pages/Shipping";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import MarvelChecklist from "./pages/MarvelChecklist";
import StarWarsChecklist from "./pages/StarWarsChecklist";
import EmailCapturePopup from "./components/EmailCapturePopup";
import AdminDashboard from "./pages/AdminDashboard";
import Checklists from "./pages/Checklists";
import ChecklistDetail from "./pages/ChecklistDetail";
import Whatnot from "./pages/Whatnot";
// import WhatnotChecklist from "./pages/WhatnotChecklist"; // Removed - broken route, hidden for now
import OrderSuccess from "./pages/OrderSuccess";
import CardDatabase from "./pages/CardDatabase";
// import GradedInventory from "./pages/GradedInventory"; // Removed from public site
import EbayComps from "./pages/EbayComps";
import Transparency from "./pages/Transparency";
import CardDisplay from "./pages/CardDisplay";
import Characters from "./pages/Characters";
import CharacterPage from "./pages/CharacterPage";
import CardDetailPage from "./pages/CardDetailPage";
import JarvisProtocol from "./pages/JarvisProtocol";
import MatrixPortal from "./pages/MatrixPortal";
import MCUNews from "./pages/MCUNews";
import NerdGossip from "./pages/NerdGossip";
import MCUNewsArticle from "./pages/MCUNewsArticle";
import SubscriberHub from "./pages/SubscriberHub";
import CardShows from "./pages/CardShows";
import SubmitShow from "./pages/SubmitShow";
import MarketIntel from "./pages/MarketIntel";
import MarketIntel2024vs2025 from "./pages/MarketIntel2024vs2025";
import MarketIntelToppsVsUpperDeck from "./pages/MarketIntelToppsVsUpperDeck";
import MarketIntelMarvelVsPokemon from "./pages/MarketIntelMarvelVsPokemon";
import MarketIntelFanatics from "./pages/MarketIntelFanatics";
import MarketIntelBestCards from "./pages/MarketIntelBestCards";
import MarvelCardHub from "./pages/MarvelCardHub";
import OurProcess from "./pages/OurProcess";
import TheCollector from "./pages/TheCollector";
import BlogPost from "./pages/BlogPost";
import WhatnotDeal from "./pages/WhatnotDeal";
import SiteMap from "./pages/SiteMap";
import Rewards from "./pages/Rewards";
import Giveaway from "./pages/Giveaway";
import TrendingCards from "./pages/TrendingCards";
import TrendingCharacterPage from "./pages/TrendingCharacterPage";
import MCUSpotlight from "./pages/MCUSpotlight";
import GambitDeck from "./pages/GambitDeck";
import TheLittleThings from "./pages/TheLittleThings";
import VotingGrounds from "./pages/VotingGrounds";
import TemplateShowcase from "./pages/TemplateShowcase";
import AdminAffiliateLinks from "./pages/AdminAffiliateLinks";
import MCUMediaHub from "./pages/MCUMediaHub";
import MCUMediaDetail from "./pages/MCUMediaDetail";
import NLFSeries1Checklist from "./pages/NLFSeries1Checklist";
import NLFInfinitySeries1Checklist from "./pages/NLFInfinitySeries1Checklist";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import ApiDocs from "./pages/ApiDocs";
import SellCards from "./pages/SellCards";

// Routes that render as full-screen standalone experiences (no nav/footer)
const STANDALONE_ROUTES = ["/card-display", "/matrix", "/free-credit"];

function AppRouter() {
  const [location] = useLocation();
  const isStandalone = STANDALONE_ROUTES.some((r) => location === r || location.startsWith(r + "/"));

  // Full-screen standalone routes — no Navigation, CartDrawer, or Footer
  if (isStandalone) {
    return (
      <Switch>
        <Route path="/card-display" component={CardDisplay} />
        <Route path="/matrix" component={MatrixPortal} />
        <Route path="/free-credit" component={WhatnotDeal} />
      </Switch>
    );
  }

  // Standard layout routes
  return (
    <>
      <Navigation />
      <CartDrawer />
      <main className="min-h-screen">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
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
          <Route path="/matrix" component={MatrixPortal} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/templates" component={TemplateShowcase} />
          <Route path="/admin/ebay-comps" component={EbayComps} />
          <Route path="/admin/affiliate-links" component={AdminAffiliateLinks} />
          <Route path="/transparency" component={Transparency} />
          <Route path="/mcu-news" component={MCUNews} />
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
          <Route path="/login" component={JarvisProtocol} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
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
            <EmailCapturePopup />
            <AppRouter />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
