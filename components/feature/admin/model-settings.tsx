"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateGeminiModelAction } from "@/app/admin/models/actions";

interface ModelSettingsProps {
  currentModel: string | null;
  models: string[] | null;
}

export default function ModelSettings({ currentModel, models }: ModelSettingsProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(currentModel);
  const [savedModel, setSavedModel] = useState<string | null>(currentModel);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selectedModel) return;
    startTransition(async () => {
      const result = await updateGeminiModelAction(selectedModel);
      if (result.success) {
        setSavedModel(selectedModel);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(result.error);
      }
    });
  };

  if (!models) {
    return <p className="text-muted-foreground">모델 목록을 불러올 수 없습니다. 백엔드 API를 확인해주세요.</p>;
  }

  const isDirty = selectedModel !== savedModel;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-muted-foreground mb-4">사주 분석에 사용할 Gemini 모델을 선택하세요. 저장 즉시 반영됩니다.</p>
        <div className="space-y-2">
          {models.map((model) => {
            const isSelected = selectedModel === model;
            const isCurrent = savedModel === model;
            return (
              <Button
                key={model}
                variant="ghost"
                onClick={() => setSelectedModel(model)}
                className={`w-full h-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-left ${
                  isSelected
                    ? "border-primary bg-primary/10 hover:bg-primary/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{model}</span>
                    {isCurrent && (
                      <span className="text-xs rounded-full border border-green-500/40 bg-green-500/10 text-green-400 px-2 py-0.5">
                        사용 중
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end md:gap-3">
        <Button onClick={handleSave} disabled={isPending || !selectedModel || !isDirty} className="w-full md:w-auto">
          {isPending ? "저장 중..." : "저장"}
        </Button>
        {saved && <span className="text-sm text-green-400 text-center md:text-left">저장되었습니다.</span>}
      </div>
    </div>
  );
}
