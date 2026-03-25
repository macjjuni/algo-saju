import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getTemplates, getCategories } from '@/services/fortune'
import { getProfiles } from '@/services/profile'
import SidebarLayout from '@/components/ui/sidebar-layout'
import type { SidebarMenuItem } from '@/components/ui/sidebar-layout'
import TemplateList from '@/components/feature/fortune/template-list'

export const metadata = {
  title: '템플릿 선택',
}

interface Props {
  params: Promise<{ categoryId: string }>
}

export default async function CategoryPage({ params }: Props) {
  const session = await auth()
  const { categoryId } = await params

  let templates
  try {
    templates = await getTemplates(categoryId)
  } catch {
    notFound()
  }

  if (!templates || templates.length === 0) notFound()

  const [profiles, categories] = await Promise.all([
    session?.backendToken ? getProfiles(session.backendToken) : Promise.resolve([]),
    getCategories(),
  ])

  const menuItems: SidebarMenuItem[] = categories
    .filter((c) => c.isActive)
    .map((c) => ({
      href: `/category/${c.id}`,
      label: c.title,
      icon: c.icon,
      color: c.color,
    }))

  return (
    <SidebarLayout title="운세 카테고리" menuItems={menuItems}>
      <TemplateList templates={templates} profiles={profiles} isAuthenticated={!!session} />
    </SidebarLayout>
  )
}
