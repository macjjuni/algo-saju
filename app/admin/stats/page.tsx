import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/api/admin";
import StatsCards from "@/components/feature/admin/stats-cards";
import StatsTable from "@/components/feature/admin/stats-table";

export default async function AdminStatsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  let stats = null;
  try {
    stats = session.backendToken ? await getAdminStats(session.backendToken) : null;
  } catch {
    // 백엔드 미구현 시 null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">통계 대시보드</h1>
      {stats ? (
        <>
          <StatsCards
            totalUsers={stats.totalUsers}
            totalProfiles={stats.totalProfiles}
            totalFortunes={stats.totalFortunes}
            todayFortunes={stats.todayFortunes}
          />
          <StatsTable dailyStats={stats.dailyStats} />
        </>
      ) : (
        <p className="text-muted-foreground">통계 데이터를 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>
      )}
    </div>
  );
}
