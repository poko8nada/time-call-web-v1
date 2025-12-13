export function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <path d='M8 5v14l11-7z' />
    </svg>
  )
}

export function PauseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <rect x='6' y='4' width='4' height='16' />
      <rect x='14' y='4' width='4' height='16' />
    </svg>
  )
}
