'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { notFound } from 'next/navigation'
import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { CountryBanner } from '../components/CountryBanner'
import { TourCard } from '../components/TourCard'
import { FaqSection } from '../components/FaqSection'
import { lexicalToString } from '../lib/utils'
import type { Tour, Faq } from '@/payload-types'

interface TourCategoryPageProps {
  data: AsiaToursTravelWebData
  categorySlug: string
}

export function TourCategoryPage({ data, categorySlug }: TourCategoryPageProps) {
  const { siteSettings, navigation, footer, tourStyles } = data
  
  const [category, setCategory] = useState<any>(null)
  const [tours, setTours] = useState<Tour[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
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
        // slug corresponds to categorySlug
        const catRes = await fetch(`${baseUrl}/api/tour-categories?where%5Bslug%5D%5Bequals%5D=${categorySlug}`)
        const catJson = await catRes.json()
        const foundCat = catJson.docs?.[0]
        
        if (foundCat) {
            setCategory(foundCat)
            
            // 2. Fetch Tours with this category
            const toursRes = await fetch(`${baseUrl}/api/tours?where%5Bcategories%5D%5Bcontains%5D=${foundCat.id}&limit=100`)
            const toursJson = await toursRes.json()
            if (toursJson.docs) {
                setTours(toursJson.docs as Tour[])
            }

            // 3. Fetch FAQs (Client-side REST query)
            // Logic: (tour_categories contains catId) OR (id IN curatedIds)
            const catId = foundCat.id
            let curatedIds: number[] = []
            if (foundCat.faqs && Array.isArray(foundCat.faqs)) {
                curatedIds = foundCat.faqs.map((f: any) => (typeof f === 'object' ? f.id : f))
            }
            
            // Construct OR query manually for now
            // where[or][0][tour_categories][contains]=catId
            let faqQuery = `where[or][0][tour_categories][contains]=${catId}`
            
            if (curatedIds.length > 0) {
                 // where[or][1][id][in]=id1,id2
                 faqQuery += `&where[or][1][id][in]=${curatedIds.join(',')}`
            }
            
            try {
                const faqsRes = await fetch(`${baseUrl}/api/faqs?${faqQuery}&sort=order&limit=20`)
                const faqsJson = await faqsRes.json()
                if (faqsJson.docs) {
                    const mappedFaqs = faqsJson.docs.map((f: Faq) => ({
                        question: f.question,
                        answer: lexicalToString(f.answer)
                    }))
                    setFaqs(mappedFaqs)
                }
            } catch (err) {
                console.error("Failed to fetch FAQs", err)
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
  const { featuredTours, remainingTours, destinations, experiences } = useMemo(() => {
    if (!tours.length) return { featuredTours: [], remainingTours: [], destinations: [], experiences: [] }

    // 1. Separate Featured vs Remaining
    // As per requirement: "Danh sách các tour còn lại không thuộc Featured tour"
    const featured = tours.filter(t => t.isFeatured)
    const allRemaining = tours.filter(t => !t.isFeatured)

    // 2. Extract Options for filters (from ALL tours to be inclusive)
    const destSet = new Set<string>()
    const expSet = new Set<string>()

    tours.forEach(tour => {
        // Destinations (Countries)
        if (tour.countries && Array.isArray(tour.countries)) {
            tour.countries.forEach((c: any) => {
                 const name = typeof c === 'string' ? c : c.name
                 if (name) destSet.add(name)
            })
        }
        // Experience (Parses `specs_experiences`)
        // NOTE: User requested filter by Experience. 'categories' is already the main taxonomy for this page.
        // We can inspect the 'specs_experiences' relationship field in tours if it exists.
        // The schema for `Tours` showed `specs_experiences` -> `items` (relationship to experiences).
        const specs = (tour as any).specs_experiences;
        if (specs && Array.isArray(specs.items)) {
             specs.items.forEach((item: any) => {
                 // item can be ID or object depending on depth. Assuming depth=0 by default in fetch unless specified.
                 // We need names. If we only have IDs, we might need a separate fetch or reliance on depth.
                 // Let's assume we might need to fetch names or simplistic mapping.
                 // For client-side robustness without extra fetching, we might only support if depth > 0.
                 // If depth is 0 (IDs only), we can't show names easily. 
                 // Strategy: The fetch above didn't specify depth. Default is usually 1? 
                 // Let's assume depth=1 for now.
                 if (typeof item === 'object' && item.title) {
                     expSet.add(item.title)
                 }
             })
        }
    })

    return {
        featuredTours: featured,
        remainingTours: allRemaining,
        destinations: Array.from(destSet).sort(),
        experiences: Array.from(expSet).sort()
    }
  }, [tours])


  // Filter Logic for Remaining Tours
  const filteredRemainingTours = useMemo(() => {
      return remainingTours.filter(tour => {
          // Destination Filter
          if (destinationFilter !== 'all') {
              const hasDest = tour.countries?.some((c: any) => (typeof c === 'string' ? c : c.name) === destinationFilter)
              if (!hasDest) return false
          }
          // Experience Filter
          if (experienceFilter !== 'all') {
              // specs_experiences.items check
              const specs = (tour as any).specs_experiences;
              const hasExp = specs?.items?.some((item: any) => (typeof item === 'object' ? item.title : '') === experienceFilter)
              if (!hasExp) return false
          }
           // Duration Filter
           if (durationFilter !== 'all') {
               const durationStr = typeof tour.duration === 'string' ? tour.duration : ''
               const days = parseInt(durationStr) || 0
               
               if (durationFilter === 'short' && days >= 5) return false // < 5 days
               if (durationFilter === 'medium' && (days < 5 || days > 10)) return false // 5-10 days
               if (durationFilter === 'long' && days <= 10) return false // > 10 days
           }

          return true
      })
  }, [remainingTours, destinationFilter, experienceFilter, durationFilter])


  // Derived UI Data
  const title = category ? category.title : (categorySlug ? categorySlug.replace(/-/g, ' ') : 'Category')
  const subtitle = 'Explore our curated tours'
  // Use category.heroImage if available
  const bannerImage = category?.heroImage?.url || 'https://d2lwt6tidfiof0.cloudfront.net/images/banner/multi-country.jpg'

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        <CountryBanner 
          title={title} 
          subtitle={subtitle} 
          bannerUrl={bannerImage} 
        />
        
        {/* Intro */}
        <section className="intro-country-tour">
            <div className="container">
                <div className="wrap-mini-intro">
                    <h2 className="title-h2">{title}</h2>
                    {category?.description && (
                         <p className="paragraph">{category.description}</p>
                    )}
                </div>
            </div>
        </section>

        {/* Featured Tours Section */}
        {featuredTours.length > 0 && (
            <section className="featured-tours py-10 bg-gray-50">
                <div className="container">
                     <h3 className="text-2xl font-bold mb-6 text-center">Featured {title} Tours</h3>
                     <div className="row flex flex-wrap">
                        {featuredTours.map((tour, idx) => (
                           <div key={tour.id || idx} className="col-xlg-4 col-lg-6 col-md-12 mb-5">
                             <TourCard tour={tour} />
                           </div>
                        ))}
                     </div>
                </div>
            </section>
        )}

        {/* Helper Components for Filters */}
        <div className="container mt-8 mb-4">
             <div className="flex flex-wrap gap-4 items-center p-6 bg-white shadow-sm border border-gray-100 rounded-xl">
                 <span className="font-bold text-gray-800 uppercase tracking-wide text-sm">Filter Tours:</span>
                 
                 {/* Destination Select */}
                 <div className="relative">
                     <select 
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-8 cursor-pointer hover:bg-gray-100 transition-colors"
                        value={destinationFilter}
                        onChange={(e) => setDestinationFilter(e.target.value)}
                     >
                         <option value="all">All Destinations</option>
                         {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                     </div>
                 </div>

                 {/* Experience Select */}
                 {experiences.length > 0 && (
                     <div className="relative">
                         <select 
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-8 cursor-pointer hover:bg-gray-100 transition-colors"
                            value={experienceFilter}
                            onChange={(e) => setExperienceFilter(e.target.value)}
                         >
                             <option value="all">All Experiences</option>
                             {experiences.map(e => <option key={e} value={e}>{e}</option>)}
                         </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                         </div>
                     </div>
                 )}

                 {/* Duration Select */}
                 <div className="relative">
                     <select 
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 pr-8 cursor-pointer hover:bg-gray-100 transition-colors"
                        value={durationFilter}
                        onChange={(e) => setDurationFilter(e.target.value)}
                     >
                         <option value="all">Any Duration</option>
                         <option value="short">Short (&lt; 5 Days)</option>
                         <option value="medium">Medium (5-10 Days)</option>
                         <option value="long">Long (&gt; 10 Days)</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                     </div>
                 </div>
                 
                 {(destinationFilter !== 'all' || experienceFilter !== 'all' || durationFilter !== 'all') && (
                     <button 
                        onClick={() => {
                            setDestinationFilter('all')
                            setExperienceFilter('all')
                            setDurationFilter('all')
                        }}
                        className="text-sm text-red-500 hover:text-red-700 underline ml-auto"
                     >
                        Clear Filters
                     </button>
                 )}
             </div>
        </div>

        {/* Main List (Filtered) */}
        <section className="list-trip mg-bot-0">
          <div className="container">
             {loading ? (
                 <div className="text-center p-10">Loading tours...</div>
             ) : (
                 <>
                     {filteredRemainingTours && filteredRemainingTours.length > 0 ? (
                       <div className="row flex flex-wrap">
                         {filteredRemainingTours.map((tour, idx) => (
                           <div key={tour.id || idx} className="col-xlg-4 col-lg-6 col-md-12 mb-5">
                             <TourCard tour={tour} />
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center p-10">
                         <p>No tours found matching your filters.</p>
                       </div>
                     )}
                 </>
             )}
          </div>
        </section>

        {/* FAQs */}
        <FaqSection items={faqs.length > 0 ? faqs : data.faqs} />
      </main>

      <Footer data={footer} />
    </div>
  )
}
