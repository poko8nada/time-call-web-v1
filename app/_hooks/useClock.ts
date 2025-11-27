'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type UseClockResult = { currentTime: Date }

/**
 * useClock
 * - Returns { currentTime: Date }
 * - Syncs to seconds using setTimeout (avoids setInterval drift)
 * - Re-syncs on visibility/focus
 */
export function useClock(): UseClockResult {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date())
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleTick = useCallback(() => {
    clearTimer()
    const now = new Date()
    setCurrentTime(now)
    const msToNextSecond = 1000 - now.getMilliseconds()
    timerRef.current = window.setTimeout(() => {
      scheduleTick()
    }, msToNextSecond)
  }, [clearTimer])

  useEffect(() => {
    scheduleTick()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // re-sync immediately and restart scheduling
        setCurrentTime(new Date())
        clearTimer()
        scheduleTick()
      } else {
        // optionally pause timer when hidden
        clearTimer()
      }
    }

    const handleFocus = () => {
      setCurrentTime(new Date())
      clearTimer()
      scheduleTick()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)

    return () => {
      clearTimer()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
    }
  }, [scheduleTick, clearTimer])

  return { currentTime }
}
