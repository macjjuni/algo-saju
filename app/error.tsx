"use client"

import { useRouter } from 'next/navigation'
import GlassPanel from '@/components/ui/glass-panel'
import { Button } from '@/components/ui/button'

export default function GlobalError() {
  // region [Hooks]
  const router = useRouter()
  // endregion

  // region [Events]
  const handleRetry = () => {
    router.refresh()
  }
  // endregion

  return (
    <GlassPanel>
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl border border-white/10 bg-white/5 text-4xl">
          ⚠️
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
          <p className="text-sm text-white/50">
            일시적인 오류가 발생했어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>

        {/* CTA */}
        <Button variant="outline" onClick={handleRetry}>
          다시 시도하기
        </Button>
      </div>
    </GlassPanel>
  )
}
