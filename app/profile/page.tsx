import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getProfiles } from '@/lib/profile-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileDeleteButton from '@/components/profile/profile-delete-button'
import GlassPanel from '@/components/ui/glass-panel'

export const metadata = {
  title: '프로필 관리 - algo-saju',
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
  if (!session?.backendToken) redirect('/login')

  const profiles = await getProfiles(session.backendToken)

  return (
    <GlassPanel>
      <div className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">프로필 관리</h1>
        <Button asChild>
          <Link href="/profile/new">새 프로필</Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">등록된 프로필이 없습니다.</p>
            <Button asChild className="mt-4">
              <Link href="/profile/new">프로필 만들기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {profile.name || '이름 없음'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatBirth(profile)} · {profile.gender === 'M' ? '남' : '여'} · {profile.cityName}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/profile/${profile.id}`}>수정</Link>
                  </Button>
                  <ProfileDeleteButton id={profile.id}/>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </GlassPanel>
  )
}
