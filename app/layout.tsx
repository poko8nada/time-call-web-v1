import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
// import Footer from '../components/Footer
// import Header from '../components/Header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Time Call',
    template: '%s · Time Call',
  },
  description:
    'Time Call — a minimal, accessible web clock that speaks the time, provides beeps and timers. Lightweight and testable for MVP.',
  keywords: ['time', 'clock', 'voice', 'timer', 'accessible', 'minimal'],
  authors: [{ name: 'poko8nada' }],
  openGraph: {
    title: 'Time Call — Minimal voice clock',
    description:
      'A lightweight web app that announces the time and provides configurable timers with simple, accessible UI.',
    siteName: 'Time Call',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Time Call preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Call',
    description:
      'Minimal accessible hour announcements, beeps and timers — Time Call',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/*<Header />*/}

        <main className='flex-1 w-full py-8 px-6'>
          <div className='max-w-5xl mx-auto'>{children}</div>
        </main>

        {/*<Footer />*/}
      </body>
    </html>
  )
}
