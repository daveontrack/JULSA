import { redirect } from 'next/navigation'
import AdminCollectionManager from '@/components/admin-collection-manager'

const SECTIONS: Record<string, string> = {
  members: 'members', messages: 'contacts', events: 'events', blog: 'blog-posts',
  competitions: 'competitions', leaders: 'leaders', gallery: 'gallery', news: 'news',
  opportunities: 'opportunities', resources: 'academic-resources',
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const collection = SECTIONS[section]
  if (!collection) redirect('/admin')
  return <AdminCollectionManager key={collection} collection={collection} />
}
