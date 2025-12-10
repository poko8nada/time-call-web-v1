'use client'

import { useEffect, useState } from 'react'

interface SettingsPanelProps {
  children?: React.ReactNode
}

/**
 * SettingsPanel
 *
 * Layout container for audio settings using composition pattern.
 * Children render directly without prop drilling.
 *
 * FR-11: 設定パネル
 * - Container for settings UI
 * - Composition pattern (children only)
 * - Hydration-safe rendering
 *
 * Usage:
 * <SettingsPanel>
 *   <VolumeControl ... />
 *   <VoiceSelector ... />
 *   <TestButton ... />
 * </SettingsPanel>
 */
export function SettingsPanel({ children }: SettingsPanelProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering client content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='w-full p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm'>
        <h2 className='text-lg font-bold text-foreground dark:text-foreground mb-6'>
          設定
        </h2>
        <div className='space-y-6' />
      </div>
    )
  }

  return (
    <div className='w-full p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm'>
      <h2 className='text-lg font-bold text-foreground dark:text-foreground mb-6'>
        設定
      </h2>

      <div className='space-y-6'>{children}</div>
    </div>
  )
}
