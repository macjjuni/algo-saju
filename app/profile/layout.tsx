"use client"

import { UserRound, UserPlus } from 'lucide-react'
import SidebarLayout from '@/components/ui/sidebar-layout'
import type { SidebarMenuItem } from '@/components/ui/sidebar-layout'

const menuItems: SidebarMenuItem[] = [
  { href: '/profile', label: '프로필 목록', icon: UserRound },
  { href: '/profile/new', label: '프로필 작성', icon: UserPlus },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout title="프로필 관리" menuItems={menuItems}>
      {children}
    </SidebarLayout>
  )
}
