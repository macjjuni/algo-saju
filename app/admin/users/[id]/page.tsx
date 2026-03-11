import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAdminUser, type AdminUserDetail } from "@/api/admin";
import { ApiError } from "@/lib/api-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;

  let user: AdminUserDetail | null = null;
  let error = "";
  try {
    if (session.backendToken) {
      user = await getAdminUser(session.backendToken, id);
    }
  } catch (err) {
    error = err instanceof ApiError
      ? err.status === 404 ? "존재하지 않는 사용자입니다." : err.message
      : "사용자 정보를 불러올 수 없습니다.";
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        사용자 목록
      </Link>

      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : user ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {user.image && (
              <img src={user.image} alt="" className="h-10 w-10 rounded-full" />
            )}
            <div>
              <h1 className="text-xl font-bold">{user.name || "-"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <dt className="text-xs text-muted-foreground">로그인 방식</dt>
              <dd className="text-lg font-semibold">{user.provider}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <dt className="text-xs text-muted-foreground">운세 분석 수</dt>
              <dd className="text-lg font-semibold">{user.totalFortuneCount ?? 0}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <dt className="text-xs text-muted-foreground">이용 횟수</dt>
              <dd className="text-lg font-semibold">{user.usageCount ?? 0}</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <dt className="text-xs text-muted-foreground">가입일</dt>
              <dd className="text-lg font-semibold">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ko-KR") : "-"}
              </dd>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            마지막 활동: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("ko-KR") : "-"}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">사용자 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
