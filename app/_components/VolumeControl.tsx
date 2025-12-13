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
          className='text-sm font-semibold text-[#e2e8f0] block'
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
          className='w-full h-2 bg-[#2d3748] rounded-lg shadow-neuro-pressed accent-cyan-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2d3748] transition-all duration-200'
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={masterVolume}
        />

        {/* Value Display */}
        <div className='flex justify-between items-center'>
          <span className='text-xs text-[#94a3b8]'>{masterVolume} / 100</span>
          <span className='text-xs text-[#94a3b8]'>
            {Math.round((masterVolume / 100) * 100)}%
          </span>
        </div>
      </div>

      {/* Optional Description */}
      {description && (
        <p className='mt-2 text-xs text-[#94a3b8]'>{description}</p>
      )}
    </div>
  )
}
