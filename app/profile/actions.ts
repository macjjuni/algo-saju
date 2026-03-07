"use server";

import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api-client";
import {
  createProfile,
  updateProfile,
  deleteProfile,
  type CreateProfileRequest,
  type UpdateProfileRequest,
} from "@/api/profile";
import type { ActionResult } from "@/lib/types";

export async function createProfileAction(data: CreateProfileRequest): Promise<ActionResult> {
  const session = await auth();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "로그인이 필요합니다." };

  try {
    await createProfile(session.backendToken, data);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "프로필 생성에 실패했습니다." };
  }
}

export async function updateProfileAction(id: string, data: UpdateProfileRequest): Promise<ActionResult> {
  const session = await auth();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "로그인이 필요합니다." };

  try {
    await updateProfile(session.backendToken, id, data);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "프로필 수정에 실패했습니다." };
  }
}

export async function deleteProfileAction(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.backendToken) return { success: false, code: "UNAUTHORIZED", error: "로그인이 필요합니다." };

  try {
    await deleteProfile(session.backendToken, id);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiError) return { success: false, code: err.code, error: err.message };
    return { success: false, code: "INTERNAL_ERROR", error: "프로필 삭제에 실패했습니다." };
  }
}
