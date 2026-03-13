"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptTemplateSchema, type PromptTemplateFormValues } from "@/lib/admin-schema";
import { createPromptTemplateAction, updatePromptTemplateAction } from "@/app/admin/templates/actions";
import type { Category } from "@/api/fortune";
import Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateFormProps {
  templateId?: number;
  categories: Category[];
  defaultValues?: PromptTemplateFormValues;
}

const CREATE_DEFAULTS: PromptTemplateFormValues = {
  title: "",
  description: "",
  template: "",
  parentId: "",
  isActive: true,
  isSolo: false,
  sortOrder: 0,
};

export default function TemplateForm({ templateId, categories, defaultValues }: TemplateFormProps) {
  // region [Hooks]
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);
  const isEditMode = templateId !== undefined;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PromptTemplateFormValues>({
    resolver: zodResolver(promptTemplateSchema),
    defaultValues: defaultValues ?? CREATE_DEFAULTS,
  });
  // endregion

  // region [Events]
  const onSubmit = useCallback(
    (data: PromptTemplateFormValues) => {
      startTransition(async () => {
        const result = isEditMode
          ? await updatePromptTemplateAction(templateId, data)
          : await createPromptTemplateAction(data);
        if (result.success) {
          router.push("/admin/templates");
          router.refresh();
        } else {
          alert(result.error);
        }
      });
    },
    [templateId, isEditMode, router],
  );
  // endregion

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert>
        <div className="space-y-1">
          <p>카테고리, 제목, 설명, 템플릿 내용, 정렬 순서는 필수 항목입니다.</p>
          <p>템플릿 내용에서 사용 가능한 치환 변수:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li><code className="rounded bg-blue-500/15 px-1 py-0.5 font-mono text-xs">{"{{chartData}}"}</code> — 사용자의 사주 명식 데이터 <span className="text-blue-400">(필수)</span></li>
            <li><code className="rounded bg-blue-500/15 px-1 py-0.5 font-mono text-xs">{"{{today}}"}</code> — 오늘 날짜 (년월일)</li>
            <li><code className="rounded bg-blue-500/15 px-1 py-0.5 font-mono text-xs">{"{{targetYear}}"}</code> — 당해 년도</li>
          </ul>
        </div>
      </Alert>

      <div>
        <Label className="mb-2">카테고리</Label>
        {mounted ? (
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground">
            {categories.find((c) => c.id === defaultValues?.parentId)?.title ?? "카테고리를 선택하세요"}
          </div>
        )}
        {errors.parentId && <p className="mt-1 text-sm text-red-400">{errors.parentId.message}</p>}
      </div>

      <div>
        <Label htmlFor="title" className="mb-2">제목</Label>
        <input
          id="title"
          {...register("title")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="템플릿 제목"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="mb-2">설명</Label>
        <input
          id="description"
          {...register("description")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="템플릿 설명"
        />
        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="template" className="mb-2">템플릿 내용</Label>
        <textarea
          id="template"
          {...register("template")}
          rows={28}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          placeholder="프롬프트 템플릿 내용"
        />
        {errors.template && <p className="mt-1 text-sm text-red-400">{errors.template.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sortOrder" className="mb-2">정렬 순서</Label>
          <input
            id="sortOrder"
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="0"
          />
          {errors.sortOrder && <p className="mt-1 text-sm text-red-400">{errors.sortOrder.message}</p>}
        </div>

        <div>
          <Label className="mb-2">활성</Label>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2 pt-1">
                {mounted ? (
                  <Switch
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                ) : (
                  <div className="h-[1.15rem] w-8 rounded-full bg-input" />
                )}
                <span className="text-sm text-muted-foreground">{field.value ? "활성" : "비활성"}</span>
              </div>
            )}
          />
        </div>

        <div>
          <Label className="mb-2">Solo</Label>
          <Controller
            name="isSolo"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2 pt-1">
                {mounted ? (
                  <Switch
                    id="isSolo"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                ) : (
                  <div className="h-[1.15rem] w-8 rounded-full bg-input" />
                )}
                <span className="text-sm text-muted-foreground">{field.value ? "사용" : "미사용"}</span>
              </div>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "저장 중..." : isEditMode ? "수정" : "생성"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
          목록으로
        </Button>
      </div>
    </form>
  );
}
