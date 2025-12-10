'use client'
import { useCallback, useEffect, useState } from 'react'
import { useClock } from './useClock'

export function calculateNextCallTime(currentTime: Date, interval: number) {
  const callTime = new Date(currentTime)
  const currentMinute = callTime.getMinutes()
  const remainder = currentMinute % interval
  if (remainder === 0) {
    callTime.setMinutes(currentMinute + interval)
  } else {
    callTime.setMinutes(currentMinute + (interval - remainder))
  }
  callTime.setSeconds(0, 0)

  // Set beep time 3 seconds before
  const beepTime = new Date(callTime)
  beepTime.setSeconds(beepTime.getSeconds() - 3)

  return { callTime, beepTime }
}

type UseTimeCallTimerOptions = {
  onInterval?: () => Promise<void>
}

export function useTimeCallTimer(options: UseTimeCallTimerOptions = {}) {
  const { onInterval } = options
  const { currentTime } = useClock()

  const [isRunning, setIsRunning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [interval, setInterval] = useState(5) // default interval in minutes
  const [nextCallTime, setNextCallTime] = useState<Date | null>(null)

  const calculateCallback = useCallback(
    (currentTime: Date, interval: number) =>
      calculateNextCallTime(currentTime, interval),
    [],
  )

  const handleInterval = useCallback(async () => {
    if (onInterval) {
      await onInterval()
    }
  }, [onInterval])

  const start = useCallback(() => {
    setIsRunning(true)
    setNextCallTime(null) // Reset to calculate next call time
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    setNextCallTime(null)
  }, [])

  useEffect(() => {
    const { callTime, beepTime } = calculateCallback(currentTime, interval)

    if (!nextCallTime) {
      setNextCallTime(callTime)
      return
    }

    if (!isRunning) return

    if (currentTime >= beepTime && currentTime < nextCallTime && !isPlaying) {
      setIsPlaying(true)
      handleInterval()
    }
    if (currentTime >= nextCallTime) {
      setIsPlaying(false)
      const { callTime: newCallTime } = calculateCallback(currentTime, interval)
      setNextCallTime(newCallTime)
    }
  }, [
    isPlaying,
    isRunning,
    currentTime,
    interval,
    nextCallTime,
    calculateCallback,
    handleInterval,
  ])

  return {
    isRunning,
    interval,
    setInterval,
    start,
    stop,
    nextCallTime,
  }
}
