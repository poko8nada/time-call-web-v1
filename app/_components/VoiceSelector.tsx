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
 *
 * Usage:
 * <VoiceSelector
 *   voices={voices}
 *   selectedVoice={selectedVoice}
 *   onVoiceChange={setSelectedVoice}
 *   isSupported={true}
 * />
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
        className={`block font-semibold text-foreground dark:text-foreground ${
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
        className={`w-full bg-background dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-md text-foreground dark:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed ${
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
        <p className='mt-2 text-xs text-secondary-600 dark:text-secondary-400'>
          選択した音声で時刻が読み上げられます
        </p>
      )}
    </div>
  )
}
