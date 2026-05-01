import Link from 'next/link'
import { ACTIVE_TOPIC } from '@/topic.config'

export function Navigation() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
          {ACTIVE_TOPIC.name}
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
          <Link href="/chat" className="hover:text-white transition-colors">AI Chat</Link>
          <Link href="/search" className="hover:text-white transition-colors">Search</Link>
          <Link
            href="/auth/login"
            className="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-orange-500 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}
