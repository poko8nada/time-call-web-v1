'use client'
import { useCallback, useEffect, useState } from 'react'
import { formatSpeechTime } from '@/utils/formatTime'
import { useBeepSound } from './useBeepSound'
import { useClock } from './useClock'
import { useSpeechSynthesis } from './useSpeechSynthesis'

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

  // Set beep time 5 seconds before
  const beepTime = new Date(callTime)
  beepTime.setSeconds(beepTime.getSeconds() - 5)

  return { callTime, beepTime }
}

export function useTimeCallTimer() {
  const { playBeepSequence } = useBeepSound()
  const { speak } = useSpeechSynthesis()
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

  const formatSpeechTimeCallback = useCallback(
    (callTime: Date) => formatSpeechTime(callTime),
    [],
  )

  const handleBeepAndSpeak = useCallback(async () => {
    if (!nextCallTime) return
    const timeText = formatSpeechTimeCallback(nextCallTime)

    const beepResult = await playBeepSequence()
    if (!beepResult.ok) {
      console.error('Beep failed:', beepResult.error)
      return
    }

    const speakResult = await speak(timeText)
    if (!speakResult.ok) {
      console.error('Speech failed:', speakResult.error)
      return
    }
  }, [playBeepSequence, speak, nextCallTime, formatSpeechTimeCallback])

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
      handleBeepAndSpeak()
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
    handleBeepAndSpeak,
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
