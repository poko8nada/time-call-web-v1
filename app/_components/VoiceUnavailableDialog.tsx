'use client'

interface VoiceUnavailableDialogProps {
  isOpen: boolean
}

export function VoiceUnavailableDialog({
  isOpen,
}: VoiceUnavailableDialogProps) {
  if (!isOpen) return null

  return (
    <div
      role="alertdialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
    >
      <div className='bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-sm mx-4'>
        <h2
          id="dialog-title"
          className='text-lg font-semibold text-foreground dark:text-foreground mb-3'
        >
          音声が利用できません
        </h2>
        <p
          id="dialog-description"
          className='text-sm text-gray-600 dark:text-gray-400'
        >
          申し訳ございません。ご使用のブラウザでは音声合成が利用できません。別のブラウザでお試しください。
        </p>
      </div>
    </div>
  )
}
