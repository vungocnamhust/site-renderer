/**
 * Asia Tours Travel Website Module
 * 
 * Main entry point that handles routing based on the 'slug' parameter.
 * This acts as an internal router for the module.
 */

import { notFound } from 'next/navigation'
import type { ModuleProps } from './types'

import { HomePage } from './pages/HomePage'
import { CountryToursPage } from './pages/CountryToursPage'
import { MultiCountryToursPage } from './pages/MultiCountryToursPage'
import { TourDetailPage } from './pages/TourDetailPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { TourCategoryPage } from './pages/TourCategoryPage'
import { TravelGuidePage } from './pages/TravelGuidePage'
import './home.css'

export async function AsiaToursTravelWeb({ data, slug = [] }: ModuleProps) {
  // Debug routing
  console.log('[AsiaToursTravelWeb] Rendering with slug:', slug)

  let content: React.ReactNode = null

  // 1. Homepage: slug is empty
  if (!slug || slug.length === 0) {
    content = <HomePage data={data} />
  }
  // 2. Country Tours: /vietnam/tours, /cambodia/tours, etc.
  else if (slug.length === 2 && slug[1] === 'tours') {
    const country = slug[0]
    content = <CountryToursPage data={data} countrySlug={country} />
  }
  // 3. Multi-Country Tours & Tour Detail
  else if (slug[0] === 'tours' && slug.length === 2) {
    const secondSlug = slug[1]
    
    // Check if it's a known multi-country slug (simple logic for now)
    const isMultiCountry = ['thailand-vietnam', 'vietnam-cambodia', 'vietnam-cambodia-laos', 'multi-country'].includes(secondSlug)
    
    if (isMultiCountry) {
        content = <MultiCountryToursPage data={data} slug={secondSlug} />
    } else {
        // Assume it's a Tour Detail Page
        content = <TourDetailPage data={data} tourSlug={secondSlug} />
    }
  }
  // 4. Blog Posts: /blog/post-slug
  else if (slug[0] === 'blog' && slug.length === 2) {
    const blogSlug = slug[1]
    content = <BlogPostPage data={data} blogSlug={blogSlug} />
  }
  // 5. Travel Guide: /travel-guide
  else if (slug[0] === 'travel-guide') {
    content = <TravelGuidePage data={data} searchParams={{ tab: 'overview' }} /> // Default, will be hydrated on client or passed if we change sig
  }
  // 6. Category Page: /category-slug (single segment)
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
