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


// COMING SOON MODE: Set to true to show countdown page, false to show full site
const COMING_SOON_MODE = true;

function Router() {
  // If coming soon mode is enabled, show only the countdown page
  if (COMING_SOON_MODE) {
    return <ComingSoon />;
  }

  // Normal site routing
  return (
    <>
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
