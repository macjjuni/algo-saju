import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getCategories } from "@/api/fortune";
import TemplateForm from "@/components/feature/admin/template-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewTemplatePage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  let categories = await getCategories();

  return (
    <div className="space-y-6">
      <Link href="/admin/templates" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        템플릿 목록
      </Link>
      <h1 className="text-xl font-bold">새 템플릿</h1>
      <TemplateForm categories={categories} />
    </div>
  );
}
