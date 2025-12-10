'use client'

import { useCallback, useEffect, useState } from 'react'

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onVoiceChange: (voice: SpeechSynthesisVoice) => void
  isSupported: boolean
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
  isSupported,
}: VoiceSelectorProps) {
  const [mounted, setMounted] = useState(false)

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
        htmlFor='voice-select'
        className='block text-sm font-semibold text-foreground dark:text-foreground mb-3'
      >
        音声選択
      </label>
      <select
        value={voices.indexOf(selectedVoice || voices[0])}
        onChange={handleVoiceChange}
        className='w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md text-foreground dark:text-foreground focus:outline-2 focus:outline-blue-500 focus:outline-offset-0'
        aria-label='音声の選択'
      >
        {voices.map((voice, index) => (
          <option key={`${voice.name}-${index}`} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <p className='mt-2 text-xs text-gray-600 dark:text-gray-400'>
        選択した音声で時刻が読み上げられます
      </p>
    </div>
  )
}
