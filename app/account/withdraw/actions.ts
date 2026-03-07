"use server";

import { auth, signOut } from "@/lib/auth";
import { ApiError } from "@/lib/api-client";
import { deleteMe } from "@/api/auth";
import type { ActionResult } from "@/lib/types";

export async function withdrawAction(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "인증이 필요합니다." };

  try {
    await deleteMe(session.backendToken);
    await signOut({ redirect: false });
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "회원탈퇴에 실패했습니다." };
  }
}
