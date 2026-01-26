
import React from 'react'
import { notFound } from 'next/navigation'
import type { AsiaToursTravelWebData } from '../types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroSection } from '../components/HeroSection'
import { FeaturedToursSection } from '../components/FeaturedToursSection'
import type { Tour } from '@/payload-types' // Ensure this type is available

interface TourCategoryPageProps {
  data: AsiaToursTravelWebData
  categorySlug: string
}

export async function TourCategoryPage({ data, categorySlug }: TourCategoryPageProps) {
  const payload = await getPayload({ config })

  // 1. Fetch the category details
  const categoryResult = await payload.find({
    collection: 'tour-categories',
    where: {
      slug: { equals: categorySlug },
    },
    limit: 1,
  })

  const category = categoryResult.docs[0]

  if (!category) {
    return notFound()
  }

  // 2. Fetch tours belonging to this category
  // IMPORTANT: 'categories' in 'tours' is a relationship field.
  // We query 'tours' where 'categories' contains the category ID.
  const toursResult = await payload.find({
    collection: 'tours',
    where: {
      categories: { contains: category.id },
      isActive: { equals: true },
    },
    depth: 1,
    limit: 50,
  })

  const tours = toursResult.docs as Tour[]

  // 3. Construct Hero Content
  // If category has a heroImage, use it. Otherwise fallback to site default or a specific placeholder.
  const heroImage = (category.heroImage || data.heroSection?.slides?.[0]?.image) as any // Cast to any to avoid type mismatch with number ID
  
  // Construct a single slide for the HeroSection
  const heroSlides = [{
    image: heroImage,
    title: category.title,
    subtitle: category.description || `Explore our ${category.title} packages`,
    link: '#tours-list',
    linkText: 'View Tours'
  }]

  return (
    <div className="asia-tours-category-page">
      {/* 
          Reuse HeroSection. 
          Note: HeroSection expects { slides: ... }. 
          We construct a temporary object to match that shape.
      */}
      <HeroSection 
        slides={heroSlides}
      />

      <div id="tours-list" className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
            {category.description && (
                <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            )}
        </div>

        {/* Reuse FeaturedToursSection or create a simple grid if that component is too specific */}
        {/* FeaturedToursSection expects 'featuredTours' in data. 
            We can verify if we can pass tours directly or if we need to mock the data structure.
        */}
        
        {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                    /* Simple card fallback or reuse TourCard if available/exported */
                    <div key={tour.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* 
                          Ideally we import TourCard. 
                          For now, let's implement a basic card structure 
                          to ensure it works, then refactor to use shared TourCard.
                        */}
                        <div className="relative h-64 bg-gray-200">
                             {/* @ts-ignore */}
                            {tour.featuredImage?.url && (
                                <img 
                                    /* @ts-ignore */
                                    src={tour.featuredImage.url} 
                                    alt={tour.title} 
                                    className="w-full h-full object-cover"
                                />
                            )}
                             <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary">
                                {tour.duration}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 line-clamp-2">{tour.title}</h3>
                            <div className="flex items-center text-gray-500 mb-4 text-sm">
                                {/* @ts-ignore */}
                                <span>{tour.destinations?.length || 1} Destinations</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{typeof tour.tourType === 'string' ? tour.tourType.replace('-', ' ') : 'Tour'}</span>
                            </div>
                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    <span className="text-sm text-gray-500 block">From</span>
                                    <span className="text-2xl font-bold text-primary">${tour.price}</span>
                                </div>
                                <a 
                                    href={`/tours/${tour.slug}`} 
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center py-12 text-gray-500">
                <p>No tours found in this category yet.</p>
            </div>
        )}
      </div>

    </div>
  )
}
