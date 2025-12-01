'use client'

import useCurrentTime from '../../hooks/useCurrentTime'

export type DigitalClockProps = {
  className?: string
  'aria-label'?: string
}

export default function DigitalClock({
  className,
  'aria-label': ariaLabel = '現在時刻',
}: DigitalClockProps) {
  const now = useCurrentTime()

  return (
    <output
      className={className}
      aria-live='polite'
      aria-label={ariaLabel}
      data-testid='digital-clock'
    >
      <time
        aria-hidden='true'
        dateTime={`${String(now.hours).padStart(2, '0')}:${String(now.minutes).padStart(2, '0')}:${String(now.seconds).padStart(2, '0')}`}
      >
        {now.timeString}
      </time>
    </output>
  )
}
