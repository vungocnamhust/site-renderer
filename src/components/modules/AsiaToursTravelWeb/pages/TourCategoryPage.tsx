'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { notFound } from 'next/navigation'
import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { CountryBanner } from '../components/CountryBanner'
import { TourCard } from '../components/TourCard'
import { InquiryFormSection } from '../components/InquiryFormSection'
import { CategoryIntro } from '../components/CategoryIntro'
import { CategoryTourList } from '../components/CategoryTourList'
import { TourStylesSection } from '../components/TourStylesSection'
import { TravelGuideSection } from '../components/TravelGuideSection'
import { FaqSection } from '../components/FaqSection'
import type { Tour, Blog } from '@/payload-types'
import Link from 'next/link'

interface TourCategoryPageProps {
  data: AsiaToursTravelWebData
  categorySlug: string
}

export function TourCategoryPage({ data, categorySlug }: TourCategoryPageProps) {
  const { siteSettings, navigation, footer, tourStyles } = data

  const [category, setCategory] = useState<any>(null)
  const [tours, setTours] = useState<Tour[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [destinationFilter, setDestinationFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')

  // Fetch Data Client Side
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

        // 1. Fetch Category Info
        const catRes = await fetch(`${baseUrl}/api/tour-categories?where%5Bslug%5D%5Bequals%5D=${categorySlug}`)
        const catJson = await catRes.json()
        const foundCat = catJson.docs?.[0]

        if (foundCat) {
          setCategory(foundCat)

          // 2. Fetch Tours with this category
          // query: where[categories][contains]=id
          const toursRes = await fetch(`${baseUrl}/api/tours?where%5Bcategories%5D%5Bcontains%5D=${foundCat.id}&limit=100`)
          const toursJson = await toursRes.json()
          if (toursJson.docs) {
            setTours(toursJson.docs as Tour[])
          }

          // 3. Fetch Blogs (Travel Guide)
          // Fetch relevant blogs if possible, or just recent
          const blogsRes = await fetch(`${baseUrl}/api/blogs?limit=3`)
          const blogsJson = await blogsRes.json()
          if (blogsJson.docs) {
            setBlogs(blogsJson.docs as Blog[])
          }
        }
      } catch (e) {
        console.error("Failed to fetch category data", e)
      } finally {
        setLoading(false)
      }
    }

    if (categorySlug) {
      fetchData()
    }
  }, [categorySlug])

  // Computed lists
  const { featuredTours, remainingTours, multiCountryTours, destinations, experiences } = useMemo(() => {
    if (!tours.length) return { featuredTours: [], remainingTours: [], destinations: [], experiences: [] }

    // 1. Separate Featured vs Remaining
    const featured = tours.filter(t => t.isFeatured)
    const allRemaining = tours.filter(t => !t.isFeatured)

    // 2. Extract Options for filters (from ALL tours to be inclusive)
    const destSet = new Set<string>()
    const expSet = new Set<string>()

    tours.forEach(tour => {
      // Destinations
      if (tour.countries && Array.isArray(tour.countries)) {
        tour.countries.forEach((c: any) => {
          const name = typeof c === 'string' ? c : c.name
          if (name) destSet.add(name)
        })
      }
      // Experiences
      const specs = (tour as any).specs_experiences;
      if (specs && Array.isArray(specs.items)) {
        specs.items.forEach((item: any) => {
          if (typeof item === 'object' && item.title) {
            expSet.add(item.title)
          }
        })
      }
    })

    return {
      featuredTours: featured,
      remainingTours: allRemaining,
      multiCountryTours: tours.filter(t => (t as any).tourType === 'multi-country'),
      destinations: Array.from(destSet).sort(),
      experiences: Array.from(expSet).sort()
    }
  }, [tours])


  // Derived UI Data
  const title = category ? category.title : (categorySlug ? categorySlug.replace(/-/g, ' ') : 'Category')
  const heroTitle = `Asia ${title}`
  const subtitle = 'Authentic family vacations tailor-made for your personal needs'
  const bannerImage = category?.heroImage?.url || 'https://d2lwt6tidfiof0.cloudfront.net/images/banner/multi-country.jpg'

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />

      <main>
        {/* SECTION 1: HERO BANNER */}
        <div className="relative text-center">
          <CountryBanner
            title={heroTitle}
            subtitle={subtitle}
            bannerUrl={bannerImage}
          />
        </div>

        {/* SECTION 2: INTRO & EXPERTS */}
        <CategoryIntro title={title} description={category?.description} />

        {/* SECTION 3: FEATURED TOURS */}
        {featuredTours.length > 0 && (
          <section className="featured-tours py-12 bg-gray-50">
            <div className="container">
              <h3 className="section-title text-center text-2xl font-bold mb-2 uppercase tracking-wide">
                {title} Highlights
              </h3>
              <p className="text-center text-gray-500 mb-10 italic">Our most popular and highly recommended experiences</p>

              <div className="row flex flex-wrap justify-center">
                {featuredTours.map((tour, idx) => (
                  <div key={tour.id || idx} className="col-xlg-4 col-lg-4 col-md-6 mb-8">
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: MAIN LIST & FILTER (Refactored) */}
        <CategoryTourList
          tours={remainingTours}
          title={`Perfectly Paced ${title} Tours`}
          destinations={destinations}
          experiences={experiences}
        />

        {/* SECTION 5: INQUIRY FORM */}
        <InquiryFormSection />

        {/* SECTION 6: CROSS-SELL (Multi-Country) */}
        {multiCountryTours && multiCountryTours.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-100">
            <div className="container">
              <h3 className="section-title text-center text-2xl font-bold mb-2 uppercase tracking-wide">
                Multi-Country {title} Tours
              </h3>
              <p className="text-center text-gray-500 mb-10 italic">Combine {title} with other destinations</p>

              <div className="row flex flex-wrap justify-center">
                {multiCountryTours.slice(0, 3).map((tour, idx) => (
                  <div key={tour.id || idx} className="col-xlg-4 col-lg-4 col-md-6 mb-8">
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7: CROSS-SELL (Styles) - Refined */}
        {tourStyles && tourStyles.length > 0 && (
          <TourStylesSection items={tourStyles} />
        )}

        {/* SECTION 8: TRAVEL GUIDE */}
        {blogs && blogs.length > 0 && (
          <TravelGuideSection items={blogs} />
        )}

        {/* SECTION 9: FAQs */}
        {data.faqs && data.faqs.length > 0 && (
          <FaqSection items={data.faqs} />
        )}

      </main>

      <Footer data={footer} />
    </div>
  )
}
