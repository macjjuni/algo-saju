"use client"

import { useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { icons } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassPanel from '@/components/ui/glass-panel'

export interface SidebarMenuItem {
  href: string
  label: string
  icon: LucideIcon | string
  color?: string
}

interface SidebarLayoutProps {
  title: string
  menuItems: SidebarMenuItem[]
  children: React.ReactNode
}

export default function SidebarLayout({ title, menuItems, children }: SidebarLayoutProps) {
  // region [Hooks]
  const pathname = usePathname()
  const activeRef = useRef<HTMLLIElement>(null)
  // endregion

  // region [Privates]
  const resolvedIcons = useMemo(
    () => menuItems.map(({ icon }) => (typeof icon === 'string' ? icons[icon as keyof typeof icons] : icon)),
    [menuItems],
  )
  // endregion

  // region [Events]
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) e.preventDefault()
  }, [pathname])
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [pathname])
  // endregion

  return (
    <GlassPanel>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 shrink-0">
          <h2 className="mb-6 text-lg font-semibold">{title}</h2>
          <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
            {menuItems.map(({ href, label, color }, index) => {
              const isActive = pathname === href
              const Icon = resolvedIcons[index]
              return (
                <li key={href} ref={isActive ? activeRef : undefined}>
                  <Link
                    href={href}
                    onClick={(e) => handleClick(e, href)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-white/10 text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" style={{ color }} />}
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
