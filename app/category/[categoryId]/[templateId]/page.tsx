import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getTemplates } from '@/api/fortune'
import { getProfiles } from '@/api/profile'
import GlassPanel from '@/components/ui/glass-panel'
import FortuneAnalyzer from '@/components/feature/fortune/fortune-analyzer'

export const metadata = {
  title: '운세 분석',
}

interface Props {
  params: Promise<{ categoryId: string; templateId: string }>
}

export default async function FortuneAnalyzePage({ params }: Props) {
  const session = await auth()

  const { categoryId, templateId } = await params
  const templateIdNum = Number(templateId)
  if (isNaN(templateIdNum)) notFound()

  let templates
  try {
    templates = await getTemplates(session!.backendToken!, categoryId)
  } catch {
    notFound()
  }

  const template = templates.find((t) => t.promptTemplateId === templateIdNum)
  if (!template) notFound()

  const profiles = await getProfiles(session!.backendToken!)

  return (
    <GlassPanel>
      <div className="max-w-xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold">운세 분석</h1>
        <FortuneAnalyzer profiles={profiles} templateId={templateIdNum} isSolo={template.isSolo} />
      </div>
    </GlassPanel>
  )
}
