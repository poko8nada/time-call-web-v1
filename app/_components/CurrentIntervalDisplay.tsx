'use client'

interface CurrentIntervalDisplayProps {
  isRunning: boolean
  interval: number
}

/**
 * CurrentIntervalDisplay
 *
 * Display the current interval when timer is running.
 * Shows "現在: ○分間隔" when timer is active.
 *
 * FR-15: タイマー実行中の現在間隔表示
 * - Display current interval in "○分間隔" format
 * - Only visible when timer is running
 * - Positioned above IntervalSelector
 * - Always visible even when IntervalSelector is disabled
 */
export function CurrentIntervalDisplay({
  isRunning,
  interval,
}: CurrentIntervalDisplayProps) {
  return (
    <div
      className={`mb-4 p-3 bg-primary-50 dark:bg-primary-950 rounded-md border border-primary-200 dark:border-primary-800 transition-soft ${
        isRunning
          ? 'opacity-100 visible h-auto duration-300'
          : 'opacity-0 invisible h-0 duration-300'
      }`}
    >
      <p className='text-sm font-medium text-primary-900 dark:text-primary-100'>
        現在: <span className='font-bold text-lg'>{interval}</span>
        分間隔で実行中
      </p>
    </div>
  )
}
