'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatSpeechTime } from '@/utils/formatTime'
import { ControlButton } from '../_components/ControlButton'
import { DigitalClock } from '../_components/DigitalClock'
import { IntervalSelector } from '../_components/IntervalSelector'
import { SettingsPanel } from '../_components/SettingsPanel'
import { TestPlayButton } from '../_components/TestPlayButton'
import { VoiceSelector } from '../_components/VoiceSelector'
import { VolumeControl } from '../_components/VolumeControl'
import { useBeepSound } from '../_hooks/useBeepSound'
import { useClock } from '../_hooks/useClock'
import { useSpeechSynthesis } from '../_hooks/useSpeechSynthesis'
import { useTimeCallTimer } from '../_hooks/useTimeCallTimer'

/**
 * TimeCallService
 *
 * Unified client feature component for the time call service.
 * Manages:
 * - Master volume state (0-100)
 * - Speech synthesis (voices, volume, speaking)
 * - Timer logic and audio synchronization
 * - UI coordination via composition pattern
 *
 * FR-10: 時報サービス全体の統合
 * - Integrates all hooks (useClock, useTimeCallTimer, useBeepSound, useSpeechSynthesis)
 * - Centralized volume and speech synthesis management
 * - Uses composition pattern to avoid prop drilling
 * - Coordinates beep → speech sequence via onInterval callback
 * - Composes UI components
 *
 * Design:
 * - onInterval callback passed to useTimeCallTimer captures masterVolume
 * - This ensures beep/speak always use current volume setting
 * - Avoids the problem of independent hook instances with stale volume
 *
 * Usage:
 * <TimeCallService />  (in page.tsx Server Component)
 */
export function TimeCallService() {
  const [masterVolume, setMasterVolume] = useState(70)
  const [nextCallTime, setNextCallTime] = useState<Date | null>(null)

  // Initialize hooks
  const { currentTime } = useClock()
  const { setVolume: setBeepVolume, playBeepSequence } = useBeepSound()
  const {
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    setVolumeState,
  } = useSpeechSynthesis()

  // Sync master volume to beep and speech hooks
  useEffect(() => {
    const normalizedVolume = masterVolume / 100
    setBeepVolume(normalizedVolume)
    setVolumeState(normalizedVolume)
  }, [masterVolume, setBeepVolume, setVolumeState])

  // Define onInterval callback - executed by useTimeCallTimer when time reaches
  // This closure captures masterVolume, so beep/speak always use current volume
  const handleInterval = useCallback(async () => {
    if (!nextCallTime) return

    const timeText = formatSpeechTime(nextCallTime)

    const beepResult = await playBeepSequence()
    if (!beepResult.ok) {
      console.error('Beep failed:', beepResult.error)
      return
    }

    const speakResult = await speak(timeText)
    if (!speakResult.ok) {
      console.error('Speech failed:', speakResult.error)
      return
    }
  }, [nextCallTime, playBeepSequence, speak])

  // Initialize timer with onInterval callback injected
  const {
    isRunning,
    start,
    stop,
    interval,
    setInterval,
    nextCallTime: timerNextCallTime,
  } = useTimeCallTimer({
    onInterval: handleInterval,
  })

  // Sync nextCallTime from timer
  useEffect(() => {
    setNextCallTime(timerNextCallTime)
  }, [timerNextCallTime])

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

        <div className='space-y-6'>
          {/* Interval Selector */}
          <IntervalSelector
            interval={interval}
            onChange={setInterval}
            disabled={isRunning}
          />

          {/* Control Button */}
          <div className='flex justify-center'>
            <ControlButton
              isRunning={isRunning}
              onStart={start}
              onStop={stop}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel - Using Composition Pattern */}
      <div className='bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg'>
        <SettingsPanel>
          <VolumeControl
            volume={masterVolume}
            onChange={setMasterVolume}
            label='マスターボリューム'
            description='ビープ音と読み上げ音の両方に適用されます'
          />
          <VoiceSelector
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            isSupported={isSupported}
          />
          <TestPlayButton
            selectedVoice={selectedVoice}
            onSpeak={speak}
            isSupported={isSupported}
          />
        </SettingsPanel>
      </div>
    </main>
  )
}
