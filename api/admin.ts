import { apiClient, authHeaders } from "@/lib/api-client";

// region [Types]

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  profileCount: number;
  fortuneCount: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface AdminUserDetail extends AdminUser {
  profiles: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  totalProfiles: number;
  totalFortunes: number;
  todayFortunes: number;
  dailyStats: {
    date: string;
    users: number;
    fortunes: number;
  }[];
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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// endregion

// region [Stats]

export async function getAdminStats(token: string): Promise<AdminStats> {
  return apiClient<AdminStats>("/api/v1/admin/stats", {
    headers: authHeaders(token),
  });
}

// endregion

// region [Users]

export async function getAdminUsers(
  token: string,
  params: { page?: number; search?: string } = {},
): Promise<PaginatedResponse<AdminUser>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.search) query.set("search", params.search);
  const qs = query.toString();
  return apiClient<PaginatedResponse<AdminUser>>(`/api/v1/admin/users${qs ? `?${qs}` : ""}`, {
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
