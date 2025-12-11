'use client'
import { useCallback, useEffect, useState } from 'react'
import { formatSpeechTime } from '@/utils/formatTime'
import type { Result } from '@/utils/types'

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

interface UseTimeCallTimerParams {
  currentTime: Date
  playBeep: () => Promise<Result<void, string>>
  playSpeech: (text: string) => Promise<Result<void, string>>
}

export function useTimeCallTimer({
  currentTime,
  playBeep,
  playSpeech,
}: UseTimeCallTimerParams) {
  const [isRunning, setIsRunning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [interval, setInterval] = useState(5) // default interval in minutes
  const [nextCallTime, setNextCallTime] = useState<Date | null>(null)

  // CT = currentTime, currentTime is often updated from outside. that's why we pass it as parameter.
  // So we need to recalculate next call time when interval changes.
  const calculateCallback = useCallback(
    (CT: Date) => calculateNextCallTime(CT, interval),
    [interval],
  )

  // PB = playBeep, PS = playSpeech, NCT = nextCallTime.
  // These are passed as parameters to avoid stale closures.
  const handleCallback = useCallback(
    async (
      PB: () => Promise<Result<void, string>>,
      PS: (text: string) => Promise<Result<void, string>>,
      NCT: Date,
    ) => {
      if (!NCT) return

      const beepResult = await PB()
      if (!beepResult.ok) {
        console.error('Beep failed:', beepResult.error)
        return
      }

      const timeText = formatSpeechTime(NCT)
      const speakResult = await PS(timeText)
      if (!speakResult.ok) {
        console.error('Speech failed:', speakResult.error)
        return
      }
    },
    [],
  )

  useEffect(() => {
    const { callTime, beepTime } = calculateCallback(currentTime)

    if (!nextCallTime) {
      setNextCallTime(callTime)
      return
    }

    if (!isRunning) return

    if (currentTime >= beepTime && currentTime < nextCallTime && !isPlaying) {
      setIsPlaying(true)
      handleCallback(playBeep, playSpeech, callTime)
    }
    if (currentTime >= nextCallTime) {
      setIsPlaying(false)
      const { callTime: newCallTime } = calculateCallback(currentTime)
      setNextCallTime(newCallTime)
    }
  }, [
    isPlaying,
    isRunning,
    currentTime,
    nextCallTime,
    calculateCallback,
    handleCallback,
    playBeep,
    playSpeech,
  ])

  const startTimer = useCallback(() => {
    setIsRunning(true)
    setNextCallTime(null) // Reset to calculate next call time
  }, [])

  const stopTimer = useCallback(() => {
    setIsRunning(false)
    setNextCallTime(null)
  }, [])

  return {
    isRunning,
    interval,
    setInterval,
    startTimer,
    stopTimer,
    nextCallTime,
  }
}
