"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteProfileAction } from "@/app/profile/actions";
import { safeAction } from "@/lib/handle-unauthorized";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function ProfileDeleteButton({ id }: { id: string }) {
  // region [Hooks]
  const router = useRouter();
  const [pending, setPending] = useState(false);
  // endregion

  // region [Events]
  async function onConfirm() {
    setPending(true);
    const res = await safeAction(deleteProfileAction, id);
    setPending(false);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    router.refresh();
  }
  // endregion

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>프로필 삭제</DialogTitle>
          <DialogDescription>정말 삭제하시겠습니까?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>취소</Button>
          </DialogClose>
          <Button variant="destructive" disabled={pending} onClick={onConfirm}>
            {pending ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
