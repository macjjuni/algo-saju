import { unstable_cache } from "next/cache";
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
  promptTemplateId: number;
  title: string;
  description: string;
  isSolo: boolean;
  parentId: string;
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

const FOUR_HOURS = 4 * 60 * 60;

export async function getTemplates(token: string, c: string): Promise<PromptTemplate[]> {
  const cached = unstable_cache(
    async () => {
      const res = await apiClient<{ templates: PromptTemplate[] }>(`/api/v1/fortune/templates?c=${c}`, {
        headers: authHeaders(token),
      });
      return res.templates;
    },
    ["fortune-templates", c],
    { revalidate: FOUR_HOURS },
  );
  return cached();
}

export async function getCategories(token: string): Promise<Category[]> {
  const cached = unstable_cache(
    async () => {
      const res = await apiClient<{ categories: Category[] }>("/api/v1/fortune/categories", {
        headers: authHeaders(token),
      });
      return res.categories;
    },
    ["fortune-categories"],
    { revalidate: FOUR_HOURS },
  );
  return cached();
}
