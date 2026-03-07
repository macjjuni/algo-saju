import Link from 'next/link'
import { icons } from 'lucide-react'
import { getCategories } from '@/api/fortune'
import GlassPanel from '@/components/ui/glass-panel'

export const metadata = {
  title: '운세 보기',
}

export default async function FortunePage() {
  const categories = await getCategories()

  return (
    <GlassPanel>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium rounded-full border border-white/10 bg-white/5 text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            AI 운세 분석
          </div>
          <h1 className="text-3xl font-bold mb-2">운세 카테고리</h1>
          <p className="text-sm text-white/50">원하는 카테고리를 선택해주세요</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-7 text-center font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Icon */}
              <span
                className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shadow-lg"
                style={{ backgroundColor: category.color ? `${category.color}22` : 'rgba(255,255,255,0.08)', boxShadow: category.color ? `0 0 16px ${category.color}33` : undefined }}
              >
                {(() => {
                  const LucideIcon = icons[category.icon as keyof typeof icons]
                  return LucideIcon ? <LucideIcon size={24} color={category.color || undefined} /> : '✨'
                })()}
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
      </div>
    </GlassPanel>
  )
}
