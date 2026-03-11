import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAnnouncements } from "@/api/admin";
import AnnouncementList from "@/components/feature/admin/announcement-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminAnnouncementsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  let announcements = null;
  try {
    announcements = session.backendToken ? await getAnnouncements(session.backendToken) : null;
  } catch {
    // 백엔드 미구현 시 null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">공지사항</h1>
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
