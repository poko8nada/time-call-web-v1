'use client'

import { useCallback } from 'react'

interface VolumeControlProps {
  /**
   * Current volume value (0-100)
   */
  volume: number

  /**
   * Callback fired when volume changes (0-100)
   */
  onChange: (volume: number) => void

  /**
   * Label text for the volume control
   * e.g., "ビープ音量" or "読み上げ音量"
   */
  label: string

  /**
   * Optional: disable the control
   */
  disabled?: boolean
}

/**
 * VolumeControl
 *
 * Reusable volume adjustment slider component.
 * Internally converts 0-100 to 0.0-1.0 for audio API.
 *
 * FR-09: 音量調整スライダー
 * - Range: 0-100
 * - Real-time value display
 * - Label display
 * - Accessibility support
 *
 * Usage:
 * <VolumeControl
 *   volume={70}
 *   onChange={(v) => setBeepVolume(v)}
 *   label="ビープ音量"
 * />
 */
export function VolumeControl({
  volume,
  onChange,
  label,
  disabled = false,
}: VolumeControlProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value, 10)
      onChange(newValue)
    },
    [onChange],
  )

  return (
    <div className='flex flex-col gap-3 w-full max-w-xs'>
      {/* Label */}
      <label
        htmlFor={`volume-${label}`}
        className='text-sm font-semibold text-foreground dark:text-foreground'
      >
        {label}
      </label>

      {/* Slider */}
      <input
        id={`volume-${label}`}
        type='range'
        min='0'
        max='100'
        value={volume}
        onChange={handleChange}
        disabled={disabled}
        className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500 dark:accent-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volume}
      />

      {/* Value Display */}
      <div className='flex justify-between items-center'>
        <span className='text-xs text-gray-600 dark:text-gray-400'>
          {volume} / 100
        </span>
        <span className='text-xs text-gray-600 dark:text-gray-400'>
          {Math.round((volume / 100) * 100)}%
        </span>
      </div>
    </div>
  )
}
