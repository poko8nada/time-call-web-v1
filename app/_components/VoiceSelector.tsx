'use client'

import { useCallback, useEffect, useId, useState } from 'react'

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onVoiceChange: (voice: SpeechSynthesisVoice) => void
  isSupported?: boolean
  disabled?: boolean
  compact?: boolean
}

/**
 * VoiceSelector
 *
 * Voice selection dropdown component.
 * Accepts voices and callbacks as props (composition pattern).
 */
export function VoiceSelector({
  voices,
  selectedVoice,
  onVoiceChange,
  isSupported = true,
  disabled = false,
  compact = false,
}: VoiceSelectorProps) {
  const [mounted, setMounted] = useState(false)
  const selectId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleVoiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const voiceIndex = Number.parseInt(e.target.value, 10)
      const selectedVoiceItem = voices[voiceIndex]
      if (selectedVoiceItem) {
        onVoiceChange(selectedVoiceItem)
      }
    },
    [voices, onVoiceChange],
  )

  if (!mounted || !isSupported || voices.length === 0) {
    return null
  }

  return (
    <div>
      <label
        htmlFor={selectId}
        className={`block font-semibold text-text-light ${
          compact ? 'text-xs mb-2' : 'text-sm mb-3'
        }`}
      >
        音声選択
      </label>
      <select
        id={selectId}
        value={voices.indexOf(selectedVoice || voices[0])}
        onChange={handleVoiceChange}
        disabled={disabled}
        className={`w-full bg-neuro-base border-0 rounded-xl text-text-light shadow-neuro-flat focus:shadow-neuro-pressed focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neuro-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
        }`}
        aria-label='音声の選択'
      >
        {voices.map((voice, index) => (
          <option key={`${voice.name}-${index}`} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      {!compact && (
        <p className='mt-2 text-xs text-text-muted'>
          選択した音声で時刻が読み上げられます
        </p>
      )}
    </div>
  )
}
