import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이하로 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  isPublished: z.boolean(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export const promptTemplateSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이하로 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  template: z.string().min(1, "템플릿 내용을 입력해주세요").refine((v) => v.includes("{{chartData}}"), "템플릿에 '{{chartData}}'가 포함되어야 합니다"),
  parentId: z.string().min(1, "카테고리를 선택해주세요"),
  isActive: z.boolean(),
  isSolo: z.boolean(),
  sortOrder: z.number({ error: "정렬 순서를 입력해주세요" }).int().min(0, "0 이상의 숫자를 입력해주세요"),
});

export type PromptTemplateFormValues = z.infer<typeof promptTemplateSchema>;
