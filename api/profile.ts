import { apiClient, authHeaders } from "@/lib/api-client";

export interface Profile {
  id: string;
  userId: string;
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "M" | "F";
  unknownTime: boolean;
  latitude: number;
  longitude: number;
  cityName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "M" | "F";
  unknownTime: boolean;
  latitude: number;
  longitude: number;
  cityName: string;
}

export type UpdateProfileRequest = Partial<CreateProfileRequest>;

export async function getProfiles(token: string): Promise<Profile[]> {
  const res = await apiClient<{ profiles: Profile[] }>("/api/v1/profiles", {
    headers: authHeaders(token),
  });
  return res.profiles;
}

export async function getProfile(token: string, id: string): Promise<Profile> {
  return apiClient<Profile>(`/api/v1/profiles/${id}`, {
    headers: authHeaders(token),
  });
}

export async function createProfile(token: string, body: CreateProfileRequest): Promise<Profile> {
  return apiClient<Profile>("/api/v1/profiles", {
    method: "POST",
    headers: authHeaders(token),
    body,
  });
}

export async function updateProfile(token: string, id: string, body: UpdateProfileRequest): Promise<Profile> {
  return apiClient<Profile>(`/api/v1/profiles/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body,
  });
}

export async function deleteProfile(token: string, id: string): Promise<void> {
  await apiClient<void>(`/api/v1/profiles/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
