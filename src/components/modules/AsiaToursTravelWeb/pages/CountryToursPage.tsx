import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { CountryBanner } from '../components/CountryBanner'
import { CountryIntro } from '../components/CountryIntro'
import { HighlightCarousel } from '../components/HighlightCarousel'
import { TourCard } from '../components/TourCard'
import { COUNTRIES } from '../data/countries'
import { notFound } from 'next/navigation'

interface CountryToursPageProps {
  data: AsiaToursTravelWebData
  countrySlug: string
}

import { getToursByCountry } from '../lib/api'
import type { Tour } from '@/payload-types' 

export async function CountryToursPage({ data, countrySlug }: CountryToursPageProps) {
  const { siteSettings, navigation, footer } = data
  
  // Find country data from mock or props
  const country = COUNTRIES[countrySlug]

  if (!country) {
    return notFound()
  }

  // Fetch Tours for this Country
  const tours = await getToursByCountry(countrySlug)

  // Fallback to featuredTours if fetch yields nothing
  const fallbackTours = (data.featuredTours?.filter(t => typeof t !== 'string' && t.country === countrySlug) || []) as Tour[]
  
  const displayTours = tours.length > 0 ? tours : fallbackTours

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        <CountryBanner 
          title={country.title} 
          subtitle={country.subtitle} 
          backgroundImage={country.bannerImage} 
        />
        
        <CountryIntro 
          title={country.slug.charAt(0).toUpperCase() + country.slug.slice(1)} 
          slogan={country.introSlogan} 
          description={country.introDescription} 
          fullDescription={country.introFullDescription}
          stats={country.stats}
          links={[
            { label: 'Best Tours', href: '#', icon: '' },
            { label: 'Experiences', href: '#', icon: 'external-link' },
            { label: 'Destinations & Map', href: '#', icon: '' },
            { label: 'Travel Guide', href: '#', icon: 'external-link' }
          ]}
        />
        
        {country.highlights && country.highlights.length > 0 && (
           <div className="list-highlight-tour">
             <article className="wrap-mini-intro">
               <h2 className="title-h2">Highlights in our {country.slug.charAt(0).toUpperCase() + country.slug.slice(1)} Tours</h2>
               <p className="paragraph">With more than 10 years in creating bespoke journeys...</p>
             </article>
             <HighlightCarousel highlights={country.highlights} />
           </div>
        )}

        {/* Best Tours Collection */}
        <section className="list-trip mg-bot-0">
          <div className="wrap-mini-intro wrap-mini-intro-2">
            <h2 id="div-ctry-tour" className="title-h2-line">The Best {country.slug.charAt(0).toUpperCase() + country.slug.slice(1)} Tours Collection 2026 - 2027</h2>
            <p className="paragraph">These tours bring you alluring experiences...</p>
          </div>
          <div className="container">
             {displayTours && displayTours.length > 0 ? (
               <div className="row flex flex-wrap">
                 {displayTours.map((tour, idx) => (
                   <div key={tour.id || idx} className="col-xlg-4 col-lg-6 col-md-12 mb-5">
                     <TourCard tour={tour} />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center p-10">
                 <p>No tours found for {country.slug}.</p>
               </div>
             )}
          </div>
        </section>
      </main>

      <Footer data={footer} />
    </div>
  )
}
