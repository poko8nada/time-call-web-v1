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
        <time
          className='font-mono font-bold tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#e2e8f0] invisible'
          aria-hidden='true'
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
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
        className='font-mono font-bold tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#e2e8f0]'
        role='status'
        aria-label={`現在時刻: ${displayTime}`}
        style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        {displayTime}
      </time>
    </div>
  )
}
