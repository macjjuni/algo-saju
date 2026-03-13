import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getAnnouncement } from "@/api/admin";
import AnnouncementForm from "@/components/feature/admin/announcement-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;
  const announcementId = Number(id);

  let announcement = null;
  try {
    announcement = session.backendToken ? await getAnnouncement(session.backendToken, announcementId) : null;
  } catch (error) {
    console.error("공지사항 조회 실패:", error);
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/announcements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        공지사항 목록
      </Link>
      <h3 className="text-lg font-bold">공지사항 수정</h3>
      {announcement ? (
        <AnnouncementForm
          announcementId={announcementId}
          defaultValues={{
            title: announcement.title,
            content: announcement.content,
            isPublished: announcement.isPublished,
          }}
        />
      ) : (
        <p className="text-muted-foreground">공지사항을 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
