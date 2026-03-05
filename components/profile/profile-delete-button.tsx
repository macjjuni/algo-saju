"use client";

import { useRouter } from "next/navigation";
import { deleteProfileAction } from "@/app/profile/actions";
import { Button } from "@/components/ui/button";

export default function ProfileDeleteButton({ id }: { id: string }) {
  // region [Hooks]
  const router = useRouter();
  // endregion

  // region [Events]
  async function onClick() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteProfileAction(id);
    router.refresh();
  }
  // endregion

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={onClick}
    >
      삭제
    </Button>
  );
}
