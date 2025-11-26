export default function Header() {
  return (
    <header className='w-full border-b py-4 px-6'>
      <div className='max-w-5xl mx-auto flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='rounded-full h-10 w-10 bg-slate-200 flex items-center justify-center font-bold text-sm'>
            TC
          </div>
          <div>
            <h1 className='text-lg font-semibold'>Time Call</h1>
            <p className='text-xs text-slate-500'>Minimal voice clock — MVP</p>
          </div>
        </div>

        <nav aria-label='main navigation'>
          <ul className='flex items-center gap-4 text-sm text-slate-700'>
            <li>Clock</li>
            <li>Timer</li>
            <li>Settings</li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
