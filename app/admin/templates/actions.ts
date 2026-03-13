"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { ApiError } from "@/lib/api-client";
import {
  createPromptTemplate,
  updatePromptTemplate,
  deletePromptTemplate,
  type AdminPromptTemplateCreateRequest,
  type AdminPromptTemplateUpdateRequest,
} from "@/api/admin";
import type { ActionResult } from "@/lib/types";

export async function createPromptTemplateAction(data: AdminPromptTemplateCreateRequest): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "관리자 권한이 필요합니다." };

  try {
    await createPromptTemplate(session.backendToken, data);
    revalidatePath("/admin/templates");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "템플릿 생성에 실패했습니다." };
  }
}

export async function updatePromptTemplateAction(id: number, data: AdminPromptTemplateUpdateRequest): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "관리자 권한이 필요합니다." };

  try {
    await updatePromptTemplate(session.backendToken, id, data);
    revalidatePath("/admin/templates");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "템플릿 수정에 실패했습니다." };
  }
}

export async function deletePromptTemplateAction(id: number): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "관리자 권한이 필요합니다." };

  try {
    await deletePromptTemplate(session.backendToken, id);
    revalidatePath("/admin/templates");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "템플릿 삭제에 실패했습니다." };
  }
}
