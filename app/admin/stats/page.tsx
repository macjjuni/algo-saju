import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAdminStats, getTemplateStats } from "@/api/admin";
import type { AdminStats, CategoryStatItem } from "@/api/admin";
import StatsCards from "@/components/feature/admin/stats-cards";
import StatsChart from "@/components/feature/admin/stats-chart";
import TemplateStatsTable from "@/components/feature/admin/template-stats-table";

export default async function AdminStatsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  let stats: AdminStats | null = null;
  let templateStats: CategoryStatItem[] | null = null;
  try {
    if (session.backendToken) {
      [stats, templateStats] = await Promise.all([
        getAdminStats(session.backendToken),
        getTemplateStats(session.backendToken),
      ]);
    }
  } catch {
    // 백엔드 미구현 시 null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold mb-3">통계 대시보드</h1>
      {stats ? (
        <>
          <StatsCards
            totalUsers={stats.totalUsers}
            totalFortuneCalls={stats.totalFortuneCalls}
            todayFortuneCalls={stats.todayFortuneCalls}
          />
          <StatsChart dailyStats={stats.dailyStats ?? []} />
        </>
      ) : (
        <p className="text-muted-foreground">통계 데이터를 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>
      )}
      {templateStats && <TemplateStatsTable templateStats={templateStats} />}
    </div>
  );
}
