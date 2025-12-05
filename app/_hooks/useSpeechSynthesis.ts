'use client'
import { useCallback, useEffect, useState } from 'react'
import { err, type Ok, ok, type Result } from '@/utils/types'

type UseSpeechSynthesisReturn = {
  speak: (
    text: string,
    options?: { cancelPrev?: boolean },
  ) => Promise<Result<void, string>>
  stop: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (v: SpeechSynthesisVoice | null) => void
  volume: number
  setVolume: (v: number) => void
  isSupported: boolean
  isSpeaking: boolean
}

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
  if (voices.length > 0) return ok(voices)

  try {
    // race listener and timer
    const result = await Promise.race([
      getVoicesByListener(ss),
      getVoicesByWaitFor(ss, 1200),
    ])
    // result contains voices array
    return ok(result)
  } catch (e) {
    return err(String(e))
  }
}

function selectPreferredVoice(
  voices: SpeechSynthesisVoice[],
  preferLangs = ['ja-JP', 'ja'],
) {
  if (voices.length === 0) return null
  for (const lang of preferLangs) {
    const found = voices.find(v => v.lang === lang)
    if (found) return found
  }

  for (const voice of voices) {
    if (voice.lang.startsWith('ja')) return voice
  }

  const heuristics = /google|meiko|hikari|yukari|aki|kiritan/i
  const nameMatch = voices.find(v => heuristics.test(v.name))
  if (nameMatch) return nameMatch

  // Fallback to the first voice
  return voices[0] ?? null
}

export function useSpeechSynthesis(defaultVolume?: number) {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.speechSynthesis.getVoices === 'function'

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null)
  const [volume, setVolume] = useState<number>(
    defaultVolume !== undefined ? defaultVolume : 1,
  )
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

  useEffect(() => {
    if (!isSupported) return
    let mounted = true
    loadVoices().then(result => {
      if (!mounted) return
      if (result.ok) {
        setVoices(result.value)
        const receivedVoices = result.ok ? result.value : []
        const prefVoise = selectPreferredVoice(receivedVoices)
        setSelectedVoice(prefVoise)
      } else {
        console.error('Failed to load voices:', result.error)
      }
    })
    return () => {
      mounted = false
    }
  }, [isSupported])

  return {
    isSupported,
    voices,
    selectedVoice,
  }
}
