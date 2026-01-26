
import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { ExperienceDetail } from '@/components/modules/AsiaToursTravelWeb/components/experiences/ExperienceDetail'

interface PageProps {
  params: Promise<{
    slug: string
    site: string
  }>
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug, site } = await params
  const payload = await getPayloadHMR({ config: configPromise })

  // Fetch the experience by slug
  const experiences = await payload.find({
    collection: 'experiences',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const experience = experiences.docs[0]

  if (!experience) {
    return notFound()
  }

  // Fetch related tours that link to this experience
  const relatedTours = await payload.find({
    collection: 'tours',
    where: {
      'specs_experiences.items': {
        contains: experience.id,
      },
      tenant: {
        exists: true // Ideally filter by tenant/site if we mapped site to tenant, but for now just validation
      }
    },
    limit: 6, // Match the 2 rows of 3 grid
  })

  return (
    <ExperienceDetail 
      experience={experience} 
      relatedTours={relatedTours.docs} 
    />
  )
}
