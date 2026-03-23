import { apiClient, authHeaders } from "@/lib/api-client";

// region [Types]

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  provider: string;
  totalFortuneCount: number;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  updatedAt: string;
  usageCount: number;
}

export interface DailyStat {
  date: string;
  fortuneCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalFortuneCalls: number;
  todayFortuneCalls: number;
  dailyStats: DailyStat[];
}

export interface TemplateStatItem {
  templateId: number;
  title: string;
  usageCount: number;
}

export interface CategoryStatItem {
  categoryId: string;
  categoryTitle: string;
  templates: TemplateStatItem[];
}

export interface TemplateStatsResponse {
  templateStats: CategoryStatItem[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  isPublished: boolean;
}

export interface UpdateAnnouncementRequest {
  title: string;
  content: string;
  isPublished: boolean;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  totalCount: number;
}

// endregion

// region [Stats]

export async function getAdminStats(token: string, days?: number): Promise<AdminStats> {
  const query = days ? `?days=${days}` : "";
  return apiClient<AdminStats>(`/api/v1/admin/stats${query}`, {
    headers: authHeaders(token),
  });
}

export async function getTemplateStats(token: string): Promise<CategoryStatItem[]> {
  const res = await apiClient<TemplateStatsResponse>("/api/v1/admin/template-stats", {
    headers: authHeaders(token),
  });
  return res.templateStats;
}

// endregion

// region [Users]

export async function getAdminUsers(
  token: string,
  params: { page?: number; pageSize?: number; search?: string } = {},
): Promise<AdminUsersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  const qs = query.toString();
  return apiClient<AdminUsersResponse>(`/api/v1/admin/users${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(token),
  });
}

export async function getAdminUser(token: string, id: string): Promise<AdminUserDetail> {
  return apiClient<AdminUserDetail>(`/api/v1/admin/users/${id}`, {
    headers: authHeaders(token),
  });
}

// endregion

// region [Announcements]

export async function getAnnouncements(token: string): Promise<Announcement[]> {
  const res = await apiClient<{ announcements: Announcement[] }>("/api/v1/admin/announcements", {
    headers: authHeaders(token),
  });
  return res.announcements;
}

export async function getAnnouncement(token: string, id: number): Promise<Announcement> {
  return apiClient<Announcement>(`/api/v1/admin/announcements/${id}`, {
    headers: authHeaders(token),
  });
}

export async function createAnnouncement(token: string, body: CreateAnnouncementRequest): Promise<Announcement> {
  return apiClient<Announcement>("/api/v1/admin/announcements", {
    method: "POST",
    headers: authHeaders(token),
    body,
  });
}

export async function updateAnnouncement(token: string, id: number, body: UpdateAnnouncementRequest): Promise<Announcement> {
  return apiClient<Announcement>(`/api/v1/admin/announcements/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body,
  });
}

export async function deleteAnnouncement(token: string, id: number): Promise<void> {
  await apiClient<void>(`/api/v1/admin/announcements/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// endregion

// region [Prompt Templates]

export interface AdminPromptTemplate {
  id: number;
  title: string;
  description: string;
  template: string;
  parentId: string | null;
  isActive: boolean;
  isSolo: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPromptTemplateCreateRequest {
  title: string;
  description: string;
  template: string;
  parentId?: string;
  isActive?: boolean;
  isSolo?: boolean;
  sortOrder?: number;
}

export interface AdminPromptTemplateUpdateRequest {
  title: string;
  description: string;
  template: string;
  parentId: string | null;
  isActive: boolean;
  isSolo: boolean;
  sortOrder: number;
}

export interface AdminPromptTemplatesResponse {
  promptTemplates: AdminPromptTemplate[];
  totalCount: number;
}

export async function getPromptTemplates(
  token: string,
  params: { page?: number; pageSize?: number; parentId?: string } = {},
): Promise<AdminPromptTemplatesResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.parentId) query.set("parentId", params.parentId);
  const qs = query.toString();
  return apiClient<AdminPromptTemplatesResponse>(`/api/v1/admin/prompt-templates${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(token),
  });
}

export async function createPromptTemplate(token: string, body: AdminPromptTemplateCreateRequest): Promise<AdminPromptTemplate> {
  return apiClient<AdminPromptTemplate>("/api/v1/admin/prompt-templates", {
    method: "POST",
    headers: authHeaders(token),
    body,
  });
}

export async function getPromptTemplate(token: string, id: number): Promise<AdminPromptTemplate> {
  return apiClient<AdminPromptTemplate>(`/api/v1/admin/prompt-templates/${id}`, {
    headers: authHeaders(token),
  });
}

export async function updatePromptTemplate(token: string, id: number, body: AdminPromptTemplateUpdateRequest): Promise<AdminPromptTemplate> {
  return apiClient<AdminPromptTemplate>(`/api/v1/admin/prompt-templates/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body,
  });
}

export async function deletePromptTemplate(token: string, id: number): Promise<void> {
  await apiClient<void>(`/api/v1/admin/prompt-templates/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

// endregion

// region [Models]

export interface GeminiModelResponse {
  currentModel: string;
  models: string[];
}

export async function getGeminiModel(token: string): Promise<GeminiModelResponse> {
  return apiClient<GeminiModelResponse>("/api/v1/admin/gemini-model", {
    headers: authHeaders(token),
  });
}

export async function updateGeminiModel(token: string, model: string): Promise<GeminiModelResponse> {
  return apiClient<GeminiModelResponse>("/api/v1/admin/gemini-model", {
    method: "PUT",
    headers: authHeaders(token),
    body: { model },
  });
}

// endregion
