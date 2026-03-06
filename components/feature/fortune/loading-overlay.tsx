"use client"

import Lottie from 'lottie-react'
import useFortuneStore from '@/store/useFortuneStore'
import aiAnimation from '@/public/lotties/ai.json'

export default function FortuneLoadingOverlay() {
  // region [Hooks]
  const loading = useFortuneStore((s) => s.loading)
  // endregion

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      <Lottie animationData={aiAnimation} loop className="h-40 w-40" />
      <p className="mt-2 text-lg font-medium text-white">분석 중...</p>
    </div>
  )
}
