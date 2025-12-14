/**
 * time-call-web-v1/utils/audioContext.ts
 *
 * Web Audio API helper
 *
 * - getAudioContext(): returns a singleton AudioContext instance
 * - resumeAudioContext(): resumes AudioContext if it's suspended (use after user gesture)
 *
 * FR-06: Web Audio API初期化ヘルパー（Browser only）
 */

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

let audioContextInstance: AudioContext | null = null

/**
 * Returns a singleton AudioContext instance.
 * Throws when not in a browser environment or when Web Audio API is unsupported.
 */
export function getAudioContext(): AudioContext {
  if (typeof window === 'undefined') {
    throw new Error('getAudioContext: must be called in a browser environment')
  }

  const AudioCtor = window.AudioContext ?? window.webkitAudioContext
  if (!AudioCtor) {
    throw new Error(
      'getAudioContext: Web Audio API is not supported in this environment',
    )
  }

  if (audioContextInstance) {
    return audioContextInstance
  }

  audioContextInstance = new AudioCtor()
  return audioContextInstance
}

/**
 * Resumes the AudioContext if it is suspended.
 * Safe to call multiple times; it will no-op if the context is already running.
 */
export async function resumeAudioContext(): Promise<void> {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}

/**
 * Close the current AudioContext if one exists.
 * After closing, the singleton reference is cleared.
 */
export async function closeAudioContext(): Promise<void> {
  if (!audioContextInstance) return
  try {
    await audioContextInstance.close()
  } finally {
    audioContextInstance = null
  }
}
