'use client'
import { useCallback, useEffect, useState } from 'react'
import { err, type Ok, ok, type Result } from '@/utils/types'

type UseSpeechSynthesisReturn = {
  speak: (
    text: string,
    options?: { cancelPrev?: boolean },
  ) => Promise<Result<void, string>>
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (v: SpeechSynthesisVoice | null) => void
  volume: number
  isSupported: boolean
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
  const voices = ss.getVoices()
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

async function loadUtterance() {
  return new Promise<Result<SpeechSynthesisUtterance, string>>(
    (resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance()
        resolve(ok(utterance))
      } catch (e) {
        reject(err(String(e)))
      }
    },
  )
}

export function useSpeechSynthesis(defaultVolume = 0.5) {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.speechSynthesis.getVoices === 'function'

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null)
  const [volume, setVolumeState] = useState(defaultVolume)

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

  const speak = useCallback(
    async (text: string) => {
      if (!isSupported) return
      const ss = (window as Window & { speechSynthesis: SpeechSynthesis })
        .speechSynthesis

      const utteranceResult = await loadUtterance()
      if (!utteranceResult.ok) {
        return err(`Failed to create utterance: ${utteranceResult.error}`)
      }

      let settled = false
      const cleanup = (result: Result<void, string>) => {
        if (settled) return
        settled = true
        try {
          utterance.removeEventListener('end', () => result)
          utterance.removeEventListener('error', () => console.error(result))
        } catch {}
      }

      const utterance = utteranceResult.value
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      utterance.volume = volume
      utterance.lang = selectedVoice?.lang || 'ja-JP'
      utterance.text = text
      utterance.addEventListener('end', () => {
        cleanup(ok(undefined))
      })
      utterance.addEventListener('error', e => {
        cleanup(err(`SpeechSynthesisUtterance error: ${String(e)}`))
      })

      try {
        ss.speak(utterance)
      } catch (e) {
        cleanup(err(`Failed to speak: ${String(e)}`))
        return err(String(e))
      }
    },
    [isSupported, selectedVoice, volume],
  )
  return {
    isSupported,
    voices,
    selectedVoice,
  }
}
