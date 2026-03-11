import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이하로 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  isPublished: z.boolean(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
