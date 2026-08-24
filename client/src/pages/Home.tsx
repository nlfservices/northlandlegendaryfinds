import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import HomeHero from "./HomeHero";
import HomeStory from "./HomeStory";
import HomeExplore from "./HomeExplore";
import HomeRest from "./HomeRest";

export default function Home() {
  let { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // After OAuth login, check if we need to redirect back to a pending page (e.g. /matrix)
  useEffect(() => {
    if (!loading && user) {
      const pendingRedirect = localStorage.getItem("nlf_post_login_redirect");
      if (pendingRedirect) {
        localStorage.removeItem("nlf_post_login_redirect");
        setLocation(pendingRedirect);
      }
    }
  }, [user, loading, setLocation]);

  return (
    <div className="min-h-screen">
      <HomeHero />
      <HomeStory />
      <HomeExplore />
      <HomeRest />
    </div>
  );
}
