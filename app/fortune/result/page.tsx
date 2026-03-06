"use client"

import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GlassPanel from '@/components/ui/glass-panel'
import useFortuneStore from '@/store/useFortuneStore'

export default function FortuneResultPage() {
  // region [Hooks]
  const result = useFortuneStore((s) => s.result)
  const clear = useFortuneStore((s) => s.clear)
  const router = useRouter()
  // endregion

  // region [Events]
  const handleBack = () => {
    clear()
    router.back()
  }

  const handleCategory = () => {
    clear()
    router.push('/category')
  }
  // endregion

  if (!result) {
    return (
      <GlassPanel>
        <div className="max-w-xl mx-auto flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">분석 결과가 없습니다.</p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel>
      <div className="max-w-xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold">분석 결과</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-5">
          <div className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
            <Markdown>{result}</Markdown>
          </div>
        </div>
        <Button variant="outline" className="mt-6 w-full" onClick={handleCategory}>
          <Compass className="h-4 w-4" />
          다른 운세 보기
        </Button>
      </div>
    </GlassPanel>
  )
}
