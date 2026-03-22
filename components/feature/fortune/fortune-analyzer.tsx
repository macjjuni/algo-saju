"use client";

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserRound, UserRoundPlus } from 'lucide-react'
import type { Profile } from '@/api/profile'
import type { BirthForm } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { encrypt } from '@/lib/crypto'
import { formatBirth } from '@/lib/format'
import useFortuneStore from '@/store/useFortuneStore'

interface FortuneAnalyzerProps {
  profiles: Profile[]
  templateId: number
  isSolo: boolean
  onAnalyzeStart?: () => void
}

const MAX_DUO_PROFILES = 2

export default function FortuneAnalyzer({ profiles, templateId, isSolo, onAnalyzeStart }: FortuneAnalyzerProps) {
  // region [Hooks]
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    isSolo && profiles.length === 1 ? profiles[0].id : null
  )
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([])
  const setLoading = useFortuneStore((s) => s.setLoading)
  const setStreamRequest = useFortuneStore((s) => s.setStreamRequest)
  const loading = useFortuneStore((s) => s.loading)
  const router = useRouter()
  const lastAnalyzeTime = useRef(0)
  // endregion

  // region [Privates]
  const isSelected = (id: string) => {
    if (isSolo) return selectedProfileId === id
    return selectedProfileIds.includes(id)
  }

  const canAnalyze = isSolo
    ? !!selectedProfileId
    : selectedProfileIds.length === MAX_DUO_PROFILES

  const profileToBirthForm = (profile: Profile): BirthForm => ({
    year: profile.year,
    month: profile.month,
    day: profile.day,
    hour: profile.hour,
    minute: profile.minute,
    gender: profile.gender,
    unknownTime: profile.unknownTime,
    latitude: profile.latitude,
    longitude: profile.longitude,
    cityName: profile.cityName,
  })
  // endregion

  // region [Events]
  const handleSelectSolo = (id: string) => {
    setSelectedProfileId(id)
  }

  const handleSelectDuo = (id: string) => {
    setSelectedProfileIds((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id)
      if (prev.length >= MAX_DUO_PROFILES) return prev
      return [...prev, id]
    })
  }

  const handleSelect = (id: string) => {
    if (isSolo) handleSelectSolo(id)
    else handleSelectDuo(id)
  }

  const handleAnalyze = async () => {
    const now = Date.now()
    if (now - lastAnalyzeTime.current < 3000) return
    lastAnalyzeTime.current = now

    const ids = isSolo ? (selectedProfileId ? [selectedProfileId] : []) : selectedProfileIds
    if (ids.length === 0) return

    const birthForms = ids
      .map((id) => profiles.find((p) => p.id === id))
      .filter((p): p is Profile => !!p)
      .map((p) => profileToBirthForm(p))

    onAnalyzeStart?.()

    const encryptedData = await encrypt(JSON.stringify(birthForms))
    setStreamRequest(encryptedData, templateId)
    setLoading(true)
    router.push('/fortune/result')
  }
  // endregion

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <UserRoundPlus className="h-8 w-8 text-muted-foreground/60"/>
        </div>
        <div className="space-y-1">
          <p className="font-medium">등록된 프로필이 없습니다</p>
          <p className="text-sm text-muted-foreground">운세 분석을 위해 프로필을 먼저 추가해 주세요.</p>
        </div>
        <Button asChild className="mt-2">
          <Link href="/profile/new">
            <UserRoundPlus className="h-4 w-4"/>
            프로필 추가하기
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          <span className="text-sm font-normal text-muted-foreground">
            ({isSolo ? (selectedProfileId ? 1 : 0) : selectedProfileIds.length}/{isSolo ? 1 : MAX_DUO_PROFILES})
          </span>
        </h2>
        <div className="space-y-2">
          {profiles.map((profile) => {
            const selected = isSelected(profile.id)
            const disabledDuo = !isSolo && !selected && selectedProfileIds.length >= MAX_DUO_PROFILES

            return (
              <Button
                key={profile.id}
                variant="ghost"
                onClick={() => handleSelect(profile.id)}
                disabled={disabledDuo}
                className={`flex w-full h-auto items-center gap-4 rounded-xl border px-4 py-3 text-left ${
                  selected
                    ? 'border-white/70 bg-white/15 hover:bg-white/15'
                    : disabledDuo
                      ? 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  selected ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <UserRound className="h-5 w-5 text-muted-foreground"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{profile.name || '이름 없음'}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatBirth(profile)} · {profile.gender === 'M' ? '남' : '여'} · {profile.cityName}
                  </p>
                </div>
                {!isSolo && selected && (
                  <span className="shrink-0 text-xs font-medium text-white/70">
                    {selectedProfileIds.indexOf(profile.id) + 1}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="w-full border-0" asChild>
          <Link href="/profile/new">
            <UserRoundPlus className="h-4 w-4"/>
            프로필 등록
          </Link>
        </Button>

        <Button
          className="w-full"
          disabled={!canAnalyze || loading}
          onClick={handleAnalyze}
        >
          {loading ? '분석 중...' : '분석하기'}
        </Button>
      </div>

    </div>
  )
}
