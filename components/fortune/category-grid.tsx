import Link from 'next/link'
import type { Category } from '@/api/fortune'

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/fortune/${category.id}`}
          className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-7 text-center font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* Icon */}
          <span
            className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shadow-lg"
            style={{ backgroundColor: category.color ? `${category.color}22` : 'rgba(255,255,255,0.08)', boxShadow: category.color ? `0 0 16px ${category.color}33` : undefined }}
          >
            {category.icon || '✨'}
          </span>

          {/* Title */}
          <span className="text-sm leading-tight">{category.title}</span>

          {/* Hover accent line */}
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-8"
            style={{ backgroundColor: category.color || 'rgba(255,255,255,0.4)' }}
          />
        </Link>
      ))}
    </div>
  )
}
