import { useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import useFortuneStore from '@/store/useFortuneStore'

const ERROR_MESSAGES: Record<string, string> = {
  TOO_MANY_REQUESTS: '오늘의 분석 횟수를 모두 사용했습니다. 자정에 초기화됩니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
}

export default function useFortuneStream() {
  // region [Hooks]
  const encryptedData = useFortuneStore((s) => s.encryptedData)
  const templateId = useFortuneStore((s) => s.templateId)
  const appendChunk = useFortuneStore((s) => s.appendChunk)
  const completeStream = useFortuneStore((s) => s.completeStream)
  const setLoading = useFortuneStore((s) => s.setLoading)
  const setError = useFortuneStore((s) => s.setError)
  const startedRef = useRef(false)
  // endregion

  // region [Privates]
  const getErrorMessage = (code?: string, fallback?: string) => {
    if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code]
    return fallback ?? '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (!encryptedData || !templateId || startedRef.current) return
    startedRef.current = true
    setLoading(true)

    const controller = new AbortController()

    async function startStream() {
      try {
        const res = await fetch('/api/fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedData, templateId }),
          signal: controller.signal,
        })

        if (!res.ok) {
          if (res.status === 401) {
            signIn('google')
            return
          }
          const errorBody = await res.json().catch(() => null)
          setError(getErrorMessage(errorBody?.code, errorBody?.message))
          return
        }

        const reader = res.body?.getReader()
        if (!reader) {
          setError('스트림 응답을 받을 수 없습니다.')
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data) as { chunk?: string; done?: boolean; error?: string }
              if (parsed.error) {
                setError(getErrorMessage(undefined, parsed.error))
                return
              }
              if (parsed.done) {
                completeStream()
                return
              }
              if (parsed.chunk) {
                appendChunk(parsed.chunk)
              }
            } catch {
              appendChunk(data)
            }
          }
        }

        completeStream()
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        console.error('Fortune stream error:', err)
        setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }

    startStream()

    return () => {
      controller.abort()
    }
  }, [encryptedData, templateId, appendChunk, completeStream, setLoading, setError])
  // endregion
}
