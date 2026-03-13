import { auth } from '@/lib/auth'
import { getMe } from '@/api/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import InfoCard from '@/components/feature/account/info-card'

export const metadata = {
  title: '회원정보',
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.backendToken) redirect('/login')

  const user = await getMe(session.backendToken)

  return (
    <div>
      <h1 className="mb-6 text-lg font-bold">회원정보</h1>
      <div className="space-y-4">
        {user.image && (
          <div className="flex justify-center my-8">
            <Image
              src={user.image}
              alt={user.name}
              width={124}
              height={124}
              className="rounded-full"
            />
          </div>
        )}
        <InfoCard label="이름" value={user.name} />
        <InfoCard label="이메일" value={user.email} />
        <InfoCard label="로그인 방식" value={user.provider === 'google' ? 'Google' : user.provider} />
        <InfoCard label="오늘의 무료 이용권" value={`${3 - user.usageCount} / 3`} />
      </div>
    </div>
  )
}
