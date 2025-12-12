'use client'

interface CurrentIntervalDisplayProps {
  /**
   * Timer running state
   */
  isRunning: boolean

  /**
   * Current interval in minutes
   */
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
 *
 * Usage:
 * <CurrentIntervalDisplay
 *   isRunning={isRunning}
 *   interval={interval}
 * />
 */
export function CurrentIntervalDisplay({
  isRunning,
  interval,
}: CurrentIntervalDisplayProps) {
  // Only render when timer is running
  if (!isRunning) {
    return null
  }

  return (
    <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800'>
      <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
        現在: <span className='font-bold text-lg'>{interval}</span>
        分間隔で実行中
      </p>
    </div>
  )
}
