"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useScrollDirection from "@/hooks/use-scroll-direction";
import AuthButton from "@/components/common/auth-button";

interface HeaderProps {
  isAuthenticated: boolean;
}

const menuItems = [
  { href: '/category', label: '운세 카테고리' },
  { href: '/profile', label: '프로필 관리' },
  { href: '/account', label: '내 정보' },
];

export default function Header({ isAuthenticated }: HeaderProps) {
  // region [Hooks]
  const isHidden = useScrollDirection();
  const pathname = usePathname();
  // endregion

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="text-lg font-bold">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          {isAuthenticated && menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm transition-colors ${pathname.startsWith(item.href) ? 'text-foreground underline underline-offset-4' : 'text-foreground/70 hover:text-foreground'}`}>
              {item.label}
            </Link>
          ))}
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
