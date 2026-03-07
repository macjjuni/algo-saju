"use client"

import { useState } from 'react'
import type { PromptTemplate } from '@/api/fortune'
import type { Profile } from '@/api/profile'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import FortuneAnalyzer from '@/components/feature/fortune/fortune-analyzer'

interface TemplateListProps {
  templates: PromptTemplate[]
  profiles: Profile[]
  categoryId: string
}

export default function TemplateList({ templates, profiles }: TemplateListProps) {
  // region [Hooks]
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // endregion

  // region [Events]
  const handleTemplateClick = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setDialogOpen(true)
    setError(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDialogOpen(false)
    }
  }

  const handleCloseAnimationEnd = () => {
    if (!dialogOpen) {
      setSelectedTemplate(null)
    }
  }
  // endregion

  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <h1 className="mb-6 text-lg font-bold">템플릿 선택</h1>
      <div className="flex flex-col gap-3">
        {templates.map((template) => (
          <button
            key={template.promptTemplateId}
            type="button"
            onClick={() => handleTemplateClick(template)}
            className="flex flex-col gap-2 max-sm:gap-1 rounded-2xl border border-white/10 bg-white/5 cursor-pointer px-4 py-5 text-left transition-colors hover:bg-white/10"
          >
            <span className="font-bold text-xl max-sm:text-lg">{template.title}</span>
            {template.description && (
              <span className="text-sm text-muted-foreground">{template.description}</span>
            )}
          </button>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto" onAnimationEnd={handleCloseAnimationEnd}>
          <DialogHeader>
            <DialogTitle>프로필 선택</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <FortuneAnalyzer
              profiles={profiles}
              templateId={selectedTemplate.promptTemplateId}
              isSolo={selectedTemplate.isSolo}
              onAnalyzeStart={() => setDialogOpen(false)}
              onError={setError}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
