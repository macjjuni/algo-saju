import Link from 'next/link'
import type { PromptTemplate } from '@/api/fortune'

interface TemplateGridProps {
  templates: PromptTemplate[]
  categoryId: string
}

export default function TemplateGrid({ templates, categoryId }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <Link
          key={template.promptTemplateId}
          href={`/fortune/${categoryId}/${template.promptTemplateId}`}
          className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 transition-colors hover:bg-white/10"
        >
          <span className="font-medium">{template.title}</span>
          {template.description && (
            <span className="text-sm text-muted-foreground">{template.description}</span>
          )}
        </Link>
      ))}
    </div>
  )
}
