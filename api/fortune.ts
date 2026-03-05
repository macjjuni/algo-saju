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
  id: string;
  title: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export async function requestFortune(token: string, body: FortuneRequest): Promise<FortuneResponse> {
  return apiClient<FortuneResponse>("/api/v1/fortune", {
    method: "POST",
    headers: authHeaders(token),
    body,
  });
}

export async function getTemplates(c: string): Promise<PromptTemplate[]> {
  return apiClient<PromptTemplate[]>(`/api/v1/fortune/templates?c=${c}`);
}

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>("/api/v1/fortune/categories");
}
