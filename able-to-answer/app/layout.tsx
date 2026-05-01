import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { ACTIVE_TOPIC } from '@/topic.config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: ACTIVE_TOPIC.name,
  description: ACTIVE_TOPIC.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
