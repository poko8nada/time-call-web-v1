import { describe, expect, it } from 'vitest'
import { calculateNextCallTime } from './useTimeCallTimer'

describe('calculateNextCallTime', () => {
  it('calculates next 5-minute multiple when current time is 10:23:45', () => {
    const current = new Date(2024, 0, 1, 10, 23, 45)
    const { callTime, beepTime } = calculateNextCallTime(current, 5)

    expect(callTime.getHours()).toBe(10)
    expect(callTime.getMinutes()).toBe(25)
    expect(callTime.getSeconds()).toBe(0)
    expect(callTime.getMilliseconds()).toBe(0)

    expect(beepTime.getMinutes()).toBe(24)
    expect(beepTime.getSeconds()).toBe(55)
  })

  it('moves to next interval when already on boundary (10:25:00)', () => {
    const current = new Date(2024, 0, 1, 10, 25, 0)
    const { callTime } = calculateNextCallTime(current, 5)

    expect(callTime.getMinutes()).toBe(30)
    expect(callTime.getSeconds()).toBe(0)
  })

  it('calculates next hour boundary for 60-min interval', () => {
    const current = new Date(2024, 0, 1, 10, 30, 0)
    const { callTime } = calculateNextCallTime(current, 60)

    expect(callTime.getHours()).toBe(11)
    expect(callTime.getMinutes()).toBe(0)
    expect(callTime.getSeconds()).toBe(0)
  })

  it('calculates next minute for 1-min interval', () => {
    const current = new Date(2024, 0, 1, 10, 23, 45)
    const { callTime } = calculateNextCallTime(current, 1)

    expect(callTime.getMinutes()).toBe(24)
    expect(callTime.getSeconds()).toBe(0)
  })

  it('calculates next 15-min boundary', () => {
    const current = new Date(2024, 0, 1, 10, 23, 45)
    const { callTime } = calculateNextCallTime(current, 15)

    expect(callTime.getMinutes()).toBe(30)
    expect(callTime.getSeconds()).toBe(0)
  })

  it('calculates next 10-min boundary', () => {
    const current = new Date(2024, 0, 1, 10, 23, 45)
    const { callTime } = calculateNextCallTime(current, 10)

    expect(callTime.getMinutes()).toBe(30)
    expect(callTime.getSeconds()).toBe(0)
  })

  it('beep time is always 5 seconds before call time', () => {
    const current = new Date(2024, 0, 1, 10, 23, 45)
    const { callTime, beepTime } = calculateNextCallTime(current, 5)

    const diffMs = callTime.getTime() - beepTime.getTime()
    expect(diffMs).toBe(5000)
  })

  it('preserves milliseconds to 0 in call time', () => {
    const current = new Date(2024, 0, 1, 10, 23, 45, 999)
    const { callTime } = calculateNextCallTime(current, 5)

    expect(callTime.getMilliseconds()).toBe(0)
  })
})
