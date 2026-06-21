/**
 * RoadTripTimeline — Interactive visual timeline for Chasing Doom road trip
 * Shows stops along the journey with expandable details, dates, finds, and a connecting route line.
 * Designed to be updated as new stops are added.
 */

import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp, Package, Star, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TripStop {
  id: string;
  city: string;
  state: string;
  date: string;
  description: string;
  finds?: string[];
  highlight?: string;
  status: "completed" | "current" | "upcoming";
  imageUrl?: string;
}

// Initial trip data — will be expanded as the journey continues
const TRIP_STOPS: TripStop[] = [
  {
    id: "start",
    city: "Minneapolis",
    state: "MN",
    date: "June 21, 2026",
    description: "Where it all begins. Packed the car, loaded up the Doom figures on the dashboard, and hit the road with Landon. Laura's already rolling her eyes.",
    finds: ["Doctor Doom Legends figure (travel companion)", "Full binder of Doom cards for the road"],
    highlight: "Day 1 — The journey starts",
    status: "current",
  },
  {
    id: "stop-2",
    city: "???",
    state: "??",
    date: "TBD",
    description: "Next stop on the radar. Stay tuned.",
    status: "upcoming",
  },
];

function StopCard({ stop, isExpanded, onToggle }: { stop: TripStop; isExpanded: boolean; onToggle: () => void }) {
  const statusColors = {
    completed: "border-green-500/50 bg-green-500/5",
    current: "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20",
    upcoming: "border-border/30 bg-card/30 opacity-60",
  };

  const dotColors = {
    completed: "bg-green-500 shadow-green-500/50",
    current: "bg-amber-500 shadow-amber-500/50 animate-pulse",
    upcoming: "bg-gray-600",
  };

  return (
    <div className="relative pl-8 sm:pl-12">
      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 sm:left-2 top-6 w-4 h-4 rounded-full shadow-lg z-10",
          dotColors[stop.status]
        )}
      />

      {/* Card */}
      <div
        className={cn(
          "border rounded-xl p-4 sm:p-6 transition-all duration-300 cursor-pointer hover:border-green-500/30",
          statusColors[stop.status]
        )}
        onClick={onToggle}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {stop.status === "current" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs text-amber-400 font-bold">
                  <Navigation className="w-3 h-3" />
                  NOW
                </span>
              )}
              {stop.status === "completed" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-bold">
                  ✓ VISITED
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {stop.city}, {stop.state}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              <MapPin className="w-3 h-3 inline mr-1" />
              {stop.date}
            </p>
            {stop.highlight && (
              <p className="text-sm text-green-400 font-medium mt-1">{stop.highlight}</p>
            )}
          </div>

          <button className="text-gray-400 hover:text-white transition-colors p-1">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <p className="text-gray-300 leading-relaxed">{stop.description}</p>

            {stop.finds && stop.finds.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Finds
                </h4>
                <ul className="space-y-1.5">
                  {stop.finds.map((find, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Star className="w-3 h-3 text-amber-400 mt-1 shrink-0" />
                      <span>{find}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stop.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border/30">
                <img
                  src={stop.imageUrl}
                  alt={`${stop.city}, ${stop.state} — Chasing Doom stop`}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoadTripTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(TRIP_STOPS[0]?.id || null);

  const completedCount = TRIP_STOPS.filter((s) => s.status === "completed").length;
  const totalStops = TRIP_STOPS.filter((s) => s.status !== "upcoming" || s.city !== "???").length;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Visited ({completedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-gray-400">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <span className="text-sm text-gray-400">Upcoming</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{TRIP_STOPS.length} stops planned</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[7px] sm:left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-500/50 via-amber-500/50 to-gray-700/30" />

        {/* Stops */}
        <div className="space-y-4">
          {TRIP_STOPS.map((stop) => (
            <StopCard
              key={stop.id}
              stop={stop}
              isExpanded={expandedId === stop.id}
              onToggle={() => setExpandedId(expandedId === stop.id ? null : stop.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer teaser */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm italic">
          More stops being added as we drive. Check back for updates.
        </p>
      </div>
    </div>
  );
}
