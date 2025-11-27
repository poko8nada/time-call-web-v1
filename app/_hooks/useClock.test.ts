import { act, cleanup, render } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClock } from './useClock'

/**
 * Test component to exercise the useClock hook without JSX (keeps file as .ts).
 * We render the seconds value so assertions remain stable and independent of timezone.
 */
function TestClock() {
  const { currentTime } = useClock()
  return React.createElement(
    'div',
    { 'data-testid': 'clock' },
    String(currentTime.getSeconds()),
  )
}

describe('useClock', () => {
  beforeEach(() => {
    // Use fake timers and set a deterministic system time
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0)) // 2023-01-01 12:00:00
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('updates every second', () => {
    const { getByTestId } = render(React.createElement(TestClock))
    const el = getByTestId('clock')

    // Initial second should be 0 (12:00:00)
    expect(el.textContent).toBe('0')

    // Advance time by 1 second and flush timers
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(el.textContent).toBe('1')

    // Advance another 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(el.textContent).toBe('3')
  })

  it('cleans up on unmount', () => {
    const clearSpy = vi.spyOn(window, 'clearTimeout')
    const { unmount } = render(React.createElement(TestClock))

    // Unmount should trigger cleanup and clear any active timeouts
    unmount()

    expect(clearSpy).toHaveBeenCalled()
  })
})
