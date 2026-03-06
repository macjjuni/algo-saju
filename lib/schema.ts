import { z } from "zod";

export const birthFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(16),
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
  privacyConsent: z.literal(true, { message: "개인정보 수집·이용에 동의해주세요" }),
});

export type BirthFormValues = z.infer<typeof birthFormSchema>;
