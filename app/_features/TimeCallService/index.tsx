'use client'

import { useEffect, useState } from 'react'
import { VoiceUnavailableDialog } from '@/app/_components/VoiceUnavailableDialog'
import { DigitalClock } from '@/app/_components/DigitalClock'
import { NextCallTimeDisplay } from '@/app/_components/NextCallTimeDisplay'
import { useBeepSound } from '@/app/_hooks/useBeepSound'
import { useClock } from '@/app/_hooks/useClock'
import { useSpeechSynthesis } from '@/app/_hooks/useSpeechSynthesis'
import { AudioSettings } from './AudioSettings'
import { TimerControls } from './TimerControls'
import { useTimeCallTimer } from './useTimeCallTimer'

export function TimeCallService() {
  const [masterVolume, setMasterVolume] = useState(70)

  const { currentTime } = useClock()
  const { playBeep, setBeepVolume } = useBeepSound(masterVolume / 100)
  const {
    isSupported,
    isAvailable,
    voices,
    selectedVoice,
    setSelectedVoice,
    playSpeech,
    setSpeechVolume,
  } = useSpeechSynthesis(masterVolume / 100)

  const {
    isRunning,
    interval,
    setInterval,
    startTimer,
    stopTimer,
    nextCallTime,
  } = useTimeCallTimer({ currentTime, playBeep, playSpeech })

  useEffect(() => {
    setBeepVolume(masterVolume / 100)
    setSpeechVolume(masterVolume / 100)
  }, [masterVolume, setBeepVolume, setSpeechVolume])

  return (
    <>
      {/* FR-18: Show error dialog when voices are unavailable */}
      <VoiceUnavailableDialog isOpen={!isAvailable} />

      <main className='w-full max-w-2xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-4'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground dark:text-foreground drop-shadow-sm'>
            時刻読み上げサービス
          </h1>
          <p className='text-xs sm:text-sm md:text-base text-secondary-600 dark:text-secondary-400'>
            指定した間隔で現在時刻をお知らせします
          </p>
        </div>

        {/* Digital Clock Section */}
        <div className='flex flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-16 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-elevated'>
          <DigitalClock currentTime={currentTime} />
          <NextCallTimeDisplay
            nextCallTime={nextCallTime}
            isRunning={isRunning}
          />
        </div>

        {/* Timer Control Section */}
        <div className='space-y-4 sm:space-y-6 bg-secondary-50 dark:bg-secondary-900 p-4 sm:p-6 md:p-8 rounded-lg border border-secondary-200 dark:border-secondary-800'>
          <h2 className='text-base sm:text-lg font-semibold text-foreground dark:text-foreground'>
            タイマー制御
          </h2>

          <TimerControls
            isRunning={isRunning}
            interval={interval}
            onStart={startTimer}
            onStop={stopTimer}
            onIntervalChange={setInterval}
            isAvailable={isAvailable}
          />
        </div>

        {/* Settings Panel */}
        <div className='bg-secondary-50 dark:bg-secondary-900 p-4 sm:p-6 md:p-8 rounded-lg border border-secondary-200 dark:border-secondary-800'>
          <AudioSettings
            isSupported={isSupported}
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            masterVolume={masterVolume}
            onSetMasterVolume={setMasterVolume}
            onPlaySpeech={playSpeech}
          />
        </div>
      </main>
    </>
  )
}
