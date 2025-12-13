'use client'

import { useEffect, useState } from 'react'
import { DigitalClock } from '@/app/_components/DigitalClock'
import { IntervalSelector } from '@/app/_components/IntervalSelector'
import { NextCallTimeDisplay } from '@/app/_components/NextCallTimeDisplay'
import { VoiceSelector } from '@/app/_components/VoiceSelector'
import { VoiceUnavailableDialog } from '@/app/_components/VoiceUnavailableDialog'
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
        {/* Header - Minimized */}
        <div className='text-center space-y-1'>
          <h1 className='text-base sm:text-lg font-bold text-foreground dark:text-foreground'>
            時刻読み上げサービス
          </h1>
          <p className='text-xs sm:text-sm text-secondary-600 dark:text-secondary-400'>
            指定した間隔で現在時刻をお知らせします
          </p>
        </div>

        {/* Main Timer Section - Unified with integrated button */}
        <div className='flex flex-col items-center justify-between min-h-[50vh] sm:min-h-[55vh] py-8 sm:py-10 md:py-12 px-6 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-elevated'>
          {/* Digital Clock - Enlarged */}
          <div className='flex-1 flex items-center justify-center w-full'>
            <DigitalClock currentTime={currentTime} />
          </div>

          {/* Next Call Time - Integrated below clock */}
          <div className='mb-6'>
            <NextCallTimeDisplay
              nextCallTime={nextCallTime}
              isRunning={isRunning}
            />
          </div>

          {/* Control Button - Inside timer area */}
          <TimerControls
            isRunning={isRunning}
            onStart={startTimer}
            onStop={stopTimer}
            isAvailable={isAvailable}
          />
        </div>

        {/* Quick Settings - Horizontal bar */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center justify-center py-4 px-4 sm:px-6'>
          {/* Interval Selector */}
          <div className='flex-1 max-w-xs'>
            <IntervalSelector
              interval={interval}
              onChange={setInterval}
              disabled={isRunning}
              compact={true}
            />
          </div>

          {/* Voice Selector */}
          <div className='flex-1 max-w-xs'>
            <VoiceSelector
              voices={voices}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              isSupported={isSupported}
              disabled={isRunning}
              compact={true}
            />
          </div>
        </div>

        {/* Audio Settings - Accordion */}
        <AudioSettings
          isSupported={isSupported}
          selectedVoice={selectedVoice}
          masterVolume={masterVolume}
          onSetMasterVolume={setMasterVolume}
          onPlaySpeech={playSpeech}
        />
      </main>
    </>
  )
}
