"use client";

import { useState } from "react";
import { toast } from "sonner";
import { withdrawAction } from "@/app/account/withdraw/actions";
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

export default function WithdrawButton() {
  // region [Hooks]
  const [pending, setPending] = useState(false);
  // endregion

  // region [Events]
  async function onConfirm() {
    setPending(true);
    const res = await safeAction(withdrawAction);
    if (!res.success) {
      toast.error(res.error);
      setPending(false);
      return;
    }
    window.location.href = "/";
  }
  // endregion

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">회원탈퇴</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
          <DialogDescription className="space-y-1">
            <span>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</span>
            <span className="block text-destructive">탈퇴 후 24시간 동안 재가입이 불가합니다.</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>취소</Button>
          </DialogClose>
          <Button variant="destructive" disabled={pending} onClick={onConfirm}>
            {pending ? "처리 중..." : "탈퇴하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
