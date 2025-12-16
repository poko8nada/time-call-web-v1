'use client'

import { useCallback } from 'react'

interface IntervalSelectorProps {
  interval: number
  onChange: (minutes: number) => void
  disabled?: boolean
  compact?: boolean
}

const INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60]

/**
 * IntervalSelector
 *
 * Radio button group for selecting time call interval.
 * Allows user to choose between 1, 5, 10, 15, 30, or 60 minutes.
 *
 * FR-04: 読み上げ間隔選択UI
 * - Interval options: 1, 5, 10, 15, 30, 60 minutes
 * - Radio button selection
 * - Disabled state when timer is running
 * - Accessibility: fieldset + legend + aria labels
 *
 * Usage:
 * <IntervalSelector
 *   interval={5}
 *   onChange={(min) => setInterval(min)}
 *   disabled={isRunning}
 * />
 */
export function IntervalSelector({
  interval,
  onChange,
  disabled = false,
  compact = false,
}: IntervalSelectorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInterval = Number.parseInt(e.target.value, 10)
      onChange(newInterval)
    },
    [onChange],
  )

  return (
    <fieldset
      disabled={disabled}
      className='border-0 p-0'
      aria-label='Time call interval selection'
    >
      <legend
        className={`font-semibold text-text-light block ${
          compact ? 'text-xs mb-2' : 'text-sm mb-3'
        }`}
      >
        Interval Selection
      </legend>

      <div
        className={`flex flex-wrap ${compact ? 'gap-2' : 'gap-2 sm:gap-3 md:gap-4'}`}
      >
        {INTERVAL_OPTIONS.map(option => (
          <label
            key={option}
            className={`
              flex items-center justify-center
              px-4 py-2 rounded-xl
              bg-neuro-base
              cursor-pointer
              transition-all duration-200
              ${
                interval === option
                  ? 'shadow-neuro-pressed'
                  : 'shadow-neuro-flat hover:shadow-neuro-raised'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:ring-offset-2 focus-within:ring-offset-neuro-base
            `}
          >
            <input
              type='radio'
              name='interval'
              value={option}
              checked={interval === option}
              onChange={handleChange}
              className='sr-only'
              aria-label={`${option}分間隔で読み上げ`}
              disabled={disabled}
            />
            <span
              className={`text-xs sm:text-sm font-medium ${
                interval === option ? 'text-accent-cyan' : 'text-text-light'
              }`}
            >
              {option}分
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
