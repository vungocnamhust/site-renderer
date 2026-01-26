
import { getFeaturedTours, getToursByCountry, getMultiCountryTours } from '../lib/api'
import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { BestSupportSection } from '../components/BestSupportSection'
import { AboutSection } from '../components/AboutSection'
import { FeaturedToursGrid } from '../components/FeaturedToursGrid'
import { FeaturedToursSection } from '../components/FeaturedToursSection'

// New Components
import { TourStylesSection } from '../components/TourStylesSection'
import { InquiryFormSection } from '../components/InquiryFormSection'
import { UniqueExperiencesSection } from '../components/UniqueExperiencesSection'
import { TravelGuideSection } from '../components/TravelGuideSection'
import { FaqSection } from '../components/FaqSection'
import { CustomerReviewsSection } from '../components/CustomerReviewsSection'
import { LocalExperiencesSection } from '../components/LocalExperiencesSection'

export async function HomePage({ data }: { data: AsiaToursTravelWebData }) {
  // Destructure data following Atomic Pattern
  const { heroSection, siteSettings, navigation, footer } = data

  // Fetch Multi-Country Tours dynamically (Fallback if empty in CMS)
  const dynamicMultiCountryTours = await getMultiCountryTours()
  
  // Use CMS selected tours if available, else fallback to dynamic API
  const multiCountryTours = (data.multiCountryTours && data.multiCountryTours.length > 0) 
    ? data.multiCountryTours 
    : dynamicMultiCountryTours

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        {/* Section 1: Hero Banner + Booking Widget */}
        <HeroSection slides={heroSection.slides} />
        
        {/* Section 2: Best Support (Team + 4 Highlights) */}
        <BestSupportSection />
        
        {/* Section 3: About + Video + Map Carousel */}
        <AboutSection />

        {/* Section 4: Featured Tours (Vertical List) */}
        <FeaturedToursSection tours={data.featuredTours} />

        {/* Section 5: Featured Multi-Country Tours Grid (Renamed concept, using same component for now) */}
        <FeaturedToursGrid 
          tours={multiCountryTours} 
          title="Most Popular Multi-Country Asia Tours" 
          subtitle="Our carefully curated selection showcases the very best multi-country experiences."
        />

        {/* Section 6: Asia Tours by Styles */}
        <TourStylesSection items={data.tourStyles} />

        {/* Section 7: Inquiry Form */}
        <InquiryFormSection />

        {/* Section 8: Unique Experiences */}
        <UniqueExperiencesSection items={data.uniqueExperiences} />

        {/* Section 9: Travel Guide & Inspirations */}
        <TravelGuideSection items={data.featuredBlogs} />

        {/* Section 10: FAQs */}
        <FaqSection items={data.faqs} />

        {/* Section 11: Customer Reviews */}
        <CustomerReviewsSection items={data.recentTravels} />

        {/* Section 12: Real Local Experiences */}
        <LocalExperiencesSection data={data.locExp} />
      </main>

      <Footer data={footer} />
    </div>
  )
}
