'use client'

import { useEffect, useState } from 'react'
import { formatDigitalTime } from '@/utils/formatTime'

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
export function DigitalClock({ currentTime }: { currentTime: Date }) {
  const [isMounted, setIsMounted] = useState(false)

  // Defer rendering until after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // During hydration, render empty placeholder with same height
  if (!isMounted) {
    return (
      <div className='flex items-center justify-center w-full'>
        <time className='font-mono font-bold tracking-wider text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground dark:text-foreground invisible' aria-hidden='true' style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
          00:00:00
        </time>
      </div>
    )
  }

  const displayTime = formatDigitalTime(currentTime)

  return (
    <div className='flex items-center justify-center w-full px-4'>
      <time
        dateTime={currentTime.toISOString()}
        className='font-mono font-bold tracking-wider text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground dark:text-foreground drop-shadow-lg'
        role='status'
        aria-label={`現在時刻: ${displayTime}`}
        style={{
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(79, 70, 229, 0.1)',
          letterSpacing: '0.05em',
        }}
      >
        {displayTime}
      </time>
    </div>
  )
}
