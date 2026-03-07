"use client"

import { memo } from 'react'
import Lottie from 'lottie-react'
import useFortuneStore from '@/store/useFortuneStore'
import aiAnimation from '@/public/lotties/ai.json'

export default memo(function FortuneLoadingOverlay() {
  // region [Hooks]
  const loading = useFortuneStore((s) => s.loading)
  // endregion

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-10 py-8 shadow-2xl backdrop-blur-md">
        <Lottie animationData={aiAnimation} loop className="h-40 w-40 -mt-6 -mb-4" />
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-lg font-semibold text-white">AI 분석 중</p>
          <p className="text-sm text-white/50">리포트를 작성하고 있습니다.</p>
        </div>
        <div className="flex items-center gap-1.5 pt-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
})
