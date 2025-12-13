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
      className={`mt-3 sm:mt-4 md:mt-6 px-2 sm:px-4 transition-opacity transition-height duration-300 overflow-hidden ${
        isRunning && nextCallTime ? 'opacity-100 h-auto' : 'opacity-0 h-0'
      }`}
    >
      <div className='bg-gradient-to-r from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-3 sm:p-4 border border-primary-200/30 dark:border-primary-700/30 shadow-subtle'>
        <p className='text-xs sm:text-sm md:text-base text-center text-secondary-600 dark:text-secondary-400'>
          次の読み上げ:{' '}
          <span className='font-bold text-primary-600 dark:text-primary-400 tracking-wider'>
            {timeString}
          </span>
        </p>
      </div>
    </div>
  )
}
