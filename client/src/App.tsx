import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CardSets from "./pages/CardSets";
import ChromeSet from "./pages/ChromeSet";
import CBHSet from "./pages/CBHSet";
import MintSet from "./pages/MintSet";
import Characters from "./pages/Characters";
import CharacterPage from "./pages/CharacterPage";
import Shop from "./pages/Shop";
import About from "./pages/About";


function Router() {
  return (
    <>
      <Navigation />
      <div className="pt-20 min-h-screen flex flex-col">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/sets"} component={CardSets} />
          <Route path={"/sets/chrome"} component={ChromeSet} />
          <Route path={"/sets/comic-book-heroes"} component={CBHSet} />
          <Route path={"/sets/marvel-mint"} component={MintSet} />
          <Route path={"/characters"} component={Characters} />
          <Route path={"/character/:name"} component={CharacterPage} />
          <Route path={"/shop"} component={Shop} />
          <Route path={"/about"} component={About} />
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
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
