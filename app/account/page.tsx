import { auth } from '@/lib/auth'
import { getMe } from '@/api/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const metadata = {
  title: '회원정보',
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.backendToken) redirect('/login')

  const user = await getMe(session.backendToken)

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">회원정보</h1>
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
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">이름</p>
          <p className="text-sm font-medium">{user.name}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">이메일</p>
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">로그인 방식</p>
          <p className="text-sm font-medium">{user.provider === 'google' ? 'Google' : user.provider}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">오늘의 무료 이용권</p>
          <p className="text-sm font-medium">{3 - user.usageCount} / 3</p>
        </div>
      </div>
    </div>
  )
}
