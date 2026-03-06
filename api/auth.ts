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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function deleteMe(token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/auth/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }
}
