'use client'

import { formatDigitalTime } from '@/utils/formatTime'

interface NextCallTimeDisplayProps {
  /**
   * Next scheduled call time
   */
  nextCallTime: Date | null

  /**
   * Timer running state
   */
  isRunning: boolean
}

/**
 * NextCallTimeDisplay
 *
 * Display the next scheduled time call.
 * Shows "次の読み上げ: HH:MM:SS" format when timer is running.
 *
 * FR-16: 次の読み上げ時刻表示
 * - Display next call time in "HH:MM:SS" format
 * - Only visible when timer is running
 * - Positioned below DigitalClock
 *
 * Usage:
 * <NextCallTimeDisplay
 *   nextCallTime={nextCallTime}
 *   isRunning={isRunning}
 * />
 */
export function NextCallTimeDisplay({
  nextCallTime,
  isRunning,
}: NextCallTimeDisplayProps) {
  // Only render when timer is running and nextCallTime is set
  if (!isRunning || !nextCallTime) {
    return null
  }

  const timeString = formatDigitalTime(nextCallTime)

  return (
    <div className='mt-4 text-center'>
      <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
        次の読み上げ:{' '}
        <span className='font-semibold text-foreground dark:text-foreground'>
          {timeString}
        </span>
      </p>
    </div>
  )
}
