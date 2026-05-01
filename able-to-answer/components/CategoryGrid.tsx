import Link from 'next/link'

export function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-orange-500 hover:bg-gray-800 transition-all group"
        >
          <div className="text-2xl mb-2">{cat.icon}</div>
          <div className="text-sm font-medium group-hover:text-orange-400 transition-colors">
            {cat.name}
          </div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</div>
        </Link>
      ))}
    </div>
  )
}
