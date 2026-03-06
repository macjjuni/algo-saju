"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MAX_PROFILES = 10;

export default function ProfileAddButton({ count }: { count: number }) {
  // region [Events]
  function onClick() {
    toast.warning(`프로필은 최대 ${MAX_PROFILES}명까지 등록할 수 있습니다.`);
  }
  // endregion

  if (count >= MAX_PROFILES) {
    return (
      <Button onClick={onClick}>프로필 추가</Button>
    );
  }

  return (
    <Button asChild>
      <Link href="/profile/new">프로필 추가</Link>
    </Button>
  );
}
