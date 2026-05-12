import { useState, useEffect, useRef } from 'react'

export function useTypewriter(source: string, charsPerSec = 60) {
  const [displayed, setDisplayed] = useState('')
  const idxRef = useRef(0)
  const rafRef = useRef(0)
  const runningRef = useRef(false)
  const sourceRef = useRef(source)

  useEffect(() => {
    sourceRef.current = source
  })

  useEffect(() => {
    if (source.length < idxRef.current) {
      cancelAnimationFrame(rafRef.current)
      runningRef.current = false
      idxRef.current = 0
      rafRef.current = requestAnimationFrame(() => setDisplayed(''))
      return
    }

    if (idxRef.current >= source.length || runningRef.current) return

    runningRef.current = true
    let lastTs: number | null = null

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts
      const delta = Math.min(ts - lastTs, 100)
      lastTs = ts

      idxRef.current = Math.min(
        idxRef.current + Math.ceil((delta / 1000) * charsPerSec),
        sourceRef.current.length
      )
      setDisplayed(sourceRef.current.slice(0, idxRef.current))

      if (idxRef.current < sourceRef.current.length) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        runningRef.current = false
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [source, charsPerSec])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return displayed
}
