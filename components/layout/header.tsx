"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import useScrollDirection from "@/hooks/use-scroll-direction";
import useOutsideClick from "@/hooks/use-outside-click";
import AuthButton from "@/components/common/auth-button";
import { Button } from "@/components/ui/button";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useOutsideClick(headerRef, () => setMobileMenuOpen(false), mobileMenuOpen);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  // endregion

  // region [Events]
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);
  // endregion

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Image src="/images/logo.webp" alt="로고" width={28} height={28} />
          알고사주
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center gap-4">
          {isAuthenticated && menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm transition-colors ${pathname.startsWith(item.href) ? 'text-foreground underline underline-offset-4' : 'text-foreground/70 hover:text-foreground'}`}>
              {item.label}
            </Link>
          ))}
          <AuthButton />
        </nav>

        {/* Mobile Hamburger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden text-foreground/70 hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
          <nav className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
              {isAuthenticated && menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${pathname.startsWith(item.href) ? 'bg-accent text-foreground font-medium' : 'text-foreground/70 hover:bg-accent hover:text-foreground'}`}
                >
                  {item.label}
                </Link>
              ))}
              <AuthButton variant="mobile" />
            </div>
          </nav>
      )}
    </header>
  );
}
