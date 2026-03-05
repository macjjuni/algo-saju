import { apiClient, authHeaders } from "@/lib/api-client";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  image: string;
}

export async function getMe(token: string): Promise<UserInfo> {
  return apiClient<UserInfo>("/api/v1/auth/me", {
    headers: authHeaders(token),
  });
}
