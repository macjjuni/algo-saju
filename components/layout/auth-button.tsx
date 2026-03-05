"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  // region [Hooks]
  const { status } = useSession();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  // endregion

  // region [Events]
  function onClickLogin() {
    signIn("google");
  }

  function onClickLogout() {
    setAccessToken(null);
    signOut();
  }
  // endregion

  if (status === "loading") return null;

  if (status === "authenticated") {
    return (
      <Button variant="ghost" size="sm" onClick={onClickLogout}>
        로그아웃
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={onClickLogin}>
      로그인
    </Button>
  );
}
