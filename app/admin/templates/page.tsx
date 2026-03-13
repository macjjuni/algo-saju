import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPromptTemplates, type AdminPromptTemplatesResponse } from "@/api/admin";
import { getCategories, type Category } from "@/api/fortune";
import { ApiError } from "@/lib/api-client";
import { parsePaginationParams } from "@/lib/pagination";
import TemplateList from "@/components/feature/admin/template-list";

interface Props {
  searchParams: Promise<{ page?: string; pageSize?: string; parentId?: string }>;
}

export default async function AdminTemplatesPage({ searchParams }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const params = await searchParams;
  const { page, pageSize } = parsePaginationParams(params);
  const parentId = params.parentId || "";

  let data: AdminPromptTemplatesResponse | null = null;
  let categories: Category[] = [];
  let error = "";
  try {
    const [templatesRes, categoriesRes] = await Promise.all([
      session.backendToken
        ? getPromptTemplates(session.backendToken, { page, pageSize, parentId })
        : null,
      getCategories(),
    ]);
    data = templatesRes;
    categories = categoriesRes;
  } catch (err) {
    error = err instanceof ApiError ? err.message : "템플릿을 불러올 수 없습니다.";
  }

  const templates = data?.promptTemplates ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">템플릿 관리</h1>
        <div className="flex items-center gap-3">
          {data && (
            <span className="text-sm text-muted-foreground">
              총 <span className="font-semibold text-foreground">{totalCount.toLocaleString("ko-KR")}</span>개
            </span>
          )}
          <Link
            href="/admin/templates/new"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            새 템플릿
          </Link>
        </div>
      </div>
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : data ? (
        <TemplateList
          templates={templates}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          categories={categories}
          currentParentId={parentId}
        />
      ) : (
        <p className="text-muted-foreground">템플릿을 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>
      )}
    </div>
  );
}
