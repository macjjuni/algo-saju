import { useState, useCallback } from 'react'
import { copyToClipboard } from '@/lib/utils'

export function useCopy(resetDelay = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string): Promise<boolean> => {
    const success = await copyToClipboard(text)
    if (!success) return false
    setCopied(true)
    setTimeout(() => setCopied(false), resetDelay)
    return true
  }, [resetDelay])

  return { copied, copy }
}
