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
import WhatnotChecklist from "./pages/WhatnotChecklist";
import OrderSuccess from "./pages/OrderSuccess";
import CardDatabase from "./pages/CardDatabase";
// import GradedInventory from "./pages/GradedInventory"; // Removed from public site
import EbayComps from "./pages/EbayComps";
import Transparency from "./pages/Transparency";
import CardDisplay from "./pages/CardDisplay";
import CardDetail from "./pages/CardDetail";

// Routes that render as full-screen standalone experiences (no nav/footer)
const STANDALONE_ROUTES = ["/card-display"];

function AppRouter() {
  const [location] = useLocation();
  const isStandalone = STANDALONE_ROUTES.some((r) => location === r || location.startsWith(r + "/"));

  // Full-screen standalone routes — no Navigation, CartDrawer, or Footer
  if (isStandalone) {
    return (
      <Switch>
        <Route path="/card-display" component={CardDisplay} />
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
          <Route path="/whatnot/checklist/:slug" component={WhatnotChecklist} />
          <Route path="/order-success" component={OrderSuccess} />
          <Route path="/cards" component={CardDatabase} />
          <Route path="/cards/:setSlug/:cardSlug" component={CardDetail} />
          <Route path="/cards/:slug" component={CardDatabase} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/ebay-comps" component={EbayComps} />
          <Route path="/transparency" component={Transparency} />
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
