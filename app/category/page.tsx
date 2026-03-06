import { auth } from '@/lib/auth'
import { getCategories } from '@/api/fortune'
import GlassPanel from '@/components/ui/glass-panel'
import CategoryGrid from '@/components/feature/fortune/category-grid'

export const metadata = {
  title: '운세 보기',
}

export default async function FortunePage() {
  const session = await auth()
  const categories = await getCategories(session!.backendToken!)

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

        <CategoryGrid categories={categories} />
      </div>
    </GlassPanel>
  )
}
