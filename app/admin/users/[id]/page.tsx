import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/api/admin";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;

  let user = null;
  try {
    user = session.backendToken ? await getAdminUser(session.backendToken, id) : null;
  } catch {
    // 백엔드 미구현 시 null
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        사용자 목록
      </Link>

      {user ? (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">{user.name}</h1>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">이메일</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">프로필 수</dt>
              <dd>{user.profileCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">운세 분석 수</dt>
              <dd>{user.fortuneCount}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">가입일</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString("ko-KR")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">마지막 로그인</dt>
              <dd>{new Date(user.lastLoginAt).toLocaleDateString("ko-KR")}</dd>
            </div>
          </dl>

          {user.profiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">프로필 목록</h2>
              <ul className="space-y-1 text-sm">
                {user.profiles.map((profile) => (
                  <li key={profile.id} className="flex justify-between py-1 border-b border-white/5">
                    <span>{profile.name}</span>
                    <span className="text-muted-foreground">{new Date(profile.createdAt).toLocaleDateString("ko-KR")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">사용자 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
