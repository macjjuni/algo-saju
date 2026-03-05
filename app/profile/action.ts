"use server";

import { birthFormSchema, type BirthFormValues } from "@/lib/schema";
import { buildChartData } from "@/lib/build-chart-data";

export async function analyzeProfile(data: BirthFormValues) {
  const parsed = birthFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: "입력값이 올바르지 않습니다." };
  }

  const form = parsed.data;

  const birthForm = {
    year: form.year,
    month: form.month,
    day: form.day,
    hour: form.unknownTime ? 12 : form.hour,
    minute: form.unknownTime ? 0 : form.minute,
    gender: form.gender,
    unknownTime: form.unknownTime,
    latitude: form.latitude,
    longitude: form.longitude,
    cityName: form.cityName,
  };

  const chartData = await buildChartData(birthForm);

  return { success: true as const, chartData };
}
