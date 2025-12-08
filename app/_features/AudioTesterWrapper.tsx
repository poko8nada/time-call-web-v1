'use client'

import dynamic from 'next/dynamic'

const BeepTester = dynamic(() => import('../_components/BeepTester'), {
  ssr: false,
})

const SpeechTester = dynamic(() => import('../_components/SpeechTester'), {
  ssr: false,
})

const isDev = process.env.NODE_ENV === 'development'

export default function AudioTesterWrapper() {
  if (!isDev) return null

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-xl font-bold mb-4'>Dev: Audio Testers</h1>

      <div className='space-y-4'>
        <BeepTester />
        <SpeechTester />
      </div>

      <div className='text-xs text-gray-500 dark:text-gray-400 mt-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700'>
        <p className='font-semibold mb-2'>Development Tools</p>
        <ul className='list-disc list-inside space-y-1'>
          <li>Test beep sound playback and volume control</li>
          <li>Test speech synthesis with different voices</li>
          <li>Verify audio components work before integration</li>
          <li>These components are hidden in production builds</li>
        </ul>
      </div>
    </div>
  )
}
