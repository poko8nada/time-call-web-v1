'use client'

import { ControlButton } from '@/app/_components/ControlButton'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  isAvailable: boolean
}

/**
 * TimerControls
 *
 * Simplified component that returns only the START/STOP button
 * for integration inside the main timer area.
 * Interval and Voice selectors moved to QuickSettings bar.
 */
export function TimerControls({
  isRunning,
  onStart,
  onStop,
  isAvailable,
}: TimerControlsProps) {
  return (
    <div className='flex justify-center w-full min-h-14 items-center'>
      <ControlButton
        isRunning={isRunning}
        onStart={onStart}
        onStop={onStop}
        disabled={!isAvailable}
      />
    </div>
  )
}
