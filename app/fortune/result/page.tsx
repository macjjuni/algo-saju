"use client"

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import { Compass, Copy, Check, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Alert from '@/components/ui/alert'
import GlassPanel from '@/components/ui/glass-panel'
import { copyToClipboard } from '@/lib/utils'
import useFortuneStore from '@/store/useFortuneStore'
import useFortuneStream from '@/hooks/use-fortune-stream'

function highlightQuoted(children: ReactNode): ReactNode {
  return Array.isArray(children) ? children.map((child, i) => typeof child === 'string' ? highlightSingle(child, i) : child)
    : typeof children === 'string' ? highlightSingle(children, 0) : children
}

function highlightSingle(text: string, key: number): ReactNode {
  const parts = text.split(/('[^']+')/)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    part.startsWith("'") && part.endsWith("'")
      ? <span key={`${key}-${i}`} className="text-purple-400 font-semibold">{part}</span>
      : part
  )
}

export default function FortuneResultPage() {
  // region [Hooks]
  const result = useFortuneStore((s) => s.result)
  const streamingResult = useFortuneStore((s) => s.streamingResult)
  const loading = useFortuneStore((s) => s.loading)
  const encryptedData = useFortuneStore((s) => s.encryptedData)
  const error = useFortuneStore((s) => s.error)
  const clear = useFortuneStore((s) => s.clear)
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  useFortuneStream()
  // endregion

  // region [Privates]
  const displayText = result || streamingResult
  const isStreaming = loading && !!streamingResult
  const isComplete = !!result && !loading
  const hasPendingRequest = !!encryptedData
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (!displayText && !loading && !hasPendingRequest && !error) {
      router.replace('/category')
      return
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [displayText, loading, hasPendingRequest, error, router])
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
    if (isComplete && !confirm('페이지를 떠나면 분석 결과를 다시 확인할 수 없습니다. 이동하시겠습니까?')) return
    clear()
    router.push('/category')
  }
  // endregion

  if (!displayText && !loading && !hasPendingRequest && !error) return null

  if (error) {
    return (
      <GlassPanel>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <TriangleAlert className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-bold">분석 실패</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" className="w-full max-w-xs" onClick={handleCategory}>
            <Compass className="h-4 w-4" />
            돌아가기
          </Button>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel>
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-center">🔮 AI 분석 결과 🔮</h1>
        <Alert variant="warning" className="mb-6">
          <p>이 분석 결과는 1회성이며, 페이지를 이탈하면 다시 확인할 수 없습니다. 필요 시 결과를 복사해 보관해 주세요.</p>
        </Alert>
        <div className="rounded-xl border border-white/10 bg-white/5 max-sm:p-3 p-10">
          {displayText ? (
            <div className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-p:text-[16px] prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-[16px] prose-li:text-foreground/90">
              <Markdown components={{
                p: ({ children }) => <p>{highlightQuoted(children)}</p>,
                li: ({ children }) => <li>{highlightQuoted(children)}</li>,
                strong: ({ children }) => <strong>{highlightQuoted(children)}</strong>,
              }}>{displayText}</Markdown>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
                <span className="ml-2 text-sm">AI가 분석 중입니다...</span>
              </div>
            </div>
          )}
          {isStreaming && (
            <div className="mt-4 flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
            </div>
          )}
        </div>
        <Button variant="outline" className="mt-6 w-full h-10" onClick={handleCopy} disabled={!isComplete}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? '복사 완료' : '결과 복사하기'}
        </Button>
        <Button variant="outline" className="mt-2 w-full h-10" onClick={handleCategory} disabled={!isComplete}>
          <Compass className="h-4 w-4" />
          다른 운세 보기
        </Button>
      </div>
    </GlassPanel>
  )
}
