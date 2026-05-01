'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBar({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search videos..."
        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-medium transition-colors"
      >
        Search
      </button>
    </form>
  )
}
