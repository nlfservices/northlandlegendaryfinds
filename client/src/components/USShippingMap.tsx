/**
 * US Shipping Map Component
 * Color-coded SVG map showing shipping zones from Midwest HQ
 * Zone 1 (Midwest) = Fastest + Cheapest
 * 
 * Design: NLF cosmic theme - green/purple/teal palette
 */

import { useState } from "react";

// State abbreviation to full name mapping
const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington DC"
};

// Shipping zones from Midwest HQ
export const shippingZones: Record<string, { zone: number; color: string; transit: string; rate: string }> = {
  // Zone 1 - Midwest (Home Base) - 1-2 business days
  MN: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  WI: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  IA: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  IL: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  IN: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  MI: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  OH: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  ND: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  SD: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  NE: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  KS: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },
  MO: { zone: 1, color: "#00FF41", transit: "1–2 business days", rate: "$5.99" },

  // Zone 2 - Near Midwest (Great Lakes, Plains, Upper South) - 2-3 business days
  MT: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  WY: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  CO: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  OK: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  AR: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  KY: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  TN: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  WV: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  PA: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },
  NY: { zone: 2, color: "#00CC33", transit: "2–3 business days", rate: "$7.99" },

  // Zone 3 - Extended (South, Northeast, Mountain West) - 3-4 business days
  TX: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  LA: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  MS: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  AL: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  GA: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  SC: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  NC: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  VA: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  DC: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  MD: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  DE: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  NJ: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  CT: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  RI: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  MA: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  VT: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  NH: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  ME: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  NM: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  ID: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  UT: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },
  FL: { zone: 3, color: "#0099AA", transit: "3–4 business days", rate: "$9.99" },

  // Zone 4 - West Coast & Far Reaches - 4-5 business days
  AZ: { zone: 4, color: "#7B2FBE", transit: "4–5 business days", rate: "$11.99" },
  NV: { zone: 4, color: "#7B2FBE", transit: "4–5 business days", rate: "$11.99" },
  CA: { zone: 4, color: "#7B2FBE", transit: "4–5 business days", rate: "$11.99" },
  OR: { zone: 4, color: "#7B2FBE", transit: "4–5 business days", rate: "$11.99" },
  WA: { zone: 4, color: "#7B2FBE", transit: "4–5 business days", rate: "$11.99" },

  // Zone 5 - Non-contiguous - 5-10 business days (USPS)
  AK: { zone: 5, color: "#5A1E8E", transit: "5–10 business days", rate: "$14.99" },
  HI: { zone: 5, color: "#5A1E8E", transit: "5–10 business days", rate: "$14.99" },
};

// SVG paths for each US state (simplified)
const statePaths: Record<string, string> = {
  AL: "M628,466 L628,530 L618,545 L625,555 L616,555 L608,530 L608,466",
  AK: "M161,485 L183,485 L183,510 L194,510 L194,530 L161,530 L140,530 L130,520 L130,505 L140,495 L130,485 L140,480 L155,485",
  AZ: "M205,430 L270,430 L280,520 L205,520 L195,490",
  AR: "M540,460 L600,460 L600,510 L540,510",
  CA: "M120,280 L165,280 L180,340 L195,430 L195,490 L155,490 L130,440 L110,380 L110,320",
  CO: "M280,330 L370,330 L370,400 L280,400",
  CT: "M830,230 L855,220 L860,240 L840,250 L830,240",
  DE: "M790,320 L800,310 L805,330 L795,340",
  FL: "M640,530 L700,520 L740,530 L740,570 L720,600 L690,610 L670,590 L640,570 L630,555",
  GA: "M650,460 L700,460 L710,520 L650,530 L630,530",
  HI: "M260,560 L290,555 L300,565 L280,575 L260,570",
  ID: "M195,190 L235,180 L250,260 L230,300 L195,300",
  IL: "M560,290 L590,290 L600,310 L600,400 L580,420 L560,420 L550,380 L550,310",
  IN: "M600,290 L640,290 L640,400 L600,400",
  IA: "M480,270 L560,270 L560,330 L480,330",
  KS: "M380,370 L480,370 L480,420 L380,420",
  KY: "M600,390 L700,370 L710,400 L640,420 L600,420",
  LA: "M540,520 L590,510 L600,530 L590,560 L560,570 L540,550",
  ME: "M860,120 L880,110 L890,150 L870,190 L850,180 L855,150",
  MD: "M740,310 L790,300 L800,310 L790,330 L760,340 L740,330",
  MA: "M840,210 L870,200 L880,210 L855,220 L840,215",
  MI: "M580,180 L620,170 L640,200 L650,260 L620,280 L590,270 L580,230",
  MN: "M440,130 L530,130 L530,240 L480,260 L440,260",
  MS: "M580,460 L610,460 L610,545 L580,545 L570,510",
  MO: "M480,370 L560,370 L570,420 L560,460 L480,460",
  MT: "M220,130 L340,130 L340,200 L220,200",
  NE: "M350,290 L470,290 L480,330 L480,360 L350,360",
  NV: "M165,280 L210,280 L220,390 L195,430 L180,390 L165,340",
  NH: "M850,150 L860,140 L865,190 L850,200 L845,170",
  NJ: "M800,260 L810,250 L815,290 L800,310 L790,300",
  NM: "M270,430 L350,430 L350,520 L270,520",
  NY: "M730,180 L810,170 L830,210 L810,250 L780,260 L740,260 L730,230",
  NC: "M660,400 L770,380 L790,400 L770,420 L660,440",
  ND: "M350,130 L440,130 L440,200 L350,200",
  OH: "M640,280 L700,270 L710,340 L700,370 L640,380",
  OK: "M370,420 L480,420 L490,460 L540,460 L540,480 L400,480 L370,460",
  OR: "M110,180 L195,180 L195,260 L120,260",
  PA: "M700,250 L790,240 L800,260 L790,300 L740,310 L700,300",
  RI: "M855,225 L865,220 L865,235 L855,238",
  SC: "M680,440 L730,420 L740,450 L710,470 L680,460",
  SD: "M350,200 L440,200 L440,270 L350,270",
  TN: "M580,420 L700,400 L710,420 L700,440 L580,460",
  TX: "M330,460 L400,480 L540,480 L540,520 L530,570 L490,600 L440,610 L390,580 L350,540 L330,500",
  UT: "M220,280 L280,280 L280,390 L220,390",
  VT: "M830,140 L845,135 L850,180 L835,190 L830,165",
  VA: "M690,350 L780,330 L790,360 L770,380 L690,400",
  WA: "M120,110 L200,110 L200,180 L120,180",
  WV: "M700,320 L740,310 L750,350 L730,370 L710,360 L700,340",
  WI: "M500,150 L570,150 L580,180 L570,260 L530,260 L500,240",
  WY: "M250,200 L340,200 L340,280 L250,280",
  DC: "M770,335 L775,330 L780,335 L775,340",
};

// State label positions (approximate center of each state)
const stateLabels: Record<string, string> = {
  AL: "618,500", AK: "160,510", AZ: "237,475", AR: "570,485", CA: "145,380",
  CO: "325,365", CT: "845,235", DE: "797,325", FL: "685,565", GA: "670,490",
  HI: "275,565", ID: "215,240", IL: "575,355", IN: "620,345", IA: "520,300",
  KS: "430,395", KY: "655,395", LA: "565,535", ME: "870,150", MD: "770,320",
  MA: "860,210", MI: "615,225", MN: "485,195", MS: "595,500", MO: "520,415",
  MT: "280,165", NE: "415,325", NV: "185,340", NH: "855,170", NJ: "805,275",
  NM: "310,475", NY: "770,215", NC: "720,410", ND: "395,165", OH: "670,325",
  OK: "450,450", OR: "155,220", PA: "745,275", RI: "860,230", SC: "710,445",
  SD: "395,235", TN: "640,430", TX: "440,540", UT: "250,335", VT: "840,160",
  VA: "735,365", WA: "160,145", WV: "720,340", WI: "540,205", WY: "295,240",
  DC: "775,337",
};

interface TooltipData {
  state: string;
  zone: number;
  transit: string;
  rate: string;
  x: number;
  y: number;
}

export default function USShippingMap() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [activeZone, setActiveZone] = useState<number | null>(null);

  const handleStateHover = (abbr: string, event: React.MouseEvent) => {
    const info = shippingZones[abbr];
    if (info) {
      const rect = (event.currentTarget as SVGElement).closest("svg")?.getBoundingClientRect();
      if (rect) {
        setTooltip({
          state: stateNames[abbr] || abbr,
          zone: info.zone,
          transit: info.transit,
          rate: info.rate,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    }
  };

  const zones = [
    { zone: 1, label: "Zone 1 — Midwest", color: "#00FF41", transit: "1–2 days", rate: "$5.99", desc: "Home base — fastest & cheapest" },
    { zone: 2, label: "Zone 2 — Near Midwest", color: "#00CC33", transit: "2–3 days", rate: "$7.99", desc: "Great Lakes, Plains, Upper South" },
    { zone: 3, label: "Zone 3 — Extended", color: "#0099AA", transit: "3–4 days", rate: "$9.99", desc: "South, Northeast, Mountain West" },
    { zone: 4, label: "Zone 4 — West Coast", color: "#7B2FBE", transit: "4–5 days", rate: "$11.99", desc: "Pacific Coast states" },
    { zone: 5, label: "Zone 5 — Non-Contiguous", color: "#5A1E8E", transit: "5–10 days", rate: "$14.99", desc: "Alaska & Hawaii (USPS)" },
  ];

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative bg-card/50 rounded-2xl border border-border p-4 md:p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <svg
          viewBox="100 100 810 530"
          className="w-full h-auto"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Background */}
          <rect x="100" y="100" width="810" height="530" fill="transparent" />
          
          {/* State paths */}
          {Object.entries(statePaths).map(([abbr, path]) => {
            const info = shippingZones[abbr];
            if (!info) return null;
            const isHighlighted = activeZone === null || activeZone === info.zone;
            return (
              <path
                key={abbr}
                d={path}
                fill={info.color}
                fillOpacity={isHighlighted ? 0.7 : 0.15}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => handleStateHover(abbr, e)}
                onMouseMove={(e) => handleStateHover(abbr, e)}
                onMouseLeave={() => setTooltip(null)}
                style={{
                  filter: isHighlighted ? `drop-shadow(0 0 4px ${info.color}40)` : "none",
                }}
              />
            );
          })}

          {/* State labels */}
          {Object.entries(stateLabels).map(([abbr, coords]) => {
            const [x, y] = coords.split(",").map(Number);
            const info = shippingZones[abbr];
            if (!info) return null;
            const isHighlighted = activeZone === null || activeZone === info.zone;
            // Skip labels for very small states
            if (["DC", "RI", "DE", "CT", "NH", "VT", "NJ", "MA", "MD"].includes(abbr)) return null;
            return (
              <text
                key={`label-${abbr}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="11"
                fontWeight="bold"
                opacity={isHighlighted ? 0.9 : 0.2}
                className="pointer-events-none select-none"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >
                {abbr}
              </text>
            );
          })}

          {/* NLF HQ Marker */}
          <circle cx="485" cy="195" r="6" fill="#FFD700" stroke="white" strokeWidth="2" />
          <text x="485" y="180" textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="bold" className="pointer-events-none">
            NLF HQ
          </text>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: `${tooltip.x + 15}px`,
              top: `${tooltip.y - 10}px`,
              transform: "translateY(-100%)",
            }}
          >
            <div className="bg-black/95 border border-primary/40 rounded-lg px-3 py-2 shadow-lg shadow-primary/10 min-w-[180px]">
              <p className="font-bold text-white text-sm">{tooltip.state}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: shippingZones[Object.keys(stateNames).find(k => stateNames[k] === tooltip.state) || ""]?.color || "#00FF41" }}
                />
                <span className="text-xs text-muted-foreground">Zone {tooltip.zone}</span>
              </div>
              <p className="text-xs text-primary mt-1">{tooltip.transit}</p>
              <p className="text-xs text-white font-semibold">{tooltip.rate} flat rate</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {zones.map((z) => (
          <button
            key={z.zone}
            onClick={() => setActiveZone(activeZone === z.zone ? null : z.zone)}
            onMouseEnter={() => setActiveZone(z.zone)}
            onMouseLeave={() => setActiveZone(null)}
            className={`relative rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
              activeZone === z.zone
                ? "border-primary/60 bg-card scale-[1.02]"
                : "border-border bg-card/50 hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: z.color }}
              />
              <span className="font-bold text-xs text-white">Zone {z.zone}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-tight">{z.desc}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-primary font-semibold">{z.transit}</span>
              <span className="text-xs font-bold text-white">{z.rate}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
