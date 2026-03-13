import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getPromptTemplate, type AdminPromptTemplate } from "@/api/admin";
import { getCategories, type Category } from "@/api/fortune";
import TemplateForm from "@/components/feature/admin/template-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: Props) {
  const session = await requireAdmin();
  if (!session) redirect("/");

  const { id } = await params;
  const templateId = Number(id);

  let template: AdminPromptTemplate | null = null;
  let categories: Category[] = [];
  try {
    const [templateRes, categoriesRes] = await Promise.all([
      session.backendToken ? getPromptTemplate(session.backendToken, templateId) : null,
      getCategories(),
    ]);
    template = templateRes;
    categories = categoriesRes;
  } catch {
    // 백엔드 미구현 시 null
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/templates" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        템플릿 목록
      </Link>
      <h1 className="text-xl font-bold">템플릿 수정</h1>
      {template ? (
        <TemplateForm
          templateId={templateId}
          categories={categories}
          defaultValues={{
            title: template.title,
            description: template.description,
            template: template.template,
            parentId: template.parentId ?? "",
            isActive: template.isActive,
            isSolo: template.isSolo,
            sortOrder: template.sortOrder,
          }}
        />
      ) : (
        <p className="text-muted-foreground">템플릿을 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
