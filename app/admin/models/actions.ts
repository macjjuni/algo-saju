"use server";

import { requireAdmin } from "@/lib/admin";
import { updateGeminiModel } from "@/services/admin";
import { ApiError } from "@/lib/api-client";

type ErrorCode = "UNAUTHORIZED" | "API_ERROR" | "UNKNOWN";
type ActionResult = { success: true } | { success: false; code: ErrorCode; error: string };

export async function updateGeminiModelAction(model: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, code: "UNAUTHORIZED", error: "권한이 없습니다." };

  try {
    if (!session.backendToken) throw new Error("토큰이 없습니다.");
    await updateGeminiModel(session.backendToken, model);
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) return { success: false, code: "API_ERROR", error: e.message };
    return { success: false, code: "UNKNOWN", error: "알 수 없는 오류가 발생했습니다." };
  }
}
