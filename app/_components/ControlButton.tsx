'use client'

import { useCallback } from 'react'

interface ControlButtonProps {
  /**
   * Current timer running state
   */
  isRunning: boolean

  /**
   * Callback fired when start button is clicked
   */
  onStart: () => void

  /**
   * Callback fired when stop button is clicked
   */
  onStop: () => void
}

/**
 * ControlButton
 *
 * Start/Stop button for timer control.
 * Shows "開始" when stopped, "停止" when running.
 * Visual feedback with color changes based on state.
 *
 * FR-05: 開始/停止ボタン
 * - Label changes based on isRunning state
 * - Green when stopped (ready to start)
 * - Red when running (ready to stop)
 * - Visual feedback with color and icon
 * - Accessibility: aria-pressed, aria-label
 *
 * Usage:
 * <ControlButton
 *   isRunning={isRunning}
 *   onStart={() => startTimer()}
 *   onStop={() => stopTimer()}
 * />
 */
export function ControlButton({
  isRunning,
  onStart,
  onStop,
}: ControlButtonProps) {
  const handleClick = useCallback(() => {
    if (isRunning) {
      onStop()
    } else {
      onStart()
    }
  }, [isRunning, onStart, onStop])

  const buttonLabel = isRunning ? '停止' : '開始'
  const buttonIcon = isRunning ? '⏹️' : '▶️'
  const ariaLabel = isRunning ? 'タイマーを停止' : 'タイマーを開始'

  return (
    <button
      type='button'
      onClick={handleClick}
      aria-pressed={isRunning}
      aria-label={ariaLabel}
      className={`px-6 py-3 rounded-lg font-semibold text-white text-lg transition-colors focus:outline-2 focus:outline-offset-2 ${
        isRunning
          ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-red-500'
          : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-green-500'
      }`}
    >
      <span className='mr-2'>{buttonIcon}</span>
      {buttonLabel}
    </button>
  )
}
