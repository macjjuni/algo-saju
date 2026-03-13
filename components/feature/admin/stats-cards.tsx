import { Users, Sparkles, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  totalFortuneCalls: number;
  todayFortuneCalls: number;
}

const cards = [
  { key: "totalUsers", label: "전체 사용자", icon: Users },
  { key: "totalFortuneCalls", label: "전체 분석", icon: Sparkles },
  { key: "todayFortuneCalls", label: "오늘 분석", icon: TrendingUp },
] as const;

export default function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon }) => (
        <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Icon className="h-4 w-4" />
            {label}
          </div>
          <div className="text-2xl font-bold">{(props[key] ?? 0).toLocaleString("ko-KR")}</div>
        </div>
      ))}
    </div>
  );
}
