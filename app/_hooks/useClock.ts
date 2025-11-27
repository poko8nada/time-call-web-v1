"use client"

import { useEffect, useState } from 'react';

export type CurrentTime = {
  hours: number;
  minutes: number;
  seconds: number;
  timeString: string; // HH:MM:SS
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function getCurrentTime(date = new Date()): CurrentTime {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return {
    hours,
    minutes,
    seconds,
    timeString: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}

/**
 w* useCurrentTime
 * - returns the current time and updates every second
 * - small and strongly-typed to make testing easy
 */
export default function useCurrentTime(): CurrentTime {
  const [now, setNow] = useState<CurrentTime>(() => getCurrentTime());

  useEffect(() => {
    function tick() {
      setNow(getCurrentTime());
    }

    // simple fixed interval: tick every 1000ms
    const id = window.setInterval(tick, 1000) as unknown as number;

    return () => clearInterval(id as number);
  }, []);

  return now;
}
