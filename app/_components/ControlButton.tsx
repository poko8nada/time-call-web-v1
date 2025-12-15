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

  const buttonLabel = isRunning ? 'Stop' : 'Start'
  const ariaLabel = isRunning ? 'Stop timer' : 'Start timer'

  const baseClasses =
    'px-12 py-4 rounded-full font-semibold text-white text-lg flex items-center justify-center gap-3 transition-all duration-200'

  const disabledClasses =
    'bg-[#64748b] cursor-not-allowed opacity-50 shadow-neuro-flat'

  const runningClasses =
    'bg-gradient-to-br from-[#f43f5e] to-[#dc2626] shadow-neuro-raised hover:shadow-neuro-hover active:shadow-neuro-pressed hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2d3748]'

  const stoppedClasses =
    'bg-gradient-to-br from-[#06b6d4] to-[#a855f7] shadow-neuro-raised hover:shadow-neuro-hover active:shadow-neuro-pressed hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2d3748]'

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
