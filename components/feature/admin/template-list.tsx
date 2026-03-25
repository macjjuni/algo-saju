"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { AdminPromptTemplate } from "@/services/admin";
import type { Category } from "@/services/fortune";
import { deletePromptTemplateAction } from "@/app/admin/templates/actions";
import { safeAction } from "@/lib/handle-unauthorized";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TemplateListProps {
  templates: AdminPromptTemplate[];
  totalCount: number;
  page: number;
  pageSize: number;
  categories: Category[];
  currentParentId: string;
}

export default function TemplateList({ templates, totalCount, page, pageSize, categories, currentParentId }: TemplateListProps) {
  // region [Hooks]
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { totalPages, handlePageChange } = usePagination({
    basePath: "/admin/templates",
    page,
    pageSize,
    totalCount,
    extraParams: currentParentId ? { parentId: currentParentId } : undefined,
  });
  // endregion

  // region [Events]
  const handleDelete = useCallback(
    (id: number) => {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      startTransition(async () => {
        const result = await safeAction(deletePromptTemplateAction, id);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.error);
        }
      });
    },
    [router],
  );

  const handleCategoryChange = useCallback(
    (parentId: string) => {
      const params = new URLSearchParams();
      if (parentId) params.set("parentId", parentId);
      const qs = params.toString();
      router.push(`/admin/templates${qs ? `?${qs}` : ""}`);
    },
    [router],
  );
  // endregion

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentParentId ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("")}
          className="rounded-full"
        >
          전체
        </Button>
        {categories.map((c) => (
          <Button
            key={c.id}
            variant={currentParentId === c.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(c.id)}
            className="rounded-full"
          >
            {c.title}
          </Button>
        ))}
      </div>

      {templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">등록된 템플릿이 없습니다.</p>
      ) : (
        <>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>활성</TableHead>
                  <TableHead>Solo</TableHead>
                  <TableHead>정렬</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.title}</TableCell>
                    <TableCell className="text-muted-foreground">{t.parentId ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                          t.isActive ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {t.isActive ? "활성" : "비활성"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {t.isSolo && (
                        <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400">
                          Solo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.sortOrder}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/templates/${t.id}`}
                          className="rounded p-1.5 hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(t.id)} disabled={isPending} className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
