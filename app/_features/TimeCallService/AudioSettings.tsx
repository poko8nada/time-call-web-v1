'use client'

import { useId, useState } from 'react'
import { TestPlayButton } from '@/app/_components/TestPlayButton'
import { VolumeControl } from '@/app/_components/VolumeControl'
import type { Result } from '@/utils/types'

interface AudioSettingsProps {
  masterVolume: number
  onSetMasterVolume: (volume: number) => void
  isSupported: boolean
  selectedVoice: SpeechSynthesisVoice | null
  onPlaySpeech: (text: string) => Promise<Result<void, string>>
}

/**
 * AudioSettings
 *
 * Collapsible accordion for audio settings (volume and test playback).
 * Default closed to save space. Voice selection moved to Quick Settings bar.
 * Uses grid-rows for smooth animation without layout shift.
 */
export function AudioSettings({
  masterVolume,
  onSetMasterVolume,
  isSupported,
  selectedVoice,
  onPlaySpeech,
}: AudioSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()

  return (
    <div className='bg-neuro-base rounded-2xl shadow-neuro-flat hover:shadow-neuro-raised transition-shadow duration-300 border-0'>
      {/* Accordion Header */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-4 sm:p-6 text-left transition-colors rounded-2xl focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neuro-base'
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <h2 className='text-base sm:text-lg font-semibold text-text-light'>
          音声設定
        </h2>
        <svg
          className={`w-5 h-5 text-text-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-label={isOpen ? '閉じる' : '開く'}
          role='img'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {/* Accordion Content */}
      <div
        id={contentId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className='overflow-hidden'>
          <div className='p-4 sm:p-6 pt-0 space-y-6'>
            <VolumeControl
              masterVolume={masterVolume}
              onSetMasterVolume={onSetMasterVolume}
              label='マスターボリューム'
              description='ビープ音と読み上げ音の両方に適用されます'
            />
            <div>
              <TestPlayButton
                selectedVoice={selectedVoice}
                onPlaySpeech={onPlaySpeech}
                isSupported={isSupported}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
