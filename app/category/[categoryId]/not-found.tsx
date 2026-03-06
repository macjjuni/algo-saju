import Link from 'next/link'
import GlassPanel from '@/components/ui/glass-panel'

export default function CategoryNotFound() {
  return (
    <GlassPanel>
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl border border-white/10 bg-white/5 text-4xl">
          🔮
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">존재하지 않는 카테고리</h1>
          <p className="text-sm text-white/50">
            해당 운세 카테고리를 찾을 수 없어요.
            <br />
            주소가 올바른지 확인하거나 다른 카테고리를 선택해 주세요.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/category"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20"
        >
          ← 운세 카테고리로 돌아가기
        </Link>
      </div>
    </GlassPanel>
  )
}
