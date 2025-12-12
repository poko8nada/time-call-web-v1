/**
 * voicePresets.ts
 *
 * 推奨音声プリセット定義
 *
 * FR-17: ハードコードされた推奨音声配列
 * - OSやブラウザの標準音声から厳選
 * - 音量調整が可能な音声のみを含む
 * - useSpeechSynthesis.ts でこのリストでフィルタリング
 *
 * プリセット音声マッピング:
 * - Google Chrome/Edge: "Google 日本語"
 * - Microsoft Edge (Windows): "Microsoft Haruka Desktop"
 * - Safari (macOS/iOS): "Kyoko" (built-in)
 * - Firefox (system voices): Various ja-JP voices
 *
 * 形式: { name: string, lang: string }
 */

export type VoicePreset = {
  name: string
  lang: string
}

/**
 * 推奨音声配列（ハードコード）
 *
 * 各ブラウザ・OSから取得可能な良質な日本語音声を記載
 * useSpeechSynthesis.ts で getVoices() と照合してマッチングする
 */
export const VOICE_PRESETS: VoicePreset[] = [
  // Chrome/Edge (Google TTS)
  { name: 'Google 日本語', lang: 'ja-JP' },

  // Microsoft Edge (Windows)
  { name: 'Microsoft Haruka Desktop', lang: 'ja-JP' },
  { name: 'Microsoft Haruka Online', lang: 'ja-JP' },

  // Safari / macOS / iOS
  { name: 'Kyoko', lang: 'ja-JP' },

  // Firefox / Generic system voices
  { name: 'Onna', lang: 'ja-JP' },
  { name: 'Otoko', lang: 'ja-JP' },

  // Android Chrome
  { name: 'ja-jp-x-jfn-local', lang: 'ja-JP' },
  { name: 'ja-jp-x-jpm-local', lang: 'ja-JP' },

  // Fallback: Generic Japanese voices
  { name: 'Japanese Female', lang: 'ja-JP' },
  { name: 'Japanese Male', lang: 'ja-JP' },
]

/**
 * プリセット音声でフィルタリング
 *
 * @param voices - speechSynthesis.getVoices() から取得した全音声リスト
 * @returns プリセットにマッチした音声のみを返す
 *
 * マッチング条件:
 * 1. 完全一致: name と lang が両方マッチ
 * 2. 部分一致: name が含まれている場合もマッチ（大文字小文字区別なし）
 *
 * 例:
 * - getVoices() で "Google 日本語" が取得されたら、プリセット "Google 日本語" ja-JP にマッチ
 * - getVoices() で "Kyoko" が取得されたら、プリセット "Kyoko" ja-JP にマッチ
 */
export function filterVoicesByPresets(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
  if (voices.length === 0) return []

  const filtered = voices.filter(voice => {
    return VOICE_PRESETS.some(preset => {
      // 完全一致
      if (voice.name === preset.name && voice.lang === preset.lang) {
        return true
      }

      // 部分一致（name に preset.name を含む）
      if (voice.name.toLowerCase().includes(preset.name.toLowerCase())) {
        return true
      }

      return false
    })
  })

  return filtered
}
