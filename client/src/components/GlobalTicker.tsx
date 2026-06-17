import { useLaunchCountdown } from "@/hooks/useLaunchCountdown";

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

export default function GlobalTicker() {
  const doomsday = useLaunchCountdown(DOOMSDAY_DATE);
  const spiderman = useLaunchCountdown(SPIDERMAN_DATE);
  const { months: doomMonths, remainingDays: doomRemainingDays } = getMonthsAndDays(DOOMSDAY_DATE);

  const pad = (n: number, len = 2) => String(n).padStart(len, "0");

  return (
    <div className="bg-black border-b border-green-500/30 overflow-hidden" style={{ height: "32px" }}>
      <div className="flex items-center h-full">
        {/* Label badge */}
        <div className="flex-shrink-0 bg-green-500 text-black text-[10px] font-black tracking-widest uppercase px-3 h-full flex items-center z-10">
          LIVE
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex items-center whitespace-nowrap"
            style={{ animation: "nlf-global-ticker 50s linear infinite" }}
          >
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-flex items-center gap-5 pr-5 text-[11px]">
                <span className="text-green-400 font-bold tracking-wider">⚡ AVENGERS: DOOMSDAY</span>
                <span className="text-gray-500">|</span>
                <span className="text-white font-semibold">
                  {doomMonths}M {doomRemainingDays}D {pad(doomsday.hours)}H {pad(doomsday.minutes)}M {pad(doomsday.seconds)}S
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-yellow-400 font-semibold">★ RDJ AS DOCTOR DOOM</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">🎬 RUSSO BROTHERS DIRECTING</span>
                <span className="text-gray-500">|</span>
                <span className="text-blue-400 font-semibold">
                  🕷 SPIDER-MAN: BRAND NEW DAY — {pad(spiderman.days, 3)}D {pad(spiderman.hours)}H {pad(spiderman.minutes)}M AWAY
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">🃏 NUMBERED TOPPS MARVEL CARDS — LIMITED FOREVER</span>
                <span className="text-gray-500">|</span>
                <span className="text-green-400 font-semibold">NORTHLANDLEGENDARYFINDS.COM</span>
                <span className="text-gray-500 pr-8">|</span>
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
