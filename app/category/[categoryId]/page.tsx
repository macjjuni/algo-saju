import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getTemplates } from '@/api/fortune'
import GlassPanel from '@/components/ui/glass-panel'
import TemplateGrid from '@/components/fortune/template-grid'

export const metadata = {
  title: '운세 선택',
}

interface Props {
  params: Promise<{ categoryId: string }>
}

export default async function CategoryPage({ params }: Props) {
  const session = await auth()
  const { categoryId } = await params

  let templates
  try {
    templates = await getTemplates(session!.backendToken!, categoryId)
  } catch {
    notFound()
  }

  if (!templates || templates.length === 0) notFound()

  return (
    <GlassPanel>
      <div className="max-w-xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold">운세 선택</h1>
        <TemplateGrid templates={templates} categoryId={categoryId} />
      </div>
    </GlassPanel>
  )
}
