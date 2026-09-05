import { useEffect, useState } from "react";
import { fetchBreaksFeed, loadBreakRuns } from "./breakRunLoader";
import type { BreakRun } from "./nlfBreakRunContract";

/** Load the two-file Inventory feed (R2, then `/data/breaks/runs.json` + checklists). */
export function useBreaksFeed(): {
  runs: BreakRun[];
  updatedAt: string | null;
  loading: boolean;
} {
  const [runs, setRuns] = useState<BreakRun[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchBreaksFeed()
      .then((data) => {
        if (cancelled) return;
        setUpdatedAt(data.updated_at);
        setRuns(data.runs);
      })
      .catch(() => {
        if (cancelled) return;
        setRuns(loadBreakRuns());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    runs: runs ?? [],
    updatedAt,
    loading: runs === null,
  };
}
