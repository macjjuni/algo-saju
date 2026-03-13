"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  variant?: "default" | "mobile";
}

export default function AuthButton({ variant = "default" }: AuthButtonProps) {
  // region [Hooks]
  const { status } = useSession();
  // endregion

  if (status === "loading") return null;

  if (variant === "mobile") {
    if (status === "authenticated") {
      return (
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="w-full justify-start px-3 py-2 h-auto text-foreground/70 hover:text-foreground"
        >
          로그아웃
        </Button>
      );
    }
    return (
      <Link
        href="/login"
        className="block rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
      >
        로그인
      </Link>
    );
  }

  if (status === "authenticated") {
    return (
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        로그아웃
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/login">로그인</Link>
    </Button>
  );
}
