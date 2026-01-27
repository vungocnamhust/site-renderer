import { getMultiCountryTours, getFaqsByMultiCountry } from '../lib/api'
import { lexicalToString } from '../lib/utils'
import { FaqSection } from '../components/FaqSection'
import type { AsiaToursTravelWebData } from '../types'
import type { Tour } from '@/payload-types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { CountryBanner } from '../components/CountryBanner'
import { TourCard } from '../components/TourCard'

interface MultiCountryToursPageProps {
  data: AsiaToursTravelWebData
  slug: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

import { COUNTRIES } from '../data/countries'

export async function MultiCountryToursPage({ data, slug, searchParams }: MultiCountryToursPageProps) {
  const routeSlug = typeof searchParams?.route === 'string' ? searchParams.route : undefined
  const pageConfig = COUNTRIES[slug] || COUNTRIES['multi-country']
  const { siteSettings, navigation, footer } = data

  const tours = await getMultiCountryTours(routeSlug)

  // Cast
  const displayTours = tours as unknown as Tour[]
  
  // Fetch FAQs based on countries in the tours
  const countryIds = new Set<number>()
  displayTours.forEach(tour => {
      if (tour.countries && Array.isArray(tour.countries)) {
          tour.countries.forEach(c => {
              const id = typeof c === 'object' ? c.id : c
              if (id) countryIds.add(id)
          })
      }
  })
  
  const faqsDocs = await getFaqsByMultiCountry(Array.from(countryIds))
  const faqs = faqsDocs.map(f => ({
      question: f.question,
      answer: lexicalToString(f.answer)
  }))
  
  const faqsToDisplay = faqs.length > 0 ? faqs : data.faqs
  
  // If pageConfig is missing (e.g. unknown slug), fallback or 404
  if (!pageConfig) {
      // For now fallback to generic if possible, or just render with empty strings
      console.warn(`MultiCountry config not found for slug: ${slug}`)
  }
  
  const title = routeSlug 
      ? (tours[0] as any)?.routeTitle || routeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' Tours'
      : (pageConfig?.title || 'Multi-Country Tours')
  const subtitle = pageConfig?.subtitle || 'Explore Asia'
  const image = pageConfig?.bannerImage || 'https://d2lwt6tidfiof0.cloudfront.net/images/banner/multi-country.jpg'

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        <CountryBanner 
          title={title} 
          subtitle={subtitle} 
          bannerUrl={image} 
        />
        
        <section className="intro-country-tour">
            <div className="container">
                <div className="wrap-mini-intro">
                    <h2 className="title-h2">{title}</h2>
                    <p className="paragraph">
                        {pageConfig?.introDescription || `Explore our handpicked selection of ${title}...`}
                    </p>
                </div>
            </div>
        </section>

        <section className="list-trip mg-bot-0">
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
                 <p>No tours found for this category.</p>
               </div>
             )}
          </div>
        </section>

        {/* FAQs */}
        <FaqSection items={faqsToDisplay} />
      </main>

      <Footer data={footer} />
    </div>
  )
}
