import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAnnouncements } from "@/services/admin";
import AnnouncementList from "@/components/feature/admin/announcement-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminAnnouncementsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  let announcements = null;
  try {
    announcements = session.backendToken ? await getAnnouncements(session.backendToken) : null;
  } catch (error) {
    console.error("공지사항 목록 조회 실패:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">공지사항</h3>
        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          새 공지
        </Link>
      </div>
      {announcements ? (
        <AnnouncementList announcements={announcements} />
      ) : (
        <p className="text-muted-foreground">공지사항을 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>
      )}
    </div>
  );
}
