"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import { Compass, Copy, Check, TriangleAlert } from 'lucide-react'
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

  // region [Life Cycles]
  useEffect(() => {
    if (!result) {
      router.replace('/category')
      return
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [result, router])
  // endregion

  // region [Events]
  const handleCopy = async () => {
    if (!result) return
    const success = await copyToClipboard(result)
    if (!success) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCategory = () => {
    if (!confirm('페이지를 떠나면 분석 결과를 다시 확인할 수 없습니다. 이동하시겠습니까?')) return
    clear()
    router.push('/category')
  }
  // endregion

  if (!result) return null

  return (
    <GlassPanel>
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold">분석 결과</h1>
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          <TriangleAlert className="h-4 w-4 mt-0.5 shrink-0" />
          <p>이 분석 결과는 1회성이며, 페이지를 이탈하면 다시 확인할 수 없습니다. 필요 시 결과를 복사해 보관해 주세요.</p>
        </div>
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
