import { unstable_cache } from "next/cache";
import { apiClient, ApiError, authHeaders, type ErrorCode } from "@/lib/api-client";

export interface FortuneRequest {
  chartData: string;
  promptTemplateId: number;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function requestFortuneStream(token: string, body: FortuneRequest): Promise<Response> {
  const res = await fetch(`${API_URL}/api/v1/fortune`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      ...authHeaders(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let code: ErrorCode = "INTERNAL_ERROR";
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const errBody = await res.json();
      if (errBody?.code) code = errBody.code;
      if (errBody?.message) message = errBody.message;
    } catch { /* ignore */ }
    throw new ApiError(res.status, code, message);
  }

  return res;
}

const FOUR_HOURS = 4 * 60 * 60;

export async function getTemplates(c: string): Promise<PromptTemplate[]> {
  const cached = unstable_cache(
    async () => {
      const res = await apiClient<{ templates: PromptTemplate[] }>(`/api/v1/fortune/templates?c=${c}`);
      return res.templates;
    },
    ["fortune-templates", c],
    { revalidate: FOUR_HOURS },
  );
  return cached();
}

export async function getCategories(): Promise<Category[]> {
  const cached = unstable_cache(
    async () => {
      const res = await apiClient<{ categories: Category[] }>("/api/v1/fortune/categories");
      return res.categories;
    },
    ["fortune-categories"],
    { revalidate: FOUR_HOURS },
  );
  return cached();
}
