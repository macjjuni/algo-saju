"use client"

import { User, UserX } from 'lucide-react'
import SidebarLayout from '@/components/ui/sidebar-layout'
import type { SidebarMenuItem } from '@/components/ui/sidebar-layout'

const menuItems: SidebarMenuItem[] = [
  { href: '/account', label: '회원정보', icon: User },
  { href: '/account/withdraw', label: '회원탈퇴', icon: UserX },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout title="내 정보" menuItems={menuItems}>
      {children}
    </SidebarLayout>
  )
}
