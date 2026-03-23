import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { getGeminiModel } from "@/services/admin";
import type { GeminiModelResponse } from "@/services/admin";
import ModelSettings from "@/components/feature/admin/model-settings";

export default async function AdminModelsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/");

  let data: GeminiModelResponse | null = null;
  try {
    if (session.backendToken) {
      data = await getGeminiModel(session.backendToken);
    }
  } catch (e) {
    console.error("[AdminModelsPage] 모델 정보 로드 실패:", e);
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">모델 설정</h3>
      <ModelSettings currentModel={data?.currentModel ?? null} models={data?.models ?? null} />
    </div>
  );
}
