
import { getTourBySlug, getFeaturedTours } from '../lib/api'
import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { FeaturedToursGrid } from '../components/FeaturedToursGrid'
import Link from 'next/link'

// Tour Detail Components
import { TourHeroSection } from '../components/tour-detail/TourHeroSection'
import { TourNavbar } from '../components/tour-detail/TourNavbar'
import { TourDestinationsSection } from '../components/tour-detail/TourDestinationsSection'
import { TourHighlightsSection } from '../components/tour-detail/TourHighlightsSection'
import { TourItinerarySection } from '../components/tour-detail/TourItinerarySection'
import { TourInclusionsSection } from '../components/tour-detail/TourInclusionsSection'
import { TourPriceOptions } from '../components/tour-detail/TourPriceOptions'
import { TourBestSupportSection } from '../components/tour-detail/TourBestSupportSection'

interface TourDetailPageProps {
  data: AsiaToursTravelWebData
  tourSlug: string
}

export async function TourDetailPage({ data, tourSlug }: TourDetailPageProps) {
  const { siteSettings, navigation, footer } = data

  const tour = await getTourBySlug(tourSlug)

  if (!tour) {
    return (
        <div className="app">
            <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h1 className="title-h1">Tour Not Found</h1>
                <p className="paragraph">We couldn't find a tour with the slug: {tourSlug}</p>
                <Link href="/" className="btn-st2">Back to Home</Link>
            </div>
            <Footer data={footer} />
        </div>
    )
  }

  // Fetch Recommended Tours (Related)
  const relatedTours = await getFeaturedTours(3, { multiCountry: true })

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        {/* 1. Hero Banner with Title, Price, Stats */}
        <TourHeroSection tour={tour} />

        {/* 2. Sticky Navigation Bar */}
        <TourNavbar />

        {/* 3. Destinations Section with Carousel & Experience Icons */}
        <TourDestinationsSection tour={tour} />

        {/* 4. Inclusions Section */}
        <TourInclusionsSection includes={tour.includes as any} excludes={tour.excludes as any} specs={tour as any} />

        {/* 5. Highlights Section with Video/Image Grid */}
        <TourHighlightsSection tour={tour} />
        
        {/* 6. Map & Itinerary */}
        <TourItinerarySection tour={tour} />

        {/* 7. Price Options (Budget Choices) */}
        <TourPriceOptions tour={tour} />

        {/* 8. Best Support / Why Choose Us */}
        <TourBestSupportSection />

        {/* 9. Related Tours */}
        <FeaturedToursGrid 
            tours={relatedTours} 
            title="You Might Also Like" 
            subtitle="Explore other popular tours" 
        />
      </main>

      <Footer data={footer} />
    </div>
  )
}
