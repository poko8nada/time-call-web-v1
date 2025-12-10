'use client'

import { type ChangeEvent, useCallback, useId, useState } from 'react'
import { useSpeechSynthesis } from '../_hooks/useSpeechSynthesis'

/**
 * Dev-only SpeechTester component
 *
 * - Temporary UI to manually test / review the speech synthesis in the browser.
 * - TODO: remove before merging to production or gate behind a dev-only flag.
 */
export default function SpeechTester() {
  const {
    isSupported,
    speak,
    voices,
    setSelectedVoice,
    setVolumeState,
    cancel,
  } = useSpeechSynthesis(0.5)

  const [testText, setTestText] = useState('午前10時30分です。')
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0)
  const inputId = useId()
  const volumeId = useId()
  const voiceSelectId = useId()

  console.debug('SpeechTester loaded', {
    isSupported,
    voiceCount: voices.length,
  })

  const handleSpeak = useCallback(async () => {
    if (!testText.trim()) {
      setLastAction('error: empty text')
      setLastResult('❌ Empty')
      return
    }

    setLastAction('speaking...')
    setLastResult('⏳ Speaking...')

    const result = await speak(testText)

    if (result.ok) {
      setLastAction('spoke successfully')
      setLastResult('✅ Success')
    } else {
      setLastAction(`error: ${result.error}`)
      setLastResult(`❌ ${result.error}`)
    }
  }, [speak, testText])

  const handleCancel = useCallback(() => {
    cancel()
    setLastAction('cancelled')
    setLastResult('⏹️ Cancelled')
  }, [cancel])

  const handleVolumeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = Math.max(0, Math.min(100, Number(e.target.value)))
      setVolume(v)
      setVolumeState(v / 100)
      setLastAction(`volume ${v}%`)
    },
    [setVolumeState],
  )

  const handleVoiceChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const idx = Number(e.target.value)
      if (idx >= 0 && idx < voices.length) {
        setSelectedVoiceIndex(idx)
        setSelectedVoice(voices[idx])
        setLastAction(`voice: ${voices[idx].name}`)
      }
    },
    [voices, setSelectedVoice],
  )

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTestText(e.target.value)
  }, [])

  if (!isSupported) {
    return (
      <section
        aria-label='speech-tester'
        className='p-4 rounded-md bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800'
        style={{ maxWidth: 420 }}
      >
        <h3 className='text-sm font-semibold mb-2 text-red-700 dark:text-red-300'>
          Speech Tester (dev)
        </h3>
        <p className='text-xs text-red-600 dark:text-red-400'>
          ❌ Web Speech API is not supported in this browser.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label='speech-tester'
      className='p-4 rounded-md bg-white shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800'
      style={{ maxWidth: 420 }}
    >
      <h3 className='text-sm font-semibold mb-2'>Speech Tester (dev)</h3>

      {/* Voice Selection */}
      <div className='mb-3'>
        <label
          htmlFor={voiceSelectId}
          className='block text-xs text-gray-600 dark:text-gray-400 mb-1'
        >
          Voice ({voices.length} available)
        </label>
        <select
          id={voiceSelectId}
          value={selectedVoiceIndex}
          onChange={handleVoiceChange}
          className='w-full px-2 py-1 text-xs border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700'
          aria-label='select voice'
        >
          {voices.map((voice, idx) => (
            <option key={`${voice.voiceURI}-${idx}`} value={idx}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      {/* Text Input */}
      <div className='mb-3'>
        <label
          htmlFor={inputId}
          className='block text-xs text-gray-600 dark:text-gray-400 mb-1'
        >
          Text to speak
        </label>
        <input
          id={inputId}
          type='text'
          value={testText}
          onChange={handleTextChange}
          placeholder='読み上げるテキストを入力'
          className='w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-zinc-800 dark:border-zinc-700'
          aria-label='speech text input'
        />
      </div>

      {/* Control Buttons */}
      <div className='flex gap-2 mb-3'>
        <button
          type='button'
          onClick={handleSpeak}
          className='px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 text-sm'
          aria-label='speak text'
        >
          Speak
        </button>
        <button
          type='button'
          onClick={handleCancel}
          className='px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 text-sm'
          aria-label='cancel speech'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={() => {
            setTestText('これはテストです。')
            setLastAction('reset text')
          }}
          className='px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm'
        >
          Reset
        </button>
      </div>

      {/* Volume Control */}
      <div className='mb-2'>
        <label
          htmlFor={volumeId}
          className='block text-xs text-gray-600 dark:text-gray-400 mb-1'
        >
          Volume: {volume}%
        </label>
        <input
          id={volumeId}
          type='range'
          min={0}
          max={100}
          step={1}
          value={volume}
          onChange={handleVolumeChange}
          aria-label='speech volume'
          className='w-full'
        />
      </div>

      {/* Status Display */}
      <div className='text-xs text-gray-600 dark:text-gray-400 mb-1'>
        <span>Last: </span>
        <span className='font-medium'>{lastAction ?? '—'}</span>
      </div>

      <div className='text-xs text-gray-600 dark:text-gray-400'>
        <span>Result: </span>
        <span className='font-medium'>{lastResult ?? '—'}</span>
      </div>

      <div className='mt-3 text-xs text-gray-500 dark:text-gray-500'>
        <p>Note: temporary developer tool. Remove or hide before release.</p>
      </div>
    </section>
  )
}
