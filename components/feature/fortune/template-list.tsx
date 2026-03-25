"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PromptTemplate } from '@/services/fortune'
import type { Profile } from '@/services/profile'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import FortuneAnalyzer from '@/components/feature/fortune/fortune-analyzer'

interface TemplateListProps {
  templates: PromptTemplate[]
  profiles: Profile[]
  isAuthenticated: boolean
}

export default function TemplateList({ templates, profiles, isAuthenticated }: TemplateListProps) {
  // region [Hooks]
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  // endregion

  // region [Events]
  const handleTemplateClick = (template: PromptTemplate) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setSelectedTemplate(template)
    setDialogOpen(true)
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
      <h1 className="mb-6 text-lg font-bold">템플릿 선택</h1>
      <div className="flex flex-col gap-3">
        {templates.map((template) => (
          <Card
            key={template.promptTemplateId}
            onClick={() => handleTemplateClick(template)}
            className="min-h-[102px] cursor-pointer gap-2 max-sm:gap-1 rounded-2xl border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <span className="font-bold text-xl max-sm:text-lg">{template.title}</span>
            {template.description && (
              <span className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{template.description}</span>
            )}
          </Card>
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
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
