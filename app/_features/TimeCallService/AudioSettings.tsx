import { SettingsPanel } from '@/app/_components/SettingsPanel'
import { TestPlayButton } from '@/app/_components/TestPlayButton'
import { VoiceSelector } from '@/app/_components/VoiceSelector'
import { VolumeControl } from '@/app/_components/VolumeControl'
import type { Result } from '@/utils/types'

interface AudioSettingsProps {
  masterVolume: number
  onSetMasterVolume: (volume: number) => void
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void
  onPlaySpeech: (text: string) => Promise<Result<void, string>>
}

export function AudioSettings({
  masterVolume,
  onSetMasterVolume,
  isSupported,
  voices,
  selectedVoice,
  onVoiceChange,
  onPlaySpeech,
}: AudioSettingsProps) {
  return (
    <SettingsPanel>
      <VolumeControl
        masterVolume={masterVolume}
        onSetMasterVolume={onSetMasterVolume}
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
          onPlaySpeech={onPlaySpeech}
          isSupported={isSupported}
        />
      </div>
    </SettingsPanel>
  )
}
