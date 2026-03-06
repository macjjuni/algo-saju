import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: '회원정보',
}

export default async function AccountPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">회원정보</h1>
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">이메일</p>
          <p className="text-sm font-medium">{session.user?.email ?? '-'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">이름</p>
          <p className="text-sm font-medium">{session.user?.name ?? '-'}</p>
        </div>
      </div>
    </div>
  )
}
