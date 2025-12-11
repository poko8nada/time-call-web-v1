import { SettingsPanel } from '@/app/_components/SettingsPanel'
import { TestPlayButton } from '@/app/_components/TestPlayButton'
import { VoiceSelector } from '@/app/_components/VoiceSelector'
import { VolumeControl } from '@/app/_components/VolumeControl'
import type { Result } from '@/utils/types'

interface AudioSettingsProps {
  masterVolume: number
  setMasterVolume: (volume: number) => void
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void
  onSpeak: (text: string) => Promise<Result<void, string>>
}

export function AudioSettings({
  masterVolume,
  setMasterVolume,
  isSupported,
  voices,
  selectedVoice,
  onVoiceChange,
  onSpeak,
}: AudioSettingsProps) {
  return (
    <SettingsPanel>
      <VolumeControl
        volume={masterVolume}
        onChange={setMasterVolume}
        label='マスターボリューム'
        description='ビープ音と読み上げ音の両方に適用されます'
      />
      <div>
        <VoiceSelector
          voices={voices}
          selectedVoice={selectedVoice}
          onVoiceChange={onVoiceChange}
          isSupported={isSupported}
        />
        <TestPlayButton
          selectedVoice={selectedVoice}
          onSpeak={onSpeak}
          isSupported={isSupported}
        />
      </div>
    </SettingsPanel>
  )
}
