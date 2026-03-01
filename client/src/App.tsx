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
import ComingSoon from "./pages/ComingSoon";
import AdminDashboard from "./pages/AdminDashboard";
import Checklists from "./pages/Checklists";
import ChecklistDetail from "./pages/ChecklistDetail";
import Whatnot from "./pages/Whatnot";
import WhatnotChecklist from "./pages/WhatnotChecklist";
import { useState, useEffect } from "react";

// COMING SOON MODE: Set to true to show countdown page, false to show full site
const COMING_SOON_MODE = true;

// ADMIN PASSWORD: Change this to your own password
const ADMIN_PASSWORD = "temp123";

// SUPER ADMIN EMAIL: Used for password recovery
const SUPER_ADMIN_EMAIL = "admin@nlfservices.com";

// SECRET RECOVERY KEY: Add ?recover=nlf-legendary to URL to auto-login
const RECOVERY_KEY = "nlf-legendary";

function AppRouter() {
  const [showFullSite, setShowFullSite] = useState(() => {
    return sessionStorage.getItem('nlf_admin') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

  // Check for recovery key or preview param in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('recover') === RECOVERY_KEY || params.get('preview') === 'admin') {
      sessionStorage.setItem('nlf_admin', 'true');
      setShowFullSite(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('recover');
      url.searchParams.delete('preview');
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('nlf_admin', 'true');
      setShowFullSite(true);
      setShowLoginModal(false);
      setPasswordInput("");
      setLoginError(false);
      setShowForgotPassword(false);
    } else {
      setLoginError(true);
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nlf_admin');
    setShowFullSite(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setLoginError(false);
    setPasswordInput("");
  };

  const maskedEmail = SUPER_ADMIN_EMAIL.replace(
    /^(.{2})(.*)(@.{3})(.*)(\..+)$/,
    '$1***$3***$5'
  );

  const closeModal = () => {
    setShowLoginModal(false);
    setShowForgotPassword(false);
    setPasswordInput("");
    setLoginError(false);
    setRecoveryEmailSent(false);
  };

  // Admin login modal
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-gray-900 border border-green-500/30 rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-green-500/10">
        
        {!showForgotPassword ? (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🔐</div>
              <h2 className="text-xl font-bold text-green-400">Admin Access</h2>
              <p className="text-gray-400 text-sm mt-1">Enter password to view full site</p>
            </div>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setLoginError(false); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password..."
              autoFocus
              className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-green-400 placeholder-gray-600 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all mb-3"
            />
            {loginError && (
              <p className="text-red-400 text-sm mb-3 text-center">Wrong password. Try again.</p>
            )}
            <div className="flex gap-3 mb-4">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm transition-all border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 bg-green-500/20 hover:bg-green-500/40 text-green-400 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border border-green-500/30"
              >
                Unlock Site
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={handleForgotPassword}
                className="text-purple-400 hover:text-purple-300 text-xs underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🔑</div>
              <h2 className="text-xl font-bold text-purple-400">Password Recovery</h2>
              <p className="text-gray-400 text-sm mt-2">Admin account:</p>
              <p className="text-green-400 font-mono text-sm mt-1">{maskedEmail}</p>
            </div>

            {!recoveryEmailSent ? (
              <button
                onClick={() => setRecoveryEmailSent(true)}
                className="w-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 px-4 py-3 rounded-lg text-sm font-semibold transition-all border border-purple-500/30 mb-4"
              >
                🔑 Reveal Password
              </button>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 text-sm text-center font-semibold mb-2">Your password:</p>
                <p className="text-green-400 font-mono text-lg text-center select-all bg-black/50 rounded-lg py-2 px-4">
                  {ADMIN_PASSWORD}
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">Copy it, then go back to login</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowForgotPassword(false); setRecoveryEmailSent(false); }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm transition-all border border-gray-700"
              >
                ← Back to Login
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm transition-all border border-gray-700"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // If coming soon mode is enabled AND user hasn't logged in, show countdown page
  if (COMING_SOON_MODE && !showFullSite) {
    return (
      <>
        <ComingSoon />
        {showLoginModal && <LoginModal />}
        <button
          onClick={() => setShowLoginModal(true)}
          className="fixed top-4 left-4 text-gray-600 hover:text-green-400 transition-all text-lg opacity-30 hover:opacity-100 z-50"
          title="Admin Login"
        >
          🔒
        </button>
      </>
    );
  }

  // Normal site routing
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      {COMING_SOON_MODE && (
        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-4 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 px-4 py-2 rounded-lg text-xs font-mono border border-purple-500/30 transition-all z-50"
          title="Admin: Return to Countdown View"
        >
          🔒 Back to Countdown
        </button>
      )}
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
          <Route path="/admin" component={AdminDashboard} />
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
            {!COMING_SOON_MODE && <EmailCapturePopup />}
            <AppRouter />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
