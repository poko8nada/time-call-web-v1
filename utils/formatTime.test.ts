import { describe, it, expect } from 'vitest'
import { formatDigitalTime, formatSpeechTime } from './formatTime'

describe('formatDigitalTime', () => {
  it('formats single-digit parts with leading zeros', () => {
    const d = new Date(2023, 0, 1, 9, 5, 3)
    expect(formatDigitalTime(d)).toBe('09:05:03')
  })

  it('formats midnight as 00:00:00', () => {
    const d = new Date(2023, 0, 1, 0, 0, 0)
    expect(formatDigitalTime(d)).toBe('00:00:00')
  })

  it('formats last second of the day as 23:59:59', () => {
    const d = new Date(2023, 0, 1, 23, 59, 59)
    expect(formatDigitalTime(d)).toBe('23:59:59')
  })

  it('throws TypeError for invalid Date', () => {
    // Invalid date
    expect(() => formatDigitalTime(new Date('invalid-date'))).toThrow(TypeError)
  })
})

describe('formatSpeechTime', () => {
  it('formats 9:05 as "9時5分です。"', () => {
    const d = new Date(2023, 0, 1, 9, 5, 0)
    expect(formatSpeechTime(d)).toBe('9時5分です。')
  })

  it('formats midnight as "0時0分です。"', () => {
    const d = new Date(2023, 0, 1, 0, 0, 0)
    expect(formatSpeechTime(d)).toBe('0時0分です。')
  })

  it('formats 23:59 as "23時59分です。"', () => {
    const d = new Date(2023, 0, 1, 23, 59, 30)
    expect(formatSpeechTime(d)).toBe('23時59分です。')
  })

  it('throws TypeError for invalid Date', () => {
    // Invalid date
    expect(() => formatSpeechTime(new Date('invalid-date'))).toThrow(TypeError)
  })
})
