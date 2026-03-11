import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAdminUsers } from "@/api/admin";
import UserSearchForm from "@/components/feature/admin/user-search-form";
import UserList from "@/components/feature/admin/user-list";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  let data = null;
  try {
    data = session.backendToken ? await getAdminUsers(session.backendToken, { page, search }) : null;
  } catch {
    // 백엔드 미구현 시 null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">사용자 관리</h1>
      <UserSearchForm defaultSearch={search} />
      {data?.items ? (
        <UserList users={data.items} total={data.total ?? 0} page={data.page ?? 1} pageSize={data.pageSize ?? 20} />
      ) : (
        <p className="text-muted-foreground">사용자 데이터를 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>
      )}
    </div>
  );
}
