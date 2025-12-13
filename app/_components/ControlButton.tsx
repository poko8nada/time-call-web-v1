'use client'

import { useCallback } from 'react'
import { PauseIcon, PlayIcon } from './PlayIcon'

interface ControlButtonProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  disabled?: boolean
}

/**
 * ControlButton
 *
 * Start/Stop button for timer control.
 * Shows "開始" when stopped, "停止" when running.
 * Enhanced with SVG icons, gradients, and modern hover states.
 *
 * FR-05: 開始/停止ボタン
 * - Label changes based on isRunning state
 * - Green gradient when stopped (ready to start)
 * - Red gradient when running (ready to stop)
 * - Scale and shadow on hover
 * - Smooth transitions
 * - Accessibility: aria-pressed, aria-label
 */
export function ControlButton({
  isRunning,
  onStart,
  onStop,
  disabled = false,
}: ControlButtonProps) {
  const handleClick = useCallback(() => {
    if (isRunning) {
      onStop()
    } else {
      onStart()
    }
  }, [isRunning, onStart, onStop])

  const buttonLabel = isRunning ? '停止' : '開始'
  const ariaLabel = isRunning ? 'タイマーを停止' : 'タイマーを開始'

  const baseClasses =
    'btn-enhanced px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3'

  const disabledClasses =
    'bg-secondary-400 dark:bg-secondary-600 cursor-not-allowed opacity-60'

  const runningClasses =
    'bg-gradient-to-br from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 dark:from-error-600 dark:to-error-700 dark:hover:from-error-700 dark:hover:to-error-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-error-500 shadow-md hover:shadow-lg'

  const stoppedClasses =
    'bg-gradient-to-br from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 dark:from-success-600 dark:to-success-700 dark:hover:from-success-700 dark:hover:to-success-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-success-500 shadow-md hover:shadow-lg'

  const buttonClasses = `${baseClasses} ${
    disabled ? disabledClasses : isRunning ? runningClasses : stoppedClasses
  }`

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isRunning}
      aria-label={ariaLabel}
      className={buttonClasses}
    >
      <span className='w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center'>
        {isRunning ? (
          <PauseIcon className='w-full h-full' />
        ) : (
          <PlayIcon className='w-full h-full' />
        )}
      </span>
      {buttonLabel}
    </button>
  )
}
