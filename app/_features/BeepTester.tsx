'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import { useBeepSound } from '../_hooks/useBeepSound'

/**
 * Dev-only BeepTester component
 *
 * - Temporary UI to manually test / review the beep playback in the browser.
 * - TODO: remove before merging to production or gate behind a dev-only flag.
 */
export default function BeepTester() {
  const { playBeepSequence, stopBeep, volume, setVolume } = useBeepSound(0.5)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const handlePlay = useCallback(() => {
    playBeepSequence()
    setLastAction('played')
  }, [playBeepSequence])

  const handleStop = useCallback(() => {
    stopBeep()
    setLastAction('stopped')
  }, [stopBeep])

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.max(0, Math.min(100, Number(e.target.value)))
      setVolume(v / 100)
      setLastAction(`volume ${v}%`)
    },
    [setVolume],
  )

  return (
    <section
      aria-label='beep-tester'
      className='p-4 rounded-md bg-white shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800'
      style={{ maxWidth: 420 }}
    >
      <h3 className='text-sm font-semibold mb-2'>Beep Tester (dev)</h3>

      <div className='flex gap-2 mb-3'>
        <button
          type='button'
          onClick={handlePlay}
          className='px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
          aria-label='play beep sequence'
        >
          Play
        </button>
        <button
          type='button'
          onClick={handleStop}
          className='px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
          aria-label='stop beep'
        >
          Stop
        </button>
        <button
          type='button'
          onClick={() => {
            // quick test: play then stop after 1s
            handlePlay()
            setTimeout(() => {
              handleStop()
            }, 1000)
          }}
          className='px-3 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600'
        >
          Play 1s then stop
        </button>
      </div>

      <div className='mb-2'>
        <label
          htmlFor='beep-volume'
          className='block text-xs text-gray-600 mb-1'
        >
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          id='beep-volume'
          type='range'
          min={0}
          max={100}
          step={1}
          value={Math.round(volume * 100)}
          onChange={handleVolumeChange}
          aria-label='beep volume'
          className='w-full'
        />
      </div>

      <div className='text-xs text-gray-600'>
        <span>Last: </span>
        <span className='font-medium'>{lastAction ?? '—'}</span>
      </div>

      <div className='mt-3 text-xs text-gray-500'>
        <p>Note: temporary developer tool. Remove or hide before release.</p>
      </div>
    </section>
  )
}
