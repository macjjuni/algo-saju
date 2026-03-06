"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import { ArrowLeft, Compass, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GlassPanel from '@/components/ui/glass-panel'
import { copyToClipboard } from '@/lib/utils'
import useFortuneStore from '@/store/useFortuneStore'

export default function FortuneResultPage() {
  // region [Hooks]
  const result = useFortuneStore((s) => s.result)
  const clear = useFortuneStore((s) => s.clear)
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  // endregion

  // region [Events]
  const handleCopy = async () => {
    if (!result) return
    const success = await copyToClipboard(result)
    if (!success) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold">분석 결과</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-5">
          <div className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
            <Markdown>{result}</Markdown>
          </div>
        </div>
        <Button variant="outline" className="mt-6 w-full" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? '복사 완료' : '결과 복사하기'}
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={handleCategory}>
          <Compass className="h-4 w-4" />
          다른 운세 보기
        </Button>
      </div>
    </GlassPanel>
  )
}
