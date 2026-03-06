"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import GlassPanel from '@/components/ui/glass-panel'

export interface SidebarMenuItem {
  href: string
  label: string
  icon: LucideIcon
}

interface SidebarLayoutProps {
  title: string
  menuItems: SidebarMenuItem[]
  children: React.ReactNode
}

export default function SidebarLayout({ title, menuItems, children }: SidebarLayoutProps) {
  // region [Hooks]
  const pathname = usePathname()
  // endregion

  return (
    <GlassPanel>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 shrink-0">
          <h2 className="mb-3 text-lg font-semibold">{title}</h2>
          <ul className="flex md:flex-col gap-1">
            {menuItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/10 text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </GlassPanel>
  )
}
