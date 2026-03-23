import { apiClient, authHeaders } from "@/lib/api-client";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
  usageCount: number;
}

export async function getMe(token: string): Promise<UserInfo> {
  return apiClient<UserInfo>("/api/v1/auth/me", {
    headers: authHeaders(token),
  });
}

export async function deleteMe(token: string): Promise<void> {
  await apiClient<void>("/api/v1/auth/me", {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
