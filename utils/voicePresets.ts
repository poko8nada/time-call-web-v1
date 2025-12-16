/**
 * voicePresets.ts
 * FR-17: ハードコードされた推奨音声プリセット定義（優先度順）
 * - OSやブラウザの標準音声から厳選
 * - 音量調整が可能な音声のみを含む
 * - useSpeechSynthesis.ts でこのリストでフィルタリングと優先度選択を実施
 * - 配列の上から順がプライオリティを定義（最初の要素が最優先）
 *
 * 形式: { name: string, lang: string }
 */

export type VoicePreset = {
  name: string
  lang: string
}

/**
 * 推奨音声配列（ハードコード・優先度順）
 *
 * 各ブラウザ・OSから取得可能な良質な日本語音声を記載（上から順にプライオリティ）
 * useSpeechSynthesis.ts で getVoices() と照合してマッチングし、
 * マッチ結果の最初の要素が自動選択される
 */
export const VOICE_PRESETS: VoicePreset[] = [
  // Safari / macOS / iOS
  { name: 'Kyoko', lang: 'ja-JP' },
  { name: 'Hattori', lang: 'ja-JP' },

  // Microsoft Edge (Windows)
  {
    name: 'Microsoft Nanami Online (Natural) - Japanese (Japan)',
    lang: 'ja-JP',
  },
  {
    name: 'Microsoft Keita Online (Natural) - Japanese (Japan)',
    lang: 'ja-JP',
  },

  // Chrome/Edge (Google TTS)
  { name: 'Google 日本語', lang: 'ja-JP' },

  // Android Chrome
  { name: 'ja-jp-x-jfn-local', lang: 'ja-JP' },
  { name: 'ja-jp-x-jpm-local', lang: 'ja-JP' },

  // Firefox / Generic system voices
  { name: 'Reed (Japanese (Japan))', lang: 'ja-JP' },
  { name: 'Shelley (Japanese (Japan))', lang: 'ja-JP' },

  // Fallback: Generic Japanese voices
  { name: 'Japanese Female', lang: 'ja-JP' },
  { name: 'Japanese Male', lang: 'ja-JP' },
]

/**
 * プリセット音声でフィルタリング（優先度順を保持）
 *
 * @param voices - speechSynthesis.getVoices() から取得した全音声リスト
 * @returns プリセットにマッチした音声のみを返す（VOICE_PRESETS内の優先度順で返される）
 *
 * マッチング条件:
 * 1. 完全一致: name と lang が両方マッチ
 * 2. 部分一致: name が含まれている場合もマッチ（大文字小文字区別なし）
 *
 * 返却順序: VOICE_PRESETS配列の上から順でマッチした音声を返す（優先度順）
 * - 最初の要素 (filtered[0]) が useSpeechSynthesis.ts で自動選択される
 *
 * 例:
 * - getVoices() で "Google 日本語" が取得されたら、プリセット "Google 日本語" ja-JP にマッチ
 * - getVoices() で "Kyoko" が取得されたら、プリセット "Kyoko" ja-JP にマッチ
 */
export function filterVoicesByPresets(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
  if (voices.length === 0) return []

  // VOICE_PRESETS順序を保持するため、プリセットループで結果を集める
  const filtered: SpeechSynthesisVoice[] = []
  const seen = new Set<string>()

  for (const preset of VOICE_PRESETS) {
    for (const voice of voices) {
      // 既に追加済みならスキップ
      if (seen.has(`${voice.name}|${voice.lang}`)) continue

      // 完全一致
      if (voice.name === preset.name && voice.lang === preset.lang) {
        filtered.push(voice)
        seen.add(`${voice.name}|${voice.lang}`)
        continue
      }

      // 部分一致（name に preset.name を含む）
      if (voice.name.toLowerCase().includes(preset.name.toLowerCase())) {
        filtered.push(voice)
        seen.add(`${voice.name}|${voice.lang}`)
      }
    }
  }

  return filtered
}
