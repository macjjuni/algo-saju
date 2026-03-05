"use server";

import { auth } from "@/lib/auth";
import { birthFormSchema, type BirthFormValues } from "@/lib/schema";
import { buildChartData } from "@/lib/build-chart-data";
import {
  createProfile,
  updateProfile,
  deleteProfile,
  type CreateProfileRequest,
  type UpdateProfileRequest,
} from "@/api/profile";

export async function analyzeProfile(data: BirthFormValues) {
  const parsed = birthFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: "입력값이 올바르지 않습니다." };
  }

  const form = parsed.data;

  const birthForm = {
    year: form.year,
    month: form.month,
    day: form.day,
    hour: form.unknownTime ? 12 : form.hour,
    minute: form.unknownTime ? 0 : form.minute,
    gender: form.gender,
    unknownTime: form.unknownTime,
    latitude: form.latitude,
    longitude: form.longitude,
    cityName: form.cityName,
  };

  const chartData = await buildChartData(birthForm);

  return { success: true as const, chartData };
}

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
