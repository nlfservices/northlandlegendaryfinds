/**
 * US Shipping Map Component
 * Accurate SVG map with real state boundaries showing shipping zones from Midwest HQ
 * Zone 1 (Midwest) = Fastest + Cheapest
 * 
 * SVG paths sourced from Wikimedia Commons (public domain)
 * Design: NLF cosmic theme - green/purple/teal palette
 */

import { useState, useCallback, useRef } from "react";
import { STATE_PATHS } from "./statePaths";

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

// Approximate label positions for state abbreviations (manually adjusted for the Wikimedia SVG viewBox 0 0 959 593)
const stateLabels: Record<string, [number, number]> = {
  AL: [637, 430],
  AK: [120, 540],
  AZ: [200, 380],
  AR: [550, 380],
  CA: [80, 300],
  CO: [315, 280],
  CT: [860, 185],
  DE: [825, 255],
  FL: [730, 490],
  GA: [710, 410],
  HI: [305, 555],
  ID: [195, 165],
  IL: [585, 290],
  IN: [635, 280],
  IA: [520, 225],
  KS: [440, 310],
  KY: [680, 320],
  LA: [560, 460],
  ME: [890, 100],
  MD: [810, 260],
  MA: [870, 170],
  MI: [645, 200],
  MN: [495, 140],
  MS: [595, 420],
  MO: [545, 320],
  MT: [270, 100],
  NE: [415, 240],
  NV: [135, 270],
  NH: [870, 130],
  NJ: [835, 230],
  NM: [290, 395],
  NY: [800, 170],
  NC: [760, 350],
  ND: [415, 105],
  OH: [700, 260],
  OK: [445, 370],
  OR: [105, 130],
  PA: [780, 225],
  RI: [875, 185],
  SC: [740, 390],
  SD: [415, 175],
  TN: [660, 355],
  TX: [415, 460],
  UT: [215, 275],
  VT: [845, 130],
  VA: [770, 300],
  WA: [130, 60],
  WV: [740, 290],
  WI: [560, 160],
  WY: [290, 195],
  DC: [815, 265],
};

// Small states that need external labels with leader lines
const SMALL_STATES = ["DC", "RI", "DE", "CT", "NH", "VT", "NJ", "MA", "MD"];

interface TooltipData {
  state: string;
  abbr: string;
  zone: number;
  transit: string;
  rate: string;
  x: number;
  y: number;
}

export default function USShippingMap() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleStateHover = useCallback((abbr: string, event: React.MouseEvent) => {
    const info = shippingZones[abbr];
    if (info && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltip({
        state: stateNames[abbr] || abbr,
        abbr,
        zone: info.zone,
        transit: info.transit,
        rate: info.rate,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  }, []);

  const handleStateLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const zones = [
    { zone: 1, label: "Zone 1 — Midwest", color: "#00FF41", transit: "1–2 days", rate: "$5.99", desc: "Home base — fastest & cheapest" },
    { zone: 2, label: "Zone 2 — Near Midwest", color: "#00CC33", transit: "2–3 days", rate: "$7.99", desc: "Great Lakes, Plains, Upper South" },
    { zone: 3, label: "Zone 3 — Extended", color: "#0099AA", transit: "3–4 days", rate: "$9.99", desc: "South, Northeast, Mountain West" },
    { zone: 4, label: "Zone 4 — West Coast", color: "#7B2FBE", transit: "4–5 days", rate: "$11.99", desc: "Pacific Coast states" },
    { zone: 5, label: "Zone 5 — Non-Contiguous", color: "#5A1E8E", transit: "5–10 days", rate: "$14.99", desc: "Alaska & Hawaii (USPS)" },
  ];

  // NLF HQ location (Minnesota) - approximate center of MN in the SVG coordinate space
  const hqX = 490;
  const hqY = 140;

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative bg-card/50 rounded-2xl border border-border p-4 md:p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <svg
          ref={svgRef}
          viewBox="0 0 959 593"
          className="w-full h-auto"
          onMouseLeave={handleStateLeave}
        >
          {/* Subtle grid background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            {/* Glow filter for HQ marker */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="959" height="593" fill="url(#grid)" />

          {/* State paths with accurate boundaries */}
          {Object.entries(STATE_PATHS).map(([abbr, { d }]) => {
            const info = shippingZones[abbr];
            if (!info) return null;
            const isHighlighted = activeZone === null || activeZone === info.zone;
            const isHovered = tooltip?.abbr === abbr;
            
            return (
              <path
                key={abbr}
                d={d}
                fill={info.color}
                fillOpacity={isHovered ? 0.9 : isHighlighted ? 0.6 : 0.12}
                stroke={isHovered ? "white" : "rgba(255,255,255,0.25)"}
                strokeWidth={isHovered ? 2 : 0.8}
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => handleStateHover(abbr, e)}
                onMouseMove={(e) => handleStateHover(abbr, e)}
                onMouseLeave={handleStateLeave}
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 8px ${info.color}80)`
                    : isHighlighted
                    ? `drop-shadow(0 0 2px ${info.color}30)`
                    : "none",
                }}
              />
            );
          })}

          {/* State labels (skip small states) */}
          {Object.entries(stateLabels).map(([abbr, [x, y]]) => {
            const info = shippingZones[abbr];
            if (!info) return null;
            if (SMALL_STATES.includes(abbr)) return null;
            const isHighlighted = activeZone === null || activeZone === info.zone;
            
            return (
              <text
                key={`label-${abbr}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                fontFamily="system-ui, -apple-system, sans-serif"
                opacity={isHighlighted ? 0.85 : 0.15}
                className="pointer-events-none select-none transition-opacity duration-200"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6)" }}
              >
                {abbr}
              </text>
            );
          })}

          {/* NLF HQ Marker */}
          <circle cx={hqX} cy={hqY} r="8" fill="#FFD700" fillOpacity="0.3" filter="url(#glow)" className="pointer-events-none" />
          <circle cx={hqX} cy={hqY} r="5" fill="#FFD700" stroke="white" strokeWidth="1.5" className="pointer-events-none" />
          <text
            x={hqX}
            y={hqY - 14}
            textAnchor="middle"
            fill="#FFD700"
            fontSize="9"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
            className="pointer-events-none select-none"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
          >
            NLF HQ
          </text>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: `${Math.min(tooltip.x + 15, (svgRef.current?.getBoundingClientRect().width || 800) - 200)}px`,
              top: `${tooltip.y - 10}px`,
              transform: "translateY(-100%)",
            }}
          >
            <div className="bg-black/95 border border-primary/40 rounded-lg px-3 py-2 shadow-lg shadow-primary/10 min-w-[180px] backdrop-blur-sm">
              <p className="font-bold text-white text-sm">{tooltip.state}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: shippingZones[tooltip.abbr]?.color || "#00FF41" }}
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
