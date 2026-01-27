/**
 * Asia Tours Travel Website Module
 * 
 * Main entry point that handles routing based on the 'slug' parameter.
 * This acts as an internal router for the module.
 */

import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { ModuleProps, Blog } from './types'

import { HomePage } from './pages/HomePage'
import { CountryToursPage } from './pages/CountryToursPage'
import { MultiCountryToursPage } from './pages/MultiCountryToursPage'
import { TourDetailPage } from './pages/TourDetailPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { TourCategoryPage } from './pages/TourCategoryPage'
import { TravelGuidePage } from './pages/TravelGuidePage'
import { CountryExperiencesPage } from './pages/CountryExperiencesPage'
import { ExperienceDetailPage } from './pages/ExperienceDetailPage'
import './home.css'

export async function AsiaToursTravelWeb({ data, slug = [] }: ModuleProps) {
  // Debug routing
  console.log('[AsiaToursTravelWeb] Rendering with slug:', slug)

  let content: React.ReactNode = null

  // 1. Homepage: slug is empty
  if (!slug || slug.length === 0) {
    content = <HomePage data={data} />
  }
  // 2. Country Tours: /vietnam/tours
  else if (slug.length === 2 && slug[1] === 'tours') {
    const country = slug[0]
    content = <CountryToursPage data={data} countrySlug={country} />
  }
  // 3. Country Experiences: /vietnam/experiences
  else if (slug.length === 2 && slug[1] === 'experiences') {
      const country = slug[0]
      content = <CountryExperiencesPage data={data} countrySlug={country} />
  }
  // 4. Experience Detail: /experiences/[slug]
  else if (slug.length === 2 && slug[0] === 'experiences') {
      const experienceSlug = slug[1]
      content = <ExperienceDetailPage data={data} slug={experienceSlug} />
  }
  // 5. Multi-Country Tours, Tour Detail OR Tour Category (via /tours/[slug])
  else if (slug[0] === 'tours' && slug.length === 2) {
    const secondSlug = slug[1]
    
    // Check if it's a known multi-country slug
    const isMultiCountry = ['thailand-vietnam', 'vietnam-cambodia', 'vietnam-cambodia-laos', 'multi-country'].includes(secondSlug)
    
    if (isMultiCountry) {
        content = <MultiCountryToursPage data={data} slug={secondSlug} />
    } else {
        // Dynamic Routing: Check if it's a Tour or a Category
        // We need to resolve this on the server side to decide which component to render
        try {
             // Parallel fetch attempt (optimization) is hard because we need to know WHICH one it is to pick component.
             // But we can do it sequentially or leverage Payload local API.
             // Local API is fast.
             const payload = await getPayload({ config: configPromise })
             
             // 1. Check if it's a TOUR
             const tourResult = await payload.find({
                 collection: 'tours',
                 where: { slug: { equals: secondSlug } },
                 limit: 1,
                 depth: 0 // Minimal depth just to check existence
             })

             if (tourResult.docs.length > 0) {
                 content = <TourDetailPage data={data} tourSlug={secondSlug} />
             } else {
                 // 2. Check if it's a CATEGORY
                 const catResult = await payload.find({
                     collection: 'tour-categories',
                     where: { slug: { equals: secondSlug } },
                     limit: 1,
                     depth: 0
                 })

                 if (catResult.docs.length > 0) {
                     content = <TourCategoryPage data={data} categorySlug={secondSlug} />
                 } else {
                     // 3. Fallback: Show Tour 404 (TourDetailPage has handled 404 UI)
                     content = <TourDetailPage data={data} tourSlug={secondSlug} />
                 }
             }

        } catch (e) {
            console.error('[AsiaToursTravelWeb] Error resolving /tours/ route:', e);
            content = <TourDetailPage data={data} tourSlug={secondSlug} />
        }
    }
  }
  // 6. Blog Posts: /blog/post-slug - FETCH FULL BLOG DATA
  else if (slug[0] === 'blog' && slug.length === 2) {
    const blogSlug = slug[1]
    
    // Fetch full blog document with content field from Payload API
    let fetchedBlog: Blog | undefined
    try {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'blogs',
        where: { slug: { equals: blogSlug } },
        limit: 1,
        depth: 5, // Aggressively increase depth to ensure Lexical upload nodes are populated
      })
      if (result.docs.length > 0) {
        fetchedBlog = result.docs[0] as Blog
      }
    } catch (error) {
      console.error('[AsiaToursTravelWeb] Error fetching blog:', error)
    }
    
    content = <BlogPostPage data={data} blogSlug={blogSlug} blog={fetchedBlog} />
  }
  // 7. Travel Guide: /travel-guide
  else if (slug[0] === 'blog') {
    content = <TravelGuidePage data={data} searchParams={{ tab: 'overview' }} /> // Default, will be hydrated on client or passed if we change sig
  }
  // 8. Travel Themes: /travel-themes/[slug]
  else if (slug[0] === 'travel-themes' && slug.length === 2) {
      // Use TourCategoryPage for travel themes
      content = <TourCategoryPage data={data} categorySlug={slug[1]} />
  }
  // 7. Category Page: /category-slug (single segment)
  else if (slug.length === 1) {
    const categorySlug = slug[0]
    content = <TourCategoryPage data={data} categorySlug={categorySlug} />
  }
  // 404 for unknown routes
  else {
    return notFound()
  }

  // Return content directly - CSS is loaded via layout.tsx
  return content
}
