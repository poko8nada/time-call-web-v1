'use client'

import { useState } from 'react'
import { DigitalClock } from './_components/DigitalClock'
import { VolumeControl } from './_components/VolumeControl'

// import AudioTesterWrapper from './_features/AudioTesterWrapper'

export default function Home() {
  const [beepVolume, setBeepVolume] = useState(70)
  const [speechVolume, setSpeechVolume] = useState(70)

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black p-4'>
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

        {/* Settings Section */}
        <div className='space-y-6 bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg'>
          <h2 className='text-lg font-semibold text-foreground dark:text-foreground'>
            設定
          </h2>

          <div className='space-y-4'>
            <VolumeControl
              volume={beepVolume}
              onChange={setBeepVolume}
              label='ビープ音量'
            />
            <VolumeControl
              volume={speechVolume}
              onChange={setSpeechVolume}
              label='読み上げ音量'
            />
          </div>
        </div>

        {/* Footer - License Attribution */}
        <footer className='text-center text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-zinc-800'>
          <p>
            音源:{' '}
            <a
              href='https://otologic.jp'
              className='underline hover:text-gray-700 dark:hover:text-gray-300'
            >
              OtoLogic
            </a>{' '}
            ({' '}
            <a
              href='https://creativecommons.org/licenses/by/4.0/'
              className='underline hover:text-gray-700 dark:hover:text-gray-300'
            >
              CC BY 4.0
            </a>
            )
          </p>
        </footer>
      </main>

      {/* <AudioTesterWrapper /> */}
    </div>
  )
}
