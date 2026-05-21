import { trpc } from "@/lib/trpc";
import { AlertTriangle, ShieldAlert, CheckCircle, ExternalLink, X } from "lucide-react";
import { useState } from "react";

/**
 * Persistent Token Expiration Alert Banner
 * Shows at the top of the admin dashboard when the Facebook/Instagram
 * API token is about to expire or has already expired.
 * 
 * - Red banner: Token expired or expires within 3 days
 * - Orange/amber banner: Token expires within 14 days
 * - Green subtle indicator: Token is healthy (can be dismissed)
 * 
 * The red/orange alerts CANNOT be dismissed — they persist until the token is renewed.
 */
export default function TokenExpirationAlert() {
  const { data: tokenHealth, isLoading } = trpc.socialPosts.tokenHealth.useQuery(undefined, {
    refetchInterval: 60 * 60 * 1000, // Re-check every hour
    staleTime: 30 * 60 * 1000, // Consider fresh for 30 minutes
  });
  const [healthyDismissed, setHealthyDismissed] = useState(false);

  if (isLoading || !tokenHealth) return null;

  // Token not configured at all
  if (!tokenHealth.valid && tokenHealth.error === "No token configured") {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-400">Facebook/Instagram Token Not Configured</p>
          <p className="text-xs text-yellow-400/80 mt-0.5">
            Add FB_PAGE_ACCESS_TOKEN in Settings → Secrets to enable social media posting.
          </p>
        </div>
      </div>
    );
  }

  // Token is invalid/expired
  if (!tokenHealth.valid) {
    return (
      <div className="bg-red-500/15 border-2 border-red-500/60 rounded-lg px-4 py-3 flex items-start gap-3 animate-pulse">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-400">
            ⚠️ FACEBOOK/INSTAGRAM TOKEN EXPIRED
          </p>
          <p className="text-xs text-red-400/80 mt-0.5">
            Your social media posting token has expired or is invalid. Posts cannot be published until you renew it.
            {tokenHealth.error && <span className="block mt-1 text-red-400/60">Error: {tokenHealth.error}</span>}
          </p>
          <a
            href="https://developers.facebook.com/tools/explorer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Renew Token in Graph API Explorer
          </a>
        </div>
      </div>
    );
  }

  // Token expires within 3 days — CRITICAL
  if (tokenHealth.daysRemaining !== null && tokenHealth.daysRemaining <= 3) {
    return (
      <div className="bg-red-500/15 border-2 border-red-500/60 rounded-lg px-4 py-3 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-400">
            ⚠️ TOKEN EXPIRES IN {tokenHealth.daysRemaining} DAY{tokenHealth.daysRemaining !== 1 ? "S" : ""}
          </p>
          <p className="text-xs text-red-400/80 mt-0.5">
            Your Facebook/Instagram API token expires very soon. Renew it immediately to avoid losing social media posting ability.
          </p>
          <a
            href="https://developers.facebook.com/tools/explorer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Renew Token Now
          </a>
        </div>
      </div>
    );
  }

  // Token expires within 14 days — WARNING
  if (tokenHealth.daysRemaining !== null && tokenHealth.daysRemaining <= 14) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-400">
            Token Expires in {tokenHealth.daysRemaining} Days
          </p>
          <p className="text-xs text-amber-400/80 mt-0.5">
            Your Facebook/Instagram API token will expire on{" "}
            {tokenHealth.expiresAt
              ? new Date(tokenHealth.expiresAt * 1000).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "soon"}
            . Renew it before it expires to maintain uninterrupted social media posting.
          </p>
          <a
            href="https://developers.facebook.com/tools/explorer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Renew Token
          </a>
        </div>
      </div>
    );
  }

  // Token is healthy — show subtle green indicator (dismissible)
  if (healthyDismissed) return null;

  return (
    <div className="bg-green-500/5 border border-green-500/20 rounded-lg px-4 py-2 flex items-center gap-3">
      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
      <div className="flex-1">
        <span className="text-xs text-green-400">
          Social media token healthy
          {tokenHealth.daysRemaining !== null && tokenHealth.daysRemaining < 9999 && (
            <span className="text-green-400/60 ml-1">
              — expires in {tokenHealth.daysRemaining} days
            </span>
          )}
          {tokenHealth.daysRemaining === 9999 && (
            <span className="text-green-400/60 ml-1">— never expires</span>
          )}
        </span>
      </div>
      <button
        onClick={() => setHealthyDismissed(true)}
        className="text-green-400/50 hover:text-green-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
