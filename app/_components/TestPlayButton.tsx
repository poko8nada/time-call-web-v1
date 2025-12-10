'use client'

import { useCallback, useState } from 'react'
import type { Result } from '@/utils/types'

interface TestPlayButtonProps {
  selectedVoice: SpeechSynthesisVoice | null
  onSpeak: (text: string) => Promise<Result<void, string>>
  isSupported: boolean
}

/**
 * TestPlayButton
 *
 * Voice test play button component.
 * Accepts callbacks as props (composition pattern).
 *
 * Usage:
 * <TestPlayButton
 *   selectedVoice={selectedVoice}
 *   onSpeak={speak}
 *   isSupported={true}
 * />
 */
export function TestPlayButton({
  selectedVoice,
  onSpeak,
  isSupported,
}: TestPlayButtonProps) {
  const [isTestPlaying, setIsTestPlaying] = useState(false)

  const handleTestPlay = useCallback(async () => {
    if (!selectedVoice) return
    setIsTestPlaying(true)
    await onSpeak('こんにちは。現在の音声テストです。')
    setIsTestPlaying(false)
  }, [selectedVoice, onSpeak])

  if (!isSupported || !selectedVoice) {
    return null
  }

  return (
    <button
      type='button'
      onClick={handleTestPlay}
      disabled={isTestPlaying}
      className='w-full px-4 py-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-blue-600'
      aria-label='選択した音声をテスト再生'
    >
      {isTestPlaying ? '再生中...' : '音声テスト'}
    </button>
  )
}
