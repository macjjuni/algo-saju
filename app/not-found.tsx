import Link from 'next/link'
import GlassPanel from '@/components/ui/glass-panel'

export default function NotFound() {
  return (
    <GlassPanel>
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl border border-white/10 bg-white/5 text-4xl">
          🔭
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
          <p className="text-sm text-white/50">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있어요.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </GlassPanel>
  )
}
