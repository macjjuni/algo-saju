"use client";

import { BarChart3, Users, Megaphone } from "lucide-react";
import SidebarLayout from "@/components/ui/sidebar-layout";
import type { SidebarMenuItem } from "@/components/ui/sidebar-layout";

const menuItems: SidebarMenuItem[] = [
  { href: "/admin/stats", label: "통계", icon: BarChart3 },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/announcements", label: "공지사항", icon: Megaphone },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout title="관리자" menuItems={menuItems}>
      {children}
    </SidebarLayout>
  );
}
