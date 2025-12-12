'use client'

import { ControlButton } from '@/app/_components/ControlButton'
import { CurrentIntervalDisplay } from '@/app/_components/CurrentIntervalDisplay'
import { IntervalSelector } from '@/app/_components/IntervalSelector'

interface TimerControlsProps {
  isRunning: boolean
  interval: number
  onStart: () => void
  onStop: () => void
  onIntervalChange: (interval: number) => void
  isAvailable: boolean
}

export function TimerControls({
  isRunning,
  interval,
  onStart,
  onStop,
  onIntervalChange,
  isAvailable,
}: TimerControlsProps) {
  return (
    <div className='space-y-6'>
      {/* Current Interval Display (shown when running) */}
      <CurrentIntervalDisplay isRunning={isRunning} interval={interval} />

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
          disabled={!isAvailable}
        />
      </div>
    </div>
  )
}
