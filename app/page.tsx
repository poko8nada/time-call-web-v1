import { TimeCallService } from '@/app/_features/TimeCallService'

/**
 * Home Page
 *
 * Server Component that composes the time call service UI.
 * TimeCallService is a Client Component that manages all state and interactivity.
 *
 * FR-12: トップページ
 * - Server Component (default)
 * - Renders TimeCallService
 * - Responsive layout container
 * - License attribution footer
 */
export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black p-4'>
      <TimeCallService />

      {/* Footer - License Attribution */}
      <footer className='text-center text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-zinc-800 mt-8 w-full max-w-2xl'>
        <p>
          音源:{' '}
          <a
            href='https://otologic.jp'
            className='underline hover:text-gray-700 dark:hover:text-gray-300'
          >
            OtoLogic
          </a>{' '}
          ({' '}
          <a
            href='https://creativecommons.org/licenses/by/4.0/'
            className='underline hover:text-gray-700 dark:hover:text-gray-300'
          >
            CC BY 4.0
          </a>
          )
        </p>
      </footer>
    </div>
  )
}
