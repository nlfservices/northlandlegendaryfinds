import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MarvelChecklist from "./pages/MarvelChecklist";
import StarWarsChecklist from "./pages/StarWarsChecklist";
import Marvel from "./pages/Marvel";
import StarWars from "./pages/StarWars";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Subscribe from "./pages/Subscribe";
import EmailCapturePopup from "./components/EmailCapturePopup";
import ComingSoon from "./pages/ComingSoon";
import { useState } from "react";


// COMING SOON MODE: Set to true to show countdown page, false to show full site
const COMING_SOON_MODE = true;

function Router() {
  const [showFullSite, setShowFullSite] = useState(() => {
    // Check if owner bypass parameter is present in URL or session
    const urlParams = new URLSearchParams(window.location.search);
    const hasPreviewParam = urlParams.get('preview') === 'admin';
    const hasSessionBypass = sessionStorage.getItem('nlf_preview') === 'true';
    
    // Store bypass in session if URL parameter is present
    if (hasPreviewParam) {
      sessionStorage.setItem('nlf_preview', 'true');
      return true;
    }
    
    return hasSessionBypass;
  });
  
  // Toggle function for admin button
  const toggleSiteView = () => {
    const newValue = !showFullSite;
    setShowFullSite(newValue);
    if (newValue) {
      sessionStorage.setItem('nlf_preview', 'true');
    } else {
      sessionStorage.removeItem('nlf_preview');
    }
  };
  
  // If coming soon mode is enabled AND user hasn't bypassed, show countdown page
  if (COMING_SOON_MODE && !showFullSite) {
    return (
      <>
        <ComingSoon />
        {/* Hidden admin toggle button - press Ctrl+Shift+A to reveal */}
        <button
          onClick={toggleSiteView}
          className="fixed bottom-4 right-4 bg-green-500/20 hover:bg-green-500/40 text-green-400 px-4 py-2 rounded-lg text-xs font-mono border border-green-500/30 transition-all opacity-0 hover:opacity-100 focus:opacity-100"
          title="Admin: View Full Site (Ctrl+Shift+A)"
        >
          👁️ Admin View
        </button>
      </>
    );
  }

  // Normal site routing
  return (
    <>
      {/* Admin toggle button when viewing full site */}
      {COMING_SOON_MODE && (
        <button
          onClick={toggleSiteView}
          className="fixed bottom-4 right-4 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 px-4 py-2 rounded-lg text-xs font-mono border border-purple-500/30 transition-all z-50"
          title="Admin: Return to Countdown View"
        >
          🔒 Back to Countdown
        </button>
      )}
      <Navigation />
      <div className="pt-20 min-h-screen flex flex-col">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/marvel"} component={Marvel} />
          <Route path={"/star-wars"} component={StarWars} />
          <Route path={"/about"} component={About} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/subscribe"} component={Subscribe} />
      <Route path={"/marvel/:productId/checklist"} component={MarvelChecklist} />
      <Route path={"/starwars/:productId/checklist"} component={StarWarsChecklist} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          {!COMING_SOON_MODE && <EmailCapturePopup />}
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
