'use client'

import { formatDigitalTime } from '@/utils/formatTime'

interface NextCallTimeDisplayProps {
  nextCallTime: Date | null
  isRunning: boolean
}

/**
 * NextCallTimeDisplay
 *
 * Display the next scheduled time call with enhanced visual design.
 * Shows "次の読み上げ: HH:MM:SS" format when timer is running.
 *
 * FR-16: 次の読み上げ時刻表示
 * - Display next call time in "HH:MM:SS" format
 * - Only visible when timer is running
 * - Positioned below DigitalClock
 * - Subtle gradient background and animations
 */
export function NextCallTimeDisplay({
  nextCallTime,
  isRunning,
}: NextCallTimeDisplayProps) {
  const timeString = nextCallTime
    ? formatDigitalTime(nextCallTime)
    : '-- : -- : --'

  return (
    <div
      className={`min-h-[4rem] sm:min-h-[4.5rem] flex items-center justify-center px-2 sm:px-4 transition-opacity duration-300 ${
        isRunning && nextCallTime ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className='bg-neuro-base rounded-2xl px-6 py-3 shadow-neuro-pressed w-full'>
        <p className='text-xs sm:text-sm md:text-base text-center text-text-muted'>
          次の読み上げ:{' '}
          <span className='font-bold text-[#06b6d4] tracking-wider'>
            {timeString}
          </span>
        </p>
      </div>
    </div>
  )
}
