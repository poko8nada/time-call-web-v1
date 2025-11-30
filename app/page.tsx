import BeepTester from './_features/BeepTester'

const isDev = process.env.NODE_ENV === 'development'

export default function Home() {
  return (
    <div className='flex items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main>
        <div className='p-6'>
          <h1 className='text-lg font-bold mb-2'>Dev: Beep Tester</h1>
          {isDev && <BeepTester />}
        </div>
      </main>
    </div>
  )
}
