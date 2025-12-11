'use client'

import { ControlButton } from '@/app/_components/ControlButton'
import { IntervalSelector } from '@/app/_components/IntervalSelector'

interface TimerControlsProps {
  isRunning: boolean
  interval: number
  onStart: () => void
  onStop: () => void
  onIntervalChange: (interval: number) => void
}

export function TimerControls({
  isRunning,
  interval,
  onStart,
  onStop,
  onIntervalChange,
}: TimerControlsProps) {
  return (
    <div className='space-y-6'>
      {/* Interval Selector */}
      <IntervalSelector
        interval={interval}
        onChange={onIntervalChange}
        disabled={isRunning}
      />

      {/* Control Button */}
      <div className='flex justify-center'>
        <ControlButton
          isRunning={isRunning}
          onStart={onStart}
          onStop={onStop}
        />
      </div>
    </div>
  )
}
