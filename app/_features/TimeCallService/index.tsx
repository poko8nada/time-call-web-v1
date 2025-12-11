'use client'

import { useCallback, useEffect, useState } from 'react'
import { DigitalClock } from '@/app/_components/DigitalClock'
import { useBeepSound } from '@/app/_hooks/useBeepSound'
import { formatSpeechTime } from '@/utils/formatTime'
import { AudioSettings } from './AudioSettings'
import { TimerControls } from './TimerControls'
import { useAudioSettings } from './useAudioSettings'
import { useTimerState } from './useTimerState'

export function TimeCallService() {
  const [masterVolume, setMasterVolume] = useState(70)
  const [nextCallTime, setNextCallTime] = useState<Date | null>(null)

  const { setVolume: setBeepVolume, playBeepSequence } = useBeepSound()
  const audioSettings = useAudioSettings()

  useEffect(() => {
    const normalizedVolume = masterVolume / 100
    setBeepVolume(normalizedVolume)
    audioSettings.setVolumeState(normalizedVolume)
  }, [masterVolume, setBeepVolume, audioSettings.setVolumeState])

  const handleInterval = useCallback(async () => {
    if (!nextCallTime) return

    const timeText = formatSpeechTime(nextCallTime)

    const beepResult = await playBeepSequence()
    if (!beepResult.ok) {
      console.error('Beep failed:', beepResult.error)
      return
    }

    const speakResult = await audioSettings.speak(timeText)
    if (!speakResult.ok) {
      console.error('Speech failed:', speakResult.error)
      return
    }
  }, [nextCallTime, playBeepSequence, audioSettings.speak])

  const timerState = useTimerState({
    onInterval: handleInterval,
  })

  useEffect(() => {
    setNextCallTime(timerState.nextCallTime)
  }, [timerState.nextCallTime])

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
        <DigitalClock />
      </div>

      {/* Timer Control Section */}
      <div className='space-y-6 bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg'>
        <h2 className='text-lg font-semibold text-foreground dark:text-foreground'>
          タイマー制御
        </h2>

        <TimerControls
          isRunning={timerState.isRunning}
          interval={timerState.interval}
          onStart={timerState.start}
          onStop={timerState.stop}
          onIntervalChange={timerState.setInterval}
        />
      </div>

      {/* Settings Panel */}
      <div className='bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg'>
        <AudioSettings
          isSupported={audioSettings.isSupported}
          voices={audioSettings.voices}
          selectedVoice={audioSettings.selectedVoice}
          onVoiceChange={audioSettings.setSelectedVoice}
          volume={masterVolume}
          onVolumeChange={setMasterVolume}
          onSpeak={audioSettings.speak}
        />
      </div>
    </main>
  )
}
