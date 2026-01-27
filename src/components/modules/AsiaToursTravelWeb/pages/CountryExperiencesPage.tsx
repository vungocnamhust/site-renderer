import React from 'react'
import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { CountryBanner } from '../components/CountryBanner'
import { CountryExperiencesList } from '../components/CountryExperiencesList'
import { getExperiencesByCountry } from '../lib/api'
import { notFound } from 'next/navigation'

const SKETCH_MAP: Record<string, string> = {
  'vietnam': '/images/asiatours/icon/sketch/hanoi-sketch.png',
  // Add other countries here when assets exist
}

interface CountryExperiencesPageProps {
  data: AsiaToursTravelWebData
  countrySlug: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function CountryExperiencesPage({ data, countrySlug, searchParams }: CountryExperiencesPageProps) {
  const { siteSettings, navigation, footer, tourStyles } = data
  
  // Clean up country slug
  const cleanSlug = countrySlug === 'vietnam-tours' ? 'vietnam' : countrySlug

  // Handle filtering from URL params
  const destinationFilter = typeof searchParams?.destination === 'string' ? searchParams.destination : undefined

  // Fetch experiences with filter
  const experiences = await getExperiencesByCountry(cleanSlug, destinationFilter)

  // Use the first experience's country data for banner info if available, or fallback
  const countryName = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1)
  
  // Banner Image (Static fallback or from data if we had a country fetch here - simpler to use static for now as per previous implementation)
  const bannerImage = 'https://d2lwt6tidfiof0.cloudfront.net/images/background/bg-experience.jpg'

  // Extract unique destinations and tags for filters
  // Note: For a "pure" server-side filter UI, we might need all possible destinations, 
  // but if we filter by API, we only get filtered results. 
  // Ideally we should fetch ALL experiences metadata separately or just use the filtered list's metadata 
  // if we accept that the filter list shrinks. 
  // For this task, we'll keep it simple: The filter options might reduce if we only look at `experiences`,
  // but usually users want to see all options. 
  // To show ALL options, we would need to fetch ALL experiences 
  // OR hardcode common ones 
  // OR fetch a list of locations.
  // Let's interpret the requirement: "Ensure filter by Destination works to query database".
  // This implies the page reloads with ?destination=...
  
  // To populate the dropdown with ALL destinations even when filtered, 
  // we technically need the full list.
  // Let's do a quick separate fetch for "all" to build the filter list, 
  // essentially `getExperiencesByCountry(cleanSlug)` without filter.
  // This is a slight performance cost but ensures correct UI.
  const allExperiencesForFilters = await getExperiencesByCountry(cleanSlug)

  const destinations = Array.from(new Set(
      allExperiencesForFilters
        .map(e => e.location || (typeof e.destination === 'object' ? e.destination?.name : null))
        .filter(Boolean) as string[]
  )).sort()

  const tags = Array.from(new Set(
      allExperiencesForFilters.flatMap(e => e.tags?.map(t => t.label) || [])
  )).sort()

  // Generate durations (mock/derived if not in schema yet fully, or from tags if duration added)
  // Schema update mentioned adding duration, but user didn't explicitly check it off in "Approved" artifacts, just general plan.
  // We'll stick to what we have.
  const durations = ['Full Day', 'Half Day', 'Multiple Days'] 

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        {/* Small Banner */}
        <CountryBanner 
          bannerUrl={bannerImage}
          title={`Best Asia Tour Experiences`}
          subtitle="Asia is our homeland. We’ll show you Asia, better than anyone else!"
          
        />

        {/* Intro - Sketch and Text */}
        <section className="intro-country-tour text-center" style={{ padding: '60px 0 30px' }}>
            <div className="container">
                {/* Sketch Image */}
                {SKETCH_MAP[cleanSlug] && (
                    <div className="sketch-img" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                        <img 
                            src={SKETCH_MAP[cleanSlug]} 
                            alt={`${countryName} Sketch`} 
                            style={{ maxWidth: '100%', height: 'auto', maxHeight: '100px', opacity: 0.8 }} 
                        />
                    </div>
                )}

                <div className="wrap-mini-intro" style={{ width: '80%', margin: '0 auto', maxWidth: '800px' }}>
                    <h2 className="title-h2" style={{ marginBottom: '20px' }}>
                        TOP {allExperiencesForFilters.length} {countryName.toUpperCase()} TOUR EXPERIENCES <br/> YOU CAN EXPECT
                    </h2>
                    <p className="paragraph" style={{ textAlign: 'center', color: '#666', fontSize: '14px', lineHeight: '1.8' }}>
                        From the boisterous city to peaceful countryside, from the breathtaking beaches to ancient town, from the rich history to diverse culture, {countryName} delights all your senses. Enjoy these unforgettable experiences of your holiday in {countryName} and more below:
                    </p>
                </div>
            </div>
        </section>
        
        {/* List with Server-Side Filtering */}
        <CountryExperiencesList 
            experiences={experiences} 
            title="" 
            description=""
            filters={{
                tags,
                durations,
                destinations
            }}
             // Pass current filter to control component state
            activeDestination={destinationFilter || 'All'}
        />

        {/* Keeping sections consistent with request, removed BestSupportSection as per previous edit */}
      </main>

      <Footer data={footer} />
    </div>
  )
}
