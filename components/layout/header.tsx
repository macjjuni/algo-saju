"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useScrollDirection from "@/hooks/use-scroll-direction";
import AuthButton from "./auth-button";

interface HeaderProps {
  isAuthenticated: boolean;
}

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
          {isAuthenticated && (
            <>
              <Link href="/category" className={`text-sm transition-colors ${pathname.startsWith('/category') ? 'text-foreground underline underline-offset-4' : 'text-foreground/70 hover:text-foreground'}`}>
                운세 보기
              </Link>
              <Link href="/profile" className={`text-sm transition-colors ${pathname.startsWith('/profile') ? 'text-foreground underline underline-offset-4' : 'text-foreground/70 hover:text-foreground'}`}>
                프로필 관리
              </Link>
            </>
          )}
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
