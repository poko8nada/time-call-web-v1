'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { err, ok, type Result } from '@/utils/types'
import { filterVoicesByPresets } from '@/utils/voicePresets'

function getVoicesByWaitFor(ss: SpeechSynthesis, timeoutMs = 1200) {
  return new Promise<SpeechSynthesisVoice[]>(resolve => {
    let settled = false
    const cleanup = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      cleanup()
      resolve(ss.getVoices())
    }, timeoutMs)
  })
}

function getVoicesByListener(ss: SpeechSynthesis) {
  return new Promise<SpeechSynthesisVoice[]>(resolve => {
    let settled = false
    const prevOn = ss.onvoiceschanged

    const cleanup = () => {
      if (settled) return
      settled = true
      try {
        ss.removeEventListener('voiceschanged', handleVoicesChanged)
      } catch {
        ss.onvoiceschanged = prevOn
      }
    }

    const handleVoicesChanged = () => {
      cleanup()
      resolve(ss.getVoices())
    }

    try {
      ss.addEventListener('voiceschanged', handleVoicesChanged)
    } catch {
      ss.onvoiceschanged = e => {
        handleVoicesChanged()
        try {
          prevOn?.call(ss, e)
        } catch {}
      }
    }
  })
}

async function loadVoices(): Promise<Result<SpeechSynthesisVoice[], string>> {
  const ss = (window as Window & { speechSynthesis: SpeechSynthesis })
    .speechSynthesis
  let voices = ss.getVoices()
  if (voices.length === 0) {
    try {
      // race listener and timer
      voices = await Promise.race([
        getVoicesByListener(ss),
        getVoicesByWaitFor(ss, 1200),
      ])
    } catch (e) {
      return err(String(e))
    }
  }

  // FR-17: Filter by voice presets
  const filteredVoices = filterVoicesByPresets(voices)
  return ok(filteredVoices)
}

function createUtterance(): Result<SpeechSynthesisUtterance, string> {
  try {
    const utterance = new SpeechSynthesisUtterance()
    return ok(utterance)
  } catch (e) {
    return err(String(e))
  }
}

async function speakUtterance(
  ss: SpeechSynthesis,
  utterance: SpeechSynthesisUtterance,
): Promise<Result<void, string>> {
  return new Promise<Result<void, string>>(resolve => {
    let settled = false

    const cleanup = () => {
      if (settled) return
      settled = true
      try {
        utterance.removeEventListener('end', onEnd)
        utterance.removeEventListener('error', onError)
      } catch {}
    }

    const onEnd = () => {
      cleanup()
      resolve(ok(undefined))
    }

    const onError = (event: Event) => {
      cleanup()
      // Extract detailed error information from SpeechSynthesisErrorEvent
      let errorMsg = 'Speech utterance error'

      // Type guard for SpeechSynthesisErrorEvent
      if (event && 'error' in event) {
        const errorEvent = event as SpeechSynthesisErrorEvent
        errorMsg += `: ${errorEvent.error}`

        // Log full event details for debugging with JSON.stringify for Next.js dev tools
        const errorDetails = {
          error: errorEvent.error,
          message: errorEvent.type,
          elapsedTime: errorEvent.elapsedTime,
          charIndex: errorEvent.charIndex,
        }

        // 'interrupted' is expected during page navigation/refresh, use warn
        if (errorEvent.error === 'interrupted') {
          console.warn(
            `Speech synthesis interrupted: ${JSON.stringify(errorDetails)}`,
          )
        } else {
          // Other errors are unexpected, use error
          console.error(
            `Speech synthesis error details: ${JSON.stringify(errorDetails)}`,
          )
        }
      } else {
        console.error(
          `Speech synthesis error (unknown format): ${String(event)}`,
        )
      }

      resolve(err(errorMsg))
    }

    utterance.addEventListener('end', onEnd)
    utterance.addEventListener('error', onError)

    try {
      ss.speak(utterance)
    } catch (e) {
      cleanup()
      resolve(err(`Failed to call speak: ${String(e)}`))
    }
  })
}

type UseSpeechSynthesisReturn = {
  isSupported: boolean
  isAvailable: boolean
  playSpeech: (text: string) => Promise<Result<void, string>>
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (v: SpeechSynthesisVoice | null) => void
  setSpeechVolume: (v: number) => void
  cancelSpeech: () => void
}

export function useSpeechSynthesis(
  defaultVolume = 0.5,
): UseSpeechSynthesisReturn {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.speechSynthesis.getVoices === 'function'

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null)
  const [speechVolume, setSpeechVolume] = useState(() => {
    return Math.max(0, Math.min(1, defaultVolume))
  })
  const [isAvailable, setIsAvailable] = useState(false)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!isSupported) return
    let mounted = true
    loadVoices().then(result => {
      if (!mounted) return
      if (result.ok) {
        const voicesToSet = result.value
        // DEBUG: Temporarily set empty to test empty state UI
        // const DEBUG_EMPTY_VOICES = true
        // if (DEBUG_EMPTY_VOICES) voicesToSet = []

        setVoices(voicesToSet)
        // FR-18: Set isAvailable based on voices availability
        setIsAvailable(voicesToSet.length > 0)
        // FR-17: VOICE_PRESETS order defines priority, select first filtered voice
        setSelectedVoice(voicesToSet[0] ?? null)
      } else {
        console.error('Failed to load voices:', result.error)
        setIsAvailable(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [isSupported])

  const cancelSpeech = useCallback(() => {
    if (!isSupported) return
    const ss = (window as Window & { speechSynthesis: SpeechSynthesis })
      .speechSynthesis
    try {
      // Cancel any ongoing speech
      ss.cancel()
      // Clear the current utterance reference
      currentUtteranceRef.current = null
    } catch (e) {
      console.error('Failed to cancel speechSynthesis:', e)
    }
  }, [isSupported])

  const playSpeech = useCallback(
    async (text: string): Promise<Result<void, string>> => {
      if (!isSupported) {
        return err('speechSynthesis not supported')
      }

      // FR-18: Check if voices are available
      if (!isAvailable) {
        return err('No voice available')
      }

      const ss = (window as Window & { speechSynthesis: SpeechSynthesis })
        .speechSynthesis

      // Cancel any ongoing speech before starting new one
      if (ss.speaking || ss.pending) {
        ss.cancel()
      }

      const utteranceResult = createUtterance()
      if (!utteranceResult.ok) {
        return err(`Failed to create utterance: ${utteranceResult.error}`)
      }

      const utterance = utteranceResult.value

      utterance.volume = Math.max(0, Math.min(1, speechVolume))
      utterance.text = `${text}`
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice?.lang || 'ja-JP'

      console.log(utterance)
      console.log(Math.max(0, Math.min(1, speechVolume)))
      console.log(speechVolume)

      // Store reference to current utterance
      currentUtteranceRef.current = utterance

      // Delegate event handling to separated function
      const result = await speakUtterance(ss, utterance)

      // Clear reference if this was the utterance we just spoke
      if (currentUtteranceRef.current === utterance) {
        currentUtteranceRef.current = null
      }

      return result
    },
    [isSupported, isAvailable, selectedVoice, speechVolume],
  )

  return {
    isSupported,
    isAvailable,
    voices,
    selectedVoice,
    setSelectedVoice,
    playSpeech,
    setSpeechVolume,
    cancelSpeech,
  }
}
