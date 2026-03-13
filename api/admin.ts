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
