import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAdminUsers, type AdminUsersResponse } from "@/api/admin";
import { ApiError } from "@/lib/api-client";
import UserSearchForm from "@/components/feature/admin/user-search-form";
import UserList from "@/components/feature/admin/user-list";

const DEFAULT_PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE));
  const search = params.search || "";

  let data: AdminUsersResponse | null = null;
  let error = "";
  try {
    if (session.backendToken) {
      data = await getAdminUsers(session.backendToken, { page, pageSize, search });
    }
  } catch (err) {
    error = err instanceof ApiError ? err.message : "사용자 데이터를 불러올 수 없습니다.";
  }
  console.log(data)
  const users = data?.users ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">사용자 관리</h1>
        {data && (
          <span className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{totalCount.toLocaleString("ko-KR")}</span>명
          </span>
        )}
      </div>
      <UserSearchForm defaultSearch={search} />
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : data ? (
        <UserList users={users} totalCount={totalCount} page={page} pageSize={pageSize} search={search} />
      ) : (
        <p className="text-muted-foreground">사용자 데이터를 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>
      )}
    </div>
  );
}
