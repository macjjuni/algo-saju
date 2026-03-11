import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import AnnouncementForm from "@/components/feature/admin/announcement-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewAnnouncementPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  return (
    <div className="space-y-6">
      <Link href="/admin/announcements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        공지사항 목록
      </Link>
      <h1 className="text-xl font-bold">새 공지사항</h1>
      <AnnouncementForm />
    </div>
  );
}
