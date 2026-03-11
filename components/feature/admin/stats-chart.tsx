"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DailyStat } from "@/api/admin";

interface StatsChartProps {
  dailyStats: DailyStat[];
}

export default function StatsChart({ dailyStats }: StatsChartProps) {
  // region [Privates]
  const data = [...dailyStats].reverse().map((stat) => ({
    date: stat.date.slice(5),
    fortuneCount: stat.fortuneCount ?? 0,
  }));
  // endregion

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">일별 통계 데이터가 없습니다.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">일별 운세 분석</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fortuneGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.7 0.15 250)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.7 0.15 250)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelFormatter={(label) => `${label}`}
              formatter={(value) => [Number(value).toLocaleString("ko-KR"), "분석 횟수"]}
            />
            <Area
              type="monotone"
              dataKey="fortuneCount"
              stroke="oklch(0.7 0.15 250)"
              strokeWidth={2}
              fill="url(#fortuneGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
