'use client'

import { useCallback, useState } from 'react'
import type { Result } from '@/utils/types'

interface TestPlayButtonProps {
  selectedVoice: SpeechSynthesisVoice | null
  onPlaySpeech: (text: string) => Promise<Result<void, string>>
  isSupported: boolean
}

/**
 * TestPlayButton
 *
 * Voice test play button component.
 * Accepts callbacks as props (composition pattern).
 */
export function TestPlayButton({
  selectedVoice,
  onPlaySpeech,
  isSupported,
}: TestPlayButtonProps) {
  const [isTestPlaying, setIsTestPlaying] = useState(false)

  const handleTestPlay = useCallback(async () => {
    if (!selectedVoice) return
    setIsTestPlaying(true)
    await onPlaySpeech('こんにちは。音声テストです。')
    setIsTestPlaying(false)
  }, [selectedVoice, onPlaySpeech])

  if (!isSupported || !selectedVoice) {
    return null
  }

  return (
    <button
      type='button'
      onClick={handleTestPlay}
      disabled={isTestPlaying}
      className='w-full px-4 py-2 bg-linear-to-br from-accent-cyan to-accent-purple shadow-neuro-flat hover:shadow-neuro-raised active:shadow-neuro-pressed disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-neuro-flat text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neuro-base'
      aria-label='選択した音声をテスト再生'
    >
      {isTestPlaying ? '再生中...' : '音声テスト'}
    </button>
  )
}
