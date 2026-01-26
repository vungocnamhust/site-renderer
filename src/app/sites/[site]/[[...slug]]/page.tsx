/**
 * Multi-Page Dispatcher for Tenants
 * 
 * Handles ALL routes for a tenant:
 * - / (homepage)
 * - /vietnam/tours (country tours)
 * - /tours/thailand-vietnam (multi-country)
 * - /blog/:slug (blog posts)
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { ComponentMap } from '@/components/modules/registry'
import type { Tenant } from '@/payload-types'

interface PageProps {
  params: Promise<{ site: string; slug?: string[] }>
}

async function getTenant(subdomain: string): Promise<Tenant | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'tenants',
    where: {
      subdomain: { equals: subdomain },
      isActive: { equals: true },
    },
    limit: 1,
  })
  return (result.docs[0] as Tenant) || null
}

export default async function SitePageDispatcher({ params }: PageProps) {
  const { site, slug = [] } = await params
  
  const tenant = await getTenant(site)
  if (!tenant) notFound()

  // Use templateId to find the registered module component
  const ModuleComponent = ComponentMap[tenant.templateId]
  if (!ModuleComponent) notFound()

  // Get content data dynamically based on templateId
  // The key pattern is content_{templateId with hyphens replaced by underscores}
  const contentKey = `content_${tenant.templateId.replace(/-/g, '_')}` as keyof Tenant
  const data = tenant[contentKey] || {}

  // Pass slug to module for internal routing logic
  return <ModuleComponent data={data} slug={slug} />
}
