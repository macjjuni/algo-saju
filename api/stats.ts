import { apiClient } from "@/lib/api-client";

export async function getTotalFortuneCalls(): Promise<number | null> {
  try {
    const data = await apiClient<{ totalFortuneCalls: number }>("/api/v1/stats", {
      next: { revalidate: 14400 },
    });
    return data.totalFortuneCalls ?? null;
  } catch {
    return null;
  }
}
