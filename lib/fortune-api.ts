import { apiClient, authHeaders } from "@/lib/api-client";

export interface FortuneRequest {
  chartData: string;
  promptTemplateId: number;
}

export interface FortuneResponse {
  id: number;
  result: string;
}

export interface PromptTemplate {
  id: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
}

export async function requestFortune(
  token: string,
  body: FortuneRequest,
): Promise<FortuneResponse> {
  return apiClient<FortuneResponse>("/api/v1/fortune", {
    method: "POST",
    headers: authHeaders(token),
    body,
  });
}

export async function getTemplates(): Promise<PromptTemplate[]> {
  return apiClient<PromptTemplate[]>("/api/v1/fortune/templates");
}

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>("/api/v1/fortune/categories");
}

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
