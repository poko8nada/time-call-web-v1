'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { err, ok, type Result } from '@/utils/types'

type UseBeepSoundReturn = {
  playBeepSequence: () => Promise<Result<void, string>>
  stopBeep: () => void
  volume: number
  setVolume: (volume: number) => void
}

export function useBeepSound(defaultVolume = 0.5): UseBeepSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isAudioLoaded, setIsAudioLoaded] = useState(false)
  const [volume, setVolumeState] = useState(defaultVolume)

  // biome-ignore lint/correctness/useExhaustiveDependencies(volume): suppress dependency volume
  useEffect(() => {
    const audio = new Audio('/sounds/beep-sequence.mp3')
    audio.preload = 'auto'
    audio.loop = false
    audio.volume = Math.max(0, Math.min(1, volume))
    audioRef.current = audio

    const onCanPlay = () => setIsAudioLoaded(true)
    const onError = () => {
      console.error('Failed to load beep sound.')
      audio.pause()
      setIsAudioLoaded(false)
    }

    audio.addEventListener('canplaythrough', onCanPlay)
    audio.addEventListener('canplay', onCanPlay) // For broader browser support
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }, [volume])

  const playBeepSequence = useCallback(async (): Promise<
    Result<void, string>
  > => {
    return new Promise(resolve => {
      let settled = false

      const handleEnded = () => {
        if (settled) return
        settled = true
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded)
        }
        resolve(ok<void, string>(undefined))
      }

      if (!isAudioLoaded || !audioRef.current) {
        return resolve(err<void, string>('Audio not loaded'))
      }

      if (!audioRef.current.paused) {
        return resolve(err<void, string>('Audio is already playing'))
      }

      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.currentTime = 0

      audioRef.current.play().catch(error => {
        settled = true
        audioRef.current?.removeEventListener('ended', handleEnded)
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to play beep sound'
        console.error('Error playing beep sound:', error)
        resolve(err<void, string>(errorMessage))
      })
    })
  }, [isAudioLoaded])

  const stopBeep = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const setVolume = useCallback((v: number) => {
    const clampedVolume = Math.max(0, Math.min(1, v))
    setVolumeState(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }, [])

  return { playBeepSequence, stopBeep, volume, setVolume }
}
