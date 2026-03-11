"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DailyStat {
  date: string;
  users: number;
  fortunes: number;
}

interface StatsTableProps {
  dailyStats: DailyStat[];
}

export default function StatsTable({ dailyStats }: StatsTableProps) {
  if (dailyStats.length === 0) {
    return <p className="text-sm text-muted-foreground">일별 통계 데이터가 없습니다.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">일별 통계</h2>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead className="text-right">신규 사용자</TableHead>
              <TableHead className="text-right">운세 분석</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dailyStats.map((stat) => (
              <TableRow key={stat.date}>
                <TableCell>{stat.date}</TableCell>
                <TableCell className="text-right">{stat.users.toLocaleString("ko-KR")}</TableCell>
                <TableCell className="text-right">{stat.fortunes.toLocaleString("ko-KR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
