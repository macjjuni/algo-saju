"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { AdminUser } from "@/api/admin";
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
  total: number;
  page: number;
  pageSize: number;
}

export default function UserList({ users, total, page, pageSize }: UserListProps) {
  // region [Hooks]
  const router = useRouter();
  // endregion

  // region [Privates]
  const totalPages = Math.ceil(total / pageSize);
  // endregion

  // region [Events]
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("page", String(newPage));
      router.push(`/admin/users?${params.toString()}`);
    },
    [router],
  );
  // endregion

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">사용자가 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="text-right">프로필</TableHead>
              <TableHead className="text-right">분석</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/admin/users/${user.id}`} className="hover:underline">
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-right">{user.profileCount}</TableCell>
                <TableCell className="text-right">{user.fortuneCount}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg px-3 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
          >
            이전
          </button>
          <span className="flex items-center text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg px-3 py-1 text-sm border border-white/10 disabled:opacity-50 hover:bg-white/5"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
