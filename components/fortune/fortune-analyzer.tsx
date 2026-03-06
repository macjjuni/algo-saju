"use client";

import { useState } from 'react'
import { UserRound } from 'lucide-react'
import type { Profile } from '@/api/profile'
import { Button } from '@/components/ui/button'
import { analyzeFortuneAction } from '@/app/category/[categoryId]/[templateId]/actions'

interface FortuneAnalyzerProps {
  profiles: Profile[]
  templateId: number
}

function formatBirth(p: Profile) {
  const date = `${p.year}.${String(p.month).padStart(2, '0')}.${String(p.day).padStart(2, '0')}`
  if (p.unknownTime) return `${date} (시간 미상)`
  return `${date} ${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

export default function FortuneAnalyzer({ profiles, templateId }: FortuneAnalyzerProps) {
  // region [Hooks]
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    profiles.length === 1 ? profiles[0].id : null
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // endregion

  // region [Events]
  const handleAnalyze = async () => {
    if (!selectedProfileId) return
    setLoading(true)
    setError(null)
    setResult(null)

    const res = await analyzeFortuneAction(selectedProfileId, templateId)
    setLoading(false)

    if ('error' in res) {
      setError(res.error)
    } else {
      setResult(res.result)
    }
  }
  // endregion

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <UserRound className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">등록된 프로필이 없습니다.</p>
        <Button asChild className="mt-2">
          <a href="/profile/new">프로필 만들기</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold">프로필 선택</h2>
        <div className="space-y-2">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setSelectedProfileId(profile.id)}
              className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                selectedProfileId === profile.id
                  ? 'border-white/40 bg-white/15'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <UserRound className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.name || '이름 없음'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatBirth(profile)} · {profile.gender === 'M' ? '남' : '여'} · {profile.cityName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button
        className="w-full"
        disabled={!selectedProfileId || loading}
        onClick={handleAnalyze}
      >
        {loading ? '분석 중...' : '분석하기'}
      </Button>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-5">
          <h2 className="mb-3 text-lg font-semibold">분석 결과</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{result}</p>
        </div>
      )}
    </div>
  )
}
