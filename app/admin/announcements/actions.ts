"use server";

import { requireAdmin } from "@/lib/admin";
import { ApiError } from "@/lib/api-client";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type CreateAnnouncementRequest,
  type UpdateAnnouncementRequest,
} from "@/api/admin";
import type { ActionResult } from "@/lib/types";

export async function createAnnouncementAction(data: CreateAnnouncementRequest): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "관리자 권한이 필요합니다." };

  try {
    await createAnnouncement(session.backendToken, data);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "공지사항 생성에 실패했습니다." };
  }
}

export async function updateAnnouncementAction(id: number, data: UpdateAnnouncementRequest): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "관리자 권한이 필요합니다." };

  try {
    await updateAnnouncement(session.backendToken, id, data);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "공지사항 수정에 실패했습니다." };
  }
}

export async function deleteAnnouncementAction(id: number): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "관리자 권한이 필요합니다." };

  try {
    await deleteAnnouncement(session.backendToken, id);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "공지사항 삭제에 실패했습니다." };
  }
}
