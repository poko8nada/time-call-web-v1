'use client'

import { useCallback, useState } from 'react'
import { useClock } from '../_hooks/useClock'
import { useTimeCallTimer } from '../_hooks/useTimeCallTimer'

/**
 * Dev-only TimeCallTester component
 *
 * - Manual browser testing for useTimeCallTimer hook
 * - Displays current time, next call time, interval selection, start/stop controls
 * - Shows debug info for beep and speech triggers
 * - TODO: remove before production or gate behind dev-only flag
 */
export default function TimeCallTester() {
  const { currentTime } = useClock()
  const { isRunning, interval, setInterval, start, stop, nextCallTime } =
    useTimeCallTimer()

  const [debugLog, setDebugLog] = useState<string[]>([])

  const intervals = [1, 5, 10, 15, 30, 60]

  const handleStart = useCallback(() => {
    start()
    setDebugLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Started with interval ${interval}min`,
    ])
  }, [start, interval])

  const handleStop = useCallback(() => {
    stop()
    setDebugLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Stopped`,
    ])
  }, [stop])

  const handleIntervalChange = useCallback(
    (newInterval: number) => {
      setInterval(newInterval)
      setDebugLog(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Interval changed to ${newInterval}min`,
      ])
    },
    [setInterval],
  )

  const formatTimeForDisplay = (date: Date): string => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  }

  const getTimeUntilNextCall = (): string => {
    if (!nextCallTime) return '—'
    const diff = nextCallTime.getTime() - currentTime.getTime()
    if (diff <= 0) return '0s'
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const getTimeUntilBeep = (): string => {
    if (!nextCallTime) return '—'
    const beepTime = new Date(nextCallTime)
    beepTime.setSeconds(beepTime.getSeconds() - 5)
    const diff = beepTime.getTime() - currentTime.getTime()
    if (diff <= 0) return '0s'
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  return (
    <section
      aria-label='time-call-tester'
      className='p-4 rounded-md bg-white shadow-sm border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800'
      style={{ maxWidth: 500 }}
    >
      <h3 className='text-sm font-semibold mb-4'>
        Time Call Timer Tester (dev)
      </h3>

      {/* Current Time and Status */}
      <div className='mb-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded'>
        <div className='text-xs text-gray-600 dark:text-gray-400 mb-2'>
          <span>Current Time: </span>
          <span className='font-mono font-semibold'>
            {formatTimeForDisplay(currentTime)}
          </span>
        </div>
        <div className='text-xs text-gray-600 dark:text-gray-400'>
          <span>Status: </span>
          <span className='font-semibold'>
            {isRunning ? '🟢 Running' : '⏹️ Stopped'}
          </span>
        </div>
      </div>

      {/* Next Call Time Info */}
      <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800'>
        <div className='text-xs text-blue-700 dark:text-blue-300 mb-1'>
          <span>Next Call Time: </span>
          <span className='font-mono font-semibold'>
            {nextCallTime ? formatTimeForDisplay(nextCallTime) : '—'}
          </span>
        </div>
        <div className='text-xs text-blue-700 dark:text-blue-300 mb-1'>
          <span>Time until call: </span>
          <span className='font-mono'>{getTimeUntilNextCall()}</span>
        </div>
        <div className='text-xs text-blue-700 dark:text-blue-300'>
          <span>Time until beep (5s before): </span>
          <span className='font-mono'>{getTimeUntilBeep()}</span>
        </div>
      </div>

      {/* Interval Selection */}
      <div className='mb-4'>
        <p className='block text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold'>
          Interval (minutes)
        </p>
        <div className='flex flex-wrap gap-2'>
          {intervals.map(min => (
            <button
              key={min}
              type='button'
              onClick={() => handleIntervalChange(min)}
              disabled={isRunning}
              className={`px-3 py-1 text-sm rounded transition ${
                interval === min
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`set interval to ${min} minutes`}
            >
              {min}
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className='flex gap-2 mb-4'>
        <button
          type='button'
          onClick={handleStart}
          disabled={isRunning}
          className='px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
          aria-label='start timer'
        >
          Start
        </button>
        <button
          type='button'
          onClick={handleStop}
          disabled={!isRunning}
          className='px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
          aria-label='stop timer'
        >
          Stop
        </button>
      </div>

      {/* Debug Log */}
      <div className='mb-2'>
        <p className='block text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold'>
          Debug Log
        </p>
        <div className='bg-gray-900 dark:bg-black p-3 rounded font-mono text-xs text-green-400 max-h-32 overflow-y-auto'>
          {debugLog.length === 0 ? (
            <div className='text-gray-500'>No events yet...</div>
          ) : (
            debugLog.map((log, idx) => <div key={`${idx}-${log}`}>{log}</div>)
          )}
        </div>
      </div>

      <div className='mt-3 text-xs text-gray-500 dark:text-gray-500'>
        <p>Note: temporary developer tool. Remove or hide before release.</p>
      </div>
    </section>
  )
}
