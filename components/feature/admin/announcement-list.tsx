"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { Announcement } from "@/services/admin";
import { deleteAnnouncementAction } from "@/app/admin/announcements/actions";
import { handleUnauthorized } from "@/lib/handle-unauthorized";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnnouncementListProps {
  announcements: Announcement[];
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
  // region [Hooks]
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // endregion

  // region [Events]
  const handleDelete = useCallback(
    (id: number) => {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      startTransition(async () => {
        const result = await deleteAnnouncementAction(id);
        if (result.success) {
          router.refresh();
        } else {
          if (handleUnauthorized(result)) return;
          alert(result.error);
        }
      });
    },
    [router],
  );
  // endregion

  if (announcements.length === 0) {
    return <p className="text-sm text-muted-foreground">공지사항이 없습니다.</p>;
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.title}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                    a.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {a.isPublished ? "공개" : "비공개"}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(a.createdAt).toLocaleDateString("ko-KR")}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Link
                    href={`/admin/announcements/${a.id}`}
                    className="rounded p-1.5 hover:bg-white/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(a.id)} disabled={isPending} className="text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
