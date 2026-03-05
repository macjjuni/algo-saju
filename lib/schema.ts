import { z } from "zod";

export const birthFormSchema = z.object({
  name: z.string().max(16).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  gender: z.enum(["M", "F"]),
  unknownTime: z.boolean(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cityName: z.string().min(1, "출생 위치를 선택해주세요"),
});

export type BirthFormValues = z.infer<typeof birthFormSchema>;
