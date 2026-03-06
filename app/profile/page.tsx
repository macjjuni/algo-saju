import Link from 'next/link'
import { UserRound, Pencil } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getProfiles } from '@/api/profile'
import { Button } from '@/components/ui/button'
import ProfileDeleteButton from '@/components/feature/profile/profile-delete-button'
import GlassPanel from '@/components/ui/glass-panel'

export const metadata = {
  title: '프로필 관리',
}

function formatBirth(p: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  unknownTime: boolean
}) {
  const date = `${p.year}.${String(p.month).padStart(2, '0')}.${String(p.day).padStart(2, '0')}`
  if (p.unknownTime) return `${date} (시간 미상)`
  return `${date} ${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

export default async function ProfileListPage() {
  const session = await auth()
  const profiles = await getProfiles(session!.backendToken!)

  return (
    <GlassPanel>
      <div className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">프로필 관리</h1>
        <Button asChild>
          <Link href="/profile/new">프로필 추가</Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <UserRound className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">등록된 프로필이 없습니다.</p>
          <Button asChild className="mt-2">
            <Link href="/profile/new">프로필 만들기</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <UserRound className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.name || '이름 없음'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatBirth(profile)} · {profile.gender === 'M' ? '남' : '여'} · {profile.cityName}
                </p>
              </div>
              <div className="flex items-center shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/profile/${profile.id}`}><Pencil className="h-4 w-4" /></Link>
                </Button>
                <ProfileDeleteButton id={profile.id}/>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </GlassPanel>
  )
}
