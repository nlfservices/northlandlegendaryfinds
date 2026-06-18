import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";
import { Link } from "wouter";

const DOOMSDAY_DATE = "2026-12-18T00:00:00Z";
const SPIDERMAN_DATE = "2026-07-31T00:00:00Z";

function getMonthsAndDays(targetDateUtc: string) {
  const now = new Date();
  const target = new Date(targetDateUtc);
  if (target <= now) return { months: 0, remainingDays: 0 };
  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  if (now.getDate() > target.getDate()) months -= 1;
  const afterMonths = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
  const remainingDays = Math.floor(
    (target.getTime() - afterMonths.getTime()) / (1000 * 60 * 60 * 24)
  );
  return { months: Math.max(0, months), remainingDays: Math.max(0, remainingDays) };
}

interface TickerItem {
  text: string;
  href: string;
  color: string;
  bold?: boolean;
  icon?: string;
}

export default function GlobalTicker() {
  const doomsday = useLaunchCountdown(DOOMSDAY_DATE);
  const spiderman = useLaunchCountdown(SPIDERMAN_DATE);
  const { months: doomMonths, remainingDays: doomRemainingDays } = getMonthsAndDays(DOOMSDAY_DATE);

  const pad = (n: number, len = 2) => String(n).padStart(len, "0");

  const tickerItems: TickerItem[] = [
    {
      text: "AVENGERS: DOOMSDAY",
      href: "/doomsday",
      color: "text-green-400",
      bold: true,
      icon: "⚡",
    },
    {
      text: `${doomMonths}M ${doomRemainingDays}D ${pad(doomsday.hours)}H ${pad(doomsday.minutes)}M ${pad(doomsday.seconds)}S`,
      href: "/doomsday",
      color: "text-white",
      bold: true,
    },
    {
      text: "RDJ AS DOCTOR DOOM",
      href: "/doomsday",
      color: "text-yellow-400",
      bold: true,
      icon: "★",
    },
    {
      text: "RUSSO BROTHERS DIRECTING",
      href: "/doomsday",
      color: "text-gray-300",
      icon: "🎬",
    },
    {
      text: `SPIDER-MAN: BRAND NEW DAY — ${pad(spiderman.days, 3)}D ${pad(spiderman.hours)}H ${pad(spiderman.minutes)}M AWAY`,
      href: "/mcu-news/spiderman-brand-new-day-trailer-record-breaking-card-market",
      color: "text-blue-400",
      bold: true,
      icon: "🕷",
    },
    {
      text: "NUMBERED TOPPS MARVEL CARDS — LIMITED FOREVER",
      href: "/mcu-news",
      color: "text-gray-300",
      icon: "🃏",
    },
    {
      text: "NORTHLANDLEGENDARYFINDS.COM",
      href: "/",
      color: "text-green-400",
      bold: true,
    },
  ];

  return (
    <div className="bg-black border-b border-green-500/30 overflow-hidden" style={{ height: "38px" }}>
      <div className="flex items-center h-full">
        {/* Label badge */}
        <div className="flex-shrink-0 bg-green-500 text-black text-xs font-black tracking-widest uppercase px-4 h-full flex items-center z-10">
          LIVE
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex items-center whitespace-nowrap"
            style={{ animation: "nlf-global-ticker 50s linear infinite" }}
          >
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-flex items-center gap-6 pr-6 text-sm">
                {tickerItems.map((item, i) => (
                  <span key={`${copy}-${i}`} className="inline-flex items-center">
                    <Link
                      href={item.href}
                      className={`${item.color} ${item.bold ? "font-bold" : "font-medium"} tracking-wide hover:underline hover:brightness-125 transition-all cursor-pointer`}
                    >
                      {item.icon ? `${item.icon} ` : ""}{item.text}
                    </Link>
                    {i < tickerItems.length - 1 && (
                      <span className="text-gray-600 ml-6">|</span>
                    )}
                  </span>
                ))}
                <span className="text-gray-600 ml-6">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes nlf-global-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
