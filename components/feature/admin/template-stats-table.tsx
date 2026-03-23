"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CategoryStatItem } from "@/services/admin";
import { Button } from "@/components/ui/button";

interface TemplateStatsTableProps {
  templateStats: CategoryStatItem[];
}

export default function TemplateStatsTable({ templateStats }: TemplateStatsTableProps) {
  // region [Hooks]
  const [activeTab, setActiveTab] = useState(0);
  // endregion

  // region [Privates]
  const activeCategory = templateStats[activeTab];
  const templates = useMemo(() => activeCategory?.templates ?? [], [activeCategory]);
  const totalUsage = useMemo(
    () => templates.reduce((sum, t) => sum + (t.usageCount ?? 0), 0),
    [templates],
  );
  // endregion

  if (templateStats.length === 0) {
    return <p className="text-sm text-muted-foreground">템플릿 통계 데이터가 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">템플릿별 사용량</h2>
        <span className="text-sm text-muted-foreground">
          합계 <span className="font-semibold text-foreground">{totalUsage.toLocaleString("ko-KR")}</span>회
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {templateStats.map((category, index) => (
          <Button
            key={category.categoryId}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(index)}
            className={`shrink-0 ${
              activeTab === index
                ? "bg-white/10 text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {category.categoryTitle}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>템플릿</TableHead>
              <TableHead className="text-right">사용 횟수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((item) => (
              <TableRow key={item.templateId}>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-right">{(item.usageCount ?? 0).toLocaleString("ko-KR")}</TableCell>
              </TableRow>
            ))}
            {templates.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  템플릿이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
