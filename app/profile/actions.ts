"use server";

import { auth } from "@/lib/auth";
import {
  createProfile,
  updateProfile,
  deleteProfile,
  type CreateProfileRequest,
  type UpdateProfileRequest,
} from "@/api/profile";

export async function createProfileAction(data: CreateProfileRequest) {
  const session = await auth();
  if (!session?.backendToken) throw new Error("인증이 필요합니다.");

  return createProfile(session.backendToken, data);
}

export async function updateProfileAction(id: string, data: UpdateProfileRequest) {
  const session = await auth();
  if (!session?.backendToken) throw new Error("인증이 필요합니다.");

  return updateProfile(session.backendToken, id, data);
}

export async function deleteProfileAction(id: string) {
  const session = await auth();
  if (!session?.backendToken) throw new Error("인증이 필요합니다.");

  await deleteProfile(session.backendToken, id);
}
