'use client'

import { useCallback } from 'react'

interface VolumeControlProps {
  masterVolume: number
  onSetMasterVolume: (volume: number) => void
  label: string
  disabled?: boolean
  description?: string
}

/**
 * VolumeControl
 *
 * Reusable volume adjustment slider component.
 * Internally converts 0-100 to 0.0-1.0 for audio API.

 */
export function VolumeControl({
  masterVolume,
  onSetMasterVolume,
  label,
  disabled = false,
  description,
}: VolumeControlProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value, 10)
      onSetMasterVolume(newValue)
    },
    [onSetMasterVolume],
  )

  return (
    <div>
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
          value={masterVolume}
          onChange={handleChange}
          disabled={disabled}
          className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500 dark:accent-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={masterVolume}
        />

        {/* Value Display */}
        <div className='flex justify-between items-center'>
          <span className='text-xs text-gray-600 dark:text-gray-400'>
            {masterVolume} / 100
          </span>
          <span className='text-xs text-gray-600 dark:text-gray-400'>
            {Math.round((masterVolume / 100) * 100)}%
          </span>
        </div>
      </div>

      {/* Optional Description */}
      {description && (
        <p className='mt-2 text-xs text-gray-600 dark:text-gray-400'>
          {description}
        </p>
      )}
    </div>
  )
}
