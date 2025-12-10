'use client'

import { useEffect, useState } from 'react'
import { formatDigitalTime } from '@/utils/formatTime'
import { useClock } from '../_hooks/useClock'

/**
 * DigitalClock
 *
 * Displays current time in HH:MM:SS format using large, readable monospace font.
 *
 * FR-08: デジタル時計表示
 * - Uses formatDigitalTime for "HH:MM:SS" format
 * - Large, readable font (text-6xl to text-9xl depending on viewport)
 * - Center aligned
 * - Accessibility: aria-label
 * - Updates every second via useClock hook
 *
 * Note: Uses deferred state to avoid hydration mismatch
 */
export function DigitalClock() {
  const { currentTime } = useClock()
  const [isMounted, setIsMounted] = useState(false)

  // Defer rendering until after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // During hydration, render empty placeholder with same height
  if (!isMounted) {
    return (
      <div className='flex items-center justify-center w-full'>
        <time className='font-mono font-bold tracking-wider text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground dark:text-foreground invisible'>
          00:00:00
        </time>
      </div>
    )
  }

  const displayTime = formatDigitalTime(currentTime)

  return (
    <div className='flex items-center justify-center w-full'>
      <time
        dateTime={currentTime.toISOString()}
        className='font-mono font-bold tracking-wider text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground dark:text-foreground'
      >
        {displayTime}
      </time>
    </div>
  )
}
