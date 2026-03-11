"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { AdminUser } from "@/api/admin";
import { maskString } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserListProps {
  users: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  search: string;
}

export default function UserList({ users, totalCount, page, pageSize, search }: UserListProps) {
  // region [Hooks]
  const router = useRouter();
  // endregion

  // region [Privates]
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  // endregion

  // region [Events]
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      params.set("page", String(newPage));
      if (pageSize !== 20) params.set("pageSize", String(pageSize));
      if (search) params.set("search", search);
      router.push(`/admin/users?${params.toString()}`);
    },
    [router, pageSize, search],
  );
  // endregion

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {search ? `"${search}"에 대한 검색 결과가 없습니다.` : "등록된 사용자가 없습니다."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>로그인</TableHead>
              <TableHead className="text-right">분석</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/admin/users/${user.id}`} className="hover:underline">
                    {maskString(user.name)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{maskString(user.email)}</TableCell>
                <TableCell className="text-muted-foreground">{user.provider}</TableCell>
                <TableCell className="text-right">{user.totalFortuneCount ?? 0}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ko-KR") : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users.length > 0 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page <= 1}
            className="rounded-lg px-2 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
          >
            처음
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg px-3 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg px-3 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
          >
            다음
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page >= totalPages}
            className="rounded-lg px-2 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
          >
            마지막
          </button>
        </div>
      )}
    </div>
  );
}
