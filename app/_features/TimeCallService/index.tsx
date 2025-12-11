'use client'

import { useEffect, useState } from 'react'
import { DigitalClock } from '@/app/_components/DigitalClock'
import { useBeepSound } from '@/app/_hooks/useBeepSound'
import { useClock } from '@/app/_hooks/useClock'
import { useSpeechSynthesis } from '@/app/_hooks/useSpeechSynthesis'
import { AudioSettings } from './AudioSettings'
import { TimerControls } from './TimerControls'
import { useTimeCallTimer } from './useTimeCallTimer'

export function TimeCallService() {
  const [masterVolume, setMasterVolume] = useState(70)

  const { currentTime } = useClock()
  const { playBeep, stopBeep, setBeepVolume } = useBeepSound(masterVolume / 100)
  const {
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    playSpeech,
    setSpeechVolume,
    cancelSpeech,
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
    <main className='w-full max-w-2xl space-y-8'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-foreground'>
          時刻読み上げサービス
        </h1>
        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
          指定した間隔で現在時刻をお知らせします
        </p>
      </div>

      {/* Digital Clock Section */}
      <div className='flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
        <DigitalClock currentTime={currentTime} />
      </div>

      {/* Timer Control Section */}
      <div className='space-y-6 bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg'>
        <h2 className='text-lg font-semibold text-foreground dark:text-foreground'>
          タイマー制御
        </h2>

        <TimerControls
          isRunning={isRunning}
          interval={interval}
          onStart={startTimer}
          onStop={stopTimer}
          onIntervalChange={setInterval}
        />
      </div>

      {/* Settings Panel */}
      <div className='bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg'>
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
  )
}
