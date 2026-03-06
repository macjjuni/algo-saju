import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import WithdrawButton from '@/components/feature/account/withdraw-button'

export const metadata = {
  title: '회원탈퇴',
}

export default async function WithdrawPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">회원탈퇴</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <WithdrawButton />
      </div>
    </div>
  )
}
