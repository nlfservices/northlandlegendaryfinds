import { useState, useEffect, useCallback } from "react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
  launchDate: Date;
}

/**
 * Hook that counts down to a launch date.
 * Returns { days, hours, minutes, seconds, isLaunched, launchDate }.
 * Once the launch date passes, isLaunched becomes true.
 */
export function useLaunchCountdown(launchDateUtc: string): CountdownState {
  const launchDate = new Date(launchDateUtc);

  const calculate = useCallback(() => {
    const now = Date.now();
    const diff = launchDate.getTime() - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: true, launchDate };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isLaunched: false,
      launchDate,
    };
  }, [launchDateUtc]);

  const [state, setState] = useState<CountdownState>(calculate);

  useEffect(() => {
    setState(calculate());
    const timer = setInterval(() => setState(calculate()), 1000);
    return () => clearInterval(timer);
  }, [calculate]);

  return state;
}
