'use client'

import dynamic from 'next/dynamic'

const BeepTester = dynamic(() => import('../_components/BeepTester'), {
  ssr: false,
})

const isDev = process.env.NODE_ENV === 'development'

export default function BeepTesterWrapper() {
  if (!isDev) return null

  return (
    <div className='p-6'>
      <h1 className='text-lg font-bold mb-2'>Dev: Beep Tester</h1>
      <BeepTester />
    </div>
  )
}
