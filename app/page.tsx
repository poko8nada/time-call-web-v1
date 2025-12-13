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
 * - Responsive layout container (max-w-2xl)
 * - License attribution footer
 * - Dark mode support
 * - Accessibility: semantic HTML, sufficient contrast
 */
export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background p-4 sm:p-6'>
      <TimeCallService />

      {/* Footer - License Attribution */}
      <footer className='text-center text-xs text-secondary-600 dark:text-secondary-400 py-6 border-t border-secondary-200 dark:border-secondary-800 mt-8 sm:mt-12 w-full max-w-2xl'>
        <p className='text-responsive'>
          音源:{' '}
          <a
            href='https://otologic.jp'
            className='underline hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
            rel='external noopener noreferrer'
          >
            OtoLogic
          </a>{' '}
          ({' '}
          <a
            href='https://creativecommons.org/licenses/by/4.0/'
            className='underline hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
            rel='license noopener noreferrer'
          >
            CC BY 4.0
          </a>
          )
        </p>
      </footer>
    </div>
  )
}
