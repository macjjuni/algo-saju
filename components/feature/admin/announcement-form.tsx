"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema, type AnnouncementFormValues } from "@/lib/admin-schema";
import { createAnnouncementAction, updateAnnouncementAction } from "@/app/admin/announcements/actions";
import { handleUnauthorized } from "@/lib/handle-unauthorized";
import { Button } from "@/components/ui/button";

interface AnnouncementFormProps {
  announcementId?: number;
  defaultValues?: AnnouncementFormValues;
}

export default function AnnouncementForm({ announcementId, defaultValues }: AnnouncementFormProps) {
  // region [Hooks]
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: defaultValues ?? { title: "", content: "", isPublished: false },
  });
  // endregion

  // region [Privates]
  const isEditMode = announcementId !== undefined;
  // endregion

  // region [Events]
  const onSubmit = useCallback(
    (data: AnnouncementFormValues) => {
      startTransition(async () => {
        const result = isEditMode
          ? await updateAnnouncementAction(announcementId, data)
          : await createAnnouncementAction(data);

        if (result.success) {
          router.push("/admin/announcements");
          router.refresh();
        } else {
          if (handleUnauthorized(result)) return;
          alert(result.error);
        }
      });
    },
    [announcementId, isEditMode, router],
  );
  // endregion

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          제목
        </label>
        <input
          id="title"
          {...register("title")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="공지사항 제목"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          내용
        </label>
        <textarea
          id="content"
          {...register("content")}
          rows={10}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          placeholder="공지사항 내용 (마크다운 지원)"
        />
        {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="isPublished" type="checkbox" {...register("isPublished")} className="rounded" />
        <label htmlFor="isPublished" className="text-sm">
          공개
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : isEditMode ? "수정" : "생성"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
