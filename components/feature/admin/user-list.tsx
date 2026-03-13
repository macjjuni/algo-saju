"use client";

import Link from "next/link";
import type { AdminUser } from "@/api/admin";
import { maskString } from "@/lib/format";
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

interface UserListProps {
  users: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  search: string;
}

export default function UserList({ users, totalCount, page, pageSize, search }: UserListProps) {
  // region [Hooks]
  const { totalPages, handlePageChange } = usePagination({
    basePath: "/admin/users",
    page,
    pageSize,
    totalCount,
    extraParams: search ? { search } : undefined,
  });
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

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
